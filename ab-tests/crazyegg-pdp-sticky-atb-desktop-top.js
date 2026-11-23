/**
 * Crazy Egg — PDP sticky Add to Basket (desktop / tablet, under header)
 *
 * 600px wide and above. Hidden on phone (the phone variant covers that).
 * Shows once the shopper has scrolled to #plantcalendar and the live
 * buy button is off screen. Hides when the site footer enters the screen,
 * and stays hidden past it.
 *
 * Slim full-width bar that slides down under the sticky header.
 * Thumbnail, pack / name, pink price, Show options + Add to basket.
 * Does not move return-to-top or hide offer badges.
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-pdp-sticky-atb-desktop-top.css
 */
(function () {
  'use strict';

  var BAR_ID = 'ce-yg-atb-t';
  var ON = 'ce-yg-atb-t-on';
  var READY = 'ce-yg-atb-t-ready';
  var STYLE_ID = 'ce-yg-atb-t-css';
  var WIDE = 600;
  var bar = null;
  var started = false;

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function isWide() {
    return window.innerWidth >= WIDE;
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

  function headerBottom() {
    var nodes = [
      document.getElementById('head-scroll'),
      document.getElementById('header'),
      qs('header'),
      qs('.header-wrapper'),
      qs('#head')
    ];
    var bottom = 0;
    var i;
    var el;
    var rect;
    var pos;
    var seen = [];
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      if (!el || seen.indexOf(el) !== -1) continue;
      seen.push(el);
      rect = el.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) continue;
      pos = window.getComputedStyle(el).position;
      if ((pos === 'fixed' || pos === 'sticky') && rect.top < 80 && rect.bottom > bottom) {
        bottom = rect.bottom;
      }
    }
    return Math.max(0, Math.round(bottom));
  }

  function headerGap() {
    return Math.max(8, headerBottom());
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
    var img = qs('.ce-yg-atb-t__img', node);
    var title = qs('.ce-yg-atb-t__title', node);
    var sub = qs('.ce-yg-atb-t__sub', node);
    var price = qs('.ce-yg-atb-t__price', node);
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

  function layout(node) {
    var top = headerBottom();
    node.style.setProperty('position', 'fixed', 'important');
    node.style.setProperty('left', '0', 'important');
    node.style.setProperty('right', '0', 'important');
    node.style.setProperty('bottom', 'auto', 'important');
    node.style.setProperty('top', top + 'px', 'important');
    node.style.setProperty('width', '100%', 'important');
    node.style.setProperty('max-width', 'none', 'important');
    node.style.setProperty('z-index', '2147482990', 'important');
    node.style.setProperty('box-sizing', 'border-box', 'important');
    node.style.setProperty('display', isWide() ? 'block' : 'none', 'important');
    document.documentElement.style.setProperty('--ce-yg-atb-t-top', top + 'px');
  }

  function paint(node, show) {
    fill(node);
    layout(node);
    document.documentElement.classList.toggle(ON, show);
    node.setAttribute('aria-hidden', show ? 'false' : 'true');
    if (show) {
      document.documentElement.style.setProperty('--ce-yg-atb-t-h', node.offsetHeight + 'px');
    } else {
      document.documentElement.style.removeProperty('--ce-yg-atb-t-h');
    }
  }

  function scrollOptionsIntoView() {
    var price = document.getElementById('main-from-price');
    var options = document.getElementById('style-options')
      || document.getElementById('style-options-head')
      || document.getElementById('style-options-drop-box');
    var target = price || options || document.getElementById('buy-button-wrapper') || buyButton();
    if (!target) return;
    var gap = headerGap() + (bar && bar.offsetHeight ? bar.offsetHeight + 16 : (price ? 20 : 72));
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
        '.ce-yg-atb-t{position:fixed!important;left:0!important;right:0!important;bottom:auto!important;z-index:2147482990!important;display:none;width:100%;margin:0;padding:0;transform:translateY(-110%);border:0;border-bottom:1px solid #e2e2e2;border-radius:0!important;background:#fff;color:#222;box-shadow:0 8px 20px rgba(0,0,0,.1);font-family:Arial,Helvetica,sans-serif;pointer-events:none;visibility:hidden}' +
        'html.ce-yg-atb-t-on .ce-yg-atb-t{display:block!important;transform:translateY(0);visibility:visible;pointer-events:auto}' +
        'html.ce-yg-atb-t-ready .ce-yg-atb-t{display:block!important;transition:transform .28s ease-out,visibility .28s ease-out}' +
        '.ce-yg-atb-t__inner{box-sizing:border-box;display:flex;align-items:center;gap:16px;width:96%;max-width:1180px;margin:0 auto;padding:8px 0}' +
        '.ce-yg-atb-t__img{display:block;flex:0 0 48px;width:48px;height:48px;object-fit:cover;border-radius:8px;background:#f3f3f3}' +
        '.ce-yg-atb-t.is-no-img .ce-yg-atb-t__img{display:none}' +
        '.ce-yg-atb-t__copy{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px}' +
        '.ce-yg-atb-t__title{font-size:14px;font-weight:700;line-height:1.25;color:#222;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
        '.ce-yg-atb-t__sub{font-size:12px;font-weight:400;line-height:1.3;color:#666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
        '.ce-yg-atb-t__price{flex:0 0 auto;font-size:20px;font-weight:700;line-height:1.1;color:#e3185d;letter-spacing:.02em;white-space:nowrap;padding:0 8px 0 4px}' +
        '.ce-yg-atb-t__actions{display:flex;flex:0 0 auto;gap:8px}' +
        '.ce-yg-atb-t__options,.ce-yg-atb-t__buy{box-sizing:border-box;display:flex;align-items:center;justify-content:center;height:42px;margin:0;padding:0 18px;border-radius:10px!important;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:.04em;line-height:1;white-space:nowrap;cursor:pointer}' +
        '.ce-yg-atb-t__options{min-width:132px;border:1px solid #468900;background:#fff;color:#468900;text-transform:none}' +
        '.ce-yg-atb-t__options:hover{background:#f4f8ee}' +
        '.ce-yg-atb-t.is-no-options .ce-yg-atb-t__options{display:none}' +
        '.ce-yg-atb-t__buy{min-width:168px;border:0;background:#468900;color:#fff;text-transform:uppercase}' +
        '.ce-yg-atb-t__buy:hover{background:#000;color:#fff}' +
      '}' +
      '@media (min-width:600px) and (max-width:899px){' +
        '.ce-yg-atb-t__inner{width:calc(100% - 24px);max-width:none;gap:10px}' +
        '.ce-yg-atb-t__img{flex-basis:40px;width:40px;height:40px}' +
        '.ce-yg-atb-t__title{font-size:13px}' +
        '.ce-yg-atb-t__price{font-size:16px;padding:0 4px}' +
        '.ce-yg-atb-t__options,.ce-yg-atb-t__buy{height:38px;padding:0 12px;min-width:0}' +
      '}' +
      '@media (max-width:599px){.ce-yg-atb-t{display:none!important}}';
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
    node.className = 'ce-yg-atb-t';
    node.setAttribute('role', 'region');
    node.setAttribute('aria-label', 'Add to basket');
    node.innerHTML =
      '<div class="ce-yg-atb-t__inner">' +
        '<img class="ce-yg-atb-t__img" alt="">' +
        '<div class="ce-yg-atb-t__copy">' +
          '<div class="ce-yg-atb-t__title"></div>' +
          '<div class="ce-yg-atb-t__sub"></div>' +
        '</div>' +
        '<div class="ce-yg-atb-t__price"></div>' +
        '<div class="ce-yg-atb-t__actions">' +
          '<button type="button" class="ce-yg-atb-t__options">Show options</button>' +
          '<button type="button" class="ce-yg-atb-t__buy">Add to basket</button>' +
        '</div>' +
      '</div>';

    qs('.ce-yg-atb-t__options', node).addEventListener('click', openOptions);
    qs('.ce-yg-atb-t__buy', node).addEventListener('click', addToBasket);
    document.body.appendChild(node);
    paint(node, false);
    window.setTimeout(function () {
      document.documentElement.classList.add(READY);
    }, 50);
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
