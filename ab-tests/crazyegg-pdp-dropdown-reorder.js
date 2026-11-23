/**
 * Crazy Egg — PDP Drop Down Re-order
 *
 * Control: Magento order
 *   Plant Calendar → Description → Top Tips → Care → Delivery → Reviews → Videos
 * Variant: keep pre-open Plant Calendar + Description at top; reverse the rest
 *   Plant Calendar → Description → Videos → Reviews → Delivery → Care → Top Tips
 *
 * Moves live heading + #tab-content-* pairs (no clone) so Feefo / Vimeo / calendar keep working.
 * Skips missing tabs. Leaves TMS slots / other siblings after the tab stack alone.
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-pdp-dropdown-reorder.css
 *
 * Example: https://www.yougarden.com/item-p-530211/the-best-ever-hybrid-tea-rose-bush-collection
 */
(function () {
  'use strict';

  var INIT = 'data-ce-pdp-dd-reorder';
  var ROOT = 'ce-yg-pdp-dd-reorder';
  var STYLE_ID = 'ce-pdp-dd-reorder-css';

  /* Plant Calendar + Description stay first (pre-open). Reverse heatmap stack below. */
  var ORDER = [
    'plantcalendar',
    'description',
    'video',
    'reviews',
    'delivery',
    'care',
    'tips'
  ];

  if (document.documentElement.getAttribute(INIT) === '1') return;
  document.documentElement.setAttribute(INIT, '1');

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function ensureCss() {
    if (document.getElementById(STYLE_ID)) return;
    var st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent =
      'html.ce-yg-pdp-dd-reorder .centralWrapper.text[data-ce-pdp-dd-reordered="1"]{' +
        '/* marker only — layout unchanged */' +
      '}';
    document.head.appendChild(st);
  }

  function findHost() {
    var hosts = document.querySelectorAll('.centralWrapper.text');
    var i;
    for (i = 0; i < hosts.length; i++) {
      if (hosts[i].querySelector(':scope > .tab-heading')) return hosts[i];
    }
    for (i = 0; i < hosts.length; i++) {
      if (hosts[i].querySelector('.tab-heading') && hosts[i].querySelector('.tab-content')) {
        return hosts[i];
      }
    }
    return null;
  }

  function findContent(heading) {
    if (heading.id) {
      var byId = document.getElementById('tab-content-' + heading.id);
      if (byId) return byId;
    }
    var next = heading.nextElementSibling;
    if (next && next.classList && next.classList.contains('tab-content')) return next;
    return null;
  }

  function collectPairs(host) {
    var headings = [].filter.call(host.children, function (el) {
      return el.classList && el.classList.contains('tab-heading');
    });
    var map = {};
    var i;
    for (i = 0; i < headings.length; i++) {
      var h = headings[i];
      var c = findContent(h);
      if (!c) continue;
      map[h.id || ('anon-' + i)] = { heading: h, content: c };
    }
    return map;
  }

  function reorder(host) {
    if (!host || host.getAttribute('data-ce-pdp-dd-reordered') === '1') return false;

    var map = collectPairs(host);
    var ids = Object.keys(map);
    if (ids.length < 2) return false;

    /* Anchor: first node after the last tab-content in the current stack */
    var lastContent = null;
    var i;
    for (i = 0; i < host.children.length; i++) {
      var el = host.children[i];
      if (el.classList && el.classList.contains('tab-content')) lastContent = el;
    }
    var anchor = lastContent ? lastContent.nextSibling : null;

    var frag = document.createDocumentFragment();
    var used = {};

    function appendPair(id) {
      var pair = map[id];
      if (!pair || used[id]) return;
      used[id] = true;
      frag.appendChild(pair.heading);
      frag.appendChild(pair.content);
    }

    for (i = 0; i < ORDER.length; i++) appendPair(ORDER[i]);
    /* Any unexpected tab IDs — keep after known ones, original relative order */
    for (i = 0; i < ids.length; i++) {
      if (!used[ids[i]]) appendPair(ids[i]);
    }

    if (anchor) {
      host.insertBefore(frag, anchor);
    } else {
      host.appendChild(frag);
    }

    document.documentElement.classList.add(ROOT);
    host.setAttribute('data-ce-pdp-dd-reordered', '1');
    host.setAttribute('data-ce-pdp-dd-order', ORDER.join(','));
    return true;
  }

  function boot() {
    ensureCss();
    var host = findHost();
    if (!host) return false;
    return reorder(host);
  }

  ready(function () {
    if (boot()) return;
    var tries = 0;
    var t = setInterval(function () {
      tries += 1;
      if (boot() || tries > 40) clearInterval(t);
    }, 250);
  });
})();
