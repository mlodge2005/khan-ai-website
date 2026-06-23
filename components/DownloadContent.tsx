'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const INSTALL_CMD =
  'curl -fsSL https://raw.githubusercontent.com/mlodge2005/treffy-desktop/main/scripts/install.sh | bash';

function DetailsSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="details-section">
      <button
        type="button"
        className={`details-toggle${open ? ' active' : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        {title}
      </button>
      <div className={`details-body${open ? ' open' : ''}`}>{children}</div>
    </div>
  );
}

export function DownloadContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [verifying, setVerifying] = useState(Boolean(sessionId));
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [copyLabel, setCopyLabel] = useState('Copy');

  useEffect(() => {
    if (!sessionId) {
      setError('Missing checkout session. Complete purchase from the home page.');
      setVerifying(false);
      return;
    }

    let cancelled = false;

    const id = sessionId;
    if (!id) return;

    async function verify() {
      try {
        const res = await fetch(`/api/checkout-session/${encodeURIComponent(id)}`);
        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        if (!res.ok || !data.ok) {
          setError(data.error || 'Payment could not be verified. Contact support if you were charged.');
          setVerified(false);
        } else {
          setVerified(true);
        }
      } catch {
        if (!cancelled) {
          setError('Could not verify payment (network error). Refresh after a moment or contact support.');
        }
      } finally {
        if (!cancelled) setVerifying(false);
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopyLabel('Copied!');
      setTimeout(() => setCopyLabel('Copy'), 2000);
    } catch {
      setCopyLabel('Copy failed');
      setTimeout(() => setCopyLabel('Copy'), 2000);
    }
  }

  return (
    <div className="download-page">
      <div className="download-content">
        {verifying && (
          <div className="checkout-banner checkout-banner-info">Verifying your payment…</div>
        )}
        {error && !verifying && (
          <div className="checkout-banner checkout-banner-error">{error}</div>
        )}
        {verified && !verifying && (
          <>
            <div className="success-icon">✅</div>
            <h1>Thanks for your purchase!</h1>
            <p className="sub">Your Competitive Intelligence Agent is ready to install.</p>

            <p style={{ textAlign: 'left', color: '#8A8A8A', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
              Run this command in your terminal:
            </p>
            <div className="code-block">
              <code>{INSTALL_CMD}</code>
              <button type="button" className="copy-btn" onClick={copyCommand}>{copyLabel}</button>
            </div>

            <p className="info">After running, the agent will ask for your business info and API key.</p>

            <DetailsSection title="What you need to get started">
              <ol>
                <li>
                  An API key from <strong style={{ color: '#F5F5F5' }}>OpenAI</strong>,{' '}
                  <strong style={{ color: '#F5F5F5' }}>Anthropic</strong>,{' '}
                  <strong style={{ color: '#F5F5F5' }}>Grok</strong>, or{' '}
                  <strong style={{ color: '#F5F5F5' }}>DeepSeek</strong>
                </li>
                <li>Your business name and location</li>
                <li>A short description of what you sell</li>
                <li>macOS, Linux, or Windows (WSL2) terminal access</li>
              </ol>
            </DetailsSection>

            <DetailsSection title="Detailed install instructions">
              <ol>
                <li>Open your terminal (Terminal.app on macOS, PowerShell on Windows WSL2)</li>
                <li>Paste the install command above and press Enter</li>
                <li>The installer will download and set up the agent</li>
                <li>Follow the prompts to configure your business and API key</li>
                <li>
                  Run <code style={{ color: '#C6A15B' }}>khan-intel</code> to start your first intelligence report
                </li>
              </ol>
            </DetailsSection>

            <p className="text-muted">
              Need help? Run <code>khan-intel --help</code> or re-read the setup guide above.
            </p>
          </>
        )}

        <Link href="/" className="download-back">← Back to Khan AI</Link>
      </div>
    </div>
  );
}
