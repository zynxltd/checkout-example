/**
 * Crazy Egg — Gelica on site sections
 *
 * Category pages: .top-heading-block title, intro heading, and paragraph.
 * Title and intro heading are Gelica bold. Paragraph is Gelica regular.
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-gelica-sections.css
 *
 * Example: https://www.yougarden.com/garden-plants
 */
(function () {
  'use strict';

  var MARK = 'ce-yg-gelica';
  var KIT = 'https://use.typekit.net/hrf1tkz.css';
  var FAMILY = 'gelica, Gelica, Georgia, "Times New Roman", serif';

  if (document.documentElement.getAttribute('data-' + MARK) === '1') return;

  function headings() {
    return Array.prototype.slice.call(
      document.querySelectorAll(
        '.top-heading-block h1, .top-heading-block .categoryText h2, .top-heading-block .mobile-top-text h2, .top-heading-block .categoryText p, .top-heading-block .categoryText li'
      )
    );
  }

  function loadKit() {
    if (document.querySelector('link[data-ce-yg-gelica-kit]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = KIT;
    link.setAttribute('data-ce-yg-gelica-kit', '1');
    document.head.appendChild(link);
  }

  function paint() {
    var nodes = headings();
    if (!nodes.length) return false;
    loadKit();
    nodes.forEach(function (el) {
      var weight = el.tagName === 'P' || el.tagName === 'LI' ? '400' : '700';
      el.style.setProperty('font-family', FAMILY, 'important');
      el.style.setProperty('font-weight', weight, 'important');
      el.style.setProperty('font-synthesis', 'none', 'important');
    });
    document.documentElement.setAttribute('data-' + MARK, '1');
    document.documentElement.classList.add(MARK);
    return true;
  }

  function start() {
    if (paint()) return;
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (paint() || tries > 40) clearInterval(timer);
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
