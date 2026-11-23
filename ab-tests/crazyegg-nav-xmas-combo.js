/**
 * Crazy Egg A/B — Nav CRO: priority order + sticky bar (Variant)
 *
 * Desktop ≥1001px: NEW → Christmas → Sale → … → TV + sticky green bar
 * Mobile ≤1000px: sticky chips Christmas | Sale | NEW | Garden Plants
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-nav-xmas-combo.css
 *
 * Live: https://www.yougarden.com/
 */
(function () {
  'use strict';

  var MARK = 'ce-yg-nav-pri';
  var READY = 'ce-yg-nav-pri--ready';
  var STUCK = 'ce-yg-nav-pri--stuck';
  var CHIPS_ID = 'ce-yg-nav-pri-chips';
  var DESK_MQ = '(min-width: 1001px)';
  var MOBILE_MQ = '(max-width: 1000px)';

  if (document.documentElement.getAttribute('data-' + MARK) === '1') return;
  document.documentElement.setAttribute('data-' + MARK, '1');
  document.documentElement.classList.add(MARK);

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function isDesk() {
    return window.matchMedia && window.matchMedia(DESK_MQ).matches;
  }

  function isMobile() {
    return window.matchMedia && window.matchMedia(MOBILE_MQ).matches;
  }

  function rankLi(li) {
    if (!li) return 90;
    if (li.classList.contains('new')) return 10;
    if (li.classList.contains('xmas') || li.id === 'XMAS') return 20;
    if (li.classList.contains('sale')) return 30;
    if (li.id === 'FLOW') return 40;
    if (li.id === 'INDOOR') return 50;
    if (li.id === 'TAS') return 60;
    if (li.id === 'FVEG') return 70;
    if (li.id === 'OUTLIV') return 80;
    if (li.classList.contains('tv-button')) return 100;
    return 90;
  }

  function reorderDesktopMenu() {
    var menu = qs('#desktopNav > .centralWrapper > ul.menu');
    if (!menu || menu.getAttribute('data-' + MARK + '-ordered') === '1') return;

    var items = qsa(':scope > li', menu);
    if (items.length < 3) return;

    items
      .slice()
      .sort(function (a, b) {
        return rankLi(a) - rankLi(b);
      })
      .forEach(function (li) {
        menu.appendChild(li);
      });

    menu.setAttribute('data-' + MARK + '-ordered', '1');
  }

  function setupStickyDesktop() {
    var nav = qs('#desktopNav');
    if (!nav) return;

    nav.classList.add(READY);

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        var top = nav.getBoundingClientRect().top;
        var stuck = top <= 0 || window.scrollY > 80;
        document.documentElement.classList.toggle(STUCK, stuck);
        nav.classList.toggle(STUCK, stuck);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function chip(href, label, mod) {
    var a = document.createElement('a');
    a.className = MARK + '-chip' + (mod ? ' ' + MARK + '-chip--' + mod : '');
    a.href = href;
    a.textContent = label;
    a.setAttribute('data-ga4-type', 'navigation_links_clicks');
    a.setAttribute('data-' + MARK, '1');
    return a;
  }

  function setupMobileChips() {
    if (document.getElementById(CHIPS_ID)) return;

    var bar = document.createElement('div');
    bar.id = CHIPS_ID;
    bar.className = MARK + '-chips';
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Quick shop');

    var row = document.createElement('div');
    row.className = MARK + '-chips__row';

    var xmas = qs('#desktopNav li.top.xmas > a, #XMAS > a');
    var sale = qs('#desktopNav li.top.sale > a');
    var neu = qs('#desktopNav li.top.new > a');
    var garden = qs('#desktopNav #FLOW > a');

    row.appendChild(
      chip(
        (xmas && xmas.getAttribute('href')) || '/outdoor-living/gifts/christmas',
        'Christmas',
        'xmas'
      )
    );
    row.appendChild(
      chip((sale && sale.getAttribute('href')) || '/sale', 'Sale', 'sale')
    );
    row.appendChild(
      chip((neu && neu.getAttribute('href')) || '/new', 'NEW', 'new')
    );
    row.appendChild(
      chip(
        (garden && garden.getAttribute('href')) || '/garden-plants',
        'Garden Plants',
        'garden'
      )
    );

    bar.appendChild(row);

    var header = qs('#header') || qs('.header-container') || qs('#head-scroll');
    if (header && header.parentNode) {
      if (header.nextSibling) header.parentNode.insertBefore(bar, header.nextSibling);
      else header.parentNode.appendChild(bar);
    } else {
      document.body.insertBefore(bar, document.body.firstChild);
    }
  }

  function apply() {
    if (isDesk()) {
      reorderDesktopMenu();
      setupStickyDesktop();
      var chips = document.getElementById(CHIPS_ID);
      if (chips) chips.style.display = 'none';
    } else if (isMobile()) {
      setupMobileChips();
      var nav = qs('#desktopNav');
      if (nav) nav.classList.remove(READY, STUCK);
      document.documentElement.classList.remove(STUCK);
      var chipsShow = document.getElementById(CHIPS_ID);
      if (chipsShow) chipsShow.style.display = '';
    }
  }

  ready(function () {
    apply();
    setTimeout(apply, 400);
    setTimeout(apply, 1200);

    if (window.matchMedia) {
      var mq = window.matchMedia(DESK_MQ);
      if (mq.addEventListener) mq.addEventListener('change', apply);
      else if (mq.addListener) mq.addListener(apply);
    }
  });
})();
