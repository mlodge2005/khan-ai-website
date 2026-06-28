import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LegalMarkdown } from '@/components/LegalMarkdown';
import { SiteFooter } from '@/components/SiteFooter';
import { getLegalMarkdown, getLegalMeta, isLegalSlug, LEGAL_SLUGS } from '@/lib/legal';
import type { Metadata } from 'next';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isLegalSlug(slug)) return { title: 'Legal' };
  const meta = getLegalMeta(slug);
  return { title: `${meta.title} — Khan AI` };
}

export default async function LegalPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isLegalSlug(slug)) notFound();

  const meta = getLegalMeta(slug);
  const content = getLegalMarkdown(slug);

  return (
    <>
      <main className="legal-page">
        <div className="container legal-content">
          <p className="legal-back">
            <Link href="/">← Back to Khan AI</Link>
          </p>
          <LegalMarkdown content={content} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
