/**
 * Crazy Egg — PDP low stock badge v2 (FOMO + buy-block CRO stack)
 *
 * Rearranges the buy column so the primary path is:
 *   price → low stock → size options → qty / Add to basket → PayPal → Club
 *
 * Club sits after the CTA: it is a competing upsell (opens the Club popup),
 * not the member price applied at checkout.
 *
 * Badge only shows when remaining stock is less than SHOW_BELOW.
 * This page does not currently expose a live stock count. AMO needs to feed
 * remaining qty onto the PDP before this runs for customers. Until then
 * MOCK_LEFT is the stand-in.
 *
 * Stock lookup (first match wins):
 *   1. [data-stock-left]
 *   2. window.ygStockLeft
 *   3. <meta name="yg-stock-left">
 *   4. MOCK_LEFT (demo only)
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-pdp-low-stock-v2.css
 *
 * Example: https://www.yougarden.com/item-p-800146/succulent-lucky-dip-mix
 */
(function () {
  'use strict';

  var SHOW_BELOW = 10;
  var MOCK_LEFT = 4;
  var BAR_ID = 'ce-yg-stock';
  var MARK = 'ce-yg-stock-v2';
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

  function placeAfter(host, node, anchor) {
    if (!host || !node) return anchor;
    if (anchor && anchor.parentNode === host) {
      if (anchor.nextSibling) host.insertBefore(node, anchor.nextSibling);
      else host.appendChild(node);
    } else {
      host.appendChild(node);
    }
    return node;
  }

  /** Price → options → ATC → PayPal → Club. Stock is inserted after price. */
  function restack(host) {
    var price = qs('.price-wrapper', host);
    var options = document.getElementById('style-options')
      || qs('#style-options-drop-box', host);
    var buy = qs('.buy-wrapper', host);
    var pp = qs('.pp-wrapper', host);
    var club = qs('.club-price-wrapper', host)
      || document.getElementById('club-price-wrapper');

    if (!price || price.parentNode !== host) return price;

    var anchor = price;
    if (options && options.parentNode === host) anchor = placeAfter(host, options, anchor);
    if (buy && buy.parentNode === host) anchor = placeAfter(host, buy, anchor);
    if (pp && pp.parentNode === host) anchor = placeAfter(host, pp, anchor);
    if (club && club.parentNode === host) placeAfter(host, club, anchor);

    return price;
  }

  function mountBadge(host, price, left) {
    if (document.getElementById(BAR_ID)) return;

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

    if (price && price.parentNode === host) {
      host.insertBefore(bar, price.nextSibling);
    } else {
      var buy = qs('.buy-wrapper', host);
      host.insertBefore(bar, buy || null);
    }
  }

  function mount() {
    if (document.documentElement.getAttribute('data-' + MARK) === '1') return;
    if (!/\/item-[sp]-/i.test(window.location.pathname)) return;

    var btn = buyButton();
    if (!canBuy(btn)) return;

    var host = qs('.product-right-wrapper');
    if (!host) return;

    var left = stockLeft();
    var showBadge = left > 0 && left < SHOW_BELOW;

    document.documentElement.classList.add(MARK);
    document.documentElement.setAttribute('data-' + MARK, '1');

    var price = restack(host);
    if (showBadge) mountBadge(host, price, left);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
