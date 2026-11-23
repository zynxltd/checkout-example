/**
 * Crazy Egg A/B — Homepage category blocks (Control vs Variant)
 *
 * Control (CMS base page — no CE CSS/JS):
 *   Billboard → 4 large category tiles (.category-landing-row4-wrapper)
 *            → Top picks for you (Fresh Relevance SoftBlock)
 *   The 8-up Shop By Category + Shop Bestsellers block must already be
 *   display:none on the CMS/base page (CE cannot style Control).
 *
 * Variant 1 (this script + CSS):
 *   Hide Control pair: 4 tiles + Top picks
 *   Show Variant pair: Shop By Category + Shop Bestsellers
 *     (.category-promotion-wrapper — overrides CMS display:none)
 *
 * Paste into Crazy Egg Variant 1 → Custom JS
 * Pair with: crazyegg-homepage-category-order.css
 *
 * Preview: https://yougardennew.mtechpreview.com/  (web / letmein2)
 * Live: https://www.yougarden.com/
 */
(function () {
  'use strict';

  var MARK = 'ce-yg-cat-order';
  var READY = 'ce-yg-cat-order--ready';
  var HIDE = 'ce-yg-cat-order__hide';
  var SHOW = 'ce-yg-cat-order__show';
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

  /** Variant — Shop By Category carousel + Shop Bestsellers slot */
  function findVariantBlock(fp) {
    return (
      qs(':scope > .category-promotion-wrapper', fp) ||
      qs('.category-promotion-wrapper', fp)
    );
  }

  /** Control — 4 large category tiles (outside the promo wrapper) */
  function findTilesBlock(fp, variantBlock) {
    var nodes = fp.querySelectorAll(':scope > .centralWrapperVisible, :scope > div');
    var i;
    var el;

    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      if (variantBlock && (el === variantBlock || variantBlock.contains(el))) continue;
      if (
        el.querySelector &&
        el.querySelector('.category-landing-row4-wrapper') &&
        !el.classList.contains('category-promotion-wrapper')
      ) {
        return el;
      }
    }

    // Direct row wrapper if it is a frontpage child
    var row = qs('.category-landing-row4-wrapper', fp);
    if (row && !(variantBlock && variantBlock.contains(row))) {
      return row.closest('.centralWrapperVisible, .centralWrapperVisibleText') || row;
    }

    return null;
  }

  /** Control — Top picks for you SoftBlock */
  function findPicksBlock(fp, variantBlock, tiles) {
    var nodes = fp.querySelectorAll(':scope > .centralWrapper, :scope > div');
    var i;
    var el;
    var text;

    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      if (el === variantBlock || el === tiles) continue;
      if (variantBlock && variantBlock.contains(el)) continue;
      text = (el.textContent || '').replace(/\s+/g, ' ');
      if (/Top picks for you/i.test(text) && el.querySelector('.strip-banner, [class*="yg___home___mp"]')) {
        return el;
      }
    }

    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      if (el === variantBlock || el === tiles) continue;
      if (el.querySelector && el.querySelector('.strip-banner')) {
        text = (el.textContent || '').replace(/\s+/g, ' ');
        if (/Top picks|MOST POPULAR|FROM £/i.test(text)) return el;
      }
    }

    return null;
  }

  function showEl(el) {
    if (!el) return;
    el.classList.add(SHOW);
    el.classList.remove(HIDE);
    // Clear CMS inline hide so CE CSS can show the block
    if (el.style && el.style.display === 'none') {
      el.style.removeProperty('display');
    }
    var nested = el.querySelectorAll('[style*="display: none"], [style*="display:none"]');
    var i;
    for (i = 0; i < nested.length; i++) {
      // Only clear hide on promo children that were CMS-hidden for Control
      if (
        nested[i].classList.contains('category-promotion-wrapper') ||
        nested[i].classList.contains('category-promotion-carousel') ||
        nested[i].classList.contains('tmpslot')
      ) {
        nested[i].style.removeProperty('display');
      }
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

    var variantBlock = findVariantBlock(fp);
    var tiles = findTilesBlock(fp, variantBlock);
    var picks = findPicksBlock(fp, variantBlock, tiles);

    // Variant block is required; tiles/picks hide when found (FR may lag)
    if (!variantBlock) return false;

    showEl(variantBlock);
    hideEl(tiles);
    hideEl(picks);

    // Keep variant block under billboard
    var billboard = qs(':scope > .billboard', fp);
    if (billboard && billboard.nextElementSibling !== variantBlock) {
      fp.insertBefore(variantBlock, billboard.nextElementSibling);
    }

    fp.classList.add(READY);
    done = !!(tiles && picks);

    if (done && observer) {
      observer.disconnect();
      observer = null;
    }

    // Re-run until both control blocks are found + hidden (FR async)
    return !!(tiles && picks);
  }

  function reassert() {
    var fp = frontpage();
    if (!fp) return;
    var variantBlock = findVariantBlock(fp);
    var tiles = findTilesBlock(fp, variantBlock);
    var picks = findPicksBlock(fp, variantBlock, tiles);
    showEl(variantBlock);
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
