/**
 * Crazy Egg — PLP category cross-links v4
 * Paste into Variant → Custom JS
 * Pair with: yg-plp-crosslinks-v4.css
 *
 * White outline pills (like CE Variant 2) + filters/sort/reset match.
 * Visual only. Tracking: GTM Click → `plp_crosslink_click`.
 */
(function () {
  'use strict';

  var VER = '4c';
  var ON = 'ce-yg-plp-crosslinks-v4';
  var INIT = 'data-ce-yg-plp-crosslinks';
  var STYLE_ID = 'ce-yg-plp-crosslinks-v4-css';
  var WRAP = '.category-cross-linking-wrapper';

  function ensureCss() {
    var st = document.getElementById(STYLE_ID);
    if (st) st.parentNode.removeChild(st);
    st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent =
      'html.ce-yg-plp-crosslinks-v4{--ce-xl4-forest:#264f1c;--ce-xl4-body:"proxima-nova","Proxima Nova",Arial,Helvetica,sans-serif}' +
      'html.ce-yg-plp-crosslinks-v4 .top-section{float:none!important;width:100%!important;max-width:100%!important;clear:both!important;box-sizing:border-box!important}' +
      'html.ce-yg-plp-crosslinks-v4 .category-cross-linking-wrapper{display:block!important;float:none!important;width:100%!important;max-width:100%!important;margin:0 0 12px!important;padding:10px 0 4px!important;background:transparent!important;box-sizing:border-box!important}' +
      'html.ce-yg-plp-crosslinks-v4 .category-cross-linking-wrapper::before{content:none!important;display:none!important}' +
      'html.ce-yg-plp-crosslinks-v4 .category-cross-linking-wrapper>ul{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;gap:8px!important;width:100%!important;max-width:100%!important;margin:0!important;padding:0 0 6px!important;list-style:none!important;overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch;scrollbar-width:none;box-sizing:border-box!important}' +
      'html.ce-yg-plp-crosslinks-v4 .category-cross-linking-wrapper>ul::-webkit-scrollbar{display:none}' +
      'html.ce-yg-plp-crosslinks-v4 .category-cross-linking-wrapper>ul>li{display:inline-flex!important;float:none!important;flex:0 0 auto!important;margin:0!important;padding:0!important;list-style:none!important}' +
      'html.ce-yg-plp-crosslinks-v4 .category-cross-linking-wrapper>ul>li>a{display:inline-flex!important;align-items:center!important;justify-content:center!important;margin:0!important;padding:8px 14px!important;border:1.5px solid var(--ce-xl4-forest)!important;border-radius:999px!important;background:#fff!important;color:var(--ce-xl4-forest)!important;font-family:var(--ce-xl4-body)!important;font-size:13px!important;font-weight:700!important;line-height:1.2!important;letter-spacing:.01em!important;text-decoration:none!important;white-space:nowrap!important;box-sizing:border-box!important}' +
      'html.ce-yg-plp-crosslinks-v4 .category-cross-linking-wrapper>ul>li>a:hover,html.ce-yg-plp-crosslinks-v4 .category-cross-linking-wrapper>ul>li>a:focus{background:var(--ce-xl4-forest)!important;color:#fff!important;border-color:var(--ce-xl4-forest)!important;outline:none}' +
      '@media (min-width:768px){' +
      'html.ce-yg-plp-crosslinks-v4 .category-cross-linking-wrapper>ul{flex-wrap:wrap!important;overflow-x:visible!important;padding-bottom:0!important;gap:8px 10px!important}' +
      'html.ce-yg-plp-crosslinks-v4 .category-cross-linking-wrapper>ul>li>a{font-size:14px!important;padding:9px 16px!important}' +
      'html.ce-yg-plp-crosslinks-v4 .filter-wrapper .filterHead,html.ce-yg-plp-crosslinks-v4 .sort-wrapper .sort-head,html.ce-yg-plp-crosslinks-v4 #sort-head{background:#fff!important;border:1.5px solid var(--ce-xl4-forest)!important;border-radius:999px!important;color:var(--ce-xl4-forest)!important;font-family:var(--ce-xl4-body)!important;font-weight:700!important;box-sizing:border-box!important}' +
      'html.ce-yg-plp-crosslinks-v4 .filter-wrapper .filterHead:hover,html.ce-yg-plp-crosslinks-v4 .sort-wrapper .sort-head:hover,html.ce-yg-plp-crosslinks-v4 #sort-head:hover{background:var(--ce-xl4-forest)!important;color:#fff!important}' +
      'html.ce-yg-plp-crosslinks-v4 .filter-wrapper .clear-filters{background:#fff!important;border:1.5px solid var(--ce-xl4-forest)!important;border-radius:999px!important;color:var(--ce-xl4-forest)!important;font-family:var(--ce-xl4-body)!important;font-weight:700!important;text-align:center!important;box-sizing:border-box!important;cursor:pointer!important}' +
      'html.ce-yg-plp-crosslinks-v4 .filter-wrapper .clear-filters:hover{background:var(--ce-xl4-forest)!important;color:#fff!important}' +
      '}' +
      '@media (max-width:767px){html.ce-yg-plp-crosslinks-v4 .category-filters .mobile-filter-open,html.ce-yg-plp-crosslinks-v4 #mobile-filter-open{background:#fff!important;border:1.5px solid var(--ce-xl4-forest)!important;border-radius:999px!important;color:var(--ce-xl4-forest)!important;font-family:var(--ce-xl4-body)!important;font-weight:700!important;box-sizing:border-box!important}}';
    document.head.appendChild(st);
  }

  function apply() {
    if (!document.querySelector(WRAP) && !document.querySelector('.category-filters')) return false;
    document.documentElement.classList.remove(
      'ce-yg-plp-crosslinks',
      'ce-yg-plp-crosslinks-v2',
      'ce-yg-plp-crosslinks-v3'
    );
    document.documentElement.classList.add(ON);
    document.documentElement.setAttribute(INIT, VER);
    ensureCss();
    return true;
  }

  function boot() {
    apply();
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (apply() || tries > 40) clearInterval(timer);
    }, 250);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
