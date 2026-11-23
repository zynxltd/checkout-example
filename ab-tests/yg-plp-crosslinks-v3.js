/**
 * Crazy Egg — PLP category cross-links v3 (solid green / FIND OUT MORE style)
 * Paste into Variant → Custom JS
 * Pair with: yg-plp-crosslinks-v3.css
 *
 * Forest green + white text, 6px radius. Visual only.
 * Tracking: GTM Click → `plp_crosslink_click`.
 *
 * Example: https://www.yougarden.com/garden-plants/perennial-plants-and-flowers
 */
  (function () {
    'use strict';

    var VER = '3';
    var ON = 'ce-yg-plp-crosslinks-v3';
    var INIT = 'data-ce-yg-plp-crosslinks';
    var STYLE_ID = 'ce-yg-plp-crosslinks-v3-css';
    var WRAP = '.category-cross-linking-wrapper';

    function ensureCss() {
      if (document.getElementById(STYLE_ID)) return;
      var st = document.createElement('style');
      st.id = STYLE_ID;
      st.textContent =
        'html.ce-yg-plp-crosslinks-v3{--ce-xl3-forest:#264f1c;--ce-xl3-body:"proxima-nova","Proxima Nova",Arial,Helvetica,sans-serif}' +
        'html.ce-yg-plp-crosslinks-v3 .top-section{float:none!important;width:100%!important;max-width:100%!important;clear:both!important;box-sizing:border-box!important}' +
        'html.ce-yg-plp-crosslinks-v3 .category-cross-linking-wrapper{display:block!important;float:none!important;width:100%!important;max-width:100%!important;margin:0 0 12px!important;padding:10px 0 4px!important;box-sizing:border-box!important}' +
        'html.ce-yg-plp-crosslinks-v3 .category-cross-linking-wrapper>ul{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;gap:8px!important;width:100%!important;max-width:100%!important;margin:0!important;padding:0 0 6px!important;list-style:none!important;overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch;scrollbar-width:none;box-sizing:border-box!important}' +
        'html.ce-yg-plp-crosslinks-v3 .category-cross-linking-wrapper>ul::-webkit-scrollbar{display:none}' +
        'html.ce-yg-plp-crosslinks-v3 .category-cross-linking-wrapper>ul>li{display:inline-flex!important;float:none!important;flex:0 0 auto!important;margin:0!important;padding:0!important;list-style:none!important}' +
      'html.ce-yg-plp-crosslinks-v3 .category-cross-linking-wrapper>ul>li>a{display:inline-flex!important;align-items:center!important;justify-content:center!important;margin:0!important;padding:9px 15px!important;border:none!important;border-radius:6px!important;background:var(--ce-xl3-forest)!important;color:#fff!important;font-family:var(--ce-xl3-body)!important;font-size:13px!important;font-weight:700!important;line-height:1.2!important;letter-spacing:.01em!important;text-decoration:none!important;text-transform:none!important;white-space:nowrap!important;box-sizing:border-box!important;box-shadow:none!important}' +
      'html.ce-yg-plp-crosslinks-v3 .category-cross-linking-wrapper>ul>li>a:hover,html.ce-yg-plp-crosslinks-v3 .category-cross-linking-wrapper>ul>li>a:focus{background:#1e3f16!important;color:#fff!important;outline:none}' +
      '@media (min-width:768px){html.ce-yg-plp-crosslinks-v3 .category-cross-linking-wrapper>ul{flex-wrap:wrap!important;overflow-x:visible!important;padding-bottom:0!important;gap:8px 10px!important}html.ce-yg-plp-crosslinks-v3 .category-cross-linking-wrapper>ul>li>a{font-size:14px!important;padding:10px 16px!important}}';
      document.head.appendChild(st);
    }

    function apply() {
      if (!document.querySelector(WRAP)) return false;
      document.documentElement.classList.remove('ce-yg-plp-crosslinks', 'ce-yg-plp-crosslinks-v2');
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
