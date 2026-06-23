'use client';

import { Suspense } from 'react';
import { CancelBanner } from '@/components/CancelBanner';

export function CancelBannerWrapper() {
  return (
    <Suspense fallback={null}>
      <CancelBanner />
    </Suspense>
  );
}
