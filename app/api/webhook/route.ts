import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const INTERNAL_SEND_URL = process.env.INTERNAL_SEND_URL || 'http://146.190.78.237:3847/send-welcome';
const INTERNAL_SEND_TOKEN = process.env.INTERNAL_SEND_TOKEN || '';

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured.');
  return new Stripe(key);
}

export async function POST(request: Request) {
  if (!WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  // Get raw body for signature verification
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Only handle completed checkouts
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email || session.customer_email;
    const name = session.customer_details?.name || null;

    if (!email) {
      console.error(`No email on session ${session.id}`);
      return NextResponse.json({ received: true });
    }

    const downloadToken = randomUUID();
    console.log(`Checkout completed: ${session.id} -> ${email} (token ${downloadToken})`);

    // Forward to internal email sender on the VPS
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (INTERNAL_SEND_TOKEN) {
        headers['x-internal-token'] = INTERNAL_SEND_TOKEN;
      }

      const response = await fetch(INTERNAL_SEND_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email,
          name,
          sessionId: session.id,
          metadata: session.metadata || {},
          downloadToken,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`Internal send failed (${response.status}): ${text}`);
      } else {
        console.log(`Welcome email triggered for ${email}`);
      }
    } catch (err: any) {
      console.error(`Failed to forward to internal sender: ${err.message}`);
    }
  } else {
    console.log(`Ignored event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// Allow other HTTP methods (Next.js requires explicit exports)
export const runtime = 'nodejs';
