import fs from 'fs';
import path from 'path';

export const LEGAL_SLUGS = ['terms', 'privacy', 'refunds', 'license'] as const;
export type LegalSlug = (typeof LEGAL_SLUGS)[number];

const LEGAL_META: Record<LegalSlug, { title: string; file: string; footer: boolean }> = {
  terms: { title: 'Terms of Service', file: 'terms-of-service.md', footer: true },
  privacy: { title: 'Privacy Policy', file: 'privacy-policy.md', footer: true },
  refunds: { title: 'Refund Policy', file: 'refund-policy.md', footer: true },
  license: { title: 'Software License Agreement', file: 'software-license-agreement.md', footer: false },
};

const contentDir = path.join(process.cwd(), 'content', 'legal');

export function isLegalSlug(slug: string): slug is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(slug);
}

export function getLegalMeta(slug: LegalSlug) {
  return LEGAL_META[slug];
}

export function getLegalMarkdown(slug: LegalSlug): string {
  const { file } = LEGAL_META[slug];
  return fs.readFileSync(path.join(contentDir, file), 'utf8');
}

export function getFooterLegalLinks() {
  return LEGAL_SLUGS.filter((slug) => LEGAL_META[slug].footer).map((slug) => ({
    slug,
    href: `/legal/${slug}`,
    title: LEGAL_META[slug].title,
  }));
}
