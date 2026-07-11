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
const INTERNAL_SEND_TOKEN = process.env.INTERNAL_SEND_TOKEN || '';

function pageBaseUrl(request: Request): string {
  const url = new URL(request.url);
  url.search = '';
  return url.toString();
}

async function validateToken(token: string): Promise<
  | { ok: true }
  | { ok: false; reason: 'invalid' | 'unavailable' }
> {
  const validateUrl = new URL('/validate-token', INTERNAL_VPS_URL);
  validateUrl.searchParams.set('token', token);

  const headers: Record<string, string> = {};
  if (INTERNAL_SEND_TOKEN) {
    headers['x-internal-token'] = INTERNAL_SEND_TOKEN;
  }

  const response = await fetch(validateUrl.toString(), {
    method: 'GET',
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    return { ok: false, reason: 'unavailable' };
  }

  const result = (await response.json()) as { valid?: boolean };
  if (!result.valid) {
    return { ok: false, reason: 'invalid' };
  }

  return { ok: true };
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

  try {
    const validation = await validateToken(token);

    if (!validation.ok) {
      if (validation.reason === 'invalid') {
        return htmlResponse(
          renderDownloadErrorPage(
            'Link unavailable',
            'This download link is invalid or has already been used.'
          ),
          401
        );
      }

      return htmlResponse(
        renderDownloadErrorPage(
          'Service unavailable',
          'Unable to verify your download link right now. Please try again in a moment.'
        ),
        503
      );
    }

    const userAgent = request.headers.get('user-agent') || '';
    const platformOverride = parsePlatform(searchParams.get('platform'));
    const { platform, isMobile, uaMismatch } = resolvePlatform(userAgent, platformOverride);

    const downloadUrl = new URL(
      `/download/${encodeURIComponent(token)}`,
      INTERNAL_VPS_URL
    ).toString();

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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Download validation failed:', message);
    return htmlResponse(
      renderDownloadErrorPage(
        'Service unavailable',
        'Download service is temporarily unavailable. Please try again or contact support.'
      ),
      503
    );
  }
}

export const runtime = 'nodejs';
