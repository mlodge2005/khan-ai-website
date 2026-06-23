# Khan AI Website

Competitive intelligence product landing page for **Khan AI**.

Static site built with HTML, CSS, and JS. Hosted on GitHub Pages.

## Stripe Setup

The site uses **Stripe Checkout** (hosted payment page) — no backend required.

### 1. Create a Stripe account

Go to [stripe.com](https://stripe.com) and sign up.

### 2. Create a product

1. In the Stripe Dashboard, go to **Products** → **Add Product**
2. Name: `Competitive Intelligence Agent`
3. Description: `Automated competitive intelligence for local businesses`
4. Price: **$200** one-time
5. Save the product

### 3. Get your keys

1. In Stripe Dashboard, go to **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_live_` or `pk_test_`)
3. Go to **Products** → click your product → copy the **Price ID** (starts with `price_`)

### 4. Update the config

Edit `js/stripe-checkout.js` and replace:

```js
const STRIPE_PUBLISHABLE_KEY = 'pk_live_YOUR_PUBLISHABLE_KEY';
const STRIPE_PRICE_ID = 'price_YOUR_PRICE_ID';
```

Also update `SITE_URL` if you're using a custom domain.

### 5. Enable GitHub Pages

1. Go to repo Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main`, folder: `/ (root)`
4. Save

Your site will be live at: `https://mlodge2005.github.io/khan-ai-website/`

## Files

```
├── index.html              # Main landing page
├── download.html           # Post-purchase download page
├── css/
│   └── style.css           # All styles (dark theme)
├── js/
│   └── stripe-checkout.js  # Stripe checkout integration
└── README.md               # This file
```

## Design System

- **Background:** `#0B0B0C`
- **Text:** `#F5F5F5`
- **Accent / Gold:** `#C6A15B`
- **Fonts:** Inter (body), Inter Tight (headlines)
