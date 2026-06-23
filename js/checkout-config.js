/**
 * Checkout configuration (no secrets — price id and API URL only).
 * For Stripe test mode, use your test price id from the Stripe Dashboard.
 */
(function () {
  var host = window.location.hostname;
  var isLocal = host === 'localhost' || host === '127.0.0.1';

  window.KHAN_CHECKOUT_API_URL = isLocal
    ? 'http://localhost:4242'
    : 'https://api.khan-automation.com';

  // Live price — swap to your test price id when testing (test mode product in Stripe Dashboard)
  window.KHAN_STRIPE_PRICE_ID = 'price_1TlcA3ID3oRDYINyeVbUwENv';
})();
