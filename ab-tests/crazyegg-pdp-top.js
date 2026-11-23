/**
 * Crazy Egg — PDP top buy column
 *
 * Phone and tablet: the gallery is full width, but the buy column is inset
 * (side margin, a short heading, indented bullets). This starts that column
 * on the same left edge as the images and lets Add to basket fill the row.
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-pdp-top.css
 *
 * Example: https://www.yougarden.com/item-s-pa439/peace-lily-spathiphyllum-cupido
 */
(function () {
  'use strict';

  var MARK = 'ce-yg-pdp-top';
  var MQ = window.matchMedia('(max-width: 900px)');

  if (document.documentElement.getAttribute('data-' + MARK) === '1') return;
  if (!/\/item-[sp]-/i.test(window.location.pathname)) return;

  function set(el, prop, value) {
    if (!el) return;
    el.style.setProperty(prop, value, 'important');
  }

  function clearProps(el, props) {
    if (!el) return;
    props.forEach(function (prop) {
      el.style.removeProperty(prop);
    });
  }

  function nodes() {
    var right = document.querySelector('.product-right-wrapper');
    if (!right) return null;
    return {
      images: document.querySelector('.images-wrapper'),
      right: right,
      head: right.querySelector('.product-heading-wrapper'),
      h1: right.querySelector('h1'),
      sub: right.querySelector('.sub-head'),
      price: right.querySelector('.price-wrapper'),
      pp: right.querySelector('.pp-wrapper'),
      buy: right.querySelector('.buy-wrapper'),
      options: right.querySelector('#style-options'),
      qty: right.querySelector('.qtyBlock'),
      btnWrap: right.querySelector('#buy-button-wrapper'),
      btn: right.querySelector('#buy-button'),
      iconsHead: right.querySelector('.icons-heading'),
      icons: right.querySelector('.icons-wrapper'),
      points: right.querySelector('.points'),
      uls: right.querySelectorAll('.points ul, .offer-description ul')
    };
  }

  function paint() {
    var n = nodes();
    if (!n) return false;

    document.documentElement.classList.add(MARK);
    document.documentElement.setAttribute('data-' + MARK, '1');

    var block = [n.images, n.right, n.head, n.h1, n.sub, n.price, n.pp, n.buy, n.options, n.qty, n.btnWrap, n.btn, n.iconsHead, n.icons, n.points];

    if (!MQ.matches) {
      block.forEach(function (el) {
        clearProps(el, [
          'float', 'clear', 'display', 'width', 'max-width', 'min-width',
          'margin', 'margin-left', 'margin-right', 'margin-top',
          'padding', 'padding-left', 'padding-right',
          'box-sizing', 'flex', 'flex-wrap', 'column-gap', 'row-gap', 'align-items',
          'border-radius', 'white-space'
        ]);
      });
      Array.prototype.forEach.call(n.uls, function (ul) {
        clearProps(ul, ['width', 'margin-left', 'padding-left', 'box-sizing']);
      });
      return true;
    }

    [n.images, n.right].forEach(function (el) {
      set(el, 'float', 'none');
      set(el, 'clear', 'both');
      set(el, 'width', '100%');
      set(el, 'max-width', '100%');
      set(el, 'margin-left', '0');
      set(el, 'margin-right', '0');
      set(el, 'box-sizing', 'border-box');
    });

    set(n.right, 'margin-top', '12px');
    set(n.right, 'padding-left', '16px');
    set(n.right, 'padding-right', '16px');

    [n.head, n.h1, n.sub, n.price, n.pp].forEach(function (el) {
      set(el, 'float', 'none');
      set(el, 'width', '100%');
      set(el, 'max-width', '100%');
      set(el, 'margin-left', '0');
      set(el, 'margin-right', '0');
      set(el, 'box-sizing', 'border-box');
    });

    set(n.buy, 'display', 'flex');
    set(n.buy, 'flex-wrap', 'wrap');
    set(n.buy, 'align-items', 'center');
    set(n.buy, 'column-gap', '12px');
    set(n.buy, 'row-gap', '12px');
    set(n.buy, 'float', 'none');
    set(n.buy, 'width', '100%');
    set(n.buy, 'margin', '0');

    [n.options].forEach(function (el) {
      set(el, 'flex', '1 0 100%');
      set(el, 'float', 'none');
      set(el, 'width', '100%');
      set(el, 'max-width', '100%');
      set(el, 'margin-left', '0');
      set(el, 'margin-right', '0');
      set(el, 'box-sizing', 'border-box');
    });

    set(n.qty, 'flex', '0 0 148px');
    set(n.qty, 'float', 'none');
    set(n.qty, 'width', '148px');
    set(n.qty, 'margin', '0');

    set(n.btnWrap, 'flex', '1 1 160px');
    set(n.btnWrap, 'float', 'none');
    set(n.btnWrap, 'width', 'auto');
    set(n.btnWrap, 'min-width', '160px');
    set(n.btnWrap, 'margin', '0');

    set(n.btn, 'float', 'none');
    set(n.btn, 'display', 'block');
    set(n.btn, 'width', '100%');
    set(n.btn, 'max-width', 'none');
    set(n.btn, 'margin', '0');
    set(n.btn, 'border-radius', '10px');
    set(n.btn, 'box-sizing', 'border-box');
    set(n.btn, 'white-space', 'nowrap');

    [n.iconsHead, n.icons, n.points].forEach(function (el) {
      set(el, 'float', 'none');
      set(el, 'width', '100%');
      set(el, 'max-width', '100%');
      set(el, 'margin-left', '0');
      set(el, 'margin-right', '0');
      set(el, 'box-sizing', 'border-box');
    });
    set(n.icons, 'padding-left', '0');
    set(n.icons, 'padding-right', '0');

    Array.prototype.forEach.call(n.uls, function (ul) {
      set(ul, 'width', '100%');
      set(ul, 'margin-left', '0');
      set(ul, 'padding-left', '1.15em');
      set(ul, 'box-sizing', 'border-box');
    });

    return true;
  }

  function start() {
    if (!paint()) {
      var tries = 0;
      var timer = setInterval(function () {
        tries += 1;
        if (paint() || tries > 40) clearInterval(timer);
      }, 100);
    }
    if (typeof MQ.addEventListener === 'function') {
      MQ.addEventListener('change', paint);
    } else if (typeof MQ.addListener === 'function') {
      MQ.addListener(paint);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
