/**
 * Khan AI — Stripe Checkout Integration
 *
 * CONFIG: Replace these with your actual Stripe values.
 * Get them from https://dashboard.stripe.com/
 */
const STRIPE_PUBLISHABLE_KEY = 'pk_live_YOUR_PUBLISHABLE_KEY';
const STRIPE_PRICE_ID = 'price_YOUR_PRICE_ID';

// Base URL for redirects — update for your domain
const SITE_URL = 'https://mlodge2005.github.io/khan-ai-website';

const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);

function handleCheckout() {
  stripe.redirectToCheckout({
    lineItems: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
    mode: 'payment',
    successUrl: SITE_URL + '/download.html?session_id={CHECKOUT_SESSION_ID}',
    cancelUrl: SITE_URL + '/',
  }).catch(function (error) {
    console.error('Stripe redirect error:', error);
    alert('Something went wrong. Please try again.');
  });
}

// Bind to all checkout buttons on the page
document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('#checkout-button, #checkout-button-pricing');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', handleCheckout);
  });
});
