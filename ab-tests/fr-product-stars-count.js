/**
 * Fresh Relevance — star review counts at 12px
 *
 * Feefo paints .product-stars-container-count inside an open shadow root
 * and sets the size from --feefo-typography-body-small-font-size (14px).
 * Page CSS cannot reach that node. This runs after the widget attaches
 * and writes 12px on the count itself.
 *
 * Paste into Fresh Relevance → Custom JS
 * Pair with: fr-product-stars-count.css
 */
(function () {
  'use strict';

  var STYLE_ID = 'yg-stars-count-12';
  var WATCHED = 'data-yg-stars-watched';
  var queued = false;

  function paint(root) {
    var counts;
    var style;
    var i;
    var node;
    if (!root || !root.querySelectorAll) return;
    counts = root.querySelectorAll('.product-stars-container-count');
    if (!counts.length) return;
    if (!root.querySelector('#' + STYLE_ID)) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = '.product-stars-container-count{font-size:12px!important;--feefo-typography-body-small-font-size:12px!important}';
      root.appendChild(style);
    }
    for (i = 0; i < counts.length; i++) {
      node = counts[i];
      if (node.style.getPropertyValue('font-size') === '12px' && node.style.getPropertyPriority('font-size') === 'important') {
        continue;
      }
      node.style.setProperty('--feefo-typography-body-small-font-size', '12px', 'important');
      node.style.setProperty('font-size', '12px', 'important');
    }
  }

  function watchShadow(root) {
    if (!root || root.nodeType !== 11) return;
    if (root[WATCHED]) return;
    root[WATCHED] = '1';
    paint(root);
    new MutationObserver(function () {
      paint(root);
    }).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
  }

  function walk(node) {
    var kids;
    var i;
    if (!node) return;
    if (node.shadowRoot) {
      watchShadow(node.shadowRoot);
      walk(node.shadowRoot);
    }
    kids = node.children;
    if (!kids) return;
    for (i = 0; i < kids.length; i++) walk(kids[i]);
  }

  function tick() {
    walk(document.body);
  }

  function schedule() {
    if (queued) return;
    queued = true;
    window.setTimeout(function () {
      queued = false;
      tick();
    }, 50);
  }

  function boot() {
    var tries = 0;
    var timer;
    tick();
    new MutationObserver(schedule).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    timer = window.setInterval(function () {
      tries += 1;
      tick();
      if (tries > 40) window.clearInterval(timer);
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
