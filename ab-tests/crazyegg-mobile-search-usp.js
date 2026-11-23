/**
 * Crazy Egg A/B — Mobile search bar (match Argos / mock-up header)
 *
 * Mobile only (max-width: 1000px) — enables/disables on resize (CE often
 * injects while the outer frame is desktop-width).
 *
 * Pair with: crazyegg-mobile-search-usp.css (critical CSS also injected here)
 *
 * Placement (mock-up):
 *   Header icons row → full-width pill search → USP strip
 *
 * Behaviour:
 * - Hide Luigi search icon but KEEP an icon-sized header slot (no layout shift)
 * - Do NOT hide bare #mobileSearch — login wrongly shares that id on YG
 * - Inject pill search into #header BELOW floated .mobileNavBar (clear:both)
 * - Tap opens Luigi via the hidden mobilesearch control
 */
(function () {
  'use strict';

  var ROOT_CLASS = 'ce-yg-mobile-search-usp';
  var INIT_MARK = 'data-ce-yg-mobile-search-usp-init';
  var STYLE_ID = 'ce-ms-critical-css';
  var BAR_ID = 'ce-ms-bar';
  var MOBILE_MQ = '(max-width: 1000px)';
  var PLACEHOLDER = 'Search plants, trees or outdoor living';
  var HIDE_MARK = 'data-ce-ms-hidden';
  var ICON_SLOT = '52.5px';

  if (document.documentElement.getAttribute(INIT_MARK) === '1') return;
  document.documentElement.setAttribute(INIT_MARK, '1');

  var mq = window.matchMedia ? window.matchMedia(MOBILE_MQ) : null;
  var observer = null;
  var retryTimer = null;

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function isMobile() {
    return !mq || mq.matches;
  }

  function injectCriticalCss() {
    if (document.getElementById(STYLE_ID)) return;
    var css =
      'html.ce-yg-mobile-search-usp #ltw-app[data-luma*="mobilesearch"]{' +
        'visibility:hidden!important;' +
        'opacity:0!important;' +
        'pointer-events:none!important;' +
        'width:' + ICON_SLOT + '!important;' +
        'max-width:' + ICON_SLOT + '!important;' +
        'height:33px!important;' +
        'overflow:hidden!important;' +
        'float:left!important;' +
      '}' +
      'html.ce-yg-mobile-search-usp #ltw-app[data-luma*="mobilesearch"] #mobileSearch,' +
      'html.ce-yg-mobile-search-usp .lbx-replaced#mobileSearch{' +
        'visibility:hidden!important;' +
        'opacity:0!important;' +
        'pointer-events:none!important;' +
      '}' +
      'html.ce-yg-mobile-search-usp #mobileSearchWrapper{' +
        'display:none!important;' +
      '}' +
      'html.ce-yg-mobile-search-usp #head-scroll,' +
      'html.ce-yg-mobile-search-usp #header .mobileNavBar,' +
      'html.ce-yg-mobile-search-usp .mobileNavBar{' +
        'height:auto!important;' +
        'min-height:0!important;' +
        'overflow:visible!important;' +
      '}' +
      'html.ce-yg-mobile-search-usp #header .mobileNavBar .bottomPanel,' +
      'html.ce-yg-mobile-search-usp .mobileNavBar .bottomPanel{' +
        'border-bottom:none!important;' +
      '}' +
      'html.ce-yg-mobile-search-usp .ce-ms-bar{' +
        'display:block!important;' +
        'clear:both!important;' +
        'float:none!important;' +
        'width:100%!important;' +
        'box-sizing:border-box!important;' +
        'padding:8px 16px 14px!important;' +
        'margin:0!important;' +
        'background:#fff!important;' +
        'border:0!important;' +
        'border-bottom:1px solid #eee!important;' +
        'position:relative!important;' +
        'z-index:1!important;' +
      '}' +
      'html.ce-yg-mobile-search-usp .ce-ms-bar__inner{' +
        'position:relative!important;' +
        'display:flex!important;' +
        'align-items:stretch!important;' +
        'width:100%!important;' +
        'min-height:48px!important;' +
        'border:1px solid #c5bdb5!important;' +
        'border-radius:999px!important;' +
        'background:#fff!important;' +
        'box-shadow:0 2px 10px rgba(38,79,28,.08)!important;' +
        'box-sizing:border-box!important;' +
      '}' +
      'html.ce-yg-mobile-search-usp .ce-ms-bar__input{' +
        'flex:1 1 auto!important;' +
        'min-width:0!important;' +
        'width:100%!important;' +
        'border:none!important;' +
        'outline:none!important;' +
        'background:transparent!important;' +
        'border-radius:999px!important;' +
        'padding:14px 48px 14px 18px!important;' +
        'margin:0!important;' +
        'font-family:Arial,Helvetica,sans-serif!important;' +
        'font-size:15px!important;' +
        'color:#777!important;' +
        '-webkit-appearance:none!important;' +
        'appearance:none!important;' +
      '}' +
      'html.ce-yg-mobile-search-usp .ce-ms-bar__btn{' +
        'position:absolute!important;' +
        'top:50%!important;' +
        'right:6px!important;' +
        'transform:translateY(-50%)!important;' +
        'width:36px!important;' +
        'height:36px!important;' +
        'margin:0!important;' +
        'padding:0!important;' +
        'border:none!important;' +
        'border-radius:50%!important;' +
        'background:transparent!important;' +
        'color:#264f1c!important;' +
        'cursor:pointer!important;' +
        'display:inline-flex!important;' +
        'align-items:center!important;' +
        'justify-content:center!important;' +
      '}' +
      'html.ce-yg-mobile-search-usp .ce-ms-bar__btn svg{' +
        'width:20px!important;' +
        'height:20px!important;' +
        'fill:currentColor!important;' +
        'display:block!important;' +
      '}' +
      '@media (min-width:1001px){' +
        'html.ce-yg-mobile-search-usp .ce-ms-bar{display:none!important;}' +
      '}';

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    (document.head || document.documentElement).appendChild(style);
  }

  function isRealSearchNode(el) {
    if (!el) return false;
    /* Login block wrongly reuses id="mobileSearch" — never hide it */
    if (el.querySelector && el.querySelector('a[aria-label="login"]')) return false;
    if (el.id === 'ltw-app') {
      var luma = el.getAttribute('data-luma') || '';
      return luma.indexOf('mobilesearch') !== -1;
    }
    if (el.classList && el.classList.contains('lbx-replaced')) return true;
    if (el.closest && el.closest('#ltw-app[data-luma*="mobilesearch"]')) return true;
    if (el.querySelector && el.querySelector('[data-icon="search"], .fa-search')) return true;
    return false;
  }

  function hideSearchIcons() {
    var nodes = document.querySelectorAll(
      '#ltw-app[data-luma*="mobilesearch"],' +
        '#ltw-app[data-luma*="mobilesearch"] #mobileSearch,' +
        '.lbx-replaced#mobileSearch,' +
        '.bottomPanel > #mobileSearch'
    );
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (!isRealSearchNode(el)) continue;

      el.setAttribute(HIDE_MARK, '1');
      el.style.setProperty('visibility', 'hidden', 'important');
      el.style.setProperty('opacity', '0', 'important');
      el.style.setProperty('pointer-events', 'none', 'important');

      if (el.id === 'ltw-app') {
        el.style.setProperty('width', ICON_SLOT, 'important');
        el.style.setProperty('max-width', ICON_SLOT, 'important');
        el.style.setProperty('height', '33px', 'important');
        el.style.setProperty('overflow', 'hidden', 'important');
        el.style.setProperty('float', 'left', 'important');
      }

      el.style.removeProperty('display');
      el.style.removeProperty('position');
      el.style.removeProperty('left');
    }
  }

  function findMobileSearchTrigger() {
    var ltw = document.querySelector(
      '#ltw-app[data-luma*="mobilesearch"] #mobileSearch, #ltw-app[data-luma*="mobilesearch"]'
    );
    if (ltw) {
      if (ltw.id === 'ltw-app') {
        var inner = ltw.querySelector('#mobileSearch');
        return inner || ltw;
      }
      return ltw;
    }
    var all = document.querySelectorAll('.bottomPanel > #mobileSearch');
    for (var i = 0; i < all.length; i++) {
      if (isRealSearchNode(all[i])) return all[i];
    }
    return null;
  }

  function openLuigiSearch() {
    var trigger = findMobileSearchTrigger();
    if (trigger) {
      var prevPe = trigger.style.pointerEvents;
      trigger.style.setProperty('pointer-events', 'auto', 'important');
      try {
        trigger.click();
      } catch (err) { /* ignore */ }
      trigger.style.pointerEvents = prevPe;
      return true;
    }

    var wrap = document.getElementById('mobileSearchWrapper');
    var input = document.getElementById('searchMob');
    try {
      if (window.jQuery && wrap) window.jQuery(wrap).slideDown(300);
      else if (wrap) wrap.style.display = 'block';
      if (input) {
        input.focus();
        if (input.value === 'Search entire store') input.select();
      }
    } catch (err2) { /* ignore */ }
    return false;
  }

  function buildBar() {
    var existing = document.getElementById(BAR_ID);
    if (existing) return existing;

    var bar = document.createElement('div');
    bar.id = BAR_ID;
    bar.className = 'ce-ms-bar';
    bar.setAttribute('role', 'search');

    var inner = document.createElement('div');
    inner.className = 'ce-ms-bar__inner';

    var input = document.createElement('input');
    input.type = 'search';
    input.className = 'ce-ms-bar__input';
    input.id = 'ce-ms-input';
    input.name = 'ce_ms_search';
    input.placeholder = PLACEHOLDER;
    input.setAttribute('aria-label', 'Search');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('enterkeyhint', 'search');

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ce-ms-bar__btn';
    btn.setAttribute('aria-label', 'Search');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>' +
      '</svg>';

    inner.appendChild(input);
    inner.appendChild(btn);
    bar.appendChild(inner);

    function go(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      openLuigiSearch();
    }

    input.addEventListener('focus', go);
    input.addEventListener('click', go);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') go(e);
    });
    btn.addEventListener('click', go);

    return bar;
  }

  function placeBar(bar) {
    var header = document.getElementById('header');
    var mobileNav =
      document.querySelector('#header .mobileNavBar') ||
      document.querySelector('.mobileNavBar');
    var bottomPanel = mobileNav && mobileNav.querySelector('.bottomPanel');

    /*
     * Place INSIDE .mobileNavBar after the icon row (.bottomPanel), so the
     * header border line sits below the pill (not between icons and search).
     */
    if (mobileNav && bottomPanel) {
      if (bar.parentNode === mobileNav && bar.previousElementSibling === bottomPanel) {
        return;
      }
      if (bottomPanel.nextSibling) {
        mobileNav.insertBefore(bar, bottomPanel.nextSibling);
      } else {
        mobileNav.appendChild(bar);
      }
      return;
    }

    if (header && mobileNav && mobileNav.parentNode === header) {
      if (mobileNav.nextSibling) header.insertBefore(bar, mobileNav.nextSibling);
      else header.appendChild(bar);
      return;
    }

    if (header) {
      header.appendChild(bar);
      return;
    }

    if (document.body) document.body.insertBefore(bar, document.body.firstChild);
  }

  function enable() {
    injectCriticalCss();
    document.documentElement.classList.add(ROOT_CLASS);

    var header = document.getElementById('header');
    if (!header && !document.getElementById('usp-wrapper')) return;

    hideSearchIcons();
    var bar = buildBar();
    placeBar(bar);
    bar.style.display = 'block';
    bar.style.clear = 'both';

    if (!observer && window.MutationObserver && header) {
      observer = new MutationObserver(function () {
        if (!isMobile()) return;
        hideSearchIcons();
        var b = document.getElementById(BAR_ID);
        if (!b) {
          b = buildBar();
          placeBar(b);
        } else if (!b.parentNode) {
          placeBar(b);
        } else {
          placeBar(b);
        }
      });
      observer.observe(header, { childList: true, subtree: true });
    }

    /* Luigi mounts late */
    window.clearTimeout(retryTimer);
    retryTimer = window.setTimeout(function () {
      if (!isMobile()) return;
      hideSearchIcons();
      var b = document.getElementById(BAR_ID) || buildBar();
      placeBar(b);
    }, 800);
    window.setTimeout(function () {
      if (!isMobile()) return;
      hideSearchIcons();
      var b = document.getElementById(BAR_ID) || buildBar();
      placeBar(b);
    }, 2000);
  }

  function disable() {
    document.documentElement.classList.remove(ROOT_CLASS);
    var bar = document.getElementById(BAR_ID);
    if (bar) bar.style.display = 'none';
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function sync() {
    if (isMobile()) enable();
    else disable();
  }

  ready(function () {
    sync();
    if (mq) {
      if (mq.addEventListener) mq.addEventListener('change', sync);
      else if (mq.addListener) mq.addListener(sync);
    }
  });
})();
