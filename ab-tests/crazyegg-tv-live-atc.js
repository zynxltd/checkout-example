/**
 * Crazy Egg — YouGarden TV Live listing CRO
 *
 * ADD TO BASKET actually adds (parent <a> currently sends shoppers to the PDP).
 * Image / title / price still go to the product page.
 * No added-to-basket overlay (this page does not have one).
 * Green ATC button is in the paired CSS.
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-tv-live-atc.css
 * Target URL: https://www.yougarden.com/tv-live
 *
 * ATC uses the native doAjaxBag(token, stno, qty) already on each .mainButton.
 * Do not send the catalog SKU from /item-p-{sku}/ — ajaxbag needs ST00….
 */
(function () {
  'use strict';

  var MARK = 'ce-yg-tv-live';
  var ATTR = 'data-' + MARK;
  var BUSY = 'data-ce-yg-busy';
  var ADDED = 'data-ce-yg-added';
  var LABEL = 'ADD TO BASKET';
  var OVERLAY_IDS = {
    fullScreen: 1,
    'basket-popup-wrapper': 1
  };

  if (document.documentElement.getAttribute(ATTR) === '1') return;
  if (!/\/tv-live\/?$/i.test(window.location.pathname)) return;

  document.documentElement.classList.add(MARK);
  document.documentElement.setAttribute(ATTR, '1');

  function jq() {
    return window.jQuery || window.$;
  }

  function parseBag(btn) {
    var raw = btn.getAttribute('onclick') || '';
    var m = raw.match(
      /doAjaxBag\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*,\s*['"]?([^'")\s]+)['"]?/
    );
    if (!m) return null;
    if (!/^ST\d+/i.test(m[2])) return null;
    return { token: m[1], stno: m[2], qty: m[3] || '1' };
  }

  function setLabel(btn, text) {
    btn.textContent = text;
  }

  function hideAddedOverlay() {
    var ids = ['fullScreen', 'basket-popup-wrapper'];
    var i;
    var el;
    var $ = jq();
    if ($ && $.fn && $.fn.hide) {
      $('#fullScreen, #basket-popup-wrapper').stop(true, true).hide();
    }
    for (i = 0; i < ids.length; i++) {
      el = document.getElementById(ids[i]);
      if (!el) continue;
      el.style.setProperty('display', 'none', 'important');
      el.style.setProperty('opacity', '0', 'important');
      el.style.setProperty('pointer-events', 'none', 'important');
    }
  }

  function whileAdding(run) {
    var $ = jq();
    var origAnimate;
    var origFadeIn;
    var origUpsell = window.upsellSlider;

    window.upsellSlider = function () {};

    if ($ && $.fn) {
      origAnimate = $.fn.animate;
      origFadeIn = $.fn.fadeIn;
      if (origAnimate) {
        $.fn.animate = function (props) {
          if (props && (props.scrollTop === 0 || props.scrollTop === '0')) {
            var el = this && this[0];
            var tag = el && el.tagName && el.tagName.toLowerCase();
            if (tag === 'html' || tag === 'body') return this;
          }
          return origAnimate.apply(this, arguments);
        };
      }
      if (origFadeIn) {
        $.fn.fadeIn = function () {
          var el = this && this[0];
          if (el && OVERLAY_IDS[el.id]) return this;
          return origFadeIn.apply(this, arguments);
        };
      }
    }

    try {
      run();
    } finally {
      window.setTimeout(function () {
        if (origAnimate) $.fn.animate = origAnimate;
        if (origFadeIn) $.fn.fadeIn = origFadeIn;
        window.upsellSlider = origUpsell;
        hideAddedOverlay();
      }, 2000);
    }
  }

  function addToBag(btn, bag) {
    var ret;
    setLabel(btn, 'ADDING…');
    btn.setAttribute(BUSY, '1');
    if (typeof window.doAjaxBag !== 'function') {
      btn.removeAttribute(BUSY);
      setLabel(btn, LABEL);
      return;
    }
    whileAdding(function () {
      ret = window.doAjaxBag(bag.token, bag.stno, bag.qty);
    });
    function done(ok) {
      hideAddedOverlay();
      btn.removeAttribute(BUSY);
      if (ok) {
        btn.setAttribute(ADDED, '1');
        setLabel(btn, 'ADDED');
        window.setTimeout(function () {
          btn.removeAttribute(ADDED);
          setLabel(btn, LABEL);
        }, 2200);
      } else {
        setLabel(btn, LABEL);
      }
    }
    if (ret && typeof ret.done === 'function') {
      ret.done(function () { done(true); }).fail(function () { done(false); });
      return;
    }
    window.setTimeout(function () { done(true); }, 600);
  }

  function onClick(e) {
    var btn = e.target && e.target.closest
      ? e.target.closest('.promotional-blocks .mainButton')
      : null;
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();

    if (btn.getAttribute(BUSY) === '1') return;

    var bag = parseBag(btn);
    if (!bag) return;
    addToBag(btn, bag);
  }

  document.addEventListener('click', onClick, true);
})();
