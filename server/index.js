'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const PORT = Number(process.env.PORT || 4242);
const SITE_URL = (process.env.SITE_URL || 'http://localhost:8080').replace(/\/$/, '');
const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!stripeSecret) {
  console.error('STRIPE_SECRET_KEY is required. Copy server/.env.example to server/.env');
  process.exit(1);
}

const stripe = new Stripe(stripeSecret);

const allowedPriceIds = new Set(
  (process.env.STRIPE_ALLOWED_PRICE_IDS || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
);

if (allowedPriceIds.size === 0) {
  console.error('STRIPE_ALLOWED_PRICE_IDS must list at least one price id.');
  process.exit(1);
}

const corsOrigins = (process.env.CORS_ORIGINS || SITE_URL)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();
app.use(express.json({ limit: '1kb' }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
  })
);

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'khan-ai-checkout' });
});

app.post('/api/create-checkout-session', async (req, res) => {
  const priceId = typeof req.body?.priceId === 'string' ? req.body.priceId.trim() : '';

  if (!priceId) {
    res.status(400).json({ error: 'priceId is required.' });
    return;
  }

  if (!allowedPriceIds.has(priceId)) {
    res.status(400).json({ error: 'Invalid price identifier.' });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/download.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/?checkout=cancelled`,
    });

    if (!session.url) {
      res.status(500).json({ error: 'Checkout session did not return a URL.' });
      return;
    }

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout session error:', err.message);
    res.status(500).json({ error: 'Unable to create checkout session. Please try again.' });
  }
});

app.get('/api/checkout-session/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;

  if (!sessionId || !sessionId.startsWith('cs_')) {
    res.status(400).json({ error: 'Invalid session id.' });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      res.status(400).json({
        ok: false,
        payment_status: session.payment_status,
        error: 'Payment not completed.',
      });
      return;
    }

    res.json({
      ok: true,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email || null,
    });
  } catch (err) {
    console.error('Stripe session retrieve error:', err.message);
    res.status(400).json({ error: 'Could not verify checkout session.' });
  }
});

app.use((err, _req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    res.status(403).json({ error: 'Origin not allowed.' });
    return;
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Khan AI checkout API listening on http://localhost:${PORT}`);
  console.log(`SITE_URL=${SITE_URL}`);
  console.log(`Allowed prices: ${[...allowedPriceIds].join(', ')}`);
});
