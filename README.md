# Khan AI Website

Competitive intelligence product landing page for **Khan AI**.

Static site (HTML/CSS/JS) on GitHub Pages, with a small Node checkout API for Stripe.

## Stripe Checkout (server-side)

The site uses **Stripe Checkout Sessions** created on the server. The frontend no longer calls `redirectToCheckout` (client-only integration).

### Architecture

```text
Browser → POST /api/create-checkout-session { priceId }
       → Checkout API (STRIPE_SECRET_KEY)
       → { url } → redirect to checkout.stripe.com
       → success → download.html?session_id=… (verified via API)
       → cancel → index.html?checkout=cancelled
```

### 1. Stripe Dashboard

1. Create product **Competitive Intelligence Agent** — $200 one-time
2. Copy **Price ID** (`price_…`)
3. For development, toggle **Test mode** and use test price + `sk_test_` secret key

### 2. Checkout API (`server/`)

```bash
cd server
cp .env.example .env
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_ALLOWED_PRICE_IDS=price_test_...
# SITE_URL=https://mlodge2005.github.io/khan-ai-website
npm install
npm start
```

See [server/README.md](server/README.md) for deployment and tests.

### 3. Frontend config

Edit `js/checkout-config.js`:

- `KHAN_CHECKOUT_API_URL` — production API (default `https://api.khan-automation.com`)
- `KHAN_STRIPE_PRICE_ID` — price id sent to the API (use test price id in test mode)

No secret keys in the frontend.

### 4. GitHub Pages

Repo Settings → Pages → branch `main`, folder `/ (root)`.

Live site: `https://mlodge2005.github.io/khan-ai-website/`

## Files

```
├── index.html
├── download.html
├── css/style.css
├── js/
│   ├── checkout-config.js   # API URL + price id (no secrets)
│   └── stripe-checkout.js   # Creates session via API, redirects to session.url
├── server/                  # Stripe Checkout Session API
│   ├── index.js
│   ├── package.json
│   └── test-checkout.js
└── README.md
```

## Design System

- **Background:** `#0B0B0C`
- **Text:** `#F5F5F5`
- **Accent / Gold:** `#C6A15B`
- **Fonts:** Inter (body), Inter Tight (headlines)
