/**
 * Crazy Egg — PDP sticky ATC: full-width bar WITH spacing
 *
 * 600px wide and above. Hidden on phone.
 * Shows once #plantcalendar is on screen and the live buy button
 * is off screen. Hides when the site footer enters the screen.
 * Edge-to-edge bottom bar with side padding. Details left, ATC right; the gap grows with monitor width.
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-pdp-sticky-atb-desktop-wide.css
 */
(function () {
  'use strict';

  var BAR_ID = 'ce-yg-atb-w';
  var ON = 'ce-yg-atb-w-on';
  var READY = 'ce-yg-atb-w-ready';
  var STYLE_ID = 'ce-yg-atb-w-css';
  var WIDE = 600;
  var MOVE_TOP = true;
  var TOP_GAP = 16;
  var bar = null;
  var started = false;
  var parkTimer = null;

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function isWide() { return window.innerWidth >= WIDE; }
  function buyButton() {
    return document.getElementById('buy-button')
      || qs('.product-right-wrapper .buy-wrapper > .buy-button')
      || qs('.buy-wrapper > .buy-button')
      || qs('.product-right-wrapper .buy-button');
  }
  function hasOptions() { return !!qs('#style-options-drop-box .option-row'); }
  function activeOption() { return qs('#style-options-drop-box .option-row.active:not(.discont)'); }
  function buttonOffscreen(el) {
    var r = el.getBoundingClientRect();
    if (!r || (r.width === 0 && r.height === 0)) return true;
    return r.bottom < 8 || r.top > window.innerHeight - 8;
  }
  function footerReached() {
    var footer = qs('.footerMiddle') || qs('footer');
    if (!footer) return false;
    var r = footer.getBoundingClientRect();
    if (!r || (r.width === 0 && r.height === 0)) return false;
    return r.top < window.innerHeight;
  }
  function calendarReached() {
    var el = document.getElementById('plantcalendar');
    if (!el) return true;
    var r = el.getBoundingClientRect();
    if (!r || (r.width === 0 && r.height === 0)) return false;
    return r.top < window.innerHeight - 24;
  }
  function headerBottom() {
    var nodes = [document.getElementById('head-scroll'), document.getElementById('header'), qs('header')];
    var bottom = 0, i, el, rect, pos, seen = [];
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      if (!el || seen.indexOf(el) !== -1) continue;
      seen.push(el);
      rect = el.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) continue;
      pos = window.getComputedStyle(el).position;
      if ((pos === 'fixed' || pos === 'sticky') && rect.top < 80 && rect.bottom > bottom) bottom = rect.bottom;
    }
    return Math.max(0, Math.round(bottom));
  }
  function headerGap() { return Math.max(8, headerBottom()); }
  function productName() {
    var h1 = qs('.product-heading-wrapper h1') || qs('h1');
    return h1 ? String(h1.textContent || '').replace(/\s+/g, ' ').trim() : '';
  }
  function productImage() {
    var img = qs('.slick-current.slick-active img.mainImg') || qs('img.mainImg');
    if (img) return img.currentSrc || img.src || '';
    var og = qs('meta[property="og:image"]');
    return og ? og.getAttribute('content') || '' : '';
  }
  function packLabel() {
    var row = activeOption();
    if (!row) return '';
    var title = qs('.title', row);
    if (!title) return '';
    var clone = title.cloneNode(true);
    var sku = qs('.sku', clone);
    if (sku && sku.parentNode) sku.parentNode.removeChild(sku);
    return String(clone.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function packSize() {
    var wrap = qs('.price-wrapper .pno-wrapper');
    if (!wrap) return '';
    var clone = wrap.cloneNode(true);
    var drop = clone.querySelectorAll('.pno, .pipe');
    var i;
    for (i = 0; i < drop.length; i++) {
      if (drop[i].parentNode) drop[i].parentNode.removeChild(drop[i]);
    }
    return String(clone.textContent || '').replace(/\s+/g, ' ').replace(/\|/g, '').trim();
  }
  function priceLabel() {
    var row = activeOption();
    var span;
    if (row) {
      span = qs('.price > span', row) || qs('.price span', row);
      if (span) return String(span.textContent || '').replace(/\s+/g, ' ').trim();
    }
    span = qs('#main-from-price .price-text');
    if (span) {
      var from = String(span.textContent || '').replace(/\s+/g, ' ').trim();
      return from ? 'From ' + from : '';
    }
    span = qs('.price-wrapper .price .price-text') || qs('.product-right-wrapper .price .price-text');
    if (span) return String(span.textContent || '').replace(/\s+/g, ' ').trim();
    return '';
  }

  function fill(node) {
    var img = qs('.ce-yg-atb-w__img', node);
    var title = qs('.ce-yg-atb-w__title', node);
    var sub = qs('.ce-yg-atb-w__sub', node);
    var price = qs('.ce-yg-atb-w__price', node);
    var src = productImage();
    var name = productName();
    var pack = packLabel();
    var options = hasOptions();
    if (img) { if (src) img.src = src; img.alt = name; }
    node.classList.toggle('is-no-img', !src);
    node.classList.toggle('is-no-options', !options);
    if (title) title.textContent = pack || name || 'Add to basket';
    if (sub) sub.textContent = pack ? name : (options ? 'Choose an option' : packSize());
    if (price) price.textContent = priceLabel();
  }

  function offerBadges() { return document.querySelectorAll('[id$="__notification"]'); }
  function parkOfferBadges(hide) {
    var nodes = offerBadges(), i, node;
    for (i = 0; i < nodes.length; i++) {
      node = nodes[i];
      if (hide) {
        if (node.getAttribute('data-ce-yg-atb-w-parked') === '1' && node.style.display === 'none') continue;
        node.setAttribute('data-ce-yg-atb-w-parked', '1');
        node.style.setProperty('display', 'none', 'important');
        node.style.setProperty('visibility', 'hidden', 'important');
        node.style.setProperty('pointer-events', 'none', 'important');
        continue;
      }
      if (node.getAttribute('data-ce-yg-atb-w-parked') !== '1') continue;
      node.style.removeProperty('display');
      node.style.removeProperty('visibility');
      node.style.removeProperty('pointer-events');
      node.removeAttribute('data-ce-yg-atb-w-parked');
    }
  }
  function placeScrollTop(barHeight) {
    var el = document.getElementById('return-to-top');
    if (!el || !MOVE_TOP) return;
    if (!barHeight) {
      if (el.getAttribute('data-ce-yg-atb-w-top') === '1') {
        el.style.removeProperty('bottom');
        el.style.removeProperty('right');
        el.removeAttribute('data-ce-yg-atb-w-top');
      }
      return;
    }
    el.setAttribute('data-ce-yg-atb-w-top', '1');
    el.style.setProperty('bottom', Math.round(barHeight + TOP_GAP) + 'px', 'important');
    el.style.setProperty('right', '16px', 'important');
  }
  function clearOfferChrome(hide, barHeight) {
    if (parkTimer) { window.clearInterval(parkTimer); parkTimer = null; }
    parkOfferBadges(hide);
    placeScrollTop(barHeight);
    window.requestAnimationFrame(function () {
      var open = document.documentElement.classList.contains(ON) && bar && bar.offsetHeight;
      parkOfferBadges(!!open);
      placeScrollTop(open ? bar.offsetHeight : 0);
    });
    if (!hide) return;
    parkTimer = window.setInterval(function () {
      if (!document.documentElement.classList.contains(ON) || !bar) return;
      parkOfferBadges(true);
      placeScrollTop(bar.offsetHeight);
    }, 250);
  }

  function layout(node) {
    node.style.setProperty('position', 'fixed', 'important');
    node.style.setProperty('left', '0', 'important');
    node.style.setProperty('right', '0', 'important');
    node.style.setProperty('top', 'auto', 'important');
    node.style.setProperty('bottom', '0', 'important');
    node.style.setProperty('width', '100%', 'important');
    node.style.setProperty('z-index', '2147483000', 'important');
    node.style.setProperty('box-sizing', 'border-box', 'important');
    node.style.setProperty('display', isWide() ? 'flex' : 'none', 'important');
  }
  function paint(node, show) {
    fill(node);
    layout(node);
    document.documentElement.classList.toggle(ON, show);
    node.setAttribute('aria-hidden', show ? 'false' : 'true');
    if (show) {
      var height = node.offsetHeight;
      document.documentElement.style.setProperty('--ce-yg-atb-w-h', height + 'px');
      document.documentElement.style.setProperty('padding-bottom', (height + 8) + 'px', 'important');
      clearOfferChrome(true, height);
    } else {
      document.documentElement.style.removeProperty('--ce-yg-atb-w-h');
      document.documentElement.style.removeProperty('padding-bottom');
      clearOfferChrome(false, 0);
    }
  }

  function scrollOptionsIntoView() {
    var price = document.getElementById('main-from-price');
    var options = document.getElementById('style-options')
      || document.getElementById('style-options-head')
      || document.getElementById('style-options-drop-box');
    var target = price || options || document.getElementById('buy-button-wrapper') || buyButton();
    if (!target) return;
    var extra = bar && bar.offsetHeight && BAR_ID === 'ce-yg-atb-t' ? bar.offsetHeight + 16 : (price ? 20 : 72);
    var gap = headerGap() + extra;
    var top = window.pageYOffset + target.getBoundingClientRect().top - gap;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }
  function openOptions() {
    if (typeof window.showOptions === 'function') window.showOptions();
    else { var live = buyButton(); if (live) live.click(); }
    window.setTimeout(scrollOptionsIntoView, 60);
    window.setTimeout(scrollOptionsIntoView, 320);
  }
  function addToBasket() {
    var live = buyButton();
    if (hasOptions() && !activeOption()) { openOptions(); return; }
    if (live) live.click();
  }

  function injectCss() {
    if (document.getElementById(STYLE_ID)) return;
    var css = '@media (min-width:600px){' +
        '.ce-yg-atb-w{position:fixed!important;left:0!important;right:0!important;bottom:0!important;top:auto!important;z-index:2147483000!important;display:none;width:100%;margin:0;padding:10px 32px;transform:translateY(110%);border:0;border-top:1px solid #e2e2e2;background:#fff;box-shadow:0 -8px 24px rgba(0,0,0,.12);font-family:Arial,Helvetica,sans-serif;pointer-events:none;visibility:hidden}' +
        'html.ce-yg-atb-w-on .ce-yg-atb-w{display:flex!important;align-items:center;justify-content:space-between;gap:24px;transform:translateY(0);visibility:visible;pointer-events:auto}' +
        'html.ce-yg-atb-w-ready .ce-yg-atb-w{display:flex!important;transition:transform .28s ease-out,visibility .28s ease-out}' +
        '.ce-yg-atb-w__left{display:flex;align-items:center;gap:14px;min-width:0;flex:1 1 auto}' +
        '.ce-yg-atb-w__img{display:block;flex:0 0 52px;width:52px;height:52px;object-fit:cover;border-radius:8px;background:#f3f3f3}' +
        '.ce-yg-atb-w.is-no-img .ce-yg-atb-w__img{display:none}' +
        '.ce-yg-atb-w__copy{min-width:0;display:flex;flex-direction:column;gap:2px}' +
        '.ce-yg-atb-w__title{font-size:14px;font-weight:700;color:#222;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
        '.ce-yg-atb-w__sub{font-size:12px;color:#666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
        '.ce-yg-atb-w__right{display:flex;align-items:center;flex:0 0 auto;gap:16px}' +
        '.ce-yg-atb-w__price{font-size:20px;font-weight:700;color:#e3185d;white-space:nowrap}' +
        '.ce-yg-atb-w__actions{display:flex;gap:8px}' +
        '.ce-yg-atb-w__options,.ce-yg-atb-w__buy{box-sizing:border-box;display:flex;align-items:center;justify-content:center;height:44px;margin:0;padding:0 18px;border-radius:10px!important;font:700 13px/1 Arial,Helvetica,sans-serif;letter-spacing:.04em;cursor:pointer}' +
        '.ce-yg-atb-w__options{min-width:132px;border:1px solid #468900;background:#fff;color:#468900}' +
        '.ce-yg-atb-w.is-no-options .ce-yg-atb-w__options{display:none}' +
        '.ce-yg-atb-w__buy{min-width:168px;border:0;background:#468900;color:#fff;text-transform:uppercase}' +
        'html.ce-yg-atb-w-on [id$="__notification"]{display:none!important}' +
      '}' +
      '@media (max-width:599px){.ce-yg-atb-w{display:none!important}}';
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }
  function build() {
    if (document.getElementById(BAR_ID)) return document.getElementById(BAR_ID);
    injectCss();
    var node = document.createElement('div');
    node.id = BAR_ID;
    node.className = 'ce-yg-atb-w';
    node.setAttribute('role', 'region');
    node.setAttribute('aria-label', 'Add to basket');
    node.innerHTML = '<div class="ce-yg-atb-w__left">' +
        '<img class="ce-yg-atb-w__img" alt="">' +
        '<div class="ce-yg-atb-w__copy">' +
          '<div class="ce-yg-atb-w__title"></div>' +
          '<div class="ce-yg-atb-w__sub"></div>' +
        '</div>' +
      '</div>' +
      '<div class="ce-yg-atb-w__right">' +
        '<div class="ce-yg-atb-w__price"></div>' +
        '<div class="ce-yg-atb-w__actions">' +
          '<button type="button" class="ce-yg-atb-w__options">Show options</button>' +
          '<button type="button" class="ce-yg-atb-w__buy">Add to basket</button>' +
        '</div>' +
      '</div>';
    qs('.ce-yg-atb-w__options', node).addEventListener('click', openOptions);
    qs('.ce-yg-atb-w__buy', node).addEventListener('click', addToBasket);
    document.body.appendChild(node);
    paint(node, false);
    window.setTimeout(function () { document.documentElement.classList.add(READY); }, 50);
    return node;
  }

  function tick() {
    var live = buyButton();
    if (!isWide() || !live) { if (bar) paint(bar, false); return; }
    if (!bar) bar = build();
    paint(bar, buttonOffscreen(live) && calendarReached() && !footerReached());
  }
  function arm() {
    if (started) return;
    if (!buyButton()) return;
    started = true;
    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', tick);
      window.visualViewport.addEventListener('scroll', tick);
    }
  }
  function boot() {
    injectCss();
    arm();
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      arm();
      tick();
      if (started && tries > 8) clearInterval(timer);
      if (tries > 40) clearInterval(timer);
    }, 250);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})();
