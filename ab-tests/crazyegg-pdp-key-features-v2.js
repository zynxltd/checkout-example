/**
 * Crazy Egg — PDP Key Features v2 (mobile)
 *
 * Replaces the Magento infinite Key Features slick carousel with a
 * single-row horizontal rail of smaller, equal-sized icons.
 * Swipe still works; no wrap to 2 rows; no infinite loop.
 *
 * Desktop unchanged. Mobile ≤1000px only.
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-pdp-key-features-v2.css
 *
 * Example: https://www.yougarden.com/item-p-630050/complete-300-spring-flowering-bulb-collection
 */
(function () {
  'use strict';

  var ROOT = 'ce-yg-pdp-kf-v2';
  var INIT = 'data-ce-yg-pdp-kf-v2';
  var RAIL_ID = 'ce-yg-kf-rail';
  var STYLE_ID = 'ce-yg-pdp-kf-v2-css';
  var MQ = window.matchMedia('(max-width: 1000px)');

  if (document.documentElement.getAttribute(INIT) === '1') return;
  if (!/\/item-[sp]-/i.test(window.location.pathname)) return;
  document.documentElement.setAttribute(INIT, '1');
  document.documentElement.classList.add(ROOT);

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function ensureCss() {
    if (document.getElementById(STYLE_ID)) return;
    var st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent =
      '@media (max-width:1000px){' +
        'html.ce-yg-pdp-kf-v2 #product-features-carousel,' +
        'html.ce-yg-pdp-kf-v2 .product-features-carousel{display:none!important}' +
        'html.ce-yg-pdp-kf-v2 .icons-wrapper{margin:0 0 10px!important;padding:0!important}' +
        'html.ce-yg-pdp-kf-v2 .icons-heading{margin:14px 0 8px!important;font-size:16px!important;text-align:left!important}' +
        'html.ce-yg-pdp-kf-v2 .ce-yg-kf-rail{display:flex!important;flex-wrap:nowrap!important;align-items:flex-start;' +
          'gap:0;width:100%;margin:0;padding:4px 2px 8px;box-sizing:border-box;overflow-x:auto;overflow-y:hidden;' +
          '-webkit-overflow-scrolling:touch;scroll-snap-type:x mandatory;scrollbar-width:none;-ms-overflow-style:none}' +
        'html.ce-yg-pdp-kf-v2 .ce-yg-kf-rail::-webkit-scrollbar{display:none}' +
        'html.ce-yg-pdp-kf-v2 .ce-yg-kf-rail-item{flex:0 0 72px;width:72px;max-width:72px;display:flex;' +
          'flex-direction:column;align-items:center;justify-content:flex-start;text-align:center;' +
          'scroll-snap-align:start;box-sizing:border-box;padding:0 4px}' +
        'html.ce-yg-pdp-kf-v2 .ce-yg-kf-rail-item img{width:32px!important;height:32px!important;' +
          'min-width:32px;min-height:32px;object-fit:contain;display:block;margin:0 auto 4px}' +
        'html.ce-yg-pdp-kf-v2 .ce-yg-kf-rail-item span{display:block;width:100%;font-family:Rubik,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
          'font-size:10px;line-height:1.2;font-weight:500;color:#264f1c;min-height:2.4em}' +
      '}' +
      '@media (min-width:1001px){html.ce-yg-pdp-kf-v2 .ce-yg-kf-rail{display:none!important}}';
    document.head.appendChild(st);
  }

  function collectIcons() {
    var seen = {};
    var out = [];
    var nodes = document.querySelectorAll(
      '#product-features-carousel .slick-slide:not(.slick-cloned) .icon, ' +
      '.icons-wrapper .icon'
    );
    var i;
    for (i = 0; i < nodes.length; i += 1) {
      var icon = nodes[i];
      var img = icon.querySelector('img');
      var desc = icon.querySelector('.icon-desc');
      var src = img && img.getAttribute('src');
      var alt = (img && (img.getAttribute('alt') || '')) || '';
      var key = src || alt;
      if (!key || seen[key]) continue;
      seen[key] = 1;
      out.push({
        src: src,
        alt: alt,
        label: desc
          ? (desc.innerText || '').replace(/\s+/g, ' ').trim()
          : alt
      });
    }
    return out;
  }

  function iconsHost() {
    return qs('.product-right-wrapper .icons-wrapper') || qs('.icons-wrapper');
  }

  function removeRail() {
    var el = document.getElementById(RAIL_ID);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function buildRail(icons) {
    removeRail();
    if (!icons.length) return;

    var host = iconsHost();
    if (!host) return;

    var rail = document.createElement('div');
    rail.id = RAIL_ID;
    rail.className = 'ce-yg-kf-rail';
    rail.setAttribute('role', 'list');
    rail.setAttribute('aria-label', 'Key features');

    icons.forEach(function (item) {
      var cell = document.createElement('div');
      cell.className = 'ce-yg-kf-rail-item';
      cell.setAttribute('role', 'listitem');
      if (item.src) {
        var img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt || item.label || '';
        img.width = 32;
        img.height = 32;
        img.loading = 'lazy';
        cell.appendChild(img);
      }
      var span = document.createElement('span');
      span.textContent = item.label || item.alt || '';
      cell.appendChild(span);
      rail.appendChild(cell);
    });

    host.appendChild(rail);
  }

  function apply() {
    ensureCss();
    if (!MQ.matches) {
      removeRail();
      return;
    }
    var icons = collectIcons();
    if (!icons.length) return;
    buildRail(icons);
  }

  function boot() {
    apply();
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (!MQ.matches) {
        clearInterval(timer);
        return;
      }
      if (collectIcons().length || tries > 20) {
        clearInterval(timer);
        apply();
      }
    }, 250);
  }

  ready(boot);

  if (MQ.addEventListener) {
    MQ.addEventListener('change', apply);
  } else if (MQ.addListener) {
    MQ.addListener(apply);
  }
})();
