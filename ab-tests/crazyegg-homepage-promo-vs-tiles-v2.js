/**
 * Crazy Egg — Homepage category pair test
 * VARIANT 2 (Custom JS)
 *
 * Hides the two blocks directly under the banner:
 *   .category-promotion-wrapper (Shop By Category 8-up + Shop Bestsellers)
 *
 * Leaves the next two blocks:
 *   4 large tiles + Top picks for you
 *
 * Paste into Crazy Egg Variant 2 → Custom JS
 * Pair with: crazyegg-homepage-promo-vs-tiles-v2.css
 */
(function () {
  'use strict';

  var MARK = 'ce-yg-hp-v2';
  var HIDE = 'ce-yg-hp-v2__hide';
  var SHOW = 'ce-yg-hp-v2__show';
  var MAX_MS = 8000;
  var POLL_MS = 100;
  var started = Date.now();

  function frontpage() {
    return (
      document.querySelector('body > main > div.frontpage') ||
      document.querySelector('main .frontpage') ||
      document.querySelector('.frontpage')
    );
  }

  function apply() {
    var fp = frontpage();
    if (!fp) return false;

    var promo = fp.querySelector(':scope > .category-promotion-wrapper') ||
      fp.querySelector('.category-promotion-wrapper');
    if (!promo) return false;

    promo.classList.add(HIDE);
    promo.classList.remove(SHOW);

    var tiles = fp.querySelector(':scope > .centralWrapperVisible > .category-landing-row4-wrapper');
    if (tiles && tiles.parentElement) tiles.parentElement.classList.add(SHOW);

    fp.classList.add(MARK);
    return true;
  }

  function tick() {
    if (apply()) return;
    if (Date.now() - started > MAX_MS) return;
    setTimeout(tick, POLL_MS);
  }

  document.documentElement.classList.add(MARK);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tick);
  } else {
    tick();
  }

  setTimeout(apply, 2000);
})();
