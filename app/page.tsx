import Image from 'next/image';
import { CheckoutButton } from '@/components/CheckoutButton';
import { CancelBannerWrapper } from '@/components/CancelBannerWrapper';
import { PurchaseLegal } from '@/components/PurchaseLegal';
import { SiteFooter } from '@/components/SiteFooter';

export default function HomePage() {
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-content">
          <CancelBannerWrapper />
          <div className="hero-logo">
            <Image
              src="/assets/logos/khan-ai-logo-animated.svg"
              alt="Khan AI"
              width={80}
              height={80}
              priority
            />
          </div>
          <h1>
            Know what your customers are <em>actually</em> saying. Before your competitors do.
          </h1>
          <p>
            Automated competitive intelligence for local businesses. Scrapes Yelp &amp; Google reviews,
            identifies your competitors, and surfaces weak points in your customer relationships.
            One-time purchase. <strong style={{ color: '#F5F5F5' }}>$200</strong>.
          </p>
          <CheckoutButton className="btn-gold">Get Intel — $200</CheckoutButton>
          <p className="note">Runs on your machine. Your data stays with you. No subscription.</p>
        </div>
      </section>

      <section id="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Set up in 5 minutes</h3>
              <p>One command install, paste your API key, done. No complex configuration.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Tell it about your business</h3>
              <p>Your business name, location, and what you sell. That&apos;s all we need to get started.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Get intelligence</h3>
              <p>Run reports, track competitors, and receive weekly intelligence briefs.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features">
        <div className="container">
          <h2>What You Get</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🕵️</div>
              <h3>Competitor Discovery</h3>
              <p>
                Automatically finds your top local competitors from Yelp and Google review data.
                Know who you&apos;re really up against.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Complaint Analysis</h3>
              <p>
                Extracts what customers complain about most — with evidence quotes — so you can fix
                issues before they cost you business.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Weekly Reports</h3>
              <p>
                Recurring intelligence briefs delivered straight to your channel. Competitor moves,
                complaint trends, market shifts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing">
        <div className="container pricing-section">
          <h2>One Price. Full Access.</h2>
          <div className="pricing-card">
            <div className="price">$200</div>
            <div className="price-label">one-time purchase</div>
            <ul className="pricing-includes">
              <li>The Competitive Intelligence Agent software</li>
              <li>Desktop app + install script</li>
              <li>1 year of updates</li>
              <li>Runs locally — your data stays with you</li>
            </ul>
            <div className="pricing-note-left">
              <strong>What you need:</strong> An API key from OpenAI, Anthropic, Grok, or DeepSeek.
            </div>
            <PurchaseLegal />
            <CheckoutButton className="btn-gold">Buy Now — $200</CheckoutButton>
            <p className="pricing-note">No hidden fees. Runs locally on your machine.</p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
