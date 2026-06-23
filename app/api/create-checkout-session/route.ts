import { NextResponse } from 'next/server';
import { getAllowedPriceIds, getSiteUrl, getStripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const priceId = typeof body.priceId === 'string' ? body.priceId.trim() : '';

    if (!priceId) {
      return NextResponse.json({ error: 'priceId is required.' }, { status: 400 });
    }

    const allowed = getAllowedPriceIds();
    if (!allowed.has(priceId)) {
      return NextResponse.json({ error: 'Invalid price identifier.' }, { status: 400 });
    }

    const siteUrl = getSiteUrl();
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/download?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?checkout=cancelled`,
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Checkout session did not return a URL.' }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout session error:', err);
    return NextResponse.json(
      { error: 'Unable to create checkout session. Please try again.' },
      { status: 500 }
    );
  }
}
