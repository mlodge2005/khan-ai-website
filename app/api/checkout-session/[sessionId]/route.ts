import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function GET(
  _request: Request,
  context: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await context.params;

  if (!sessionId || !sessionId.startsWith('cs_')) {
    return NextResponse.json({ error: 'Invalid session id.' }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        ok: false,
        payment_status: session.payment_status,
        error: 'Payment not completed.',
      }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email || null,
    });
  } catch (err) {
    console.error('Stripe session retrieve error:', err);
    return NextResponse.json({ error: 'Could not verify checkout session.' }, { status: 400 });
  }
}
