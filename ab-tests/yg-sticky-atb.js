/**
 * Crazy Egg — PDP sticky Add to Basket (Variant 3)
 *
 * Phone only. Hidden at 600px wide and above.
 * Shows once the shopper has scrolled to #plantcalendar (and #buy-button is off screen).
 * Hides when the site footer enters the screen, and stays hidden past it.
 * A full-width hovering pill button, labelled Add to basket. No product photo,
 * name, or price.
 * Products with size options: the button opens those options and scrolls them
 * into view under the header. Products without options click the live button.
 * Pre-order PDPs use .buy-button.pre-order-msg (no #buy-button); the button
 * clicks that control and still reads Add to basket.
 * While the button is open, the dismissed-offer badge (…__notification) is
 * hidden so it cannot cover the button. #return-to-top is moved to sit just
 * above it. Both are restored when the button hides.
 * The popup can reveal the badge on a timer after the button is already open,
 * so the hide is re-applied until the button closes.
 *
 * Paste into Crazy Egg Variant 3 → Custom JS
 * Pair with: crazyegg-pdp-sticky-atb-v3.css
 */
(function () {
  'use strict';

  var BAR_ID = 'ce-yg-atb';
  var ON = 'ce-yg-atb-on';
  var MOBILE = '(max-width: 599px)';
  var LABEL = 'Add to basket';
  var bar = null;
  var started = false;
  var parkTimer = null;

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function isMobile() {
    /* innerWidth matches the device-toolbar number (440 on iPhone 15 Pro Max).
       matchMedia can stay on the wide desktop window in that mode. */
    return window.innerWidth <= 599 || window.matchMedia(MOBILE).matches;
  }

  function buyButton() {
    return document.getElementById('buy-button')
      || qs('.buy-wrapper > .buy-button');
  }

  function hasOptions() {
    return !!qs('#style-options-drop-box .option-row');
  }

  function buttonOffscreen(el) {
    var r = el.getBoundingClientRect();
    if (!r || (r.width === 0 && r.height === 0)) return true;
    return r.bottom < 8 || r.top > window.innerHeight - 8;
  }

  /** Hide once the site footer is on screen, including anything scrolled past it. */
  function footerReached() {
    var footer = qs('.footerMiddle') || qs('footer');
    if (!footer) return false;
    var r = footer.getBoundingClientRect();
    if (!r || (r.width === 0 && r.height === 0)) return false;
    return r.top < window.innerHeight;
  }

  /** Button stays hidden until Plant Calendar has entered the screen. */
  function calendarReached() {
    var el = document.getElementById('plantcalendar');
    if (!el) return true;
    var r = el.getBoundingClientRect();
    if (!r || (r.width === 0 && r.height === 0)) return false;
    return r.top < window.innerHeight - 24;
  }

  function headerGap() {
    var header = document.getElementById('head-scroll') || qs('header') || qs('#header');
    var bottom = 0;
    if (header) {
      var rect = header.getBoundingClientRect();
      var pos = window.getComputedStyle(header).position;
      if ((pos === 'fixed' || pos === 'sticky') && rect.bottom > 0 && rect.top < 20) {
        bottom = rect.bottom;
      }
    }
    return Math.max(8, Math.round(bottom));
  }

  /** Same corner radius as the on-page Add to basket control. */
  function buttonRadius() {
    var live = buyButton();
    var value = live ? window.getComputedStyle(live).borderTopLeftRadius : '';
    if (!value || value === '0px') return '10px';
    return value;
  }

  function paint(node, show) {
    node.style.setProperty('display', show ? 'block' : 'none', 'important');
    node.style.setProperty('position', 'fixed', 'important');
    node.style.setProperty('left', '16px', 'important');
    node.style.setProperty('right', '16px', 'important');
    node.style.setProperty('bottom', 'calc(12px + env(safe-area-inset-bottom))', 'important');
    node.style.setProperty('z-index', '2147483000', 'important');
    node.style.setProperty('box-sizing', 'border-box', 'important');
    node.style.setProperty('width', 'auto', 'important');
    node.style.setProperty('max-width', 'none', 'important');
    node.style.setProperty('margin', '0', 'important');
    node.style.setProperty('padding', '14px 20px', 'important');
    node.style.setProperty('transform', 'none', 'important');
    node.style.setProperty('border', '0', 'important');
    node.style.setProperty('border-radius', buttonRadius(), 'important');
    node.style.setProperty('background', '#468900', 'important');
    node.style.setProperty('color', '#ffffff', 'important');
    node.style.setProperty('box-shadow', '0 8px 22px rgba(0,0,0,0.22)', 'important');
    node.style.setProperty('font', '700 14px/1.15 Arial, Helvetica, sans-serif', 'important');
    node.style.setProperty('letter-spacing', '0.06em', 'important');
    node.style.setProperty('text-transform', 'uppercase', 'important');
    node.style.setProperty('text-align', 'center', 'important');
    node.style.setProperty('white-space', 'nowrap', 'important');
    node.style.setProperty('cursor', 'pointer', 'important');
    document.documentElement.classList.toggle(ON, show);
    if (show) {
      var height = node.offsetHeight;
      document.documentElement.style.setProperty('--ce-yg-atb-h', height + 'px');
      document.documentElement.style.setProperty('padding-bottom', (height + 28) + 'px', 'important');
      clearOfferChrome(true, height);
    } else {
      document.documentElement.style.removeProperty('--ce-yg-atb-h');
      document.documentElement.style.removeProperty('padding-bottom');
      clearOfferChrome(false, 0);
    }
  }

  function offerBadges() {
    return document.querySelectorAll('[id$="__notification"]');
  }

  /**
   * The popup sets display:block !important on the badge, which beats a
   * stylesheet rule. Hide it inline while the button is open, then give the
   * popup its own inline styles back.
   */
  function parkOfferBadges(hide) {
    var nodes = offerBadges();
    var i;
    var node;
    for (i = 0; i < nodes.length; i++) {
      node = nodes[i];
      if (hide) {
        if (node.getAttribute('data-ce-yg-atb-parked') === '1' && node.style.display === 'none') continue;
        node.setAttribute('data-ce-yg-atb-parked', '1');
        node.style.setProperty('display', 'none', 'important');
        node.style.setProperty('visibility', 'hidden', 'important');
        node.style.setProperty('pointer-events', 'none', 'important');
        continue;
      }
      if (node.getAttribute('data-ce-yg-atb-parked') !== '1') continue;
      node.style.removeProperty('display');
      node.style.removeProperty('visibility');
      node.style.removeProperty('pointer-events');
      node.removeAttribute('data-ce-yg-atb-parked');
    }
  }

  /** Site button is position:fixed; bottom:80px, which lands on the pill. */
  function placeScrollTop(barHeight) {
    var el = document.getElementById('return-to-top');
    if (!el) return;
    if (!barHeight) {
      if (el.getAttribute('data-ce-yg-atb-top') === '1') {
        el.style.removeProperty('bottom');
        el.removeAttribute('data-ce-yg-atb-top');
      }
      return;
    }
    el.setAttribute('data-ce-yg-atb-top', '1');
    el.style.setProperty('bottom', Math.round(barHeight + 28) + 'px', 'important');
  }

  function clearOfferChrome(hide, barHeight) {
    if (parkTimer) {
      window.clearInterval(parkTimer);
      parkTimer = null;
    }
    parkOfferBadges(hide);
    placeScrollTop(barHeight);
    /* Site scroll handlers can write bottom after ours. Re-apply at the end of the frame. */
    window.requestAnimationFrame(function () {
      var open = document.documentElement.classList.contains(ON) && bar && bar.offsetHeight;
      parkOfferBadges(!!open);
      placeScrollTop(open ? bar.offsetHeight : 0);
    });
    if (!hide) return;
    parkTimer = window.setInterval(function () {
      if (!document.documentElement.classList.contains(ON) || !bar) return;
      parkOfferBadges(true);
      placeScrollTop(bar.offsetHeight);
    }, 250);
  }

  function scrollOptionsIntoView() {
    var price = document.getElementById('main-from-price');
    var options = document.getElementById('style-options')
      || document.getElementById('style-options-head')
      || document.getElementById('style-options-drop-box');
    var target = price || options || document.getElementById('buy-button-wrapper') || buyButton();
    if (!target) return;
    /* Land the price (or the options, a little lower) under the header, not flush to it. */
    var gap = headerGap() + (price ? 20 : 72);
    var top = window.pageYOffset + target.getBoundingClientRect().top - gap;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  function addToBasket() {
    var live = buyButton();
    if (hasOptions()) {
      if (live) live.click();
      window.setTimeout(scrollOptionsIntoView, 60);
      window.setTimeout(scrollOptionsIntoView, 320);
      return;
    }
    if (live) live.click();
  }

  function build() {
    if (document.getElementById(BAR_ID)) return document.getElementById(BAR_ID);

    var node = document.createElement('button');
    node.type = 'button';
    node.id = BAR_ID;
    node.className = 'ce-yg-atb';
    node.textContent = LABEL;
    node.addEventListener('click', addToBasket);
    document.body.appendChild(node);
    paint(node, false);
    return node;
  }

  function tick() {
    var live = buyButton();
    if (!isMobile() || !live) {
      if (bar) paint(bar, false);
      return;
    }
    if (!bar) bar = build();
    paint(bar, buttonOffscreen(live) && calendarReached() && !footerReached());
  }

  function arm() {
    if (started) return;
    if (!buyButton()) return;
    started = true;
    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', tick);
      window.visualViewport.addEventListener('scroll', tick);
    }
    if (window.matchMedia(MOBILE).addEventListener) {
      window.matchMedia(MOBILE).addEventListener('change', tick);
    }
  }

  function boot() {
    arm();
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      arm();
      tick();
      if (started && tries > 8) clearInterval(timer);
      if (tries > 40) clearInterval(timer);
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
