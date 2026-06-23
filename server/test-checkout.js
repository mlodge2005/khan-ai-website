'use strict';

/**
 * Integration tests for checkout API (Stripe test mode).
 * Requires server/.env with sk_test_* and matching STRIPE_ALLOWED_PRICE_IDS.
 *
 * Usage: npm test   (from server/)
 */

require('dotenv').config();

const BASE = process.env.TEST_API_URL || `http://127.0.0.1:${process.env.PORT || 4242}`;

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return { status: res.status, data };
}

async function run() {
  let passed = 0;
  let failed = 0;

  function ok(name) {
    console.log(`  OK  ${name}`);
    passed += 1;
  }

  function fail(name, detail) {
    console.error(`  FAIL ${name}: ${detail}`);
    failed += 1;
  }

  console.log(`Testing ${BASE}\n`);

  const health = await request('GET', '/health');
  if (health.status === 200 && health.data.ok) ok('GET /health');
  else fail('GET /health', JSON.stringify(health));

  const noPrice = await request('POST', '/api/create-checkout-session', {});
  if (noPrice.status === 400) ok('POST create-checkout-session rejects missing priceId');
  else fail('missing priceId', JSON.stringify(noPrice));

  const badPrice = await request('POST', '/api/create-checkout-session', { priceId: 'price_invalid' });
  if (badPrice.status === 400) ok('POST create-checkout-session rejects invalid priceId');
  else fail('invalid priceId', JSON.stringify(badPrice));

  const allowed = (process.env.STRIPE_ALLOWED_PRICE_IDS || '').split(',')[0]?.trim();
  if (!allowed) {
    fail('create-checkout-session', 'STRIPE_ALLOWED_PRICE_IDS not set in .env');
  } else {
    const session = await request('POST', '/api/create-checkout-session', { priceId: allowed });
    if (session.status === 200 && session.data.url?.startsWith('https://checkout.stripe.com/')) {
      ok('POST create-checkout-session returns checkout.stripe.com URL');
    } else {
      fail('create-checkout-session', JSON.stringify(session));
    }
  }

  const badSession = await request('GET', '/api/checkout-session/not_a_session');
  if (badSession.status === 400) ok('GET checkout-session rejects invalid session id');
  else fail('invalid session id', JSON.stringify(badSession));

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
