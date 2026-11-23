/**
 * Crazy Egg A/B — PLP Filters & Sort drawer (exploration)
 *
 * Target: https://www.yougarden.com/... category PLPs with #filterForm
 * Pair with: crazyegg-plp-filters-drawer.css (Custom CSS in same variant)
 *
 * What this explores on live  markup:
 * 1. Restyle #mobile-filter-open -> "Open Filters / Sort", place at start
 *    of .category-cross-linking-wrapper (before scrollable category links)
 * 2. Replace accordion checkboxes with cream slide-out + custom dropdowns
 *    (native <select> popups mis-anchor inside position:fixed drawers)
 * 3. Batch Apply (one POST) instead of submit-on-each-checkbox
 * 4. Reset via existing Clear-All-Filters hidden
 *
 * Keeps native #filterForm / #sort-form POST - no AJAX rewrite.
 * Control = no change. Variation = paste CSS + this JS.
 *
 * Limits (known):
 * - Still full-page reloads on Apply / Reset / Sort
 * - If sort + filters both change, filters POST wins; sort needs
 *   Order to be accepted on filterForm or a follow-up sort submit
 * - Full filter catalog (groups + options + Magento hidden ids) is
 *   snapshotted grow-only so after Apply Magento can drop wrappers
 *   and the drawer still shows the same set every time
 */
