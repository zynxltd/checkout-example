/**
 * Crazy Egg VARIANT — Custom JS
 *
 * Control (CMS, no CE): hides 8-up + Shop Bestsellers
 * Variant (this script): shows 8-up, hides 4 tiles + Top picks
 *
 * Live structure (yougarden.com /):
 *   [0] billboard
 *   [1] .centralWrapperVisible — 4 tiles + Top picks (together)
 *   [2] .category-promotion-wrapper — 8-up (display:none by CMS)
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: yg-cat-cards.css
 */
(function () {
  'use strict';

  var MARK = 'ce-yg-hp-v1';
  var HIDE = 'ce-yg-hp-v1__hide';
  var SHOW = 'ce-yg-hp-v1__show';
  var MAX_MS = 12000;
  var POLL_MS = 100;
  var started = Date.now();
  var observer = null;
  var done = false;

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function frontpage() {
    return qs('body > main > div.frontpage') || qs('main .frontpage') || qs('.frontpage');
  }

  function findPromo(fp) {
    return qs(':scope > .category-promotion-wrapper', fp) || qs('.category-promotion-wrapper', fp);
  }

  /**
   * Wrapper that holds the first 4-tile row (and usually Top picks on the same block).
   * Skips later .category-landing-row4-wrapper blocks further down the page.
   */
  function findTilesWrap(fp, promo) {
    var row = qs(':scope > .centralWrapperVisible > .category-landing-row4-wrapper', fp);
    if (row && !(promo && promo.contains(row))) {
      return row.parentElement;
    }

    var nodes = fp.querySelectorAll(':scope > .centralWrapperVisible, :scope > div');
    var i;
    var el;
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      if (promo && (el === promo || promo.contains(el))) continue;
      if (el.querySelector && el.querySelector(':scope > .category-landing-row4-wrapper')) {
        return el;
      }
    }

    return null;
  }

  /** Top picks SoftBlock — only if it sits outside the 4-tile wrapper. */
  function findPicksWrap(fp, promo, tiles) {
    if (tiles && /Top picks for you/i.test(tiles.textContent || '')) {
      return null;
    }

    var nodes = fp.querySelectorAll(':scope > .centralWrapper, :scope > .centralWrapperVisible, :scope > div');
    var i;
    var el;
    var text;
    var slot;

    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      if (el === promo || el === tiles) continue;
      if (promo && promo.contains(el)) continue;
      if (tiles && tiles.contains(el)) continue;
      text = (el.textContent || '').replace(/\s+/g, ' ');
      slot = el.querySelector('.tmspslot, [class*="__sb-wrapper"]');
      if (/Top picks for you/i.test(text) && slot) return el;
    }

    return null;
  }

  function showEl(el) {
    if (!el) return;
    el.classList.add(SHOW);
    el.classList.remove(HIDE);
    if (el.style && el.style.display === 'none') {
      el.style.removeProperty('display');
    }
  }

  function hideEl(el) {
    if (!el) return;
    el.classList.add(HIDE);
    el.classList.remove(SHOW);
  }

  function apply() {
    var fp = frontpage();
    if (!fp) return false;

    var promo = findPromo(fp);
    var tiles = findTilesWrap(fp, promo);
    var picks = findPicksWrap(fp, promo, tiles);

    if (!promo) return false;

    showEl(promo);
    hideEl(tiles);
    hideEl(picks);

    fp.classList.add(MARK);
    /* Top picks often lives inside the tiles wrapper — tiles alone is enough */
    done = !!(tiles && (picks || /Top picks for you/i.test(tiles.textContent || '')));

    if (done && observer) {
      observer.disconnect();
      observer = null;
    }

    return done;
  }

  function reassert() {
    var fp = frontpage();
    if (!fp) return;
    var promo = findPromo(fp);
    var tiles = findTilesWrap(fp, promo);
    var picks = findPicksWrap(fp, promo, tiles);
    showEl(promo);
    hideEl(tiles);
    hideEl(picks);
  }

  function startObserver() {
    var fp = frontpage();
    if (!fp || typeof MutationObserver === 'undefined') return;

    observer = new MutationObserver(function () {
      if (done) {
        reassert();
        return;
      }
      if (apply()) return;
      if (Date.now() - started > MAX_MS && observer) {
        observer.disconnect();
        observer = null;
      }
    });

    observer.observe(fp, { childList: true, subtree: true });
  }

  function tick() {
    if (apply()) return;
    if (Date.now() - started > MAX_MS) return;
    setTimeout(tick, POLL_MS);
  }

  document.documentElement.classList.add(MARK);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      startObserver();
      tick();
    });
  } else {
    startObserver();
    tick();
  }

  setTimeout(function () {
    done = false;
    apply();
  }, 2500);
})();
