/**
 * Crazy Egg — PLP CTA wording Variant 2
 * Control: "FIND OUT MORE" → Variant: "VIEW DETAILS"
 * Leaves "OUT OF STOCK" (mainButtonGrey) unchanged.
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-plp-cta-view-details.css
 *
 * Runs only on PLPs (pages with listing CTAs). Safe if CE URL
 * matching is broader than listing pages.
 *
 * Tracking: GTM plp_product_click (Click URL contains item-)
 */
(function () {
  'use strict';

  var MARK = 'data-ce-yg-plp-cta-v2';
  var ON = 'ce-yg-plp-cta-v2';
  var LABEL = 'VIEW DETAILS';
  var FROM = 'FIND OUT MORE';
  var SEL = '.category-box .mainButtonGreen.moreInfo';
  var MAX_MS = 15000;
  var POLL_MS = 200;
  var started = Date.now();
  var observer = null;

  function isPlpCandidate() {
    var path = (location.pathname || '').toLowerCase();
    if (/\/item-[ps]-/i.test(path)) return false;
    if (/\.(htm|html|csp)$/i.test(path)) return false;
    return true;
  }

  function rewrite(root) {
    var nodes = (root || document).querySelectorAll(SEL);
    var i;
    var el;
    var text;
    var changed = 0;

    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      text = (el.textContent || '').replace(/\s+/g, ' ').trim().toUpperCase();
      if (text === LABEL) {
        el.setAttribute(MARK, '1');
        continue;
      }
      if (text !== FROM) continue;
      el.textContent = LABEL;
      el.setAttribute(MARK, '1');
      changed += 1;
    }

    return changed;
  }

  function apply() {
    if (!isPlpCandidate()) return false;
    if (!document.querySelector(SEL)) return false;
    document.documentElement.classList.add(ON);
    rewrite(document);
    return true;
  }

  function watch() {
    if (observer || !document.body) return;
    observer = new MutationObserver(function (mutations) {
      var i;
      var m;
      for (i = 0; i < mutations.length; i++) {
        m = mutations[i];
        if (m.addedNodes && m.addedNodes.length) {
          apply();
          return;
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function boot() {
    if (!isPlpCandidate()) return;
    apply();
    watch();

    var timer = setInterval(function () {
      apply();
      if (Date.now() - started > MAX_MS) clearInterval(timer);
    }, POLL_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
