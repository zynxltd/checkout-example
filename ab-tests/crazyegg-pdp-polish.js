/**
 * Crazy Egg — YouGarden PDP visual polish
 *
 * Same elements and layout as live PDP. CSS-only restyle for
 * clearer hierarchy, stronger ATC, and prototype-aligned surfaces.
 * Does NOT hide recs, move tabs, or change column structure.
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-pdp-polish.css
 * Target: https://www.yougarden.com/item-p-* and /item-s-*
 *
 * Example: https://www.yougarden.com/item-p-100213/premium-professional-compost-110-litre-bundle-multi-purpose-handy-scoop
 */
(function () {
  'use strict';

  var MARK = 'ce-yg-pdp-polish';
  var ATTR = 'data-' + MARK;

  if (document.documentElement.getAttribute(ATTR) === '1') return;
  if (!/\/item-[sp]-/i.test(window.location.pathname)) return;

  document.documentElement.classList.add(MARK);
  document.documentElement.setAttribute(ATTR, '1');
})();
