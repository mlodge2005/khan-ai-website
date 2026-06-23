import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured.');
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export function getAllowedPriceIds(): Set<string> {
  const raw = process.env.STRIPE_ALLOWED_PRICE_IDS || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || '';
  const ids = raw.split(',').map((id) => id.trim()).filter(Boolean);
  if (ids.length === 0) {
    throw new Error('STRIPE_ALLOWED_PRICE_IDS or NEXT_PUBLIC_STRIPE_PRICE_ID is required.');
  }
  return new Set(ids);
}

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}
