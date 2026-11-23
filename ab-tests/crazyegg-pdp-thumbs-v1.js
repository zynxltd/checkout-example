/**
 * Crazy Egg — PDP thumbs under hero (mobile ≤599px)
 * Paste into Variant → Custom JS
 * Pair with: crazyegg-pdp-thumbs-v1.css
 *
 * Example: https://www.yougarden.com/item-p-630050/complete-300-spring-flowering-bulb-collection
 */
(function () {
  'use strict';

  var VER = '3';
  var RAIL_ID = 'ce-yg-thumbs';
  var STYLE_ID = 'ce-yg-thumbs-css';
  var ON = 'ce-yg-thumbs-on';
  var INIT = 'data-ce-yg-thumbs';
  var MQ = '(max-width: 599px)';
  var bound = false;

  function mobile() {
    try {
      return window.matchMedia(MQ).matches;
    } catch (e) {
      return window.innerWidth <= 599;
    }
  }

  function $() {
    return window.jQuery || window.$;
  }

  function carousel() {
    return document.querySelector('#main-image-carousel') || document.querySelector('.main-image-carousel');
  }

  function removeRail() {
    var el = document.getElementById(RAIL_ID);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function ensureCss() {
    var st = document.getElementById(STYLE_ID);
    if (st) st.parentNode.removeChild(st);
    st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent =
      '@media (min-width:600px){#ce-yg-thumbs{display:none!important}}' +
      '@media (max-width:599px){' +
      'html.ce-yg-thumbs-on #main-image-carousel .slick-dots{display:none!important}' +
      'html.ce-yg-thumbs-on #main-image-carousel .previous-button,' +
      'html.ce-yg-thumbs-on #main-image-carousel .next-button,' +
      'html.ce-yg-thumbs-on #main-image-carousel .slick-arrow{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;z-index:9!important}' +
      '#ce-yg-thumbs{display:flex;flex-wrap:nowrap;gap:6px;width:100%;margin:0;padding:6px 0 8px;box-sizing:border-box;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;touch-action:pan-x;background:#fff}' +
      '#ce-yg-thumbs::-webkit-scrollbar{display:none}' +
      '#ce-yg-thumbs .ce-yg-thumb{flex:0 0 calc((100% - 30px)/4);width:calc((100% - 30px)/4);aspect-ratio:1/1;padding:0;margin:0;border:1.5px solid #d7ddd2;border-radius:6px;background:#f5f6f4;overflow:hidden;cursor:pointer;box-sizing:border-box;position:relative}' +
      '#ce-yg-thumbs .ce-yg-thumb:first-child{margin-left:6px!important}' +
      '#ce-yg-thumbs .ce-yg-thumb:last-child{margin-right:6px!important}' +
      '#ce-yg-thumbs .ce-yg-thumb.is-active{border-color:#264f1c;border-width:2px}' +
      '#ce-yg-thumbs .ce-yg-thumb img{display:block;width:100%;height:100%;object-fit:cover;pointer-events:none}' +
      '#ce-yg-thumbs .ce-yg-thumb.is-video::after{content:"";position:absolute;left:50%;top:50%;margin:-7px 0 0 -5px;border-style:solid;border-width:8px 0 8px 13px;border-color:transparent transparent transparent #fff;filter:drop-shadow(0 1px 2px rgba(0,0,0,.4));pointer-events:none}' +
      '}';
    document.head.appendChild(st);
  }

  function slides() {
    var car = carousel();
    if (!car) return [];
    var nodes = car.querySelectorAll('.slick-slide:not(.slick-cloned)');
    var out = [];
    for (var i = 0; i < nodes.length; i++) {
      var slide = nodes[i];
      var img = slide.querySelector('img.mainImg') || slide.querySelector('img');
      if (!img) continue;
      var src = img.getAttribute('src') || img.getAttribute('data-lazy') || img.getAttribute('data-src');
      if (!src) continue;
      var idx = parseInt(slide.getAttribute('data-slick-index'), 10);
      out.push({
        index: idx === idx ? idx : i,
        src: src,
        alt: img.getAttribute('alt') || '',
        isVideo: !!(slide.classList.contains('video') || slide.querySelector('iframe, video'))
      });
    }
    out.sort(function (a, b) {
      return a.index - b.index;
    });
    return out;
  }

  function currentIndex() {
    var jq = $();
    var car = carousel();
    if (jq && car && jq(car).hasClass('slick-initialized')) {
      try {
        return jq(car).slick('slickCurrentSlide') || 0;
      } catch (e) {
        return 0;
      }
    }
    return 0;
  }

  function goTo(index) {
    var jq = $();
    var car = carousel();
    if (jq && car && jq(car).hasClass('slick-initialized')) {
      try {
        jq(car).slick('slickGoTo', index);
      } catch (e) {
        /* ignore */
      }
    }
  }

  function setActive(index) {
    var rail = document.getElementById(RAIL_ID);
    if (!rail) return;
    var thumbs = rail.querySelectorAll('.ce-yg-thumb');
    for (var i = 0; i < thumbs.length; i++) {
      var on = parseInt(thumbs[i].getAttribute('data-index'), 10) === index;
      thumbs[i].classList.toggle('is-active', on);
      if (on) {
        var left = thumbs[i].offsetLeft - 6;
        if (left < rail.scrollLeft) rail.scrollLeft = Math.max(0, left);
        var right = thumbs[i].offsetLeft + thumbs[i].offsetWidth + 6;
        if (right > rail.scrollLeft + rail.clientWidth) {
          rail.scrollLeft = right - rail.clientWidth;
        }
      }
    }
  }

  function enableSwipe() {
    var jq = $();
    var car = carousel();
    if (!jq || !car || !jq(car).hasClass('slick-initialized')) return;
    [].forEach.call(car.querySelectorAll('img'), function (img) {
      img.setAttribute('draggable', 'false');
    });
    try {
      jq(car).slick('slickSetOption', 'swipe', true, false);
      jq(car).slick('slickSetOption', 'touchMove', true, false);
      jq(car).slick('slickSetOption', 'draggable', true, false);
      jq(car).slick('slickSetOption', 'arrows', true, true);
    } catch (e) {
      /* ignore */
    }
  }

  function bindDrag(rail) {
    if (rail.getAttribute('data-drag') === '1') return;
    rail.setAttribute('data-drag', '1');
    var x0 = 0;
    var left0 = 0;
    var dragging = false;
    var moved = false;

    rail.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      dragging = true;
      moved = false;
      x0 = e.clientX;
      left0 = rail.scrollLeft;
    });
    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - x0;
      if (Math.abs(dx) > 4) moved = true;
      rail.scrollLeft = left0 - dx;
    });
    window.addEventListener('mouseup', function () {
      dragging = false;
    });
    rail.addEventListener(
      'click',
      function (e) {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
          moved = false;
        }
      },
      true
    );
  }

  function build(list) {
    if (list.length < 2) {
      removeRail();
      return false;
    }

    var existing = document.getElementById(RAIL_ID);
    if (existing && existing.getAttribute('data-ver') === VER && existing.children.length === list.length) {
      setActive(currentIndex());
      return true;
    }

    removeRail();

    var main = document.querySelector('#main-image-wrapper') || document.querySelector('.main-image-wrapper');
    var car = carousel();
    if (!main) return false;

    var rail = document.createElement('div');
    rail.id = RAIL_ID;
    rail.setAttribute('data-ver', VER);
    rail.setAttribute('role', 'list');

    list.forEach(function (slide, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ce-yg-thumb' + (slide.isVideo ? ' is-video' : '');
      btn.setAttribute('data-index', String(slide.index));
      btn.setAttribute('aria-label', 'View image ' + (i + 1));

      /* Force 6px sides — overrides leftover CE CSS still setting 16px */
      if (i === 0) btn.style.setProperty('margin-left', '6px', 'important');
      if (i === list.length - 1) btn.style.setProperty('margin-right', '6px', 'important');

      var img = document.createElement('img');
      img.src = slide.src;
      img.alt = slide.alt;
      img.draggable = false;
      btn.appendChild(img);

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        goTo(slide.index);
      });

      rail.appendChild(btn);
    });

    /* Inside hero wrapper so left edge matches the main image */
    if (car && main.contains(car)) {
      if (car.nextSibling) main.insertBefore(rail, car.nextSibling);
      else main.appendChild(rail);
    } else if (main.parentNode) {
      if (main.nextSibling) main.parentNode.insertBefore(rail, main.nextSibling);
      else main.parentNode.appendChild(rail);
    } else {
      return false;
    }

    bindDrag(rail);
    setActive(currentIndex());
    return true;
  }

  function bindCarousel() {
    var jq = $();
    var car = carousel();
    if (!jq || !car || bound) return;
    bound = true;
    jq(car).on('afterChange.ceYgThumbs', function (e, slick, current) {
      setActive(current);
    });
  }

  function apply() {
    document.documentElement.setAttribute(INIT, VER);
    ensureCss();

    if (!mobile()) {
      document.documentElement.classList.remove(ON);
      removeRail();
      return false;
    }

    document.documentElement.classList.add(ON);
    var list = slides();
    var ok = build(list);
    if (ok) {
      bindCarousel();
      enableSwipe();
    }
    return ok;
  }

  function boot() {
    if (!/\/item-[sp]-/i.test(location.pathname) && !carousel()) return;
    apply();
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (apply() || tries > 40) clearInterval(timer);
    }, 250);
    window.addEventListener('resize', function () {
      apply();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
