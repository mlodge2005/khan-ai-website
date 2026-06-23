'use client';

import { useState } from 'react';

const PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_1TlcA3ID3oRDYINyeVbUwENv';

export function CheckoutButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: PRICE_ID }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.url) {
        alert(data.error || 'Checkout could not be started. Please try again.');
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      alert('Network error. Check your connection and try again.');
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleCheckout}
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? 'Redirecting…' : children}
    </button>
  );
}