(function () {
    'use strict';
  
    var ROOT_CLASS = 'ce-yg-plp-filters';
    var INIT_MARK = 'data-ce-yg-plp-filters-init';
    var SHELL_ID = 'ce-ff-shell';
    var STYLE_ID = 'ce-ff-critical-css';
  
    if (document.documentElement.getAttribute(INIT_MARK)) return;
  
    function ready(fn) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
      } else {
        fn();
      }
    }
  
    function injectCriticalCss() {
      if (document.getElementById(STYLE_ID)) return;
      var css =
        'html.ce-yg-plp-filters .category-filters #display-filters-wrapper,' +
        'html.ce-yg-plp-filters .category-filters .display-filters-wrapper{' +
          /* No display:none — iOS Safari drops those fields from POST */
          'display:block!important;' +
          'visibility:hidden!important;' +
          'height:0!important;' +
          'max-height:0!important;' +
          'width:1px!important;' +
          'overflow:hidden!important;' +
          'margin:0!important;' +
          'padding:0!important;' +
          'border:0!important;' +
          'position:absolute!important;' +
          'left:-10000px!important;' +
          'pointer-events:none!important;' +
          'background:transparent!important;' +
        '}' +
        'html.ce-yg-plp-filters .category-filters{' +
          'float:none!important;' +
          'width:100%!important;' +
          'background:transparent!important;' +
        '}' +
        'html.ce-yg-plp-filters .category-filters.ce-ff-filters--relocated{' +
          'display:block!important;' +
          'visibility:hidden!important;' +
          'height:0!important;' +
          'max-height:0!important;' +
          'margin:0!important;' +
          'padding:0!important;' +
          'border:0!important;' +
          'overflow:hidden!important;' +
          'pointer-events:none!important;' +
        '}' +
        'html.ce-yg-plp-filters .category-cross-linking-wrapper{' +
          'display:flex!important;' +
          'flex-direction:row!important;' +
          'flex-wrap:nowrap!important;' +
          'align-items:center!important;' +
          'gap:0!important;' +
          'width:100%!important;' +
          'max-width:100%!important;' +
          'float:none!important;' +
          'box-sizing:border-box!important;' +
        '}' +
        'html.ce-yg-plp-filters .category-cross-linking-wrapper > .ce-ff-open,' +
        'html.ce-yg-plp-filters .category-cross-linking-wrapper > #mobile-filter-open{' +
          'flex:0 0 auto!important;' +
          'flex-shrink:0!important;' +
          'position:sticky!important;' +
          'left:0!important;' +
          'z-index:2!important;' +
          'margin:0 20px 0 0!important;' +
          'float:none!important;' +
          'display:inline-flex!important;' +
          'align-self:center!important;' +
          'width:max-content!important;' +
          'min-width:max-content!important;' +
          'max-width:none!important;' +
          'white-space:nowrap!important;' +
          'overflow:visible!important;' +
        '}' +
        '@media (min-width:768px) and (max-width:1199px){' +
          'html.ce-yg-plp-filters .top-section{' +
            'float:none!important;' +
            'width:100%!important;' +
            'max-width:100%!important;' +
            'clear:both!important;' +
            'text-align:left!important;' +
          '}' +
          'html.ce-yg-plp-filters .category-cross-linking-wrapper{' +
            'display:flex!important;' +
            'flex-direction:row!important;' +
            'flex-wrap:nowrap!important;' +
            'align-items:center!important;' +
            'justify-content:flex-start!important;' +
            'gap:0!important;' +
            'width:100%!important;' +
            'max-width:100%!important;' +
            'float:none!important;' +
          '}' +
          'html.ce-yg-plp-filters .category-cross-linking-wrapper > .ce-ff-open,' +
          'html.ce-yg-plp-filters .category-cross-linking-wrapper > #mobile-filter-open{' +
            'position:relative!important;' +
            'left:auto!important;' +
            'flex:0 0 auto!important;' +
            'margin:0 20px 0 0!important;' +
            'z-index:2!important;' +
          '}' +
          'html.ce-yg-plp-filters .category-cross-linking-wrapper > ul{' +
            'flex:1 1 auto!important;' +
            'min-width:0!important;' +
            'width:auto!important;' +
            'max-width:100%!important;' +
            'overflow-x:auto!important;' +
            'overflow-y:hidden!important;' +
            'justify-content:flex-start!important;' +
          '}' +
          'html.ce-yg-plp-filters .category-cross-linking-wrapper > ul > li{' +
            'padding:0 16px 0 0!important;' +
          '}' +
          'html.ce-yg-plp-filters .category-cross-linking-wrapper > ul > li:last-child{' +
            'padding-right:0!important;' +
          '}' +
        '}' +
        '@media (min-width:1200px){' +
          'html.ce-yg-plp-filters .top-section{' +
            'float:none!important;' +
            'width:100%!important;' +
            'max-width:100%!important;' +
            'clear:both!important;' +
            'text-align:left!important;' +
          '}' +
          'html.ce-yg-plp-filters .category-cross-linking-wrapper{' +
            'display:flex!important;' +
            'flex-direction:row!important;' +
            'flex-wrap:nowrap!important;' +
            'align-items:center!important;' +
            'justify-content:flex-start!important;' +
            'gap:0!important;' +
            'width:100%!important;' +
            'max-width:100%!important;' +
            'float:none!important;' +
            'margin-left:0!important;' +
            'margin-right:0!important;' +
          '}' +
          'html.ce-yg-plp-filters .category-cross-linking-wrapper > .ce-ff-open,' +
          'html.ce-yg-plp-filters .category-cross-linking-wrapper > #mobile-filter-open{' +
            'margin:0 28px 0 0!important;' +
            'position:relative!important;' +
            'left:auto!important;' +
            'z-index:2!important;' +
            'flex:0 0 auto!important;' +
            'width:max-content!important;' +
            'min-width:max-content!important;' +
            'max-width:none!important;' +
            'white-space:nowrap!important;' +
          '}' +
          'html.ce-yg-plp-filters .category-cross-linking-wrapper > ul{' +
            'flex:1 1 auto!important;' +
            'min-width:0!important;' +
            'width:auto!important;' +
            'max-width:100%!important;' +
            'overflow-x:auto!important;' +
            'justify-content:flex-start!important;' +
          '}' +
          'html.ce-yg-plp-filters .category-cross-linking-wrapper > ul > li{' +
            'padding:0 16px 0 0!important;' +
          '}' +
          'html.ce-yg-plp-filters .category-cross-linking-wrapper > ul > li:last-child{' +
            'padding-right:0!important;' +
          '}' +
        '}' +
        'html.ce-yg-plp-filters .category-cross-linking-wrapper > ul{' +
          'flex:1 1 auto!important;' +
          'min-width:0!important;' +
          'width:auto!important;' +
          'max-width:100%!important;' +
          'float:none!important;' +
          'display:flex!important;' +
          'align-items:center!important;' +
          'overflow-x:auto!important;' +
          'overflow-y:hidden!important;' +
          'white-space:nowrap!important;' +
          'margin:0!important;' +
          'padding:0!important;' +
          'line-height:1.25!important;' +
        '}' +
        'html.ce-yg-plp-filters .category-cross-linking-wrapper > ul > li{' +
          'display:inline-flex!important;' +
          'align-items:center!important;' +
          'margin:0!important;' +
          'padding:0 26px 0 0!important;' +
          'vertical-align:middle!important;' +
        '}' +
        'html.ce-yg-plp-filters .category-cross-linking-wrapper > ul > li > a{' +
          'display:inline-flex!important;' +
          'align-items:center!important;' +
          'line-height:1.25!important;' +
        '}' +
        '@media (max-width:767px){' +
          'html.ce-yg-plp-filters .category-cross-linking-wrapper{' +
            'flex-direction:column!important;' +
            'align-items:stretch!important;' +
            'gap:18px!important;' +
          '}' +
          'html.ce-yg-plp-filters .category-cross-linking-wrapper > .ce-ff-open,' +
          'html.ce-yg-plp-filters .category-cross-linking-wrapper > #mobile-filter-open{' +
            'position:relative!important;' +
            'left:auto!important;' +
            'align-self:center!important;' +
            'margin:0 auto 6px!important;' +
          '}' +
          'html.ce-yg-plp-filters .category-cross-linking-wrapper > ul{' +
            'flex:0 0 auto!important;' +
            'width:100%!important;' +
            'max-width:100%!important;' +
          '}' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-head{' +
          'display:flex!important;' +
          'flex-direction:row!important;' +
          'align-items:center!important;' +
          'justify-content:space-between!important;' +
          'padding:calc(12px + env(safe-area-inset-top,0px)) 16px 12px!important;' +
          'box-sizing:border-box!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-title{' +
          'margin:0!important;' +
          'padding:0!important;' +
          'line-height:40px!important;' +
          'height:40px!important;' +
          'display:flex!important;' +
          'align-items:center!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-close{' +
          'width:40px!important;' +
          'height:40px!important;' +
          'display:inline-flex!important;' +
          'align-items:center!important;' +
          'justify-content:center!important;' +
          'margin:0!important;' +
          'padding:0!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-shell{' +
          'display:none!important;' +
          'position:fixed!important;' +
          'top:0!important;right:0!important;bottom:0!important;left:0!important;' +
          'width:auto!important;' +
          'height:auto!important;' +
          'max-height:none!important;' +
          'z-index:2147483000!important;' +
          'pointer-events:none!important;' +
          'background:transparent!important;' +
          'overflow:hidden!important;' +
          'box-sizing:border-box!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-shell.ce-ff-shell--vvh{' +
          'bottom:auto!important;' +
          'height:var(--ce-ff-vvh,100dvh)!important;' +
          'max-height:var(--ce-ff-vvh,100dvh)!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-shell.is-mounted{' +
          'display:block!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-shell.is-open{' +
          'pointer-events:auto!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-backdrop{' +
          'position:absolute!important;' +
          'top:0!important;right:0!important;bottom:0!important;left:0!important;' +
          'z-index:0!important;' +
          'background:rgba(0,0,0,.32)!important;' +
          'opacity:0;' +
          'transition:opacity .28s ease;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-shell.is-open .ce-ff-backdrop{opacity:1;}' +
        'html.ce-yg-plp-filters .ce-ff-panel{' +
          'position:absolute!important;' +
          'top:0!important;bottom:0!important;' +
          'left:0!important;' +
          'z-index:1!important;' +
          'width:min(100%,380px)!important;' +
          'max-width:100%!important;' +
          'height:auto!important;' +
          'max-height:none!important;' +
          'display:flex!important;' +
          'flex-direction:column!important;' +
          'background:#f2e7d8!important;' +
          'box-shadow:4px 0 28px rgba(0,0,0,.18)!important;' +
          'transform:translate3d(-105%,0,0)!important;' +
          'transition:transform .3s cubic-bezier(.22,1,.36,1)!important;' +
          'overflow:hidden!important;' +
          'box-sizing:border-box!important;' +
          'padding-bottom:0!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-shell.is-open .ce-ff-panel{' +
          'transform:translate3d(0,0,0)!important;' +
        '}' +
        '@media (max-width:767px){' +
          'html.ce-yg-plp-filters .ce-ff-panel{width:100%!important;max-width:100%!important;}' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-body{' +
          'flex:1 1 auto!important;' +
          'min-height:0!important;' +
          'overflow-y:auto!important;' +
          'padding:18px!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-actions{' +
          'position:relative!important;' +
          'left:auto!important;right:auto!important;' +
          'bottom:auto!important;top:auto!important;' +
          'flex:0 0 auto!important;' +
          'width:100%!important;' +
          'max-width:none!important;' +
          'display:grid!important;' +
          'grid-template-columns:1fr 1fr!important;' +
          'gap:10px!important;' +
          'padding:14px 18px calc(14px + env(safe-area-inset-bottom,0px))!important;' +
          'background:#fff!important;' +
          'border-top:1px solid #e0d6cb!important;' +
          'z-index:6!important;' +
          'min-height:72px!important;' +
          'box-sizing:border-box!important;' +
          'transform:none!important;' +
          'pointer-events:auto!important;' +
          'visibility:visible!important;' +
          'opacity:1!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-shell.is-open .ce-ff-actions{' +
          'pointer-events:auto!important;' +
          'opacity:1!important;' +
          'visibility:visible!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-select{' +
          'background:#fff!important;' +
          'background-color:#fff!important;' +
          'color:#483f3a!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-select-native{' +
          'position:absolute!important;' +
          'left:0!important;' +
          'top:0!important;' +
          'width:1px!important;' +
          'height:1px!important;' +
          'margin:0!important;' +
          'padding:0!important;' +
          'border:0!important;' +
          'opacity:0!important;' +
          'overflow:hidden!important;' +
          'pointer-events:none!important;' +
          'clip:rect(0,0,0,0)!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-menu{' +
          'display:none!important;' +
          'position:fixed!important;' +
          'z-index:2147483002!important;' +
          /* max-height set inline by positionMenu (visualViewport-aware) */
          'max-height:min(280px,45dvh);' +
          'overflow:auto!important;' +
          '-webkit-overflow-scrolling:touch;' +
          'overscroll-behavior:contain;' +
          'touch-action:pan-y;' +
          'background:#fff!important;' +
          'background-color:#fff!important;' +
          'color:#483f3a!important;' +
          'border:1px solid #e0d6cb!important;' +
          'border-radius:8px!important;' +
          'box-shadow:0 8px 24px rgba(72,63,58,.16)!important;' +
          'padding:4px!important;' +
          'margin:0!important;' +
          'list-style:none!important;' +
          'color-scheme:light!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-menu.is-open{display:block!important;}' +
        'html.ce-yg-plp-filters .ce-ff-menu__opt{' +
          'display:block!important;' +
          'width:100%!important;' +
          'margin:0!important;' +
          'padding:11px 12px!important;' +
          'border:0!important;' +
          'border-radius:6px!important;' +
          'background:#fff!important;' +
          'color:#483f3a!important;' +
          'font-size:14px!important;' +
          'font-weight:500!important;' +
          'text-align:left!important;' +
          'cursor:pointer!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-menu__opt:hover,' +
        'html.ce-yg-plp-filters .ce-ff-menu__opt:focus{' +
          'background:#f2e7d8!important;' +
          'color:#483f3a!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-menu__opt.is-selected{' +
          'background:#e4edd8!important;' +
          'color:#264f1c!important;' +
          'font-weight:700!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-menu__opt.is-unavailable,' +
        'html.ce-yg-plp-filters .ce-ff-menu__opt:disabled{' +
          'color:#a39a93!important;' +
          'background:#f7f4f0!important;' +
          'cursor:not-allowed!important;' +
          'opacity:.72!important;' +
          'pointer-events:none!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-menu__opt.is-unavailable:hover,' +
        'html.ce-yg-plp-filters .ce-ff-menu__opt.is-unavailable:focus,' +
        'html.ce-yg-plp-filters .ce-ff-menu__opt:disabled:hover,' +
        'html.ce-yg-plp-filters .ce-ff-menu__opt:disabled:focus{' +
          'background:#f7f4f0!important;' +
          'color:#a39a93!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-empty-results{' +
          'display:block!important;' +
          'width:100%!important;' +
          'box-sizing:border-box!important;' +
          'margin:24px 0 40px!important;' +
          'padding:28px 24px!important;' +
          'text-align:center!important;' +
          'background:#f7f4f0!important;' +
          'border:1px solid #e0d6cb!important;' +
          'border-radius:8px!important;' +
          'color:#483f3a!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-empty-results__title{' +
          'margin:0 0 8px!important;' +
          'font-family:Georgia,"Times New Roman",Times,serif!important;' +
          'font-size:22px!important;' +
          'font-weight:700!important;' +
          'color:#264f1c!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-empty-results__text{' +
          'margin:0 0 16px!important;' +
          'font-size:15px!important;' +
          'line-height:1.4!important;' +
        '}' +
        'html.ce-yg-plp-filters .ce-ff-empty-results__reset{' +
          'appearance:none!important;' +
          'display:inline-flex!important;' +
          'align-items:center!important;' +
          'justify-content:center!important;' +
          'margin:0!important;' +
          'padding:10px 18px!important;' +
          'border:2px solid #264f1c!important;' +
          'border-radius:6px!important;' +
          'background:#fff!important;' +
          'color:#264f1c!important;' +
          'font-size:14px!important;' +
          'font-weight:700!important;' +
          'cursor:pointer!important;' +
        '}' +
        'html.ce-yg-plp-filters body.ce-ff-drawer-open{' +
          'overflow:hidden!important;' +
        '}';
  
      var style = document.createElement('style');
      style.id = STYLE_ID;
      style.type = 'text/css';
      style.appendChild(document.createTextNode(css));
      (document.head || document.documentElement).appendChild(style);
    }
  
    function boot() {
      var categoryFilters = document.querySelector('.category-filters');
      var filterForm = document.getElementById('filterForm');
      if (!categoryFilters || !filterForm) return;
  
      document.documentElement.setAttribute(INIT_MARK, '1');
      document.documentElement.classList.add(ROOT_CLASS);
      injectCriticalCss();
  
      /* -- helpers -- */
  
      function textOf(el) {
        return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
      }
  
      function parseFilterValFromOnclick(onclick) {
        if (!onclick) return '';
        var m = String(onclick).match(/\.val\(\s*['"]([^'"]+)['"]\s*\)/);
        return m ? m[1] : '';
      }
  
      /* Magento marks the active option as CODE_RMV (click = remove). Strip for matching. */
      function normalizeFilterVal(val) {
        if (!val) return '';
        return String(val).replace(/_RMV$/i, '');
      }
  
      function labelTitle(label) {
        var clone = label.cloneNode(true);
        var inputs = clone.querySelectorAll('input, .checkmark, .count');
        for (var i = 0; i < inputs.length; i++) {
          if (inputs[i].parentNode) inputs[i].parentNode.removeChild(inputs[i]);
        }
        return textOf(clone);
      }
  
      function optionLabel(label) {
        var title = labelTitle(label);
        /* Active filters append a trailing "X" remove glyph in the label text */
        title = title.replace(/\s*X\s*$/i, '').trim();
        var countEl = label.querySelector('.count');
        var countText = countEl ? textOf(countEl).replace(/[()]/g, '') : '';
        countText = countText.replace(/\s*X\s*$/i, '').trim();
        if (countText && title.indexOf('(') === -1) {
          return title + ' (' + countText + ')';
        }
        /* Also strip a trailing (nX) pattern left in the title */
        title = title.replace(/\((\d+)\s*X\)/i, '($1)');
        return title || 'Option';
      }
  
      function headLabel(head) {
        var clone = head.cloneNode(true);
        var icons = clone.querySelectorAll('.filter-drop-icon, svg, i');
        for (var i = 0; i < icons.length; i++) {
          if (icons[i].parentNode) icons[i].parentNode.removeChild(icons[i]);
        }
        return textOf(clone) || 'Filter';
      }
  
      function closest(el, sel) {
        if (!el) return null;
        if (el.closest) return el.closest(sel);
        while (el && el.nodeType === 1) {
          if (el.matches && el.matches(sel)) return el;
          el = el.parentElement;
        }
        return null;
      }
  
      /* -- parse live filter groups -- */
  
      /*
       * Magento removes whole filter wrappers (and their hidden inputs) after
       * Apply — e.g. Colour=Black leaves only Colour in #filterForm.
       *
       * We snapshot the FULL catalog (every filter group + every option +
       * Magento hidden input ids) the first time we see a rich PLP, store it
       * in localStorage, and ALWAYS rebuild the drawer from that catalog.
       * Missing Magento hiddens are re-created so Apply still POSTs.
       */
      function catalogKey() {
        return 'ce-ff-baseline-catalog:' + location.pathname;
      }
  
      function storageRead(key) {
        var raw = null;
        try {
          raw = localStorage.getItem(key);
        } catch (errL) { /* ignore */ }
        if (!raw) {
          try {
            raw = sessionStorage.getItem(key);
          } catch (errS) { /* ignore */ }
        }
        return raw;
      }
  
      function storageWrite(key, val) {
        try {
          localStorage.setItem(key, val);
        } catch (errL2) { /* ignore */ }
        try {
          sessionStorage.setItem(key, val);
        } catch (errS2) { /* ignore */ }
      }
  
      function emptyCatalog() {
        return { order: [], groups: {} };
      }
  
      function readCatalog() {
        try {
          var raw = storageRead(catalogKey());
          if (!raw) return emptyCatalog();
          var parsed = JSON.parse(raw);
          if (!parsed || typeof parsed !== 'object') return emptyCatalog();
          if (!Array.isArray(parsed.order)) parsed.order = [];
          if (!parsed.groups || typeof parsed.groups !== 'object') parsed.groups = {};
          return parsed;
        } catch (errCat) {
          return emptyCatalog();
        }
      }
  
      function writeCatalog(catalog) {
        storageWrite(catalogKey(), JSON.stringify(catalog || emptyCatalog()));
      }
  
      function slimOptions(options) {
        var slim = [];
        for (var i = 0; i < options.length; i++) {
          if (!options[i] || !options[i].value) continue;
          slim.push({
            value: options[i].value,
            label: options[i].label || options[i].value,
            removeValue: options[i].removeValue || options[i].value + '_RMV'
          });
        }
        return slim;
      }
  
      function mergeFilterOptions(liveOptions, baselineOptions) {
        var byVal = {};
        var order = [];
        var c;
        var L;
        var baseline = baselineOptions || [];
        var live = liveOptions || [];
  
        for (c = 0; c < baseline.length; c++) {
          var cv = baseline[c];
          if (!cv || !cv.value || byVal[cv.value]) continue;
          byVal[cv.value] = {
            value: cv.value,
            label: cv.label || cv.value,
            input: null,
            removeValue: cv.removeValue || cv.value + '_RMV',
            available: cv.available
          };
          order.push(cv.value);
        }
  
        for (L = 0; L < live.length; L++) {
          var lo = live[L];
          if (!lo || !lo.value) continue;
          if (byVal[lo.value]) {
            byVal[lo.value].label = lo.label || byVal[lo.value].label;
            byVal[lo.value].input = lo.input;
            byVal[lo.value].removeValue =
              lo.removeValue || byVal[lo.value].removeValue;
            if (typeof lo.available !== 'undefined') {
              byVal[lo.value].available = lo.available;
            }
          } else {
            byVal[lo.value] = lo;
            order.push(lo.value);
          }
        }
  
        var merged = [];
        for (c = 0; c < order.length; c++) {
          merged.push(byVal[order[c]]);
        }
        return merged;
      }
  
      /** Map of option values Magento currently offers for a facet. */
      function liveValueMap(liveOptions) {
        var map = {};
        var i;
        for (i = 0; i < (liveOptions || []).length; i++) {
          if (liveOptions[i] && liveOptions[i].value) {
            map[liveOptions[i].value] = true;
          }
        }
        return map;
      }
  
      /**
       * Catalog keeps historical options so labels/ids survive Magento narrowing.
       * Selectable options must follow live Magento availability (like Control):
       * anything not in the current #filterForm facet is greyed out.
       * If Magento dropped the whole facet, every catalog option is unavailable
       * (user can still clear via Any / Reset — no guessed combos).
       */
      function annotateOptionAvailability(options, liveOpts, selectedValue, liveGroupPresent) {
        var liveVals = liveValueMap(liveOpts);
        var out = [];
        var i;
        for (i = 0; i < (options || []).length; i++) {
          var opt = options[i];
          if (!opt || !opt.value) continue;
          var available;
          if (!liveGroupPresent) {
            available = false;
          } else {
            available =
              !!liveVals[opt.value] ||
              opt.value === selectedValue;
          }
          out.push({
            value: opt.value,
            label: opt.label || opt.value,
            input: opt.input || null,
            removeValue: opt.removeValue || opt.value + '_RMV',
            available: available
          });
        }
        return out;
      }
  
      function readBaselineOptions(groupId) {
        var cat = readCatalog();
        var g = cat.groups && cat.groups[groupId];
        return g && Array.isArray(g.options) ? g.options : [];
      }
  
      function stableGroupId(hiddenFilter, head, index) {
        if (hiddenFilter && hiddenFilter.id) {
          return String(hiddenFilter.id)
            .replace(/-Filter$/i, '')
            .replace(/\s+/g, '');
        }
        if (hiddenFilter && hiddenFilter.name) {
          return String(hiddenFilter.name)
            .replace(/-Filter$/i, '')
            .replace(/\s+/g, '');
        }
        var label = head ? headLabel(head) : '';
        if (label) {
          return (
            'lbl-' +
            label
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '')
          );
        }
        return 'filter-' + index;
      }
  
      /** Recreate Magento *-Filter / *-Changed hiddens Magento dropped after Apply. */
      function ensureMagentoFilterInputs(group) {
        if (!group) return;
        var form = document.getElementById('filterForm') || filterForm;
        if (!form) return;
  
        var filterId = group.filterId || group.id + '-Filter';
        var changedId = group.changedId || filterId + '-Changed';
        var filterName = group.filterName || filterId;
        var changedName = group.changedName || changedId;
  
        var filterEl = document.getElementById(filterId);
        var changedEl = document.getElementById(changedId);
  
        if (!filterEl) {
          filterEl = document.createElement('input');
          filterEl.type = 'hidden';
          filterEl.id = filterId;
          filterEl.name = filterName;
          filterEl.value = '';
          filterEl.setAttribute('data-ce-ff-synth', '1');
          form.appendChild(filterEl);
        }
        if (!changedEl) {
          changedEl = document.createElement('input');
          changedEl.type = 'hidden';
          changedEl.id = changedId;
          changedEl.name = changedName;
          changedEl.value = '';
          changedEl.setAttribute('data-ce-ff-synth', '1');
          form.appendChild(changedEl);
        }
  
        group.filterId = filterId;
        group.filterName = filterName;
        group.changedId = changedId;
        group.changedName = changedName;
        group.hiddenFilter = filterEl;
        group.hiddenChanged = changedEl;
      }
  
      /**
       * Grow-only catalog update from live Magento wrappers.
       * Never drops groups or shrinks option lists.
       */
      function upsertCatalogFromLive(liveGroups) {
        var cat = readCatalog();
        var i;
        for (i = 0; i < liveGroups.length; i++) {
          var live = liveGroups[i];
          if (!live || !live.id) continue;
          var existing = cat.groups[live.id];
          var liveOpts = slimOptions(live.options || []);
  
          if (!existing) {
            cat.order.push(live.id);
            cat.groups[live.id] = {
              id: live.id,
              label: live.label || live.id,
              filterId: live.filterId || live.id + '-Filter',
              filterName: live.filterName || live.filterId || live.id + '-Filter',
              changedId: live.changedId || (live.filterId || live.id + '-Filter') + '-Changed',
              changedName:
                live.changedName ||
                live.changedId ||
                (live.filterId || live.id + '-Filter') + '-Changed',
              options: liveOpts
            };
            continue;
          }
  
          if (live.label) existing.label = live.label;
          if (live.filterId) existing.filterId = live.filterId;
          if (live.filterName) existing.filterName = live.filterName;
          if (live.changedId) existing.changedId = live.changedId;
          if (live.changedName) existing.changedName = live.changedName;
  
          var merged = mergeFilterOptions(liveOpts, existing.options || []);
          /* Never shrink */
          if (
            Array.isArray(existing.options) &&
            existing.options.length > merged.length
          ) {
            merged = mergeFilterOptions(merged, existing.options);
          }
          existing.options = slimOptions(merged);
          cat.groups[live.id] = existing;
        }
        writeCatalog(cat);
        return cat;
      }
  
      function persistShellOptions(shell) {
        if (!shell) return;
        var cat = readCatalog();
        var selects = shell.querySelectorAll('select[data-ce-ff-select]');
        var i;
        for (i = 0; i < selects.length; i++) {
          var sel = selects[i];
          if (sel.getAttribute('data-ce-ff-sort') === '1') continue;
          var gid = sel.getAttribute('data-ce-ff-select');
          if (!gid) continue;
          var opts = [];
          var o;
          for (o = 0; o < sel.options.length; o++) {
            var opt = sel.options[o];
            if (!opt || !opt.value) continue;
            opts.push({
              value: opt.value,
              label: (opt.textContent || opt.value).replace(/\s+/g, ' ').trim(),
              removeValue: opt.value + '_RMV'
            });
          }
          if (!opts.length) continue;
          if (!cat.groups[gid]) {
            cat.order.push(gid);
            var labEl = shell.querySelector(
              '.ce-ff-field[data-ce-ff-group="' + gid + '"] .ce-ff-label'
            );
            cat.groups[gid] = {
              id: gid,
              label: (labEl && labEl.textContent) || gid,
              filterId: gid + '-Filter',
              filterName: gid + '-Filter',
              changedId: gid + '-Filter-Changed',
              changedName: gid + '-Filter-Changed',
              options: slimOptions(opts)
            };
          } else {
            var merged = mergeFilterOptions(opts, cat.groups[gid].options || []);
            if (
              cat.groups[gid].options &&
              cat.groups[gid].options.length > merged.length
            ) {
              merged = mergeFilterOptions(merged, cat.groups[gid].options);
            }
            cat.groups[gid].options = slimOptions(merged);
          }
        }
        writeCatalog(cat);
      }
  
      function hydrateShellFromBaseline(shell) {
        if (!shell) return;
        var cat = readCatalog();
        var selects = shell.querySelectorAll('select[data-ce-ff-select]');
        var i;
        for (i = 0; i < selects.length; i++) {
          var sel = selects[i];
          if (sel.getAttribute('data-ce-ff-sort') === '1') continue;
          var gid = sel.getAttribute('data-ce-ff-select');
          if (!gid || !cat.groups[gid]) continue;
          var baseline = cat.groups[gid].options || [];
          if (!baseline.length) continue;
  
          /* Values Magento (or prior annotate) already put on the native select */
          var liveVals = {};
          var liveCount = 0;
          var o;
          for (o = 0; o < sel.options.length; o++) {
            if (sel.options[o].value) {
              liveVals[sel.options[o].value] = true;
              liveCount += 1;
            }
          }
          if (liveCount >= baseline.length) continue;
  
          var wrap = sel.parentNode;
          var trigger =
            wrap && wrap.querySelector('.ce-ff-select[data-ce-ff-trigger="' + gid + '"]');
          var menu =
            (wrap && wrap.querySelector('.ce-ff-menu[data-ce-ff-menu="' + gid + '"]')) ||
            shell.querySelector('.ce-ff-menu[data-ce-ff-menu="' + gid + '"]');
          var selected =
            (trigger && trigger.getAttribute('data-ce-ff-value')) || sel.value || '';
  
          while (sel.firstChild) sel.removeChild(sel.firstChild);
          var anyOpt = document.createElement('option');
          anyOpt.value = '';
          anyOpt.textContent = 'Any';
          sel.appendChild(anyOpt);
  
          var selectedLabel = 'Any';
          for (o = 0; o < baseline.length; o++) {
            var opt = document.createElement('option');
            opt.value = baseline[o].value;
            opt.textContent = baseline[o].label;
            /* Catalog-only extras are not Magento-available — keep them disabled */
            if (!liveVals[baseline[o].value] && baseline[o].value !== selected) {
              opt.disabled = true;
              opt.setAttribute('data-ce-ff-unavailable', '1');
            }
            if (baseline[o].value === selected) {
              opt.selected = true;
              selectedLabel = baseline[o].label;
            }
            sel.appendChild(opt);
          }
          if (selected) sel.value = selected;
  
          if (trigger) {
            trigger.setAttribute('data-ce-ff-value', selected);
            var valueSpan = trigger.querySelector('.ce-ff-select__value');
            if (valueSpan) valueSpan.textContent = selectedLabel;
          }
  
          if (menu) {
            while (menu.firstChild) menu.removeChild(menu.firstChild);
            function addHydratedOpt(val, label, isSel, available) {
              var li = document.createElement('li');
              li.setAttribute('role', 'presentation');
              var btn = document.createElement('button');
              btn.type = 'button';
              var isAvail = available !== false;
              btn.className =
                'ce-ff-menu__opt' +
                (isSel ? ' is-selected' : '') +
                (!isAvail ? ' is-unavailable' : '');
              btn.setAttribute('role', 'option');
              btn.setAttribute('data-value', val);
              btn.setAttribute('aria-selected', isSel ? 'true' : 'false');
              if (!isAvail) {
                btn.disabled = true;
                btn.setAttribute('aria-disabled', 'true');
              }
              btn.textContent = label;
              li.appendChild(btn);
              menu.appendChild(li);
            }
            addHydratedOpt('', 'Any', !selected, true);
            for (o = 0; o < baseline.length; o++) {
              var canPick =
                !!liveVals[baseline[o].value] || baseline[o].value === selected;
              addHydratedOpt(
                baseline[o].value,
                baseline[o].label,
                baseline[o].value === selected,
                canPick
              );
            }
          }
        }
      }
  
      function parseLiveFilterGroups() {
        var live = [];
        var wrappers = filterForm.querySelectorAll('.filter-wrapper');
        var i;
  
        for (i = 0; i < wrappers.length; i++) {
          var wrap = wrappers[i];
          if (wrap.querySelector('.clear-filters') || wrap.classList.contains('clear-filters')) {
            continue;
          }
  
          var head = wrap.querySelector('.filterHead');
          var block = wrap.querySelector('.filterBlock');
          if (!head || !block) continue;
  
          var labels = block.querySelectorAll('label.checkbox-container');
          if (!labels.length) continue;
  
          var options = [];
          var selectedValue = '';
          var hiddenFilter = null;
          var hiddenChanged = null;
  
          var hiddens = block.querySelectorAll('input[type="hidden"]');
          var h;
          for (h = 0; h < hiddens.length; h++) {
            var hid = hiddens[h];
            var id = hid.id || '';
            if (/Changed$/i.test(id) || /Changed$/i.test(hid.name || '')) {
              hiddenChanged = hid;
            } else if (/-Filter$/i.test(id) || /-Filter$/i.test(hid.name || '')) {
              hiddenFilter = hid;
            }
          }
  
          var groupId = stableGroupId(hiddenFilter, head, i);
          var j;
          for (j = 0; j < labels.length; j++) {
            var lab = labels[j];
            var input = lab.querySelector('input[type="checkbox"], input[type="radio"]');
            if (!input) continue;
  
            var rawVal =
              parseFilterValFromOnclick(input.getAttribute('onclick')) ||
              input.value ||
              input.name ||
              '';
            var val = normalizeFilterVal(rawVal);
            if (!val) continue;
  
            options.push({
              value: val,
              label: optionLabel(lab),
              input: input,
              removeValue: /_RMV$/i.test(rawVal) ? rawVal : val + '_RMV'
            });
  
            if (input.checked || /_RMV$/i.test(rawVal)) selectedValue = val;
          }
  
          if (hiddenFilter && hiddenFilter.value) {
            selectedValue = normalizeFilterVal(hiddenFilter.value);
          }
  
          if (selectedValue) {
            var hasSelected = false;
            var s;
            for (s = 0; s < options.length; s++) {
              if (options[s].value === selectedValue) {
                hasSelected = true;
                break;
              }
            }
            if (!hasSelected) {
              options.unshift({
                value: selectedValue,
                label: selectedValue,
                input: null,
                removeValue: selectedValue + '_RMV'
              });
            }
          }
  
          if (!options.length) continue;
  
          live.push({
            id: groupId,
            label: headLabel(head),
            options: options,
            selectedValue: selectedValue,
            filterId: hiddenFilter ? hiddenFilter.id : groupId + '-Filter',
            filterName: hiddenFilter ? hiddenFilter.name || hiddenFilter.id : groupId + '-Filter',
            changedId: hiddenChanged
              ? hiddenChanged.id
              : (hiddenFilter ? hiddenFilter.id : groupId + '-Filter') + '-Changed',
            changedName: hiddenChanged
              ? hiddenChanged.name || hiddenChanged.id
              : (hiddenFilter ? hiddenFilter.id : groupId + '-Filter') + '-Changed',
            hiddenFilter: hiddenFilter,
            hiddenChanged: hiddenChanged,
            block: block
          });
        }
  
        return live;
      }
  
      function collectFilterGroups() {
        var live = parseLiveFilterGroups();
        upsertCatalogFromLive(live);
  
        var cat = readCatalog();
        var liveById = {};
        var i;
        for (i = 0; i < live.length; i++) {
          liveById[live[i].id] = live[i];
        }
  
        /* First visit with no catalog yet — use live only (all available) */
        if (!cat.order.length) {
          for (i = 0; i < live.length; i++) {
            ensureMagentoFilterInputs(live[i]);
            if (live[i].options) {
              var fi;
              for (fi = 0; fi < live[i].options.length; fi++) {
                live[i].options[fi].available = true;
              }
            }
          }
          return live;
        }
  
        var groups = [];
        for (i = 0; i < cat.order.length; i++) {
          var id = cat.order[i];
          var base = cat.groups[id];
          if (!base) continue;
          var lv = liveById[id];
  
          var liveOpts = (lv && lv.options) || [];
          var options = mergeFilterOptions(liveOpts, base.options || []);
          /* Keep catalog labels/order; availability comes from live Magento */
          if ((base.options || []).length > options.length) {
            options = mergeFilterOptions(options, base.options);
          }
  
          var selectedValue = '';
          if (lv && lv.selectedValue) selectedValue = lv.selectedValue;
  
          var group = {
            id: id,
            label: (lv && lv.label) || base.label || id,
            options: options,
            selectedValue: selectedValue,
            filterId: base.filterId || id + '-Filter',
            filterName: base.filterName || base.filterId || id + '-Filter',
            changedId: base.changedId || (base.filterId || id + '-Filter') + '-Changed',
            changedName:
              base.changedName ||
              base.changedId ||
              (base.filterId || id + '-Filter') + '-Changed',
            hiddenFilter: lv ? lv.hiddenFilter : null,
            hiddenChanged: lv ? lv.hiddenChanged : null,
            block: lv ? lv.block : null
          };
  
          ensureMagentoFilterInputs(group);
  
          if (group.hiddenFilter && group.hiddenFilter.value) {
            group.selectedValue = normalizeFilterVal(group.hiddenFilter.value);
          }
  
          group.options = annotateOptionAvailability(
            group.options,
            liveOpts,
            group.selectedValue,
            !!lv
          );
  
          groups.push(group);
        }
  
        /* Any brand-new live groups not yet in catalog (shouldn't happen often) */
        for (i = 0; i < live.length; i++) {
          if (cat.groups[live[i].id]) continue;
          ensureMagentoFilterInputs(live[i]);
          groups.push(live[i]);
        }
  
        return groups;
      }
  
      function collectSortOptions() {
        var sortForm = document.getElementById('sort-form');
        var orderInput = document.getElementById('Order');
        var options = [];
        var checkedVal = '';
  
        if (!sortForm) {
          return {
            options: options,
            selected: (orderInput && orderInput.value) || 'POP',
            orderInput: orderInput,
            sortForm: null
          };
        }
  
        var labels = sortForm.querySelectorAll('label.checkbox-container');
        for (var i = 0; i < labels.length; i++) {
          var lab = labels[i];
          var input = lab.querySelector('input[type="checkbox"], input[type="radio"]');
          if (!input) continue;
          var val =
            input.id ||
            parseFilterValFromOnclick(input.getAttribute('onclick')) ||
            input.name ||
            '';
          if (!val) continue;
          options.push({
            value: val,
            label: labelTitle(lab) || val,
            input: input
          });
          if (input.checked) checkedVal = val;
        }
  
        /*
         * Magento often leaves #Order at "POP" even when another sort checkbox is
         * checked after reload — prefer the checked input for drawer state.
         */
        var selected = checkedVal || (orderInput && orderInput.value) || 'POP';
  
        return {
          options: options,
          selected: selected,
          orderInput: orderInput,
          sortForm: sortForm
        };
      }
  
      /* -- build UI -- */
  
      function buildSelectField(group, isSort) {
        var field = document.createElement('div');
        field.className = 'ce-ff-field' + (isSort ? ' ce-ff-field--sort' : '');
        field.setAttribute('data-ce-ff-group', group.id);
  
        var lab = document.createElement('span');
        lab.className = 'ce-ff-label';
        lab.textContent = group.label;
        field.appendChild(lab);
  
        var wrap = document.createElement('span');
        wrap.className = 'ce-ff-select-wrap';
  
        var selectedValue = group.selectedValue || '';
        var selectedLabel = isSort ? '' : 'Any';
        if (!isSort && !selectedValue) selectedLabel = 'Any';
  
        /* Value holder — clipped, NOT display:none (iOS drops .value on display:none selects) */
        var select = document.createElement('select');
        select.className = 'ce-ff-select-native';
        select.setAttribute('data-ce-ff-select', group.id);
        select.setAttribute('aria-hidden', 'true');
        select.tabIndex = -1;
        select.disabled = false;
        if (isSort) select.setAttribute('data-ce-ff-sort', '1');
  
        if (!isSort) {
          var anyOpt = document.createElement('option');
          anyOpt.value = '';
          anyOpt.textContent = 'Any';
          select.appendChild(anyOpt);
        }
  
        for (var i = 0; i < group.options.length; i++) {
          var opt = document.createElement('option');
          opt.value = group.options[i].value;
          opt.textContent = group.options[i].label;
          if (group.options[i].available === false) {
            opt.disabled = true;
            opt.setAttribute('data-ce-ff-unavailable', '1');
          }
          if (group.options[i].value === selectedValue) {
            opt.selected = true;
            selectedLabel = group.options[i].label;
          }
          select.appendChild(opt);
        }
        if (isSort && !selectedLabel && group.options.length) {
          selectedLabel = group.options[0].label;
          if (!selectedValue) {
            select.value = group.options[0].value;
            selectedValue = group.options[0].value;
          }
        }
  
        var trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'ce-ff-select';
        trigger.setAttribute('data-ce-ff-trigger', group.id);
        if (isSort) trigger.setAttribute('data-ce-ff-sort', '1');
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-label', group.label);
        /* Source of truth for Apply — do not rely on hidden <select>.value on iOS */
        trigger.setAttribute('data-ce-ff-value', selectedValue);
  
        var valueSpan = document.createElement('span');
        valueSpan.className = 'ce-ff-select__value';
        valueSpan.textContent = selectedLabel || 'Any';
        trigger.appendChild(valueSpan);
  
        var chev = document.createElement('span');
        chev.className = 'ce-ff-chevron';
        chev.setAttribute('aria-hidden', 'true');
        chev.textContent = '\u25BE';
  
        var menu = document.createElement('ul');
        menu.className = 'ce-ff-menu';
        menu.id = 'ce-ff-menu-' + group.id;
        menu.setAttribute('role', 'listbox');
        menu.setAttribute('data-ce-ff-menu', group.id);
        menu.hidden = true;
  
        function addMenuOption(val, label, selected, available) {
          var li = document.createElement('li');
          li.setAttribute('role', 'presentation');
          var btn = document.createElement('button');
          btn.type = 'button';
          var isAvail = available !== false;
          btn.className =
            'ce-ff-menu__opt' +
            (selected ? ' is-selected' : '') +
            (!isAvail ? ' is-unavailable' : '');
          btn.setAttribute('role', 'option');
          btn.setAttribute('data-value', val);
          btn.setAttribute('aria-selected', selected ? 'true' : 'false');
          if (!isAvail) {
            btn.disabled = true;
            btn.setAttribute('aria-disabled', 'true');
          }
          btn.textContent = label;
          li.appendChild(btn);
          menu.appendChild(li);
        }
  
        if (!isSort) addMenuOption('', 'Any', !selectedValue, true);
        for (var j = 0; j < group.options.length; j++) {
          addMenuOption(
            group.options[j].value,
            group.options[j].label,
            group.options[j].value === selectedValue,
            group.options[j].available
          );
        }
  
        wrap.appendChild(select);
        wrap.appendChild(trigger);
        wrap.appendChild(chev);
        wrap.appendChild(menu);
        field.appendChild(wrap);
        /* Menus are reparented to shell on open so fixed positioning is reliable */
        return field;
      }
  
      function buildShell(groups, sortData) {
        var existing = document.getElementById(SHELL_ID);
        if (existing && existing.parentNode) {
          existing.parentNode.removeChild(existing);
        }
  
        var shell = document.createElement('div');
        shell.className = 'ce-ff-shell';
        shell.id = SHELL_ID;
  
        var backdrop = document.createElement('div');
        backdrop.className = 'ce-ff-backdrop';
        backdrop.id = 'ce-ff-backdrop';
        backdrop.tabIndex = -1;
        backdrop.setAttribute('aria-hidden', 'true');
        shell.appendChild(backdrop);
  
        var panel = document.createElement('aside');
        panel.className = 'ce-ff-panel';
        panel.id = 'ce-ff-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        panel.setAttribute('aria-labelledby', 'ce-ff-title');
  
        var head = document.createElement('header');
        head.className = 'ce-ff-head';
  
        var title = document.createElement('h2');
        title.className = 'ce-ff-title';
        title.id = 'ce-ff-title';
        title.textContent = 'Filters & Sort';
        head.appendChild(title);
  
        var closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'ce-ff-close';
        closeBtn.id = 'ce-ff-close';
        closeBtn.setAttribute('aria-label', 'Close filters');
        closeBtn.innerHTML =
          '<svg viewBox="0 0 14 14" aria-hidden="true" focusable="false">' +
          '<path fill="currentColor" d="M14 1.4L12.6 0 7 5.6 1.4 0 0 1.4 5.6 7 0 12.6 1.4 14 7 8.4 12.6 14 14 12.6 8.4 7z"/>' +
          '</svg>';
        head.appendChild(closeBtn);
        panel.appendChild(head);
  
        var body = document.createElement('div');
        body.className = 'ce-ff-body';
        body.id = 'ce-ff-body';
  
        for (var i = 0; i < groups.length; i++) {
          body.appendChild(buildSelectField(groups[i], false));
        }
  
        if (sortData.options.length) {
          body.appendChild(
            buildSelectField(
              {
                id: 'sort',
                label: 'Sort by',
                options: sortData.options,
                selectedValue: sortData.selected
              },
              true
            )
          );
        }
  
        panel.appendChild(body);
  
        var actions = document.createElement('div');
        actions.className = 'ce-ff-actions';
        actions.id = 'ce-ff-actions';
  
        var resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'ce-ff-reset';
        resetBtn.id = 'ce-ff-reset';
        resetBtn.textContent = 'Reset filters';
        actions.appendChild(resetBtn);
  
        var applyBtn = document.createElement('button');
        applyBtn.type = 'button';
        applyBtn.className = 'ce-ff-apply';
        applyBtn.id = 'ce-ff-apply';
        applyBtn.textContent = 'Apply filters';
        actions.appendChild(applyBtn);
  
        /*
         * Actions live inside the panel as the last flex child so they always
         * match panel width and stay on-screen (no absolute/fixed bottom math).
         */
        panel.appendChild(actions);
        shell.appendChild(panel);
        document.body.appendChild(shell);
  
        return {
          shell: shell,
          backdrop: backdrop,
          closeBtn: closeBtn,
          resetBtn: resetBtn,
          applyBtn: applyBtn,
          panel: panel,
          actions: actions
        };
      }
  
      function restyleOpenButton() {
        var openBtn = document.getElementById('mobile-filter-open') ||
          categoryFilters.querySelector('.mobile-filter-open');
        if (!openBtn) return null;
  
        /* Clone to drop jQuery handlers that toggle the native panel */
        if (openBtn.parentNode && !openBtn.getAttribute('data-ce-ff-cloned')) {
          var clone = openBtn.cloneNode(true);
          clone.setAttribute('data-ce-ff-cloned', '1');
          openBtn.parentNode.replaceChild(clone, openBtn);
          openBtn = clone;
        }
  
        openBtn.classList.add('ce-ff-open');
        openBtn.setAttribute('role', 'button');
        openBtn.setAttribute('tabindex', '0');
        openBtn.setAttribute('aria-expanded', 'false');
        openBtn.setAttribute('aria-controls', 'ce-ff-panel');
  
        var svg = openBtn.querySelector('svg');
        openBtn.textContent = '';
        if (svg) openBtn.appendChild(svg);
        openBtn.appendChild(document.createTextNode(' Open Filters / Sort'));
  
        /* Kill leftover jQuery data if present — Magento slideDown must not run */
        try {
          if (window.jQuery) {
            window.jQuery(openBtn).off('click');
            window.jQuery(document).off('click', '#mobile-filter-open');
            window.jQuery(document).off('click', '.mobile-filter-open');
          }
        } catch (err) { /* ignore */ }
  
        /* Clip-hide native panel (never display:none — breaks iOS form POST) */
        hideNativeFilterChrome();
  
        placeOpenButtonInCrossLinks(openBtn);
  
        return openBtn;
      }
  
      /*
       * Sit the open control at the START of the category chip strip so it
       * stays ahead of scrollable sibling links (ul overflow-x: scroll).
       */
      function placeOpenButtonInCrossLinks(openBtn) {
        if (!openBtn) return;
        var wrap = document.querySelector('.category-cross-linking-wrapper');
        if (!wrap) {
          categoryFilters.classList.remove('ce-ff-filters--relocated');
          openBtn.classList.remove('ce-ff-open--in-crosslinks');
          return;
        }
  
        openBtn.classList.add('ce-ff-open--in-crosslinks');
        var ul = wrap.querySelector('ul');
        if (ul) {
          wrap.insertBefore(openBtn, ul);
        } else if (openBtn.parentNode !== wrap) {
          wrap.insertBefore(openBtn, wrap.firstChild);
        }
  
        /* Native filter chrome is empty once the button moves — collapse it */
        categoryFilters.classList.add('ce-ff-filters--relocated');
      }
  
      function disarmAutoSubmit(groups, sortData) {
        function strip(input) {
          if (!input) return;
          if (!input.getAttribute('data-ce-ff-onclick')) {
            var oc = input.getAttribute('onclick');
            if (oc) input.setAttribute('data-ce-ff-onclick', oc);
          }
          input.removeAttribute('onclick');
        }
  
        for (var i = 0; i < groups.length; i++) {
          for (var j = 0; j < groups[i].options.length; j++) {
            strip(groups[i].options[j].input);
          }
        }
  
        if (sortData && sortData.options) {
          for (var k = 0; k < sortData.options.length; k++) {
            strip(sortData.options[k].input);
          }
        }
  
        var clearEl = filterForm.querySelector('.clear-filters');
        if (clearEl && clearEl.getAttribute('onclick')) {
          clearEl.setAttribute('data-ce-ff-onclick', clearEl.getAttribute('onclick'));
          clearEl.removeAttribute('onclick');
        }
      }
  
      /* -- open / close -- */
  
      var scrollLockY = 0;
      var scrollLockPad = '';
      var vvCleanup = null;
  
      function clearActionsInline(actions) {
        if (!actions) return;
        actions.style.removeProperty('position');
        actions.style.removeProperty('left');
        actions.style.removeProperty('right');
        actions.style.removeProperty('bottom');
        actions.style.removeProperty('top');
        actions.style.removeProperty('width');
        actions.style.removeProperty('max-width');
        actions.style.removeProperty('transform');
        actions.style.removeProperty('opacity');
        actions.style.removeProperty('pointer-events');
        actions.style.removeProperty('visibility');
        actions.style.removeProperty('display');
        actions.style.removeProperty('z-index');
      }
  
      function syncVisualViewportHeight(shell) {
        if (!shell) return;
  
        var vv = window.visualViewport;
        var clientH = (document.documentElement && document.documentElement.clientHeight) || 0;
        var innerH = window.innerHeight || 0;
  
        /* Default: fill the fixed viewport with top/bottom */
        shell.classList.remove('ce-ff-shell--vvh');
        shell.style.top = '0px';
        shell.style.bottom = '0px';
        shell.style.removeProperty('height');
        shell.style.removeProperty('max-height');
        document.documentElement.style.removeProperty('--ce-ff-vvh');
  
        /*
         * Only shrink to visualViewport when the keyboard / URL bar actually
         * shifts the VV (offsetTop) or meaningfully shortens it. Avoid forcing
         * a pixel height on tall Chrome device emulators — that was clipping
         * the footer below the visible frame.
         */
        if (vv && vv.height > 0) {
          var shifted = (vv.offsetTop || 0) > 1;
          var shorter = clientH > 0 && vv.height < clientH - 24;
          if (shifted || shorter) {
            var h = vv.height;
            if (clientH > 0 && clientH < h) h = clientH;
            if (innerH > 0 && innerH < h) h = innerH;
            if (h >= 200) {
              var px = Math.round(h) + 'px';
              document.documentElement.style.setProperty('--ce-ff-vvh', px);
              shell.classList.add('ce-ff-shell--vvh');
              shell.style.top = Math.round(vv.offsetTop || 0) + 'px';
              shell.style.height = px;
              shell.style.maxHeight = px;
              shell.style.bottom = 'auto';
            }
          }
        }
  
        clearActionsInline(shell.querySelector('.ce-ff-actions'));
      }
  
      function startViewportLock(shell) {
        stopViewportLock();
        syncVisualViewportHeight(shell);
        /* Re-measure after paint — footer height is known once mounted */
        window.requestAnimationFrame(function () {
          syncVisualViewportHeight(shell);
        });
        function onVv() {
          syncVisualViewportHeight(shell);
          repositionOpenMenus(shell);
        }
        if (window.visualViewport) {
          window.visualViewport.addEventListener('resize', onVv);
          window.visualViewport.addEventListener('scroll', onVv);
        }
        window.addEventListener('resize', onVv);
        vvCleanup = function () {
          if (window.visualViewport) {
            window.visualViewport.removeEventListener('resize', onVv);
            window.visualViewport.removeEventListener('scroll', onVv);
          }
          window.removeEventListener('resize', onVv);
        };
      }
  
      function stopViewportLock() {
        if (vvCleanup) {
          vvCleanup();
          vvCleanup = null;
        }
        document.documentElement.style.removeProperty('--ce-ff-vvh');
        var shell = document.getElementById(SHELL_ID);
        if (shell) {
          shell.classList.remove('ce-ff-shell--vvh');
          shell.style.removeProperty('height');
          shell.style.removeProperty('max-height');
          shell.style.removeProperty('top');
          shell.style.removeProperty('bottom');
        }
      }
  
      function closeAllMenus(shell) {
        if (!shell) return;
        var menus = shell.querySelectorAll('.ce-ff-menu.is-open');
        for (var i = 0; i < menus.length; i++) {
          menus[i].classList.remove('is-open');
          menus[i].hidden = true;
          menus[i].style.top = '';
          menus[i].style.left = '';
          menus[i].style.width = '';
          menus[i].style.bottom = '';
          menus[i].style.maxHeight = '';
        }
        var triggers = shell.querySelectorAll('.ce-ff-select[aria-expanded="true"]');
        for (var t = 0; t < triggers.length; t++) {
          triggers[t].setAttribute('aria-expanded', 'false');
        }
      }
  
      /**
       * Size + place the option list entirely inside the *visible* viewport.
       * Long lists (COLOURS): open upward when the full list won't fit below —
       * same pattern as SORT near the footer — so Yellow stays reachable.
       * iPhone Safari: clamp to visualViewport + drawer footer (not innerHeight).
       */
      function positionMenu(trigger, menu, shell) {
        var rect = trigger.getBoundingClientRect();
        var gap = 4;
        var pad = 8;
        var vv = window.visualViewport;
        var viewTop = vv ? vv.offsetTop : 0;
        var viewH = vv ? vv.height : window.innerHeight;
        var viewBottom = viewTop + viewH;
  
        /* Keep list above Reset/Apply when that footer is on screen */
        var floor = viewBottom - pad;
        var actions = shell && shell.querySelector('.ce-ff-actions');
        if (actions) {
          var ar = actions.getBoundingClientRect();
          if (ar.height > 0 && ar.top < viewBottom && ar.bottom > viewTop) {
            floor = Math.min(floor, ar.top - pad);
          }
        }
  
        var spaceBelow = Math.max(0, floor - rect.bottom - gap);
        var spaceAbove = Math.max(0, rect.top - viewTop - gap - pad);
        var idealMax = Math.min(280, Math.round(viewH * 0.45));
  
        /* Measure full list height (menu is already in the DOM / open) */
        var prevMax = menu.style.maxHeight;
        menu.style.maxHeight = 'none';
        var naturalH = menu.scrollHeight || idealMax;
        menu.style.maxHeight = prevMax;
  
        var optCount = menu.querySelectorAll('.ce-ff-menu__opt').length;
        var fitsBelow = naturalH <= spaceBelow + 1;
  
        /*
         * Open UP like SORT when the list won't fit below, or when there are
         * many options (COLOURS) and more room above — otherwise Yellow stays
         * trapped under Safari chrome with no way to scroll to it.
         */
        var openUp =
          (!fitsBelow && spaceAbove >= 96) ||
          (optCount > 6 && spaceAbove >= 120 && spaceAbove >= spaceBelow) ||
          (spaceBelow < Math.min(idealMax, naturalH, 180) &&
            spaceAbove > spaceBelow);
  
        var avail = openUp ? spaceAbove : spaceBelow;
        var maxH = Math.max(0, Math.min(idealMax, naturalH, avail));
        if (maxH < 96 && Math.max(spaceAbove, spaceBelow) > maxH) {
          openUp = spaceAbove >= spaceBelow;
          maxH = Math.min(idealMax, naturalH, openUp ? spaceAbove : spaceBelow);
        }
        if (maxH < 48) {
          maxH = Math.min(idealMax, Math.max(spaceAbove, spaceBelow, 48));
        }
  
        menu.style.left = Math.round(rect.left) + 'px';
        menu.style.width = Math.round(rect.width) + 'px';
        menu.style.maxHeight = Math.round(maxH) + 'px';
        menu.style.bottom = 'auto';
  
        if (openUp) {
          /* Anchor to the trigger top so the list grows upward (like Sort) */
          menu.style.top = Math.round(rect.top - gap - maxH) + 'px';
        } else {
          menu.style.top = Math.round(rect.bottom + gap) + 'px';
        }
      }
  
      function repositionOpenMenus(shell) {
        if (!shell) return;
        var open = shell.querySelector('.ce-ff-menu.is-open');
        if (!open) return;
        var gid = open.getAttribute('data-ce-ff-menu');
        var trigger =
          (gid &&
            shell.querySelector('.ce-ff-select[data-ce-ff-trigger="' + gid + '"]')) ||
          shell.querySelector('.ce-ff-select[aria-expanded="true"]');
        if (trigger) positionMenu(trigger, open, shell);
      }
  
      function openMenu(trigger, menu, shell) {
        closeAllMenus(shell);
        /* Park menu on shell so it isn't clipped by .ce-ff-body overflow */
        if (menu.parentNode !== shell) {
          shell.appendChild(menu);
        }
        menu.hidden = false;
        menu.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        positionMenu(trigger, menu, shell);
  
        /* Keep the current value visible inside the clamped scrollport */
        try {
          var sel = menu.querySelector('.ce-ff-menu__opt.is-selected');
          if (sel && typeof sel.scrollIntoView === 'function') {
            sel.scrollIntoView({ block: 'nearest' });
          }
        } catch (err) { /* ignore */ }
      }
  
      function lockPageScroll() {
        scrollLockY = window.pageYOffset || document.documentElement.scrollTop || 0;
        var sbw = window.innerWidth - document.documentElement.clientWidth;
        scrollLockPad = document.body.style.paddingRight || '';
        if (sbw > 0) {
          document.body.style.paddingRight = sbw + 'px';
        }
        document.body.classList.add('ce-ff-drawer-open');
        document.body.style.overflow = 'hidden';
      }
  
      function unlockPageScroll() {
        document.body.classList.remove('ce-ff-drawer-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = scrollLockPad;
        window.scrollTo(0, scrollLockY);
      }
  
      /**
       * Visually suppress Magento's accordion without display:none.
       * iPhone Safari omits inputs under display:none from POST.
       */
      function hideNativeFilterChrome() {
        var nativeWrap = document.getElementById('display-filters-wrapper');
        if (!nativeWrap) return;
        try {
          if (window.jQuery) {
            window.jQuery(nativeWrap).stop(true, true);
            window.jQuery(nativeWrap).css('display', '');
          }
        } catch (err) { /* ignore */ }
        nativeWrap.style.removeProperty('display');
      }
  
      /**
       * Park Magento's real #filterForm on <body> and force it submittable.
       * iOS Safari:
       *  - drops fields under display:none
       *  - often blocks submit() on a *new* staging form (loses user gesture)
       * So we must submit the original form, synchronously, in the tap handler.
       */
      function exposeFilterFormForSubmit() {
        var form = document.getElementById('filterForm') || filterForm;
        if (!form) return null;
  
        hideNativeFilterChrome();
  
        if (categoryFilters && categoryFilters.classList) {
          categoryFilters.classList.remove('ce-ff-filters--relocated');
          categoryFilters.style.removeProperty('display');
          categoryFilters.style.removeProperty('visibility');
          categoryFilters.style.removeProperty('height');
          categoryFilters.style.removeProperty('max-height');
          categoryFilters.style.removeProperty('overflow');
        }
  
        var node = form;
        while (node && node.nodeType === 1 && node !== document.body) {
          try {
            node.style.setProperty('display', 'block', 'important');
            node.style.setProperty('visibility', 'visible', 'important');
            node.style.setProperty('opacity', '1', 'important');
            node.style.setProperty('pointer-events', 'auto', 'important');
            node.style.setProperty('height', 'auto', 'important');
            node.style.setProperty('max-height', 'none', 'important');
            node.style.setProperty('overflow', 'visible', 'important');
            node.style.setProperty('clip', 'auto', 'important');
            node.style.setProperty('clip-path', 'none', 'important');
            node.style.removeProperty('left');
          } catch (errNode) { /* ignore */ }
          node = node.parentElement;
        }
  
        try {
          document.body.appendChild(form);
        } catch (errMove) { /* ignore */ }
  
        form.style.setProperty('display', 'block', 'important');
        form.style.setProperty('visibility', 'visible', 'important');
        form.style.setProperty('position', 'fixed', 'important');
        form.style.setProperty('left', '0', 'important');
        form.style.setProperty('top', '0', 'important');
        form.style.setProperty('width', '1px', 'important');
        form.style.setProperty('height', '1px', 'important');
        form.style.setProperty('opacity', '0.01', 'important');
        form.style.setProperty('overflow', 'hidden', 'important');
        form.style.setProperty('z-index', '2147483646', 'important');
        form.style.setProperty('pointer-events', 'auto', 'important');
  
        var inputs = form.querySelectorAll('input, select, textarea');
        for (var i = 0; i < inputs.length; i++) {
          try {
            inputs[i].disabled = false;
          } catch (errDis) { /* ignore */ }
        }
  
        return form;
      }
  
      /**
       * GTM Form Submit / Click often miss live Applies: Magento uses
       * form.submit() (no submit event), and our Apply handler stops
       * propagation. Push a dataLayer event so CE can count reliably.
       * Pair with GTM Custom Event trigger: ce_plp_filter_apply
       *
       * IMPORTANT: Apply immediately navigates via form.submit(). A bare
       * dataLayer.push is often lost on unload — wait for GTM eventCallback
       * (or a short timeout) before continuing to submit.
       */
      function pushPlpFilterApply(done) {
        var finished = false;
        function next() {
          if (finished) return;
          finished = true;
          if (typeof done === 'function') {
            try {
              done();
            } catch (errDone) { /* ignore */ }
          }
        }
  
        try {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'ce_plp_filter_apply',
            page_path: location.pathname + location.search,
            eventCallback: next,
            eventTimeout: 2000
          });
        } catch (errDl) { /* ignore */ }
  
        /* Direct GA4 hit as backup if GTM is slow / page is about to navigate */
        try {
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'plp_filter_apply', {
              page_path: location.pathname + location.search,
              send_to: 'G-89VMKW3951'
            });
          }
        } catch (errGtag) { /* ignore */ }
  
        window.setTimeout(next, 500);
      }
  
      /** Drawer open — no page unload, reliable engagement signal. */
      function pushPlpFilterOpen() {
        try {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'ce_plp_filter_open',
            page_path: location.pathname + location.search
          });
        } catch (errOpen) { /* ignore */ }
      }
  
      function submitFilterForm() {
        /* Release scroll lock first — some iOS builds stall navigation while locked */
        try {
          unlockPageScroll();
        } catch (errUnlock) { /* ignore */ }
  
        var form = exposeFilterFormForSubmit();
        if (!form) return;
  
        /* Same call Magento's onclick uses (global filterForm) */
        try {
          if (typeof window.filterForm === 'undefined' || window.filterForm !== form) {
            window.filterForm = form;
          }
        } catch (errGlobal) { /* ignore */ }
  
        try {
          HTMLFormElement.prototype.submit.call(form);
          return;
        } catch (errProto) { /* fall through */ }
  
        try {
          form.submit();
          return;
        } catch (errSub) { /* fall through */ }
  
        try {
          if (window.jQuery) {
            window.jQuery(form).trigger('submit');
            window.jQuery(form).submit();
          }
        } catch (errJq) { /* ignore */ }
      }
  
      function readSelectValue(shell, gid, sel) {
        var trigger =
          shell &&
          gid &&
          shell.querySelector('.ce-ff-select[data-ce-ff-trigger="' + gid + '"]');
        if (trigger && trigger.hasAttribute('data-ce-ff-value')) {
          return trigger.getAttribute('data-ce-ff-value') || '';
        }
        return sel ? sel.value : '';
      }
  
      /**
       * Write Magento filter hiddens the same way live onclick does.
       * Do NOT toggle checkboxes — Magento only posts *-Filter / *-Changed.
       */
      function writeMagentoFilter(group, filterVal, changedVal) {
        if (!group) return;
        ensureMagentoFilterInputs(group);
        var filterEl = group.hiddenFilter;
        var changedEl = group.hiddenChanged;
  
        if (!filterEl && group.options && group.options.length) {
          /* Recover from onclick: jQuery('#Colour-Filter').val('BLA') */
          for (var i = 0; i < group.options.length; i++) {
            var inp = group.options[i].input;
            var oc =
              (inp &&
                (inp.getAttribute('data-ce-ff-onclick') ||
                  inp.getAttribute('onclick'))) ||
              '';
            var m = String(oc).match(
              /jQuery\(\s*['"]#([^'"]+-Filter)['"]\s*\)\.val\(/i
            );
            if (m) {
              filterEl = document.getElementById(m[1]);
              changedEl =
                document.getElementById(m[1] + '-Changed') || changedEl;
              group.hiddenFilter = filterEl;
              group.hiddenChanged = changedEl;
              break;
            }
          }
        }
  
        if (filterEl) filterEl.value = filterVal == null ? '' : String(filterVal);
        if (changedEl) changedEl.value = changedVal == null ? '' : String(changedVal);
  
        try {
          if (window.jQuery) {
            if (filterEl && filterEl.id) {
              window.jQuery('#' + filterEl.id).val(filterEl.value);
            }
            if (changedEl && changedEl.id) {
              window.jQuery('#' + changedEl.id).val(changedEl.value);
            }
          }
        } catch (errJq2) { /* ignore */ }
      }
  
      var closeTimer = null;
  
      function openDrawer(ui, openBtn) {
        /* Keep Magento accordion visually suppressed (still POSTable on iOS) */
        hideNativeFilterChrome();
  
        pushPlpFilterOpen();
  
        /* Restore catalog labels if Magento narrowed — unavailable stay greyed */
        hydrateShellFromBaseline(ui.shell);
        persistShellOptions(ui.shell);
  
        if (closeTimer) {
          window.clearTimeout(closeTimer);
          closeTimer = null;
        }
  
        startViewportLock(ui.shell);
  
        /* 1) Mount shell off-screen, 2) next frame add is-open so transform can animate */
        ui.shell.style.display = 'block';
        ui.shell.classList.add('is-mounted');
        ui.shell.classList.remove('is-open');
        if (ui.panel) {
          /* Clear any leftover inline sizing from older builds */
          ui.panel.style.removeProperty('transform');
          ui.panel.style.removeProperty('left');
          ui.panel.style.removeProperty('height');
          ui.panel.style.removeProperty('max-height');
        }
  
        void ui.shell.offsetWidth; /* force reflow at closed position */
  
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            ui.shell.classList.add('is-open');
            syncVisualViewportHeight(ui.shell);
          });
        });
  
        lockPageScroll();
        if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
      }
  
      function closeDrawer(ui, openBtn) {
        closeAllMenus(ui.shell);
        ui.shell.classList.remove('is-open');
        if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
  
        if (closeTimer) window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(function () {
          closeTimer = null;
          ui.shell.classList.remove('is-mounted');
          ui.shell.style.display = 'none';
          clearActionsInline(ui.actions);
          stopViewportLock();
          unlockPageScroll();
        }, 320);
      }
  
      /* -- apply / reset -- */
  
      function findGroupById(groups, id) {
        for (var i = 0; i < groups.length; i++) {
          if (groups[i].id === id) return groups[i];
        }
        return null;
      }
  
      function applyQueueKey() {
        return 'ce-ff-apply-queue:' + location.pathname;
      }
  
      function readApplyQueue() {
        try {
          var raw = sessionStorage.getItem(applyQueueKey());
          if (!raw) return [];
          var parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? parsed : [];
        } catch (errQ) {
          return [];
        }
      }
  
      function writeApplyQueue(items) {
        try {
          if (!items || !items.length) {
            sessionStorage.removeItem(applyQueueKey());
          } else {
            sessionStorage.setItem(applyQueueKey(), JSON.stringify(items));
          }
        } catch (errW) { /* ignore */ }
      }
  
      function optionIsSelectable(group, value) {
        if (!value) return true;
        if (!group || !group.options) return false;
        var i;
        for (i = 0; i < group.options.length; i++) {
          if (group.options[i].value !== value) continue;
          return group.options[i].available !== false;
        }
        return false;
      }
  
      function setShellFilterValue(shell, gid, value, label) {
        if (!shell || !gid) return;
        var trigger = shell.querySelector(
          '.ce-ff-select[data-ce-ff-trigger="' + gid + '"]'
        );
        var native = shell.querySelector(
          'select[data-ce-ff-select="' + gid + '"]'
        );
        if (trigger) {
          trigger.setAttribute('data-ce-ff-value', value || '');
          var vs = trigger.querySelector('.ce-ff-select__value');
          if (vs) vs.textContent = label || (value ? value : 'Any');
        }
        if (native) {
          try {
            native.value = value || '';
          } catch (errSet) { /* ignore */ }
        }
      }
  
      function labelForOption(group, value) {
        if (!value) return 'Any';
        if (!group || !group.options) return value;
        var i;
        for (i = 0; i < group.options.length; i++) {
          if (group.options[i].value === value) {
            return group.options[i].label || value;
          }
        }
        return value;
      }
  
      function writeDirtyFilterChange(group, value, current) {
        var lastDirtyInput = null;
        if (!value && current) {
          var removeVal = current + '_RMV';
          var r;
          for (r = 0; r < group.options.length; r++) {
            if (group.options[r].value === current && group.options[r].removeValue) {
              removeVal = group.options[r].removeValue;
              lastDirtyInput = group.options[r].input;
              break;
            }
          }
          writeMagentoFilter(group, removeVal, '1');
          return lastDirtyInput;
        }
        var k;
        for (k = 0; k < group.options.length; k++) {
          if (group.options[k].value === value) {
            lastDirtyInput = group.options[k].input;
            break;
          }
        }
        writeMagentoFilter(group, value || '', value ? '1' : '');
        return lastDirtyInput;
      }
  
      function applyFilters(groups, sortData, ui, openBtn) {
        var shell = ui.shell;
        /* Save full lists from the open drawer before Magento reload narrows facets */
        persistShellOptions(shell);
        var selects = shell.querySelectorAll('select[data-ce-ff-select]');
        var filtersDirty = false;
        var sortDirty = false;
        var sortValue = sortData.selected;
        var lastDirtyInput = null;
        var dirtyFilterCount = 0;
        var dirtyChanges = [];
  
        for (var i = 0; i < selects.length; i++) {
          var sel = selects[i];
          var gid = sel.getAttribute('data-ce-ff-select');
          var isSort = sel.getAttribute('data-ce-ff-sort') === '1';
          /* Prefer data-ce-ff-value — iOS often won't retain hidden <select>.value */
          var value = readSelectValue(shell, gid, sel);
  
          if (isSort) {
            if (value && value !== sortData.selected) {
              sortDirty = true;
              sortValue = value;
            }
            continue;
          }
  
          var group = findGroupById(groups, gid);
          if (!group) continue;
  
          var current = group.selectedValue || '';
          if (value === current) continue;
  
          /* Never POST catalog-only options Magento is not offering */
          if (!optionIsSelectable(group, value)) continue;
  
          dirtyChanges.push({
            gid: gid,
            value: value,
            current: current
          });
        }
  
        /*
         * Magento only exposes compatible facet options AFTER a filter is applied.
         * Applying Shade+Red in one POST can empty the PLP. Match Control: apply
         * one facet change per reload, queue the rest, resume with live availability.
         */
        if (dirtyChanges.length > 1) {
          writeApplyQueue(dirtyChanges.slice(1));
          dirtyChanges = [dirtyChanges[0]];
        } else {
          writeApplyQueue([]);
        }
  
        for (i = 0; i < dirtyChanges.length; i++) {
          var change = dirtyChanges[i];
          group = findGroupById(groups, change.gid);
          if (!group) continue;
          filtersDirty = true;
          dirtyFilterCount += 1;
          lastDirtyInput = writeDirtyFilterChange(
            group,
            change.value,
            change.current
          );
        }
  
        if (sortDirty) {
          if (sortData.orderInput) sortData.orderInput.value = sortValue;
          for (var s = 0; s < sortData.options.length; s++) {
            if (sortData.options[s].input) {
              sortData.options[s].input.checked = sortData.options[s].value === sortValue;
            }
          }
        }
  
        if (filtersDirty) {
          if (sortDirty || (sortData.orderInput && sortData.selected && sortData.selected !== 'POP')) {
            var orderToSend = sortDirty ? sortValue : sortData.selected;
            var existing = filterForm.querySelector('input[name="Order"][data-ce-ff-order]');
            if (!existing) {
              existing = document.createElement('input');
              existing.type = 'hidden';
              existing.name = 'Order';
              existing.setAttribute('data-ce-ff-order', '1');
              filterForm.appendChild(existing);
            }
            existing.value = orderToSend;
            if (sortData.orderInput) sortData.orderInput.value = orderToSend;
          }
  
          /*
           * Tracking already fired from the Apply click handler (pushPlpFilterApply
           * before this runs). Do not push again — just submit Magento.
           */
          if (dirtyFilterCount === 1 && lastDirtyInput) {
            var oc = lastDirtyInput.getAttribute('data-ce-ff-onclick');
            if (oc) {
              try {
                unlockPageScroll();
              } catch (errU) { /* ignore */ }
              var liveForm = exposeFilterFormForSubmit();
              try {
                window.filterForm = liveForm || document.getElementById('filterForm');
              } catch (errG) { /* ignore */ }
              try {
                new Function(oc)();
                return;
              } catch (errOc) {
                /* fall through to submitFilterForm */
              }
            }
          }
  
          submitFilterForm();
          return;
        }
  
        if (sortDirty && sortData.sortForm) {
          try {
            unlockPageScroll();
          } catch (errU2) { /* ignore */ }
          try {
            HTMLFormElement.prototype.submit.call(sortData.sortForm);
          } catch (errSort) {
            sortData.sortForm.submit();
          }
          return;
        }
  
        closeDrawer(ui, openBtn);
      }
  
      function resetFilters() {
        writeApplyQueue([]);
        var clearHidden = document.getElementById('Clear-All-Filters');
        if (clearHidden) {
          clearHidden.value = 'Clear';
          submitFilterForm();
          return;
        }
        submitFilterForm();
      }
  
      /**
       * Continue queued facet changes after Magento reloads with narrowed options.
       * Skips any queued value Magento no longer offers (avoids empty PLPs).
       */
      function resumeApplyQueue(groups, sortData, ui, openBtn) {
        var queue = readApplyQueue();
        if (!queue.length) return;
        writeApplyQueue([]);
  
        var pending = [];
        var i;
        for (i = 0; i < queue.length; i++) {
          var item = queue[i];
          if (!item || !item.gid) continue;
          var group = findGroupById(groups, item.gid);
          if (!group) continue;
          if (!optionIsSelectable(group, item.value)) continue;
          /* Already applied on this page load */
          if ((group.selectedValue || '') === (item.value || '')) continue;
          pending.push(item);
        }
        if (!pending.length) return;
  
        for (i = 0; i < pending.length; i++) {
          setShellFilterValue(
            ui.shell,
            pending[i].gid,
            pending[i].value,
            labelForOption(findGroupById(groups, pending[i].gid), pending[i].value)
          );
        }
  
        window.setTimeout(function () {
          applyFilters(groups, sortData, ui, openBtn);
        }, 50);
      }
  
      function hasActiveMagentoFilters() {
        var hiddens = filterForm.querySelectorAll('input[type="hidden"]');
        var i;
        for (i = 0; i < hiddens.length; i++) {
          var hid = hiddens[i];
          var id = hid.id || '';
          var name = hid.name || '';
          var val = hid.value || '';
          if (!val || /_RMV$/i.test(val)) continue;
          if (/Clear/i.test(id) || /Clear/i.test(name)) continue;
          if (/-Filter$/i.test(id) || /-Filter$/i.test(name)) return true;
        }
        return false;
      }
  
      function injectEmptyResultsNotice() {
        if (document.getElementById('ce-ff-empty-results')) return;
        if (!hasActiveMagentoFilters()) return;
  
        var productNodes = document.querySelectorAll(
          '.product-item, li.item.product, .item.product.product-item, li.product-item'
        );
        if (productNodes.length) return;
  
        var host =
          document.querySelector('.products.wrapper') ||
          document.querySelector('ol.products.list') ||
          document.querySelector('ol.products') ||
          document.querySelector('ul.products') ||
          document.querySelector('.products.list') ||
          document.querySelector('.category-products');
        if (!host) return;
  
        /* Avoid false positives on hosts that still contain product cards deeper */
        if (host.querySelector('.product-item, li.item.product, .item.product')) return;
  
        var notice = document.createElement('div');
        notice.id = 'ce-ff-empty-results';
        notice.className = 'ce-ff-empty-results';
        notice.setAttribute('role', 'status');
  
        var title = document.createElement('p');
        title.className = 'ce-ff-empty-results__title';
        title.textContent = 'No products match these filters';
        notice.appendChild(title);
  
        var text = document.createElement('p');
        text.className = 'ce-ff-empty-results__text';
        text.textContent =
          'Try removing a filter, or reset to see more plants.';
        notice.appendChild(text);
  
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ce-ff-empty-results__reset';
        btn.id = 'ce-ff-empty-reset';
        btn.textContent = 'Reset filters';
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          resetFilters();
        });
        notice.appendChild(btn);
  
        host.insertBefore(notice, host.firstChild);
      }
  
      /* -- wire up -- */
  
      try {
        var groups = collectFilterGroups();
        var sortData = collectSortOptions();
  
        if (!groups.length && !sortData.options.length) return;
  
        disarmAutoSubmit(groups, sortData);
  
        var openBtn = restyleOpenButton();
        var ui = buildShell(groups, sortData);
        persistShellOptions(ui.shell);
  
        function onOpen(e) {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          }
          openDrawer(ui, openBtn);
        }
  
        function onClose(e) {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          }
          closeDrawer(ui, openBtn);
        }
  
        /* Document capture: beats Magento jQuery even if button is replaced later */
        document.addEventListener('click', function (e) {
          var t = e.target;
          if (!t) return;
  
          if (closest(t, '#ce-ff-close') || closest(t, '#ce-ff-backdrop')) {
            onClose(e);
            return;
          }
  
          if (closest(t, '#ce-ff-reset')) {
            e.preventDefault();
            e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            resetFilters();
            return;
          }
  
          if (closest(t, '#ce-ff-apply')) {
            e.preventDefault();
            e.stopPropagation();
            /*
             * Do NOT stopImmediatePropagation — that blocks GTM/debug listeners
             * on the way to #ce-ff-apply. Push tracking here (before navigate),
             * then run Apply after GTM eventCallback / short timeout.
             */
            pushPlpFilterApply(function () {
              applyFilters(groups, sortData, ui, openBtn);
            });
            return;
          }
  
          /* Custom dropdown option */
          var optBtn = closest(t, '.ce-ff-menu__opt');
          if (optBtn && ui.shell.contains(optBtn)) {
            e.preventDefault();
            e.stopPropagation();
            if (
              optBtn.disabled ||
              optBtn.classList.contains('is-unavailable') ||
              optBtn.getAttribute('aria-disabled') === 'true'
            ) {
              return;
            }
            var menu = closest(optBtn, '.ce-ff-menu');
            var gid = menu && menu.getAttribute('data-ce-ff-menu');
            var native = gid && ui.shell.querySelector('select[data-ce-ff-select="' + gid + '"]');
            var trigger = gid && ui.shell.querySelector('.ce-ff-select[data-ce-ff-trigger="' + gid + '"]');
            var val = optBtn.getAttribute('data-value') || '';
            var label = optBtn.textContent || '';
            if (trigger) {
              trigger.setAttribute('data-ce-ff-value', val);
              var vs = trigger.querySelector('.ce-ff-select__value');
              if (vs) vs.textContent = label;
            }
            if (native) {
              try {
                native.value = val;
              } catch (errVal) { /* ignore */ }
            }
            if (menu) {
              var opts = menu.querySelectorAll('.ce-ff-menu__opt');
              for (var oi = 0; oi < opts.length; oi++) {
                var selected = opts[oi] === optBtn;
                opts[oi].classList.toggle('is-selected', selected);
                opts[oi].setAttribute('aria-selected', selected ? 'true' : 'false');
              }
            }
            closeAllMenus(ui.shell);
            return;
          }
  
          /* Custom dropdown trigger */
          var triggerBtn = closest(t, '.ce-ff-select[data-ce-ff-trigger]');
          if (triggerBtn && ui.shell.contains(triggerBtn)) {
            e.preventDefault();
            e.stopPropagation();
            var tg = triggerBtn.getAttribute('data-ce-ff-trigger');
            var menuEl =
              ui.shell.querySelector('.ce-ff-menu[data-ce-ff-menu="' + tg + '"]') ||
              ui.shell.querySelector('#ce-ff-menu-' + tg);
            if (!menuEl) return;
            if (menuEl.classList.contains('is-open')) {
              closeAllMenus(ui.shell);
            } else {
              openMenu(triggerBtn, menuEl, ui.shell);
            }
            return;
          }
  
          /* Click outside an open menu closes it */
          if (ui.shell.classList.contains('is-open') && !closest(t, '.ce-ff-menu')) {
            closeAllMenus(ui.shell);
          }
  
          var btn = closest(t, '#mobile-filter-open, .ce-ff-open, .mobile-filter-open');
          if (!btn) return;
          /* Button may live in .category-cross-linking-wrapper after relocate */
          if (
            !categoryFilters.contains(btn) &&
            !btn.classList.contains('ce-ff-open') &&
            btn.id !== 'mobile-filter-open'
          ) {
            return;
          }
          onOpen(e);
        }, true);
  
        if (openBtn) {
          openBtn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpen(e);
            }
          });
        }
  
        var bodyEl = ui.shell.querySelector('.ce-ff-body');
        if (bodyEl) {
          bodyEl.addEventListener(
            'scroll',
            function () {
              closeAllMenus(ui.shell);
            },
            { passive: true }
          );
        }
  
        document.addEventListener('keydown', function (e) {
          if (e.key !== 'Escape' || !ui.shell.classList.contains('is-open')) return;
          if (ui.shell.querySelector('.ce-ff-menu.is-open')) {
            closeAllMenus(ui.shell);
            e.preventDefault();
            return;
          }
          onClose(e);
        });
  
        injectEmptyResultsNotice();
        resumeApplyQueue(groups, sortData, ui, openBtn);
      } catch (err) {
        if (window.console && console.error) {
          console.error('[ce-yg-plp-filters]', err);
        }
      }
    }
  
    ready(boot);
  })();
  