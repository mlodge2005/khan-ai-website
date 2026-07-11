export type Platform = 'windows' | 'mac' | 'linux';

export type DetectedDevice =
  | { kind: 'desktop'; platform: Platform }
  | { kind: 'mobile' };

const PLATFORM_LABELS: Record<Platform, string> = {
  windows: 'Windows',
  mac: 'Mac',
  linux: 'Linux',
};

const INSTALL_CMD =
  'curl -fsSL https://raw.githubusercontent.com/mlodge2005/treffy-desktop/main/scripts/install.sh | bash';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function pageShell(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} — Khan AI</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #0B0B0C;
      color: #F5F5F5;
      min-height: 100vh;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    h1, h2 {
      font-family: 'Inter Tight', sans-serif;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.15;
    }
    h1 { font-size: clamp(1.75rem, 4vw, 2.5rem); margin-bottom: 0.75rem; }
    p { color: #B0B0B0; font-size: 1.05rem; }
    a { color: #C6A15B; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
    }
    .card {
      width: 100%;
      max-width: 640px;
      text-align: center;
    }
    .logo {
      width: 72px;
      height: 72px;
      margin: 0 auto 1.5rem;
      display: block;
    }
    .sub { margin-bottom: 2rem; }
    .btn {
      display: inline-block;
      background: #C6A15B;
      color: #0B0B0C;
      font-family: 'Inter Tight', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      padding: 0.9rem 1.75rem;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s, transform 0.2s;
    }
    .btn:hover {
      background: #d4b06a;
      text-decoration: none;
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: rgba(198, 161, 91, 0.12);
      color: #C6A15B;
      border: 1px solid rgba(198, 161, 91, 0.25);
    }
    .btn-secondary:hover { background: rgba(198, 161, 91, 0.2); color: #C6A15B; }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      background: #1A1A1C;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 999px;
      padding: 0.55rem 1rem;
      color: #C6A15B;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }
    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(198, 161, 91, 0.25);
      border-top-color: #C6A15B;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .fallback {
      margin-top: 1.25rem;
      font-size: 0.95rem;
    }
    .alt-links {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 0.95rem;
    }
    .alt-links p { font-size: 0.95rem; margin-bottom: 0.5rem; }
    .help {
      margin-top: 2rem;
      text-align: left;
      background: #1A1A1C;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
    }
    .help h2 {
      font-size: 1.1rem;
      margin-bottom: 0.75rem;
      color: #F5F5F5;
    }
    .help ol {
      list-style: none;
      counter-reset: step;
    }
    .help ol li {
      counter-increment: step;
      padding: 0.45rem 0;
      color: #B0B0B0;
      font-size: 0.95rem;
    }
    .help ol li::before {
      content: counter(step) ".";
      color: #C6A15B;
      font-weight: 700;
      margin-right: 0.5rem;
    }
    .help code {
      font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
      color: #C6A15B;
      font-size: 0.85rem;
      word-break: break-all;
    }
    .error-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .support { margin-top: 1.5rem; font-size: 0.95rem; }
    .back {
      display: inline-block;
      margin-top: 2rem;
      color: #6B6B6B;
      font-size: 0.9rem;
    }
    .banner {
      background: rgba(198, 161, 91, 0.1);
      border: 1px solid rgba(198, 161, 91, 0.25);
      border-radius: 10px;
      padding: 1rem 1.25rem;
      margin-bottom: 1.5rem;
      text-align: left;
    }
    .banner p { color: #F5F5F5; font-size: 0.95rem; }
    .win-warning {
      background: #1A1A1C;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 1rem 1.25rem;
      margin-bottom: 1.5rem;
      text-align: left;
    }
    .win-warning p { color: #B0B0B0; font-size: 0.9rem; }
    .request-section {
      margin-top: 2rem;
      text-align: left;
      background: #1A1A1C;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
    }
    .request-section h2 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      color: #F5F5F5;
    }
    .request-section .request-intro {
      margin-bottom: 1.25rem;
      font-size: 0.95rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      color: #F5F5F5;
      margin-bottom: 0.4rem;
    }
    .form-group label span {
      color: #6B6B6B;
      font-weight: 400;
    }
    .form-input {
      width: 100%;
      background: #0B0B0C;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 0.7rem 0.85rem;
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      color: #F5F5F5;
      outline: none;
      transition: border-color 0.2s;
    }
    .form-input:focus {
      border-color: rgba(198, 161, 91, 0.5);
    }
    .form-input::placeholder { color: #6B6B6B; }
    .form-submit {
      width: 100%;
      margin-top: 0.25rem;
    }
    .form-message {
      margin-top: 1rem;
      padding: 0.85rem 1rem;
      border-radius: 8px;
      font-size: 0.95rem;
      display: none;
    }
    .form-message.visible { display: block; }
    .form-success {
      background: rgba(198, 161, 91, 0.1);
      color: #F5F5F5;
    }
    .form-success strong { color: #C6A15B; }
    .form-error {
      background: rgba(255, 80, 80, 0.1);
      color: #F5F5F5;
      border: 1px solid rgba(255, 80, 80, 0.2);
    }
    .card-wide { max-width: 640px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="card">
      <img class="logo" src="/assets/logos/khan-ai-logo-animated.svg" alt="Khan AI">
      ${body}
    </div>
  </div>
</body>
</html>`;
}

export function detectDevice(userAgent: string): DetectedDevice {
  const ua = userAgent.toLowerCase();

  if (/android|iphone|ipad|ipod|mobile|webos|blackberry|iemobile|opera mini/i.test(ua)) {
    return { kind: 'mobile' };
  }

  if (/mac os x|macintosh|darwin/i.test(ua) && !/windows/i.test(ua)) {
    return { kind: 'desktop', platform: 'mac' };
  }

  if (/linux/i.test(ua) && !/android/i.test(ua)) {
    return { kind: 'desktop', platform: 'linux' };
  }

  if (/windows|win32|win64|wow64/i.test(ua)) {
    return { kind: 'desktop', platform: 'windows' };
  }

  return { kind: 'desktop', platform: 'windows' };
}

export function parsePlatform(value: string | null): Platform | null {
  if (value === 'windows' || value === 'mac' || value === 'linux') {
    return value;
  }
  return null;
}

export function renderDownloadErrorPage(
  heading: string,
  message: string,
  options?: { showSupport?: boolean }
): string {
  const showSupport = options?.showSupport !== false;
  const body = `
      <div class="error-icon">⚠️</div>
      <h1>${escapeHtml(heading)}</h1>
      <p class="sub">${escapeHtml(message)}</p>
      ${
        showSupport
          ? `<p class="support">Contact support at <a href="mailto:marcus@khan-automation.com">marcus@khan-automation.com</a></p>`
          : ''
      }
      ${showSupport ? requestDownloadForm() : ''}
      <a class="back" href="https://khan-automation.com/">← Back to Khan AI</a>`;

  return pageShell('Download', body);
}

function setupSteps(platform: Platform): string {
  if (platform === 'windows') {
    return `<ol>
        <li>Run the downloaded <strong style="color:#F5F5F5">.exe</strong> installer</li>
        <li>Follow the setup prompts to configure your business and API key</li>
        <li>Open a terminal and run <code>khan-intel</code> to start your first report</li>
      </ol>`;
  }

  if (platform === 'mac') {
    return `<ol>
        <li>Open the downloaded <strong style="color:#F5F5F5">.dmg</strong> file</li>
        <li>Drag Khan AI Intel to your Applications folder</li>
        <li>Launch the app and follow the setup prompts</li>
        <li>Run <code>khan-intel</code> in Terminal to start your first report</li>
      </ol>`;
  }

  return `<ol>
      <li>Open a terminal on your Linux machine</li>
      <li>Run: <code>${escapeHtml(INSTALL_CMD)}</code></li>
      <li>Follow the prompts to configure your business and API key</li>
      <li>Run <code>khan-intel</code> to start your first intelligence report</li>
    </ol>`;
}

function windowsWarningBanner(): string {
  return `<div class="win-warning">
        <p>⚠️ Windows may show a &ldquo;not typically downloaded&rdquo; warning. Click <strong style="color:#F5F5F5">More info</strong> then <strong style="color:#F5F5F5">Run anyway</strong> — Intel is safe, open-source software.</p>
      </div>`;
}

function requestDownloadForm(): string {
  return `<div class="request-section">
        <h2>Need another download link?</h2>
        <p class="request-intro">Lost your installer or already used your link? Submit your purchase details and we&apos;ll review your request.</p>
        <form id="request-download-form" novalidate>
          <div class="form-group">
            <label for="req-name">Name <span>(required)</span></label>
            <input class="form-input" type="text" id="req-name" name="name" required autocomplete="name" placeholder="Your name">
          </div>
          <div class="form-group">
            <label for="req-email">Email <span>(required — purchase email)</span></label>
            <input class="form-input" type="email" id="req-email" name="email" required autocomplete="email" placeholder="you@business.com">
          </div>
          <div class="form-group">
            <label for="req-business">Business name <span>(optional)</span></label>
            <input class="form-input" type="text" id="req-business" name="businessName" autocomplete="organization" placeholder="Your business">
          </div>
          <button class="btn form-submit" type="submit" id="req-submit">Request download link</button>
        </form>
        <div class="form-message form-success" id="request-success" role="status">
          <strong>Request received.</strong> We&apos;ll review your request and get back to you.
        </div>
        <div class="form-message form-error" id="request-error" role="alert">
          Something went wrong. Email <a href="mailto:marcus@khan-automation.com">marcus@khan-automation.com</a> directly.
        </div>
      </div>
      <script>
        (function () {
          var form = document.getElementById('request-download-form');
          if (!form) return;
          var successEl = document.getElementById('request-success');
          var errorEl = document.getElementById('request-error');
          var submitBtn = document.getElementById('req-submit');
          form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (successEl) successEl.classList.remove('visible');
            if (errorEl) errorEl.classList.remove('visible');
            var name = (document.getElementById('req-name') || {}).value || '';
            var email = (document.getElementById('req-email') || {}).value || '';
            var businessName = (document.getElementById('req-business') || {}).value || '';
            if (!name.trim() || !email.trim()) {
              if (errorEl) {
                errorEl.textContent = 'Name and email are required.';
                errorEl.classList.add('visible');
              }
              return;
            }
            if (submitBtn) {
              submitBtn.disabled = true;
              submitBtn.textContent = 'Sending…';
            }
            fetch('/api/request-download', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: name.trim(),
                email: email.trim(),
                businessName: businessName.trim() || null
              })
            })
              .then(function (res) {
                if (!res.ok) throw new Error('request failed');
                return res.json();
              })
              .then(function () {
                form.style.display = 'none';
                if (successEl) successEl.classList.add('visible');
              })
              .catch(function () {
                if (errorEl) errorEl.classList.add('visible');
                if (submitBtn) {
                  submitBtn.disabled = false;
                  submitBtn.textContent = 'Request download link';
                }
              });
          });
        })();
      </script>`;
}

function alternateLinks(
  token: string,
  activePlatform: Platform,
  pageBaseUrl: string
): string {
  const others = (['windows', 'mac', 'linux'] as Platform[]).filter((p) => p !== activePlatform);
  const links = others
    .map((platform) => {
      const href = `${pageBaseUrl}?token=${encodeURIComponent(token)}&platform=${platform}`;
      return `<a href="${escapeHtml(href)}">${PLATFORM_LABELS[platform]}</a>`;
    })
    .join(' · ');

  return `
      <div class="alt-links">
        <p>Need a different version?</p>
        <p>${links}</p>
      </div>`;
}

export function renderDownloadPage(options: {
  token: string;
  downloadUrl: string;
  platform: Platform;
  pageBaseUrl: string;
  isMobile: boolean;
  uaMismatch?: boolean;
}): string {
  const { token, downloadUrl, platform, pageBaseUrl, isMobile, uaMismatch } = options;
  const label = PLATFORM_LABELS[platform];
  const safeDownloadUrl = escapeHtml(downloadUrl);

  if (isMobile) {
    const body = `
      <div class="banner">
        <p><strong style="color:#C6A15B">Desktop required.</strong> Installers are built for Mac, Windows, and Linux desktops. Open this link on your computer to download.</p>
      </div>
      <h1>Download on your computer</h1>
      <p class="sub">Copy this link and open it on your desktop to get the ${escapeHtml(label)} installer.</p>
      <p style="word-break:break-all;font-size:0.9rem;margin-bottom:1.5rem;color:#8A8A8A">${escapeHtml(pageBaseUrl)}?token=${escapeHtml(token)}</p>
      ${alternateLinks(token, platform, pageBaseUrl)}
      <div class="help">
        <h2>Having trouble?</h2>
        ${setupSteps(platform)}
      </div>
      ${requestDownloadForm()}
      <a class="back" href="https://khan-automation.com/">← Back to Khan AI</a>`;

    return pageShell('Download', body);
  }

  const mismatchNote =
    uaMismatch && platform !== 'linux'
      ? `<div class="banner"><p>For the ${escapeHtml(label)} installer, open this page on a ${escapeHtml(label)} computer before downloading.</p></div>`
      : '';

  const primaryAction = `<a class="btn" id="download-btn" href="${safeDownloadUrl}">Download for ${escapeHtml(label)}</a>`;

  const winWarning = platform === 'windows' ? windowsWarningBanner() : '';

  const body = `
      ${mismatchNote}
      ${winWarning}
      <div class="status"><span class="spinner"></span> Your download is starting…</div>
      <h1>Thanks for your purchase</h1>
      <p class="sub">Your Competitive Intelligence Agent is ready to install.</p>
      ${primaryAction}
      <p class="fallback">Download didn&apos;t start? <a href="${safeDownloadUrl}" id="fallback-link">Click here</a>.</p>
      ${alternateLinks(token, platform, pageBaseUrl)}
      <div class="help">
        <h2>Having trouble?</h2>
        ${setupSteps(platform)}
      </div>
      ${requestDownloadForm()}
      <a class="back" href="https://khan-automation.com/">← Back to Khan AI</a>
      <iframe id="download-frame" title="Download" style="display:none;width:0;height:0;border:0" aria-hidden="true"></iframe>
      <script>
        (function () {
          var url = ${JSON.stringify(downloadUrl)};
          function triggerDownload() {
            var frame = document.getElementById('download-frame');
            if (frame) frame.src = url;
          }
          window.addEventListener('load', function () {
            setTimeout(triggerDownload, 1500);
          });
          var btn = document.getElementById('download-btn');
          if (btn) {
            btn.addEventListener('click', function (e) {
              e.preventDefault();
              triggerDownload();
            });
          }
          var fallback = document.getElementById('fallback-link');
          if (fallback) {
            fallback.addEventListener('click', function (e) {
              e.preventDefault();
              triggerDownload();
            });
          }
        })();
      </script>`;

  return pageShell('Download', body);
}

export function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
