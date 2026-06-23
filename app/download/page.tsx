import { Suspense } from 'react';
import { DownloadContent } from '@/components/DownloadContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Download — Khan AI Competitive Intelligence Agent',
  description: 'Download your Competitive Intelligence Agent install script.',
};

export default function DownloadPage() {
  return (
    <Suspense fallback={<div className="download-page"><p>Loading…</p></div>}>
      <DownloadContent />
    </Suspense>
  );
}
