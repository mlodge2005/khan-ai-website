/**
 * Khan AI — Stripe Checkout (server-side Checkout Session)
 *
 * Frontend sends only the price id; secret keys stay on the checkout API.
 */
(function () {
  'use strict';

  // Checkout API — set CHECKOUT_API_URL in js/checkout-config.js for production
  var CHECKOUT_API_URL = window.KHAN_CHECKOUT_API_URL || 'http://localhost:4242';
  var STRIPE_PRICE_ID = window.KHAN_STRIPE_PRICE_ID || 'price_1TlcA3ID3oRDYINyeVbUwENv';

  function setButtonLoading(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    btn.setAttribute('aria-busy', loading ? 'true' : 'false');
    if (loading) {
      btn.dataset.originalText = btn.textContent;
      btn.textContent = 'Redirecting…';
    } else if (btn.dataset.originalText) {
      btn.textContent = btn.dataset.originalText;
      delete btn.dataset.originalText;
    }
  }

  function showCheckoutError(message) {
    console.error('Checkout error:', message);
    alert(message || 'Something went wrong. Please try again.');
  }

  async function handleCheckout(event) {
    var btn = event.currentTarget;
    setButtonLoading(btn, true);

    try {
      var res = await fetch(CHECKOUT_API_URL + '/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: STRIPE_PRICE_ID }),
      });

      var data = await res.json().catch(function () {
        return {};
      });

      if (!res.ok) {
        showCheckoutError(data.error || 'Checkout could not be started.');
        setButtonLoading(btn, false);
        return;
      }

      if (!data.url) {
        showCheckoutError('Checkout did not return a redirect URL.');
        setButtonLoading(btn, false);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      showCheckoutError('Network error. Check your connection and try again.');
      setButtonLoading(btn, false);
    }
  }

  function showCancelBanner() {
    if (!window.location.search.includes('checkout=cancelled')) return;

    var hero = document.querySelector('.hero-content');
    if (!hero) return;

    var banner = document.createElement('p');
    banner.className = 'checkout-banner checkout-banner-cancel';
    banner.textContent = 'Checkout was cancelled. You can try again when you\'re ready.';
    hero.insertBefore(banner, hero.firstChild);
  }

  document.addEventListener('DOMContentLoaded', function () {
    showCancelBanner();

    var buttons = document.querySelectorAll('#checkout-button, #checkout-button-pricing');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', handleCheckout);
    });
  });
})();
