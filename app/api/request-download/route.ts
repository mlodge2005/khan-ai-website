import { NextResponse } from 'next/server';

const INTERNAL_VPS_URL =
  process.env.INTERNAL_VPS_URL || 'https://openclaw.khan-automation.com/api';
const INTERNAL_SEND_TOKEN = process.env.INTERNAL_SEND_TOKEN || '';
const NOTIFY_EMAIL = 'marcus@khan-automation.com';

type RequestBody = {
  name?: string;
  email?: string;
  businessName?: string | null;
  reason?: string | null;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const name = (body.name || '').trim();
  const email = (body.email || '').trim().toLowerCase();
  const businessName = (body.businessName || '').trim() || null;
  const reason = (body.reason || '').trim() || null;

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
  }

  const payload = {
    name,
    email,
    businessName,
    reason,
    notifyEmail: NOTIFY_EMAIL,
    requestedAt: new Date().toISOString(),
    source: 'khan-automation.com/download',
  };

  const notifyUrl = new URL('/request-download-notify', INTERNAL_VPS_URL);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (INTERNAL_SEND_TOKEN) {
    headers['x-internal-token'] = INTERNAL_SEND_TOKEN;
  }

  try {
    const response = await fetch(notifyUrl.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error(
        `Request-download notify failed (${response.status}):`,
        text.slice(0, 500)
      );

      if (response.status === 404) {
        console.error(
          'VPS endpoint /request-download-notify not found. See dev workspace VPS_REQUEST_DOWNLOAD.md for setup.'
        );
      }

      return NextResponse.json(
        { error: 'Unable to submit request right now. Email support directly.' },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Request-download notify error:', message);
    return NextResponse.json(
      { error: 'Unable to submit request right now. Email support directly.' },
      { status: 503 }
    );
  }
}

export const runtime = 'nodejs';
