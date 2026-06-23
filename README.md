# Khan AI Website (Next.js)

Competitive intelligence landing page for **Khan AI**, built with **Next.js** for deployment on **Vercel**.

Stripe Checkout uses **server-side Checkout Sessions** via Next.js API routes — no separate Express server, no client-only Stripe.js integration.

## Vercel deployment

1. Import the repo in [Vercel](https://vercel.com) (framework preset: **Next.js**).
2. Add **Environment Variables** (Production):

   | Variable | Notes |
   |----------|--------|
   | `STRIPE_SECRET_KEY` | `sk_live_…` — **never expose in client code** |
   | `STRIPE_ALLOWED_PRICE_IDS` | e.g. `price_1TlcA3ID3oRDYINyeVbUwENv` |
   | `NEXT_PUBLIC_STRIPE_PRICE_ID` | Same price id (public, sent from browser) |
   | `NEXT_PUBLIC_SITE_URL` | Optional — `https://your-custom-domain.com` |

   Vercel sets `VERCEL_URL` automatically; redirect URLs use it when `NEXT_PUBLIC_SITE_URL` is unset.

3. Deploy — `npm run build` runs on Vercel.

## Local development

```bash
cp .env.example .env.local
# Edit .env.local with your Stripe keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server |

## API routes

| Route | Description |
|-------|-------------|
| `POST /api/create-checkout-session` | Body `{ priceId }` → `{ url }` |
| `GET /api/checkout-session/[sessionId]` | Verify paid session |

## Project structure

```
app/
  page.tsx              # Landing page
  download/page.tsx     # Post-purchase download
  api/                  # Stripe Checkout API routes
components/             # Checkout button, download UI
public/assets/logos/    # SVG logos
lib/stripe.ts           # Stripe client + site URL helpers
```

## Legacy

The old static HTML site and `server/` Express checkout API were replaced by this Next.js app. Do not deploy `server/` separately on Vercel.

## Design

- Background `#0B0B0C`, text `#F5F5F5`, accent `#C6A15B`
- Fonts: Inter, Inter Tight
