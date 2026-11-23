/**
 * Crazy Egg — PDP Mobile Gallery v2
 *
 * Key Features rail BELOW PayPal text (.pp-wrapper).
 * 3 max visible (+ peek), Magento lime green band, drag/swipe scroll.
 * Centers title + reviews. Hides mid-page Key Features.
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-pdp-mobile-gallery-v2.css
 *
 * Example: https://www.yougarden.com/item-p-630050/complete-300-spring-flowering-bulb-collection
 */
(function () {
  'use strict';

  var ROOT = 'ce-yg-pdp-gal-v2';
  var VER = '11';
  var INIT = 'data-ce-yg-pdp-gal-v2';
  var STYLE_ID = 'ce-yg-pdp-gal-v2-css';
  var SHELL_ID = 'ce-yg-kf-below';
  var RAIL_ID = 'ce-yg-kf-below-rail';
  var APPLY_KEY = '__ceYgPdpGalV2Apply';
  var TIMER_KEY = '__ceYgPdpGalV2Timer';

  function isPdp() {
    if (/\/item-[sp]-/i.test(window.location.pathname || '')) return true;
    return !!(
      document.querySelector('#main-image-carousel') ||
      document.querySelector('.main-image-carousel') ||
      document.querySelector('.product-right-wrapper')
    );
  }

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function jq() {
    return window.jQuery || window.$;
  }

  function ensureCss() {
    var st = document.getElementById(STYLE_ID);
    if (st) st.parentNode.removeChild(st);
    st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent =
      '.product-right-wrapper>.icons-heading,' +
      '.product-right-wrapper>.icons-wrapper,' +
      '#product-features-carousel,' +
      '.product-features-carousel{display:none!important}' +
      '.ce-yg-kf-slide,.ce-yg-gal-shell,.ce-yg-gal-thumbs,#ce-yg-gal-thumbs,' +
      '.ce-yg-kf-under,#ce-yg-kf-under{display:none!important}' +
      '#main-image-wrapper,.main-image-wrapper{margin-bottom:0!important;padding-bottom:0!important}' +
      '.product-right-wrapper .product-heading-wrapper{float:none!important;clear:both!important;' +
        'display:block!important;width:100%!important;max-width:100%!important;margin:0!important;' +
        'padding:0 12px!important;box-sizing:border-box!important;text-align:center!important}' +
      '.product-right-wrapper .product-heading-wrapper h1,.product-right-wrapper h1,' +
      '.product-right-wrapper .product-name,.product-right-wrapper .product-name h1,' +
      'h1.product-title,h1.item-title{float:none!important;display:block!important;width:100%!important;' +
        'max-width:100%!important;margin-left:0!important;margin-right:0!important;padding-left:0!important;' +
        'padding-right:0!important;box-sizing:border-box!important;text-align:center!important}' +
      '.product-right-wrapper #feefo-rating,.product-right-wrapper .feefo-rating{float:none!important;' +
        'display:flex!important;justify-content:center!important;align-items:center!important;' +
        'width:100%!important;max-width:100%!important;margin:6px 0 10px!important;padding:0 12px!important;' +
        'box-sizing:border-box!important;text-align:center!important}' +
      '.product-right-wrapper #feefo-rating .feefo-product-stars-widget,' +
      '.product-right-wrapper .feefo-rating .feefo-product-stars-widget{float:none!important;' +
        'display:inline-block!important;margin:0 auto!important}' +
      '.ce-yg-kf-below{display:block!important;width:100%!important;max-width:100%!important;' +
        'margin:10px 0 14px!important;padding:10px 0 14px!important;' +
        'background:linear-gradient(#ffffff 42%,#ccea81 42%)!important;' +
        'box-sizing:border-box!important;clear:both!important}' +
      '.ce-yg-kf-below-rail{display:flex!important;flex-wrap:nowrap!important;align-items:flex-start!important;' +
        'gap:0!important;width:100%!important;margin:0!important;padding:0 10px!important;' +
        'box-sizing:border-box!important;overflow-x:scroll!important;overflow-y:hidden!important;' +
        '-webkit-overflow-scrolling:touch!important;scroll-snap-type:x mandatory;scrollbar-width:none;' +
        '-ms-overflow-style:none;touch-action:pan-x!important;cursor:grab}' +
      '.ce-yg-kf-below-rail.is-dragging{cursor:grabbing;scroll-snap-type:none;user-select:none}' +
      '.ce-yg-kf-below-rail::-webkit-scrollbar{display:none}' +
      '.ce-yg-kf-below-item{flex:0 0 calc(100% / 3.15)!important;width:calc(100% / 3.15)!important;' +
        'max-width:calc(100% / 3.15)!important;display:flex!important;flex-direction:column!important;' +
        'align-items:center!important;justify-content:flex-start!important;text-align:center!important;' +
        'padding:0 6px!important;margin:0!important;border:0!important;background:transparent!important;' +
        'box-sizing:border-box!important;scroll-snap-align:start;-webkit-tap-highlight-color:transparent;' +
        'pointer-events:none}' +
      '.ce-yg-kf-below-item img{display:block!important;width:56px!important;height:56px!important;' +
        'min-width:56px!important;min-height:56px!important;max-width:56px!important;max-height:56px!important;' +
        'object-fit:contain!important;margin:0 auto 8px!important;padding:0!important;pointer-events:none!important}' +
      '.ce-yg-kf-below-item span{display:block!important;width:100%!important;margin:0!important;' +
        'padding:0 2px!important;min-height:2.6em!important;font-family:Rubik,-apple-system,' +
        'BlinkMacSystemFont,"Segoe UI",sans-serif!important;font-size:11px!important;line-height:1.25!important;' +
        'font-weight:600!important;color:#254f1c!important}';
    document.head.appendChild(st);
  }

  function labelFrom(desc) {
    if (!desc) return '';
    var html = desc.innerHTML || '';
    if (html) {
      return html
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    return (desc.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function collectIcons() {
    var seen = {};
    var out = [];
    var nodes = document.querySelectorAll(
      '#product-features-carousel .slick-slide:not(.slick-cloned) .icon, ' +
        '#product-features-carousel .icon, ' +
        '.icons-wrapper .icon, ' +
        '.icons-wrapper .slick-slide .icon'
    );
    var i;
    for (i = 0; i < nodes.length; i += 1) {
      var icon = nodes[i];
      var img = icon.querySelector('img');
      var desc = icon.querySelector('.icon-desc');
      var src = img && (img.getAttribute('src') || img.getAttribute('data-src'));
      var alt = (img && (img.getAttribute('alt') || '')) || '';
      var key = src || alt;
      if (!key || seen[key]) continue;
      seen[key] = 1;
      out.push({
        src: src,
        alt: alt,
        label: labelFrom(desc) || alt
      });
    }
    return out;
  }

  function paypalEl() {
    return (
      qs('.product-right-wrapper .pp-wrapper') ||
      qs('.pp-wrapper') ||
      qs('.product-right-wrapper .buy-wrapper')
    );
  }

  function insertAfter(ref, node) {
    if (!ref || !ref.parentNode) return false;
    if (ref.nextSibling) ref.parentNode.insertBefore(node, ref.nextSibling);
    else ref.parentNode.appendChild(node);
    return true;
  }

  function removeGallerySlide() {
    var car = qs('#main-image-carousel') || qs('.main-image-carousel');
    if (!car) return;
    var $ = jq();
    var existing = car.querySelector('.ce-yg-kf-slide');
    while (existing) {
      var slide = existing.classList.contains('slick-slide')
        ? existing
        : existing.closest('.slick-slide');
      if ($ && $.fn && $.fn.slick && car.classList.contains('slick-initialized') && slide) {
        var idx = parseInt(slide.getAttribute('data-slick-index'), 10);
        if (!isNaN(idx) && idx >= 0) {
          try {
            $(car).slick('slickRemove', idx);
          } catch (e) {
            if (slide.parentNode) slide.parentNode.removeChild(slide);
          }
        } else if (slide && slide.parentNode) {
          slide.parentNode.removeChild(slide);
        }
      } else if (existing.parentNode) {
        existing.parentNode.removeChild(existing);
      }
      existing = car.querySelector('.ce-yg-kf-slide');
    }
    car.removeAttribute('data-ce-yg-kf-slide');
  }

  function removeRail() {
    var shell = document.getElementById(SHELL_ID);
    if (shell && shell.parentNode) shell.parentNode.removeChild(shell);
    var rail = document.getElementById(RAIL_ID);
    if (rail && rail.parentNode) rail.parentNode.removeChild(rail);
  }

  /* Mouse + touch drag (CE desktop preview can't swipe overflow alone) */
  function bindDragScroll(rail) {
    if (!rail || rail.getAttribute('data-ce-drag') === '1') return;
    rail.setAttribute('data-ce-drag', '1');

    var startX = 0;
    var startLeft = 0;
    var dragging = false;

    function onDown(clientX) {
      dragging = true;
      startX = clientX;
      startLeft = rail.scrollLeft;
      rail.classList.add('is-dragging');
    }

    function onMove(clientX) {
      if (!dragging) return;
      rail.scrollLeft = startLeft - (clientX - startX);
    }

    function onUp() {
      if (!dragging) return;
      dragging = false;
      rail.classList.remove('is-dragging');
    }

    rail.addEventListener(
      'mousedown',
      function (e) {
        e.preventDefault();
        onDown(e.clientX);
      },
      false
    );
    window.addEventListener(
      'mousemove',
      function (e) {
        if (!dragging) return;
        e.preventDefault();
        onMove(e.clientX);
      },
      { passive: false }
    );
    window.addEventListener('mouseup', onUp, false);

    rail.addEventListener(
      'touchstart',
      function (e) {
        if (!e.touches || !e.touches.length) return;
        onDown(e.touches[0].clientX);
      },
      { passive: true }
    );
    rail.addEventListener(
      'touchmove',
      function (e) {
        if (!dragging || !e.touches || !e.touches.length) return;
        onMove(e.touches[0].clientX);
      },
      { passive: true }
    );
    rail.addEventListener('touchend', onUp, false);
    rail.addEventListener('touchcancel', onUp, false);
  }

  function isInCorrectSpot(shell) {
    var pp = paypalEl();
    if (!pp || !shell) return false;
    return pp.nextElementSibling === shell;
  }

  function buildRail(icons) {
    if (!icons.length) return false;

    var existing = document.getElementById(SHELL_ID);
    if (
      existing &&
      existing.querySelectorAll('.ce-yg-kf-below-item').length === icons.length &&
      isInCorrectSpot(existing)
    ) {
      bindDragScroll(document.getElementById(RAIL_ID));
      return true;
    }

    removeRail();

    var pp = paypalEl();
    var buy = qs('.product-right-wrapper .buy-wrapper');
    var right = qs('.product-right-wrapper');
    var points = qs('.product-right-wrapper .points');
    if (!pp && !buy && !points && !right) return false;

    var shell = document.createElement('div');
    shell.id = SHELL_ID;
    shell.className = 'ce-yg-kf-below';

    var rail = document.createElement('div');
    rail.id = RAIL_ID;
    rail.className = 'ce-yg-kf-below-rail';
    rail.setAttribute('role', 'list');
    rail.setAttribute('aria-label', 'Key features');

    icons.forEach(function (item) {
      var cell = document.createElement('div');
      cell.className = 'ce-yg-kf-below-item';
      cell.setAttribute('role', 'listitem');
      if (item.src) {
        var img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt || item.label || '';
        img.loading = 'lazy';
        img.width = 56;
        img.height = 56;
        cell.appendChild(img);
      }
      var span = document.createElement('span');
      span.textContent = item.label || item.alt || '';
      cell.appendChild(span);
      rail.appendChild(cell);
    });

    shell.appendChild(rail);

    /* Prefer: after PayPal → else after ATB → else before bullet points */
    if (pp) {
      insertAfter(pp, shell);
    } else if (buy) {
      insertAfter(buy, shell);
    } else if (points && points.parentNode) {
      points.parentNode.insertBefore(shell, points);
    } else {
      right.appendChild(shell);
    }

    bindDragScroll(rail);
    return !!document.getElementById(SHELL_ID);
  }

  function apply() {
    document.documentElement.classList.add(ROOT);
    ensureCss();
    removeGallerySlide();
    var icons = collectIcons();
    if (!icons.length) return false;
    return buildRail(icons);
  }

  function boot() {
    if (!isPdp()) return;
    apply();
    if (window[TIMER_KEY]) clearInterval(window[TIMER_KEY]);
    var tries = 0;
    window[TIMER_KEY] = setInterval(function () {
      tries += 1;
      var ok = apply();
      if (ok || tries > 60) {
        clearInterval(window[TIMER_KEY]);
        window[TIMER_KEY] = null;
      }
    }, 250);
  }

  window[APPLY_KEY] = apply;

  document.documentElement.setAttribute(INIT, VER);
  document.documentElement.classList.add(ROOT);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
