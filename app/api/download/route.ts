import {
  detectDevice,
  htmlResponse,
  parsePlatform,
  renderDownloadErrorPage,
  renderDownloadPage,
  type Platform,
} from '@/lib/download-page';

const INTERNAL_VPS_URL =
  process.env.INTERNAL_VPS_URL || 'https://openclaw.khan-automation.com/api';

function pageBaseUrl(request: Request): string {
  const url = new URL(request.url);
  url.search = '';
  return url.toString();
}

function vpsUrl(path: string): string {
  const base = INTERNAL_VPS_URL.endsWith('/')
    ? INTERNAL_VPS_URL
    : `${INTERNAL_VPS_URL}/`;
  return new URL(path.replace(/^\/+/, ''), base).toString();
}

function resolvePlatform(
  userAgent: string,
  platformOverride: Platform | null
): { platform: Platform; isMobile: boolean; uaMismatch: boolean } {
  const device = detectDevice(userAgent);

  if (device.kind === 'mobile') {
    const platform = platformOverride ?? 'windows';
    return { platform, isMobile: true, uaMismatch: false };
  }

  const platform = platformOverride ?? device.platform;
  const uaMismatch = platformOverride !== null && platformOverride !== device.platform;

  return { platform, isMobile: false, uaMismatch };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return htmlResponse(
      renderDownloadErrorPage(
        'Missing download link',
        'This page requires a valid download token from your purchase email.',
        { showSupport: true }
      ),
      400
    );
  }

  const userAgent = request.headers.get('user-agent') || '';
  const platformOverride = parsePlatform(searchParams.get('platform'));
  const { platform, isMobile, uaMismatch } = resolvePlatform(userAgent, platformOverride);

  const downloadUrl = vpsUrl(`download/${encodeURIComponent(token)}`);

  return htmlResponse(
    renderDownloadPage({
      token,
      downloadUrl,
      platform,
      pageBaseUrl: pageBaseUrl(request),
      isMobile,
      uaMismatch,
    })
  );
}

export const runtime = 'nodejs';
