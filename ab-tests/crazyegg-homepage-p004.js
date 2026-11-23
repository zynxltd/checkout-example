/**
 * Crazy Egg A/B — Homepage P004 (first category row CSS only)
 *
 * Variation: prototype styling on the TOP category block only.
 * Second row4 block further down the page is left unchanged.
 *
 * Paste crazyegg-homepage-p004.css into Custom CSS instead when possible.
 * Use this file for CSS + optional “Shop by category” headline.
 *
 * Test URL: https://www.yougarden.com/
 * Desktop only: 961px+
 */
(function () {
  'use strict';

  var DESKTOP_MQ = '(min-width: 961px)';
  var STYLE_ID = 'ce-yg-homepage-p004';
  var TARGET_CLASS = 'ce-yg-p004-target';
  var CATEGORY_HEADLINE = 'Shop by category';
  var INJECT_HEADLINE = true;

  if (!window.matchMedia || !window.matchMedia(DESKTOP_MQ).matches) return;

  /* Keep in sync with crazyegg-homepage-p004.css */
  var css =
    '@media (min-width:961px){' +
    '.category-landing-row4-wrapper:not(.category-landing-row4-wrapper ~ .category-landing-row4-wrapper),.category-landing-row4-wrapper.ce-yg-p004-target{display:flex;flex-wrap:nowrap;gap:10px;width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);padding:0 clamp(16px,2.5vw,40px);box-sizing:border-box}' +
    '.category-landing-row4-wrapper:not(.category-landing-row4-wrapper ~ .category-landing-row4-wrapper) .block,.category-landing-row4-wrapper.ce-yg-p004-target .block{flex:1 1 0;min-width:0}' +
    '.category-landing-row4-wrapper:not(.category-landing-row4-wrapper ~ .category-landing-row4-wrapper) .block a,.category-landing-row4-wrapper.ce-yg-p004-target .block a{position:relative;display:block;border-radius:18px;overflow:hidden;text-decoration:none;aspect-ratio:1/1}' +
    '.category-landing-row4-wrapper:not(.category-landing-row4-wrapper ~ .category-landing-row4-wrapper) .block img,.category-landing-row4-wrapper.ce-yg-p004-target .block img{display:block;width:100%;height:100%;object-fit:cover;border-radius:18px}' +
    '.category-landing-row4-wrapper:not(.category-landing-row4-wrapper ~ .category-landing-row4-wrapper) .block .cta,.category-landing-row4-wrapper.ce-yg-p004-target .block .cta{position:absolute;right:10px;bottom:10px;z-index:1;display:inline-flex;align-items:center;gap:8px;max-width:calc(100% - 20px);margin:0;padding:6px 6px 6px 14px;border-radius:999px;background:rgba(255,255,255,.94);box-shadow:0 2px 10px rgba(0,0,0,.18);font-family:Georgia,"Times New Roman",Times,serif;font-size:16px;font-weight:700;line-height:1.2;letter-spacing:.01em;color:#483f3a;white-space:nowrap;overflow:hidden}' +
    '.category-landing-row4-wrapper:not(.category-landing-row4-wrapper ~ .category-landing-row4-wrapper) .block .cta .arrow,.category-landing-row4-wrapper.ce-yg-p004-target .block .cta .arrow{display:inline-flex;flex-shrink:0;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:#264f1c;color:#fff;line-height:0}' +
    '.category-landing-row4-wrapper:not(.category-landing-row4-wrapper ~ .category-landing-row4-wrapper) .block .cta .arrow svg,.category-landing-row4-wrapper.ce-yg-p004-target .block .cta .arrow svg{display:block;width:8px;height:12px}' +
    '.category-landing-row4-wrapper:not(.category-landing-row4-wrapper ~ .category-landing-row4-wrapper) .block a:hover .cta,.category-landing-row4-wrapper.ce-yg-p004-target .block a:hover .cta{background:#264f1c;color:#fff}' +
    '.category-landing-row4-wrapper:not(.category-landing-row4-wrapper ~ .category-landing-row4-wrapper) .block a:hover .cta .arrow,.category-landing-row4-wrapper.ce-yg-p004-target .block a:hover .cta .arrow{background:rgba(255,255,255,.2);color:#fff}' +
    '.ce-yg-p004-cat-headline{margin:0 0 12px;padding:8px 0 0;font-family:Georgia,"Times New Roman",Times,serif;font-size:clamp(1.35rem,2vw,1.75rem);font-weight:700;line-height:1.2;text-align:center;color:#483f3a}' +
    '}';

  function getFirstCategoryRow() {
    return document.querySelector('.category-landing-row4-wrapper');
  }

  function markFirstRow() {
    var wrapper = getFirstCategoryRow();
    if (wrapper) wrapper.classList.add(TARGET_CLASS);
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var el = document.createElement('style');
    el.id = STYLE_ID;
    el.type = 'text/css';
    el.appendChild(document.createTextNode(css));
    document.head.appendChild(el);
  }

  function injectCategoryHeadline() {
    if (!INJECT_HEADLINE) return;

    var wrapper = getFirstCategoryRow();
    if (!wrapper || document.getElementById('ce-yg-p004-cat-headline')) return;

    var h2 = document.createElement('h2');
    h2.id = 'ce-yg-p004-cat-headline';
    h2.className = 'ce-yg-p004-cat-headline';
    h2.textContent = CATEGORY_HEADLINE;

    var parent = wrapper.parentNode;
    if (parent) parent.insertBefore(h2, wrapper);
  }

  function init() {
    markFirstRow();
    injectCategoryHeadline();
  }

  injectStyles();
  init();

  if (window.MutationObserver) {
    var obs = new MutationObserver(init);
    obs.observe(document.body, { childList: true, subtree: true });
  }
})();
