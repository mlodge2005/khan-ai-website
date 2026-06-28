import Link from 'next/link';
import { getFooterLegalLinks } from '@/lib/legal';

export function SiteFooter() {
  const links = getFooterLegalLinks();

  return (
    <footer>
      <div className="container">
        <nav className="site-footer-links" aria-label="Legal">
          {links.map((link) => (
            <Link key={link.slug} href={link.href}>{link.title}</Link>
          ))}
        </nav>
        <p>Built by Khan AI</p>
        <p className="site-footer-note">This is a local application. We do not host your data.</p>
      </div>
    </footer>
  );
}
