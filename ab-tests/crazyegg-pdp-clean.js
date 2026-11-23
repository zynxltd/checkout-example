/**
 * Crazy Egg — YouGarden PDP, Shopify-style layout
 *
 * Desktop: stacked gallery on the left, sticky buy column on the right,
 * plant calendar + accordion full-width underneath.
 * Rec carousels stay hidden.
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-pdp-clean.css
 *
 * Example: https://www.yougarden.com/item-s-pa206/hardy-perennial-plant-lucky-dip
 */
(function () {
  'use strict';

  var MARK = 'ce-yg-pdp-clean';
  var ATTR = 'data-' + MARK;
  var MQ = window.matchMedia('(min-width: 901px)');
  var REC_SEL = [
    '[class*="pdp_customers_also_viewed"]',
    '[class*="ideal_to_plant_next_month"]'
  ];
  var REC_COPY = /popular choices picked just for you|handpicked for your garden/i;

  if (document.documentElement.getAttribute(ATTR) === '1') return;
  if (!/\/item-[sp]-/i.test(window.location.pathname)) return;

  document.documentElement.classList.add(MARK);
  document.documentElement.setAttribute(ATTR, '1');

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function hide(el) {
    if (!el) return;
    el.style.setProperty('display', 'none', 'important');
    var slot = el.closest && el.closest('.tmspslot');
    if (slot) slot.style.setProperty('display', 'none', 'important');
  }

  function hideRecs() {
    REC_SEL.forEach(function (sel) {
      [].forEach.call(document.querySelectorAll(sel), hide);
    });
    [].forEach.call(document.querySelectorAll('div, h2, h3'), function (el) {
      var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!t || t.length > 48 || !REC_COPY.test(t)) return;
      hide(el.closest('[class*="__sb-wrapper"]') || el.parentElement || el);
    });
  }

  function restoreTabs() {
    var tabs = qs('.images-wrapper > .centralWrapper.text') ||
      qs('.centralWrapper.text.ce-yg-pdp-clean-tabs');
    var home = qs('.product-tabs-wrapper');
    if (!tabs || !home || tabs.parentElement === home) return;
    home.appendChild(tabs);
    tabs.classList.remove('ce-yg-pdp-clean-tabs');
    home.classList.remove('ce-yg-pdp-clean-tabs-home');
  }

  function setStickyTop() {
    var head = document.getElementById('head-scroll');
    var top = 24;
    if (head) {
      var cs = window.getComputedStyle(head);
      if (cs.position === 'fixed' || cs.position === 'sticky') {
        top = Math.round(head.getBoundingClientRect().height) + 16;
      }
    }
    document.documentElement.style.setProperty('--ce-yg-sticky-top', top + 'px');
  }

  function stackBuy(right) {
    var heading = qs('.product-heading-wrapper', right);
    var h1 = heading && heading.querySelector('h1');
    var sub = heading && heading.querySelector('.sub-head');
    var stars = qs('#feefo-rating', right) || qs('.feefo-rating', right) ||
      (heading && heading.querySelector('#feefo-rating, .feefo-rating'));
    var price = qs('#main-from-price', right) || qs('.price-wrapper', right);
    var size = qs('#size-guide', right) || qs('.view-size-guide', right);
    var buy = qs('.buy-wrapper', right);
    var paypal = qs('.pp-wrapper', right);
    var iconsHead = qs('.icons-heading', right);
    var icons = qs('.icons-wrapper', right);
    var points = qs('.points', right);
    var top = qs('.product-top-wrapper');
    var tabs = qs('.product-tabs-wrapper');
    var i;

    if (heading && stars && h1) {
      if (sub) heading.insertBefore(stars, sub);
      else heading.appendChild(stars);
    }

    var buyOrder = [heading, price, size, buy, paypal];
    for (i = 0; i < buyOrder.length; i += 1) {
      if (buyOrder[i]) right.appendChild(buyOrder[i]);
    }

    if (top && (iconsHead || icons || points)) {
      var box = qs('.ce-yg-pdp-clean-highlights');
      if (!box) {
        box = document.createElement('div');
        box.className = 'ce-yg-pdp-clean-highlights';
        if (tabs && tabs.parentNode) {
          tabs.parentNode.insertBefore(box, tabs);
        } else if (top.parentNode) {
          top.parentNode.insertBefore(box, top.nextSibling);
        }
      }
      [iconsHead, icons, points].forEach(function (el) {
        if (el) box.appendChild(el);
      });
    }
  }

  function layout() {
    var host = qs('.product-top-wrapper > .centralWrapper');
    var images = qs('.product-top-wrapper .images-wrapper');
    var right = qs('.product-top-wrapper .product-right-wrapper');
    if (!host || !images || !right) return false;

    hideRecs();
    restoreTabs();
    stackBuy(right);
    host.classList.add('ce-yg-pdp-clean-grid');
    host.classList.toggle('ce-yg-pdp-clean-desktop', MQ.matches);
    setStickyTop();
    return true;
  }

  function start() {
    hideRecs();
    if (layout()) return;
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      hideRecs();
      if (layout() || tries > 40) clearInterval(timer);
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  window.addEventListener('load', layout);
  window.setTimeout(layout, 1500);
  window.addEventListener('scroll', setStickyTop, { passive: true });
  window.addEventListener('resize', layout);

  if (typeof MQ.addEventListener === 'function') {
    MQ.addEventListener('change', layout);
  } else if (typeof MQ.addListener === 'function') {
    MQ.addListener(layout);
  }
})();
