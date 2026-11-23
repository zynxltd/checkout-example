/**
 * Crazy Egg — PDP low stock badge (FOMO / urgency)
 *
 * Compact white pill above Add to basket when remaining stock is less than
 * SHOW_BELOW. Example: SHOW_BELOW = 10 → visible at 1–9 left, hidden at 10+.
 *
 * This page does not currently expose a live stock count (schema is InStock /
 * OutOfStock only). AMO needs to feed remaining qty onto the PDP before this
 * runs for customers. Until then MOCK_LEFT is the stand-in for mock-ups.
 *
 * Stock lookup (first match wins):
 *   1. [data-stock-left]  e.g. <div class="buy-wrapper" data-stock-left="4">
 *   2. window.ygStockLeft
 *   3. <meta name="yg-stock-left" content="4">
 *   4. MOCK_LEFT (demo only — remove once AMO is live)
 *
 * Hidden when: no Add to basket, Out of stock, pre-order, LEFT < 1, LEFT >= SHOW_BELOW.
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-pdp-low-stock.css
 *
 * Example: https://www.yougarden.com/item-p-800146/succulent-lucky-dip-mix
 */
(function () {
  'use strict';

  var SHOW_BELOW = 10;
  var MOCK_LEFT = 4;
  var BAR_ID = 'ce-yg-stock';
  var USE_MOCK = true;

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function buyButton() {
    return document.getElementById('buy-button')
      || qs('.product-right-wrapper .buy-wrapper > .buy-button')
      || qs('.buy-wrapper > .buy-button');
  }

  function canBuy(btn) {
    if (!btn) return false;
    var cls = ' ' + (btn.className || '') + ' ';
    if (cls.indexOf(' outOfStock ') !== -1) return false;
    if (cls.indexOf(' disabled ') !== -1) return false;
    if (cls.indexOf(' pre-order-msg ') !== -1) return false;
    return true;
  }

  function parseCount(value) {
    if (value == null || value === '') return null;
    var n = parseInt(String(value).replace(/[^\d-]/g, ''), 10);
    return n === n ? n : null;
  }

  /** Remaining units. Swap MOCK_LEFT for the AMO field once it is on the page. */
  function stockLeft() {
    var node = qs('[data-stock-left]')
      || qs('[data-qty-available]')
      || qs('[data-inventory]');
    if (node) {
      var fromAttr = parseCount(
        node.getAttribute('data-stock-left')
        || node.getAttribute('data-qty-available')
        || node.getAttribute('data-inventory')
      );
      if (fromAttr != null) return fromAttr;
    }

    if (typeof window.ygStockLeft === 'number') return window.ygStockLeft;
    var fromWindow = parseCount(window.ygStockLeft);
    if (fromWindow != null) return fromWindow;

    var meta = qs('meta[name="yg-stock-left"]');
    if (meta) {
      var fromMeta = parseCount(meta.getAttribute('content'));
      if (fromMeta != null) return fromMeta;
    }

    if (USE_MOCK) return MOCK_LEFT;
    return null;
  }

  function hintFor(left) {
    if (left <= 2) return 'Almost gone';
    if (left <= 5) return 'Selling fast';
    return 'Low stock';
  }

  function toneFor(left) {
    if (left <= 2) return 'critical';
    if (left <= 5) return 'low';
    return 'warn';
  }

  function labelFor(left) {
    return left === 1 ? 'Only 1 left' : 'Only ' + left + ' left';
  }

  function el(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function mount() {
    if (document.getElementById(BAR_ID)) return;
    if (!/\/item-[sp]-/i.test(window.location.pathname)) return;

    var btn = buyButton();
    if (!canBuy(btn)) return;

    var left = stockLeft();
    if (!(left > 0) || left >= SHOW_BELOW) return;

    var price = qs('.product-right-wrapper .price-wrapper');
    var club = qs('.product-right-wrapper .club-price-wrapper');
    var buy = qs('.product-right-wrapper .buy-wrapper') || qs('.buy-wrapper');
    var host = (price && price.parentNode)
      || (club && club.parentNode)
      || (buy && buy.parentNode);
    if (!host) return;
    var before = club || buy;
    if (price && price.parentNode === host) before = price.nextSibling;

    var bar = el('div', 'ce-yg-stock ce-yg-stock--' + toneFor(left));
    bar.id = BAR_ID;
    bar.setAttribute('role', 'status');
    bar.setAttribute('aria-live', 'polite');

    var badge = el('span', 'ce-yg-stock__badge');

    var live = el('span', 'ce-yg-stock__live');
    live.setAttribute('aria-hidden', 'true');
    live.appendChild(el('span', 'ce-yg-stock__ring'));
    live.appendChild(el('span', 'ce-yg-stock__dot'));

    var text = el('p', 'ce-yg-stock__text');
    text.textContent = labelFor(left);

    var rule = el('span', 'ce-yg-stock__rule');
    rule.setAttribute('aria-hidden', 'true');

    var hint = el('span', 'ce-yg-stock__hint');
    hint.textContent = hintFor(left);

    badge.appendChild(live);
    badge.appendChild(text);
    badge.appendChild(rule);
    badge.appendChild(hint);
    bar.appendChild(badge);

    host.insertBefore(bar, before || null);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
