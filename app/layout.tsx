import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Khan AI — Competitive Intelligence for Local Businesses',
  description:
    'Automated competitive intelligence for local businesses. Scrapes Yelp & Google reviews, identifies competitors, and surfaces weak points. One-time purchase. $200.',
  icons: { icon: '/assets/logos/khan-ai-icon-trans.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
