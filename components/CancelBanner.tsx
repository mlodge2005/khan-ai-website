'use client';

import { useSearchParams } from 'next/navigation';

export function CancelBanner() {
  const searchParams = useSearchParams();
  if (searchParams.get('checkout') !== 'cancelled') return null;

  return (
    <p className="checkout-banner checkout-banner-cancel">
      Checkout was cancelled. You can try again when you&apos;re ready.
    </p>
  );
}
