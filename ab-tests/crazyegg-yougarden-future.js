/**
 * YouGarden — Future CRO injection (JS)
 * Target: https://www.yougarden.com/
 *
 * Paste into Crazy Egg variant → Custom JavaScript.
 * Also paste crazyegg-yougarden-future.css into Custom CSS (required for site styling).
 *
 * Scopes all changes under html.ce-yg-future — control traffic unaffected.
 * Does not modify checkout or payment flows.
 */
(function () {
  'use strict';

  var ROOT_CLASS = 'ce-yg-future';
  var STYLE_ID = 'ce-yg-future-widgets';
  var INIT_MARK = 'data-ce-yg-future-init';

  /* ── Feature flags ── */
  var CONFIG = {
    scrollProgress: true,
    glassHeader: true,
    scrollReveal: true,
    stickyMobileBasket: true,
    backToTop: true,
    socialProofToast: true,
    cartCountPulse: true,
    stickyBasketMinItems: 1,
    toastDelayMs: 8000,
    toastShowMs: 5000,
    revealThreshold: 0.12,
    scrollHeaderPx: 48,
    bttShowPx: 400
  };

  var TOAST_MESSAGES = [
    '<strong>12 gardeners</strong> added bulbs to basket in the last hour',
    '<strong>Free delivery</strong> on orders over £50 — today only',
    '<strong>Club members</strong> save extra on selected lines',
    '<strong>Spring planting</strong> — bestsellers selling fast this week'
  ];

  if (document.documentElement.getAttribute(INIT_MARK)) return;
  document.documentElement.setAttribute(INIT_MARK, '1');
  document.documentElement.classList.add(ROOT_CLASS);

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Minimal widget CSS if main CSS sheet not loaded */
  function injectWidgetFallbackCss() {
    if (document.getElementById(STYLE_ID)) return;
    var el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent =
      'html.ce-yg-future .ce-yg-scroll-progress{position:fixed;top:0;left:0;z-index:99999;width:100%;height:3px;pointer-events:none}' +
      'html.ce-yg-future .ce-yg-scroll-progress__bar{display:block;height:100%;width:0;background:linear-gradient(90deg,#ccea81,#264f1c,#e3185d)}' +
      'html.ce-yg-future .ce-yg-sticky-basket{position:fixed;bottom:0;left:0;right:0;z-index:99990;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;background:#fff;border-top:1px solid #e0d6cb;transform:translateY(110%);transition:transform .4s ease}' +
      'html.ce-yg-future .ce-yg-sticky-basket.is-visible{transform:translateY(0)}' +
      'html.ce-yg-future .ce-yg-btt{position:fixed;right:20px;bottom:20px;z-index:99980;width:48px;height:48px;border:0;border-radius:50%;background:#264f1c;color:#fff;cursor:pointer;opacity:0;visibility:hidden;transition:opacity .3s,visibility .3s}' +
      'html.ce-yg-future .ce-yg-btt.is-visible{opacity:1;visibility:visible}' +
      'html.ce-yg-future .ce-yg-toast{position:fixed;left:16px;bottom:16px;z-index:99985;max-width:320px;padding:12px 16px;border-radius:14px;background:rgba(255,255,255,.9);border:1px solid rgba(38,79,28,.12);font:13px Arial,sans-serif;opacity:0;transition:opacity .4s}' +
      'html.ce-yg-future .ce-yg-toast.is-visible{opacity:1}' +
      '@media(min-width:768px){html.ce-yg-future .ce-yg-sticky-basket{display:none!important}}';
    document.head.appendChild(el);
  }

  /* ── Scroll progress ── */
  function initScrollProgress() {
    if (!CONFIG.scrollProgress || reducedMotion) return;

    var wrap = document.createElement('div');
    wrap.className = 'ce-yg-scroll-progress';
    wrap.setAttribute('aria-hidden', 'true');
    var bar = document.createElement('div');
    bar.className = 'ce-yg-scroll-progress__bar';
    wrap.appendChild(bar);
    document.body.appendChild(wrap);

    var ticking = false;
    function update() {
      var doc = document.documentElement;
      var scrollTop = window.scrollY || doc.scrollTop;
      var height = doc.scrollHeight - doc.clientHeight;
      var pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = pct + '%';

      if (CONFIG.glassHeader) {
        document.documentElement.classList.toggle('ce-yg-scrolled', scrollTop > CONFIG.scrollHeaderPx);
      }

      if (CONFIG.backToTop) {
        var btt = document.querySelector('.ce-yg-btt');
        if (btt) btt.classList.toggle('is-visible', scrollTop > CONFIG.bttShowPx);
      }

      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  /* ── Scroll reveal ── */
  function initScrollReveal() {
    if (!CONFIG.scrollReveal || reducedMotion || !window.IntersectionObserver) return;

    var selector =
      '.category-box, .category-landing-row4-wrapper .block, ' +
      '.promotional-blocks .item, .fp-section, .centralWrapper.text';

    function markTargets() {
      document.querySelectorAll(selector).forEach(function (node) {
        if (!node.classList.contains('ce-yg-reveal')) {
          node.classList.add('ce-yg-reveal');
        }
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('ce-yg-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: CONFIG.revealThreshold, rootMargin: '0px 0px -40px 0px' }
    );

    function observeAll() {
      markTargets();
      document.querySelectorAll('.ce-yg-reveal:not(.ce-yg-revealed)').forEach(function (el) {
        observer.observe(el);
      });
    }

    observeAll();
    return observeAll;
  }

  /* ── Cart helpers ── */
  function getCartCount() {
    var el = document.getElementById('header-cart-count') || document.getElementById('topbar-cart-count');
    if (!el) return 0;
    var n = parseInt(String(el.textContent).replace(/\D/g, ''), 10);
    return isNaN(n) ? 0 : n;
  }

  function getBasketUrl() {
    var link =
      document.querySelector('#basketWrapper a[href*="basket"]') ||
      document.querySelector('a[href*="/basket"]') ||
      document.querySelector('a[href*="/cart"]');
    return link ? link.getAttribute('href') : '/basket';
  }

  /* ── Sticky mobile basket bar ── */
  function initStickyBasket() {
    if (!CONFIG.stickyMobileBasket) return;

    var bar = document.createElement('div');
    bar.className = 'ce-yg-sticky-basket';
    bar.innerHTML =
      '<div class="ce-yg-sticky-basket__meta">' +
      '<strong>Your basket</strong>' +
      '<span class="ce-yg-sticky-basket__count">0 items</span>' +
      '</div>' +
      '<a class="ce-yg-sticky-basket__cta" href="' + getBasketUrl() + '">View basket</a>';
    document.body.appendChild(bar);

    var countEl = bar.querySelector('.ce-yg-sticky-basket__count');
    var cta = bar.querySelector('.ce-yg-sticky-basket__cta');

    function refresh() {
      var count = getCartCount();
      var visible = count >= CONFIG.stickyBasketMinItems && window.innerWidth < 768;
      bar.classList.toggle('is-visible', visible);
      document.documentElement.classList.toggle('ce-yg-has-sticky-basket', visible);
      if (countEl) {
        countEl.textContent = count + (count === 1 ? ' item' : ' items');
      }
      if (cta) cta.setAttribute('href', getBasketUrl());
    }

    refresh();
    window.addEventListener('resize', refresh, { passive: true });
    return refresh;
  }

  /* ── Back to top ── */
  function initBackToTop() {
    if (!CONFIG.backToTop) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ce-yg-btt';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M12 5l-7 7h4v7h6v-7h4l-7-7z" fill="currentColor"/>' +
      '</svg>';
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
    document.body.appendChild(btn);
  }

  /* ── Social proof toast ── */
  function initSocialProofToast() {
    if (!CONFIG.socialProofToast || reducedMotion) return;

    var toast = document.createElement('div');
    toast.className = 'ce-yg-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);

    var index = 0;
    var hideTimer;

    function showNext() {
      toast.innerHTML = TOAST_MESSAGES[index % TOAST_MESSAGES.length];
      index += 1;
      toast.classList.add('is-visible');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        toast.classList.remove('is-visible');
      }, CONFIG.toastShowMs);
    }

    setTimeout(showNext, CONFIG.toastDelayMs);
    setInterval(function () {
      if (!toast.classList.contains('is-visible')) showNext();
    }, CONFIG.toastDelayMs + CONFIG.toastShowMs + 2000);
  }

  /* ── Cart count pulse on change ── */
  function initCartPulse(refreshSticky) {
    if (!CONFIG.cartCountPulse) return;

    var lastCount = getCartCount();
    var targets = document.querySelectorAll('#header-cart-count, #topbar-cart-count');

    function pulse() {
      targets.forEach(function (el) {
        el.classList.remove('ce-yg-cart-pulse');
        void el.offsetWidth;
        el.classList.add('ce-yg-cart-pulse');
      });
    }

    function check() {
      var count = getCartCount();
      if (count !== lastCount) {
        if (count > lastCount) pulse();
        lastCount = count;
        if (typeof refreshSticky === 'function') refreshSticky();
      }
    }

    if (window.MutationObserver && targets.length) {
      targets.forEach(function (el) {
        new MutationObserver(check).observe(el, { childList: true, characterData: true, subtree: true });
      });
    }

    setInterval(check, 1500);
  }

  /* ── Boot ── */
  function boot() {
    injectWidgetFallbackCss();
    initScrollProgress();
    initBackToTop();
    var refreshSticky = initStickyBasket();
    initCartPulse(refreshSticky);
    initSocialProofToast();
    return initScrollReveal();
  }

  var reobserve = boot();

  if (window.MutationObserver && typeof reobserve === 'function') {
    var mo = new MutationObserver(function () {
      reobserve();
      if (typeof reobserve === 'function') {
        /* sticky basket count on DOM churn */
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
})();
