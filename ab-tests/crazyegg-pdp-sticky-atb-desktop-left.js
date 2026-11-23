/**
 * Crazy Egg — PDP sticky Add to Basket (desktop / tablet, bottom-left)
 *
 * 600px wide and above. Hidden on phone (the phone variant covers that).
 * Shows once the shopper has scrolled to #plantcalendar and the live
 * buy button is off screen. Hides when the site footer enters the screen,
 * and stays hidden past it.
 *
 * Bottom-left card in YouGarden styling (green ATC, pink price),
 * same layout as the right-hand Sarah Raven card.
 * #return-to-top stays on the right. Offer badges are hidden while open.
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-pdp-sticky-atb-desktop-left.css
 */
(function () {
  'use strict';

  var BAR_ID = 'ce-yg-atb-l';
  var ON = 'ce-yg-atb-l-on';
  var STYLE_ID = 'ce-yg-atb-l-css';
  var WIDE = 600;
  var bar = null;
  var started = false;
  var parkTimer = null;

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function isWide() {
    return window.innerWidth >= WIDE;
  }

  function isTablet() {
    return window.innerWidth < 900;
  }

  function buyButton() {
    return document.getElementById('buy-button')
      || qs('.product-right-wrapper .buy-wrapper > .buy-button')
      || qs('.buy-wrapper > .buy-button')
      || qs('.product-right-wrapper .buy-button');
  }

  function hasOptions() {
    return !!qs('#style-options-drop-box .option-row');
  }

  function activeOption() {
    return qs('#style-options-drop-box .option-row.active:not(.discont)');
  }

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

  function headerGap() {
    var header = document.getElementById('head-scroll') || qs('header') || qs('#header');
    var bottom = 0;
    if (header) {
      var rect = header.getBoundingClientRect();
      var pos = window.getComputedStyle(header).position;
      if ((pos === 'fixed' || pos === 'sticky') && rect.bottom > 0 && rect.top < 20) {
        bottom = rect.bottom;
      }
    }
    return Math.max(8, Math.round(bottom));
  }

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
    var img = qs('.ce-yg-atb-l__img', node);
    var title = qs('.ce-yg-atb-l__title', node);
    var sub = qs('.ce-yg-atb-l__sub', node);
    var price = qs('.ce-yg-atb-l__price', node);
    var src = productImage();
    var name = productName();
    var pack = packLabel();
    var options = hasOptions();

    if (img) {
      if (src) img.src = src;
      img.alt = name;
    }
    node.classList.toggle('is-no-img', !src);
    node.classList.toggle('is-no-options', !options);

    if (title) title.textContent = pack || name || 'Add to basket';
    if (sub) sub.textContent = pack ? name : (options ? 'Choose an option' : packSize());
    if (price) price.textContent = priceLabel();
  }

  function offerBadges() {
    return document.querySelectorAll('[id$="__notification"]');
  }

  function parkOfferBadges(hide) {
    var nodes = offerBadges();
    var i;
    var node;
    for (i = 0; i < nodes.length; i++) {
      node = nodes[i];
      if (hide) {
        if (node.getAttribute('data-ce-yg-atb-l-parked') === '1' && node.style.display === 'none') continue;
        node.setAttribute('data-ce-yg-atb-l-parked', '1');
        node.style.setProperty('display', 'none', 'important');
        node.style.setProperty('visibility', 'hidden', 'important');
        node.style.setProperty('pointer-events', 'none', 'important');
        continue;
      }
      if (node.getAttribute('data-ce-yg-atb-l-parked') !== '1') continue;
      node.style.removeProperty('display');
      node.style.removeProperty('visibility');
      node.style.removeProperty('pointer-events');
      node.removeAttribute('data-ce-yg-atb-l-parked');
    }
  }

  function clearOfferChrome(hide) {
    if (parkTimer) {
      window.clearInterval(parkTimer);
      parkTimer = null;
    }
    parkOfferBadges(hide);
    window.requestAnimationFrame(function () {
      var open = document.documentElement.classList.contains(ON) && bar && bar.offsetHeight;
      parkOfferBadges(!!open);
    });
    if (!hide) return;
    parkTimer = window.setInterval(function () {
      if (!document.documentElement.classList.contains(ON) || !bar) return;
      parkOfferBadges(true);
    }, 250);
  }

  function layout(node, show) {
    var tablet = isTablet();
    node.style.setProperty('position', 'fixed', 'important');
    node.style.setProperty('left', tablet ? '16px' : '24px', 'important');
    node.style.setProperty('right', 'auto', 'important');
    node.style.setProperty('top', 'auto', 'important');
    node.style.setProperty('bottom', tablet ? '16px' : '24px', 'important');
    node.style.setProperty('transform', 'none', 'important');
    node.style.setProperty('z-index', '2147483000', 'important');
    node.style.setProperty('display', show ? 'flex' : 'none', 'important');
    node.style.setProperty('width', tablet ? '420px' : '460px', 'important');
    node.style.setProperty('max-width', tablet ? 'calc(100vw - 24px)' : 'calc(100vw - 32px)', 'important');
    node.style.setProperty('align-items', 'center', 'important');
    node.style.setProperty('box-sizing', 'border-box', 'important');
  }

  function paint(node, show) {
    fill(node);
    layout(node, show);
    document.documentElement.classList.toggle(ON, show);
    if (show) {
      document.documentElement.style.setProperty('--ce-yg-atb-l-h', node.offsetHeight + 'px');
      clearOfferChrome(true);
    } else {
      document.documentElement.style.removeProperty('--ce-yg-atb-l-h');
      clearOfferChrome(false);
    }
  }

  function scrollOptionsIntoView() {
    var price = document.getElementById('main-from-price');
    var options = document.getElementById('style-options')
      || document.getElementById('style-options-head')
      || document.getElementById('style-options-drop-box');
    var target = price || options || document.getElementById('buy-button-wrapper') || buyButton();
    if (!target) return;
    var gap = headerGap() + (price ? 20 : 72);
    var top = window.pageYOffset + target.getBoundingClientRect().top - gap;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  function openOptions() {
    if (typeof window.showOptions === 'function') {
      window.showOptions();
    } else {
      var live = buyButton();
      if (live) live.click();
    }
    window.setTimeout(scrollOptionsIntoView, 60);
    window.setTimeout(scrollOptionsIntoView, 320);
  }

  function addToBasket() {
    var live = buyButton();
    if (hasOptions() && !activeOption()) {
      openOptions();
      return;
    }
    if (live) live.click();
  }

  function injectCss() {
    if (document.getElementById(STYLE_ID)) return;
    var css =
      '@media (min-width:600px){' +
        '.ce-yg-atb-l{gap:14px;padding:12px 14px;border:1px solid #e2e2e2;border-radius:10px!important;background:#fff;color:#222;box-shadow:0 8px 22px rgba(0,0,0,.18);font-family:Arial,Helvetica,sans-serif}' +
        '.ce-yg-atb-l__img{display:block;flex:0 0 72px;width:72px;height:72px;object-fit:cover;border-radius:8px;background:#f3f3f3}' +
        '.ce-yg-atb-l.is-no-img .ce-yg-atb-l__img{display:none}' +
        '.ce-yg-atb-l__main{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:10px}' +
        '.ce-yg-atb-l__copy{display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:12px;row-gap:2px;align-items:start}' +
        '.ce-yg-atb-l__title{grid-column:1;font-size:14px;font-weight:700;line-height:1.25;color:#222;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
        '.ce-yg-atb-l__sub{grid-column:1;font-size:12px;font-weight:400;line-height:1.3;color:#666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
        '.ce-yg-atb-l__price{grid-column:2;grid-row:1 / span 2;font-size:18px;font-weight:700;line-height:1.15;color:#e3185d;white-space:nowrap}' +
        '.ce-yg-atb-l__actions{display:flex;gap:8px}' +
        '.ce-yg-atb-l__options,.ce-yg-atb-l__buy{flex:1 1 0;box-sizing:border-box;display:flex;align-items:center;justify-content:center;height:42px;margin:0;padding:0 12px;border-radius:10px!important;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:.04em;line-height:1;white-space:nowrap;cursor:pointer}' +
        '.ce-yg-atb-l__options{border:1px solid #468900;background:#fff;color:#468900;text-transform:none}' +
        '.ce-yg-atb-l__options:hover{background:#f4f8ee}' +
        '.ce-yg-atb-l.is-no-options .ce-yg-atb-l__options{display:none}' +
        '.ce-yg-atb-l.is-no-options .ce-yg-atb-l__title{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}' +
        '.ce-yg-atb-l.is-no-options .ce-yg-atb-l__price{font-size:20px;align-self:center}' +
        '.ce-yg-atb-l.is-no-options .ce-yg-atb-l__buy{flex:1 1 100%}' +
        '.ce-yg-atb-l__buy{border:0;background:#468900;color:#fff;text-transform:uppercase}' +
        '.ce-yg-atb-l__buy:hover{background:#000;color:#fff}' +
        'html.ce-yg-atb-l-on [id$="__notification"]{display:none!important}' +
      '}' +
      '@media (max-width:599px){.ce-yg-atb-l{display:none!important}}';
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
    node.className = 'ce-yg-atb-l';
    node.setAttribute('role', 'region');
    node.setAttribute('aria-label', 'Add to basket');
    node.innerHTML =
      '<img class="ce-yg-atb-l__img" alt="">' +
      '<div class="ce-yg-atb-l__main">' +
        '<div class="ce-yg-atb-l__copy">' +
          '<div class="ce-yg-atb-l__title"></div>' +
          '<div class="ce-yg-atb-l__sub"></div>' +
          '<div class="ce-yg-atb-l__price"></div>' +
        '</div>' +
        '<div class="ce-yg-atb-l__actions">' +
          '<button type="button" class="ce-yg-atb-l__options">Show options</button>' +
          '<button type="button" class="ce-yg-atb-l__buy">Add to basket</button>' +
        '</div>' +
      '</div>';

    qs('.ce-yg-atb-l__options', node).addEventListener('click', openOptions);
    qs('.ce-yg-atb-l__buy', node).addEventListener('click', addToBasket);
    document.body.appendChild(node);
    paint(node, false);
    return node;
  }

  function tick() {
    var live = buyButton();
    if (!isWide() || !live) {
      if (bar) paint(bar, false);
      return;
    }
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
