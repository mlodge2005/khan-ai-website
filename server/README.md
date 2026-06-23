# Khan AI Checkout API

Server-side Stripe Checkout Session endpoint for the static Khan AI website (GitHub Pages).

## Setup

```bash
cd server
cp .env.example .env
# Edit .env — set sk_test_* and test price id for development
npm install
npm start
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness |
| POST | `/api/create-checkout-session` | Body: `{ "priceId": "price_..." }` → `{ "url": "https://checkout.stripe.com/..." }` |
| GET | `/api/checkout-session/:sessionId` | Verify paid session (download page) |

## Environment

- `STRIPE_SECRET_KEY` — **server only** (`sk_test_` or `sk_live_`)
- `STRIPE_ALLOWED_PRICE_IDS` — comma-separated allowlist (frontend price ids must match)
- `SITE_URL` — public site base for success/cancel redirects (e.g. `https://mlodge2005.github.io/khan-ai-website`)
- `CORS_ORIGINS` — allowed browser origins (GitHub Pages + localhost)
- `PORT` — default `4242`

## Local dev

1. Start API: `npm start`
2. Serve static site: `python3 -m http.server 8080` from repo root
3. Set `js/checkout-config.js` test price id if using Stripe test mode
4. Open `http://localhost:8080`

## Production

Deploy this service behind `https://api.khan-automation.com` (or update `js/checkout-config.js` with your API URL).

Ensure `CORS_ORIGINS` includes your GitHub Pages origin (`https://mlodge2005.github.io`).

## Tests

```bash
npm test
```

Requires a running server and valid `sk_test_*` + test price id in `.env`.

Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC.
