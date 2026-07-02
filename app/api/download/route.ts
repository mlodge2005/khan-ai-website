import { NextResponse } from 'next/server';

const INTERNAL_VPS_URL =
  process.env.INTERNAL_VPS_URL || 'http://146.190.78.237:3847';
const INTERNAL_SEND_TOKEN = process.env.INTERNAL_SEND_TOKEN || '';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Missing download token' }, { status: 400 });
  }

  try {
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
      return NextResponse.json(
        { error: 'Unable to verify download link. Please contact support.' },
        { status: 503 }
      );
    }

    const result = (await response.json()) as { valid?: boolean };

    if (!result.valid) {
      return NextResponse.json(
        { error: 'This download link is invalid or has already been used.' },
        { status: 401 }
      );
    }

    const downloadUrl = new URL(`/download/${encodeURIComponent(token)}`, INTERNAL_VPS_URL);
    return NextResponse.redirect(downloadUrl.toString(), 302);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Download validation failed:', message);
    return NextResponse.json(
      { error: 'Download service is temporarily unavailable. Please try again or contact support.' },
      { status: 503 }
    );
  }
}

export const runtime = 'nodejs';
