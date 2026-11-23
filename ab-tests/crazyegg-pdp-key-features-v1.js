/**
 * Crazy Egg — PDP Key Features v1 (mobile)
 *
 * Asana option 1: Key Features carousel is hard to scan on mobile (long
 * swipe loop, unclear start). Remove it from the buy column and surface
 * the same icons on the product image so description / bullets sit higher.
 *
 * Desktop unchanged. Mobile ≤1000px only.
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-pdp-key-features-v1.css
 *
 * Example: https://www.yougarden.com/item-p-630050/complete-300-spring-flowering-bulb-collection
 */
(function () {
  'use strict';

  var ROOT = 'ce-yg-pdp-kf-v1';
  var INIT = 'data-ce-yg-pdp-kf-v1';
  var OVERLAY_ID = 'ce-yg-kf-overlay';
  var STYLE_ID = 'ce-yg-pdp-kf-v1-css';
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
        'html.ce-yg-pdp-kf-v1 .product-right-wrapper>.icons-heading,' +
        'html.ce-yg-pdp-kf-v1 .product-right-wrapper>.icons-wrapper,' +
        'html.ce-yg-pdp-kf-v1 #product-features-carousel{display:none!important}' +
        'html.ce-yg-pdp-kf-v1 #main-image-wrapper,' +
        'html.ce-yg-pdp-kf-v1 .main-image-wrapper{position:relative!important}' +
        'html.ce-yg-pdp-kf-v1 .ce-yg-kf-overlay{position:absolute;left:0;right:0;bottom:0;z-index:5;' +
          'display:flex;flex-wrap:wrap;justify-content:center;align-items:flex-start;gap:6px 4px;' +
          'padding:8px 6px 10px;box-sizing:border-box;' +
          'background:linear-gradient(to top,rgba(255,255,255,.96) 0%,rgba(255,255,255,.88) 55%,rgba(255,255,255,0) 100%);' +
          'pointer-events:none}' +
        'html.ce-yg-pdp-kf-v1 .ce-yg-kf-item{flex:0 0 calc(33.333% - 4px);max-width:88px;' +
          'display:flex;flex-direction:column;align-items:center;text-align:center}' +
        'html.ce-yg-pdp-kf-v1 .ce-yg-kf-item img{width:36px!important;height:36px!important;' +
          'object-fit:contain;display:block;margin:0 auto 2px}' +
        'html.ce-yg-pdp-kf-v1 .ce-yg-kf-item span{display:block;font-family:Rubik,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
          'font-size:10px;line-height:1.2;font-weight:500;color:#264f1c}' +
      '}' +
      '@media (min-width:1001px){html.ce-yg-pdp-kf-v1 .ce-yg-kf-overlay{display:none!important}}';
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

  function imageHost() {
    return qs('#main-image-wrapper') || qs('.main-image-wrapper');
  }

  function removeOverlay() {
    var el = document.getElementById(OVERLAY_ID);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function buildOverlay(icons) {
    removeOverlay();
    if (!icons.length) return;

    var host = imageHost();
    if (!host) return;

    var wrap = document.createElement('div');
    wrap.id = OVERLAY_ID;
    wrap.className = 'ce-yg-kf-overlay';
    wrap.setAttribute('aria-label', 'Key features');

    icons.forEach(function (item) {
      var cell = document.createElement('div');
      cell.className = 'ce-yg-kf-item';
      if (item.src) {
        var img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt || item.label || '';
        img.width = 36;
        img.height = 36;
        img.loading = 'lazy';
        cell.appendChild(img);
      }
      var span = document.createElement('span');
      span.textContent = item.label || item.alt || '';
      cell.appendChild(span);
      wrap.appendChild(cell);
    });

    host.appendChild(wrap);
  }

  function apply() {
    ensureCss();
    if (!MQ.matches) {
      removeOverlay();
      return;
    }
    var icons = collectIcons();
    if (!icons.length) return;
    buildOverlay(icons);
  }

  function boot() {
    apply();
    /* Slick may init after first paint — retry briefly */
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
