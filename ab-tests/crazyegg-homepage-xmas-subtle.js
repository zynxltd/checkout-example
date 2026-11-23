/**
 * Crazy Egg A/B — Christmas header: all bells & whistles (Variant)
 *
 * Homepage only (/). Festive overlays on the header/nav — fairy lights,
 * hanging baubles, sparkles, snowfall. Magento header/nav DOM layout is
 * never modified (overlays only, pointer-events: none).
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-homepage-xmas-subtle.css
 *
 * Live: https://www.yougarden.com/
 */
(function () {
  'use strict';

  var MARK = 'ce-yg-xmas';
  var SNOW_ID = 'ce-yg-xmas-snow';
  var FX_ID = 'ce-yg-xmas-header-fx';
  var FLAKE_COUNT = 28;
  var LIGHT_COUNT = 22;
  var BAUBLE_COUNT = 7;
  var SPARK_COUNT = 12;

  if (document.documentElement.getAttribute('data-' + MARK) === '1') return;

  function isHomepage() {
    var path = (location.pathname || '/').replace(/\/+$/, '') || '/';
    return path === '/';
  }

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function el(tag, className, attrs) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        node.setAttribute(k, attrs[k]);
      });
    }
    return node;
  }

  function buildSnow() {
    if (document.getElementById(SNOW_ID)) return;

    var layer = el('div', MARK + '-snow', {
      id: SNOW_ID,
      'aria-hidden': 'true'
    });

    var i;
    var flake;
    for (i = 0; i < FLAKE_COUNT; i++) {
      flake = el(
        'span',
        MARK + '-flake' + (i % 4 === 0 ? ' ' + MARK + '-flake--spark' : '')
      );
      flake.style.width = 3 + Math.random() * 6 + 'px';
      flake.style.height = flake.style.width;
      flake.style.left = Math.random() * 100 + '%';
      flake.style.opacity = (0.25 + Math.random() * 0.4).toFixed(2);
      flake.style.animationDelay = (Math.random() * -20).toFixed(2) + 's';
      flake.style.animationDuration = 12 + Math.random() * 18 + 's';
      flake.style.setProperty(
        '--ce-xmas-drift',
        (Math.random() * 50 - 25).toFixed(1) + 'px'
      );
      layer.appendChild(flake);
    }

    document.body.appendChild(layer);
  }

  function buildHeaderFx() {
    if (document.getElementById(FX_ID)) return;

    var host = qs('#head-scroll') || qs('#header') || document.body;
    var cs = window.getComputedStyle(host);
    if (cs.position === 'static') {
      host.style.position = 'relative';
    }

    var fx = el('div', MARK + '-header-fx', {
      id: FX_ID,
      'aria-hidden': 'true'
    });

    // Soft festive wash over white header band
    fx.appendChild(el('div', MARK + '-wash'));

    // Fairy-light wire along green nav
    var lights = el('div', MARK + '-lights');
    var colours = ['#ffd76a', '#ff6b6b', '#7dffb3', '#ff9ad5', '#9ad7ff', '#fff3bf'];
    var i;
    var bulb;
    for (i = 0; i < LIGHT_COUNT; i++) {
      bulb = el('span', MARK + '-bulb');
      bulb.style.left = ((i + 0.5) / LIGHT_COUNT) * 100 + '%';
      bulb.style.background = colours[i % colours.length];
      bulb.style.animationDelay = (i * 0.18).toFixed(2) + 's';
      bulb.style.setProperty('--ce-bulb-glow', colours[i % colours.length]);
      lights.appendChild(bulb);
    }
    fx.appendChild(lights);

    // Hanging baubles under the light string
    var baubles = el('div', MARK + '-baubles');
    var baubleColors = ['#c41e3a', '#0f7a3a', '#d4af37', '#c41e3a', '#1a5f2a', '#d4af37', '#b01030'];
    for (i = 0; i < BAUBLE_COUNT; i++) {
      bulb = el('span', MARK + '-bauble');
      bulb.style.left = ((i + 1) / (BAUBLE_COUNT + 1)) * 100 + '%';
      bulb.style.animationDelay = (i * 0.25).toFixed(2) + 's';
      bulb.style.setProperty('--ce-bauble', baubleColors[i % baubleColors.length]);
      bulb.style.setProperty(
        '--ce-bauble-len',
        10 + (i % 3) * 6 + 'px'
      );
      baubles.appendChild(bulb);
    }
    fx.appendChild(baubles);

    // Corner holly clusters
    fx.appendChild(el('div', MARK + '-holly ' + MARK + '-holly--left'));
    fx.appendChild(el('div', MARK + '-holly ' + MARK + '-holly--right'));

    // Header-band sparkles
    var sparks = el('div', MARK + '-sparks');
    for (i = 0; i < SPARK_COUNT; i++) {
      bulb = el('span', MARK + '-spark');
      bulb.style.left = 8 + Math.random() * 84 + '%';
      bulb.style.top = 8 + Math.random() * 55 + '%';
      bulb.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
      bulb.style.animationDuration = 1.6 + Math.random() * 2.2 + 's';
      sparks.appendChild(bulb);
    }
    fx.appendChild(sparks);

    // Bell accents (CSS shapes)
    fx.appendChild(el('div', MARK + '-bell ' + MARK + '-bell--left'));
    fx.appendChild(el('div', MARK + '-bell ' + MARK + '-bell--right'));

    host.appendChild(fx);
  }

  function pauseWhenHidden() {
    function sync() {
      var paused = document.hidden;
      var snow = document.getElementById(SNOW_ID);
      var fx = document.getElementById(FX_ID);
      if (snow) snow.classList.toggle(MARK + '-snow--paused', paused);
      if (fx) fx.classList.toggle(MARK + '-header-fx--paused', paused);
    }
    document.addEventListener('visibilitychange', sync);
    sync();
  }

  ready(function () {
    if (!isHomepage()) return;
    if (prefersReducedMotion()) return;

    document.documentElement.setAttribute('data-' + MARK, '1');
    document.documentElement.classList.add(MARK);

    buildSnow();
    buildHeaderFx();
    pauseWhenHidden();
  });
})();
