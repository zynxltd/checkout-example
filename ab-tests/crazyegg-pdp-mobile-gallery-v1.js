/**
 * Crazy Egg — PDP Mobile Gallery v1  (Variant 1)
 *
 * Thumbnail strip UNDER the main image — mobile ≤599px only.
 * Main image: swipe + arrows. Thumbs: tap + horizontal drag/swipe.
 * Dots hidden. Desktop (≥600px) unchanged.
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-pdp-mobile-gallery-v1.css
 *
 * Example: https://www.yougarden.com/item-p-630050/complete-300-spring-flowering-bulb-collection
 */
(function () {
  'use strict';

  var ROOT = 'ce-yg-pdp-gal-v1';
  var ON = 'ce-yg-gal-on';
  var VER = '11';
  var INIT = 'data-ce-yg-pdp-gal-v1';
  var SHELL_ID = 'ce-yg-gal-shell';
  var THUMBS_ID = 'ce-yg-gal-thumbs';
  var STYLE_ID = 'ce-yg-pdp-gal-v1-css';
  var APPLY_KEY = '__ceYgPdpGalV1Apply';
  var TIMER_KEY = '__ceYgPdpGalV1Timer';
  var MQ = '(max-width: 599px)';

  function isPdp() {
    if (/\/item-[sp]-/i.test(window.location.pathname || '')) return true;
    return !!(
      document.querySelector('#main-image-carousel') ||
      document.querySelector('.main-image-carousel')
    );
  }

  function isMobileView() {
    try {
      if (window.matchMedia) return window.matchMedia(MQ).matches;
    } catch (e) {
      /* ignore */
    }
    return (window.innerWidth || 0) <= 599;
  }

  function syncMobileClass() {
    var on = isMobileView();
    if (on) document.documentElement.classList.add(ON);
    else document.documentElement.classList.remove(ON);
    return on;
  }

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function jq() {
    return window.jQuery || window.$;
  }

  function ensureCss() {
    var st = document.getElementById(STYLE_ID);
    if (st) st.parentNode.removeChild(st);
    st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent =
      '@media (min-width:600px){#ce-yg-gal-shell,#ce-yg-gal-thumbs{display:none!important}}' +
      '@media (max-width:599px){' +
      'html.ce-yg-gal-on #main-image-wrapper,html.ce-yg-gal-on .main-image-wrapper{margin-bottom:0!important;' +
        'padding-bottom:0!important;position:relative!important;overflow:visible!important}' +
      'html.ce-yg-gal-on #main-image-carousel,html.ce-yg-gal-on .images-wrapper{overflow:visible!important}' +
      'html.ce-yg-gal-on #main-image-carousel,html.ce-yg-gal-on #main-image-carousel .slick-list,' +
      'html.ce-yg-gal-on #main-image-carousel .slick-track,html.ce-yg-gal-on #main-image-carousel .slick-slide{' +
        'pointer-events:auto!important;touch-action:pan-x!important;-webkit-user-select:none!important;user-select:none!important}' +
      'html.ce-yg-gal-on #main-image-carousel img,html.ce-yg-gal-on #main-image-carousel .mainImg{' +
        'pointer-events:auto!important;-webkit-user-drag:none!important;user-select:none!important}' +
      'html.ce-yg-gal-on .ce-yg-kf-overlay,html.ce-yg-gal-on #ce-yg-kf-overlay{display:none!important;pointer-events:none!important}' +
      'html.ce-yg-gal-on #main-image-carousel .slick-dots{display:none!important}' +
      'html.ce-yg-gal-on #main-image-carousel .previous-button,html.ce-yg-gal-on #main-image-carousel .next-button,' +
      'html.ce-yg-gal-on #main-image-carousel .slick-arrow{display:block!important;visibility:visible!important;' +
        'opacity:1!important;pointer-events:auto!important;top:45%!important;transform:none!important;' +
        'width:18px!important;height:18px!important;padding:10px!important;border-radius:20px!important;' +
        'border:1px solid #bbb!important;background:rgba(255,255,255,.7)!important;box-shadow:none!important;z-index:9!important}' +
      'html.ce-yg-gal-on #main-image-carousel .previous-button,html.ce-yg-gal-on #main-image-carousel .slick-prev{' +
        'left:-16.5px!important;right:auto!important}' +
      'html.ce-yg-gal-on #main-image-carousel .next-button,html.ce-yg-gal-on #main-image-carousel .slick-next{' +
        'right:-16.5px!important;left:auto!important}' +
      'html.ce-yg-gal-on #ce-yg-gal-shell{display:block!important;position:relative!important;width:100%!important;' +
        'margin:0!important;padding:6px 0 8px!important;background:#fff!important;box-sizing:border-box!important;clear:both!important}' +
      'html.ce-yg-gal-on #ce-yg-gal-thumbs{display:flex!important;flex-wrap:nowrap!important;align-items:center!important;' +
        'gap:6px!important;width:100%!important;margin:0!important;padding:0!important;box-sizing:border-box!important;' +
        'overflow-x:auto!important;overflow-y:hidden!important;-webkit-overflow-scrolling:touch!important;' +
        'scroll-snap-type:x mandatory;scrollbar-width:none;touch-action:pan-x!important;cursor:grab}' +
      'html.ce-yg-gal-on #ce-yg-gal-thumbs.is-dragging{cursor:grabbing;scroll-snap-type:none;user-select:none}' +
      'html.ce-yg-gal-on #ce-yg-gal-thumbs::-webkit-scrollbar{display:none}' +
      'html.ce-yg-gal-on .ce-yg-gal-thumb:first-child{margin-left:16px!important}' +
      'html.ce-yg-gal-on .ce-yg-gal-thumb:last-child{margin-right:16px!important}' +
      'html.ce-yg-gal-on .ce-yg-gal-thumb{flex:0 0 calc((100% - 50px) / 4)!important;width:calc((100% - 50px) / 4)!important;' +
        'max-width:calc((100% - 50px) / 4)!important;height:auto;aspect-ratio:1/1;padding:0;' +
        'margin-top:0!important;margin-bottom:0!important;border:1.5px solid #d7ddd2;border-radius:6px;' +
        'background:#f5f6f4;overflow:hidden;cursor:pointer;scroll-snap-align:start;box-sizing:border-box;' +
        'position:relative;-webkit-tap-highlight-color:transparent}' +
      'html.ce-yg-gal-on .ce-yg-gal-thumb.is-active{border-color:#264f1c;border-width:2px}' +
      'html.ce-yg-gal-on .ce-yg-gal-thumb img{display:block;width:100%;height:100%;object-fit:cover;pointer-events:none}' +
      'html.ce-yg-gal-on .ce-yg-gal-thumb.is-video::after{content:"";position:absolute;left:50%;top:50%;width:0;height:0;' +
        'margin:-7px 0 0 -5px;border-style:solid;border-width:8px 0 8px 13px;' +
        'border-color:transparent transparent transparent #fff;' +
        'filter:drop-shadow(0 1px 2px rgba(0,0,0,.4));pointer-events:none}' +
      '}';
    document.head.appendChild(st);
  }

  function carousel() {
    return qs('#main-image-carousel') || qs('.main-image-carousel');
  }

  function collectSlides() {
    var car = carousel();
    if (!car) return [];
    var slides = car.querySelectorAll('.slick-slide:not(.slick-cloned)');
    var out = [];
    var i;
    for (i = 0; i < slides.length; i += 1) {
      var slide = slides[i];
      if (slide.classList.contains('ce-yg-kf-slide') || slide.querySelector('.ce-yg-kf-slide')) continue;
      var img = slide.querySelector('img.mainImg') || slide.querySelector('img');
      var src =
        img &&
        (img.getAttribute('src') || img.getAttribute('data-lazy') || img.getAttribute('data-src'));
      if (!src) continue;
      if (img && img.classList.contains('ce-yg-kf-spacer')) continue;
      var isVideo =
        slide.classList.contains('video') ||
        /vimeo|youtube|video/i.test(src) ||
        !!slide.querySelector('iframe, video, .video');
      out.push({
        index: parseInt(slide.getAttribute('data-slick-index'), 10),
        src: src,
        alt: (img && img.getAttribute('alt')) || '',
        isVideo: isVideo
      });
    }
    out.sort(function (a, b) {
      var ai = a.index === a.index ? a.index : 999;
      var bi = b.index === b.index ? b.index : 999;
      return ai - bi;
    });
    return out;
  }

  function insertPoint() {
    var main = qs('#main-image-wrapper') || qs('.main-image-wrapper');
    if (main && main.parentNode) return { parent: main.parentNode, after: main };
    var wrap = qs('.images-wrapper');
    if (wrap) return { parent: wrap, after: wrap.firstChild };
    return null;
  }

  function removeThumbs() {
    var shell = document.getElementById(SHELL_ID);
    if (shell && shell.parentNode) shell.parentNode.removeChild(shell);
    var el = document.getElementById(THUMBS_ID);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function scrollThumbIntoRail(rail, thumb) {
    if (!rail || !thumb) return;
    var pad = 16;
    var left = thumb.offsetLeft;
    var right = left + thumb.offsetWidth;
    var viewLeft = rail.scrollLeft;
    var viewRight = viewLeft + rail.clientWidth;
    if (left < viewLeft + pad) rail.scrollLeft = Math.max(0, left - pad);
    else if (right > viewRight - pad) rail.scrollLeft = right - rail.clientWidth + pad;
  }

  function setActive(index) {
    var rail = document.getElementById(THUMBS_ID);
    if (!rail) return;
    var thumbs = rail.querySelectorAll('.ce-yg-gal-thumb');
    var i;
    for (i = 0; i < thumbs.length; i += 1) {
      var on = parseInt(thumbs[i].getAttribute('data-index'), 10) === index;
      if (on) thumbs[i].classList.add('is-active');
      else thumbs[i].classList.remove('is-active');
      if (on) scrollThumbIntoRail(rail, thumbs[i]);
    }
  }

  function goTo(index) {
    var $ = jq();
    var car = carousel();
    if ($ && car && $(car).hasClass('slick-initialized')) {
      try {
        $(car).slick('slickGoTo', index);
      } catch (e) {
        /* ignore */
      }
      return;
    }
    var dots = car && car.querySelectorAll('.slick-dots li button');
    if (dots && dots[index]) dots[index].click();
  }

  function currentIndex() {
    var $ = jq();
    var car = carousel();
    if ($ && car && $(car).hasClass('slick-initialized')) {
      try {
        return $(car).slick('slickCurrentSlide') || 0;
      } catch (e) {
        return 0;
      }
    }
    var active = car && car.querySelector('.slick-slide.slick-current');
    if (active) {
      var n = parseInt(active.getAttribute('data-slick-index'), 10);
      return n === n ? n : 0;
    }
    return 0;
  }

  function clearHeroBlockers() {
    [].forEach.call(
      document.querySelectorAll(
        '.ce-yg-kf-overlay, #ce-yg-kf-overlay, #main-image-wrapper .ce-yg-kf-below'
      ),
      function (el) {
        if (el && el.parentNode) el.parentNode.removeChild(el);
      }
    );
  }

  function enableSwipe(car) {
    var $ = jq();
    clearHeroBlockers();
    if (!$ || !car || !$(car).hasClass('slick-initialized')) return;

    [].forEach.call(car.querySelectorAll('img'), function (img) {
      img.setAttribute('draggable', 'false');
      img.ondragstart = function () {
        return false;
      };
    });

    try {
      $(car).slick('slickSetOption', 'swipe', true, false);
      $(car).slick('slickSetOption', 'touchMove', true, false);
      $(car).slick('slickSetOption', 'draggable', true, false);
      $(car).slick('slickSetOption', 'swipeToSlide', true, false);
      $(car).slick('slickSetOption', 'touchThreshold', 5, false);
      $(car).slick('slickSetOption', 'waitForAnimate', false, false);
      $(car).slick('slickSetOption', 'arrows', true, true);
      $(car).slick('setPosition');
    } catch (e) {
      /* ignore */
    }
  }

  function bindThumbDrag(rail) {
    if (!rail || rail.getAttribute('data-ce-drag') === '1') return;
    rail.setAttribute('data-ce-drag', '1');

    var startX = 0;
    var startLeft = 0;
    var dragging = false;
    var moved = false;

    function down(x) {
      dragging = true;
      moved = false;
      startX = x;
      startLeft = rail.scrollLeft;
      rail.classList.add('is-dragging');
    }

    function move(x) {
      if (!dragging) return;
      var dx = x - startX;
      if (Math.abs(dx) > 4) moved = true;
      rail.scrollLeft = startLeft - dx;
    }

    function up() {
      if (!dragging) return;
      dragging = false;
      rail.classList.remove('is-dragging');
    }

    rail.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      down(e.clientX);
    });
    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      e.preventDefault();
      move(e.clientX);
    });
    window.addEventListener('mouseup', up);

    rail.addEventListener(
      'touchstart',
      function (e) {
        if (!e.touches || !e.touches.length) return;
        down(e.touches[0].clientX);
      },
      { passive: true }
    );
    rail.addEventListener(
      'touchmove',
      function (e) {
        if (!dragging || !e.touches || !e.touches.length) return;
        move(e.touches[0].clientX);
      },
      { passive: true }
    );
    rail.addEventListener('touchend', up, false);
    rail.addEventListener('touchcancel', up, false);

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

  var bound = false;
  function bindCarousel() {
    var $ = jq();
    var car = carousel();
    if (!$ || !car) return;
    enableSwipe(car);
    if (bound) return;
    bound = true;
    $(car).on('afterChange.' + ROOT, function (e, slick, current) {
      setActive(current);
    });
  }

  function thumbsMatch(slides) {
    var rail = document.getElementById(THUMBS_ID);
    if (!rail) return false;
    var shell = document.getElementById(SHELL_ID);
    if (!shell || shell.getAttribute('data-ce-inset') !== VER) return false;
    var thumbs = rail.querySelectorAll('.ce-yg-gal-thumb');
    if (thumbs.length !== slides.length) return false;
    var i;
    for (i = 0; i < slides.length; i += 1) {
      var idx = String(slides[i].index === slides[i].index ? slides[i].index : i);
      if (thumbs[i].getAttribute('data-index') !== idx) return false;
    }
    return true;
  }

  function buildThumbs(slides) {
    if (slides.length < 2) {
      removeThumbs();
      return false;
    }

    if (thumbsMatch(slides)) {
      bindCarousel();
      bindThumbDrag(document.getElementById(THUMBS_ID));
      enableSwipe(carousel());
      setActive(currentIndex());
      return true;
    }

    removeThumbs();

    var spot = insertPoint();
    if (!spot) return false;

    var shell = document.createElement('div');
    shell.id = SHELL_ID;
    shell.className = 'ce-yg-gal-shell';
    shell.setAttribute('data-ce-inset', VER);

    var rail = document.createElement('div');
    rail.id = THUMBS_ID;
    rail.className = 'ce-yg-gal-thumbs';
    rail.setAttribute('role', 'list');
    rail.setAttribute('aria-label', 'Product image gallery');

    var last = slides.length - 1;
    slides.forEach(function (slide, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ce-yg-gal-thumb' + (slide.isVideo ? ' is-video' : '');
      btn.setAttribute('role', 'listitem');
      btn.setAttribute('data-index', String(slide.index === slide.index ? slide.index : i));
      btn.setAttribute('aria-label', slide.isVideo ? 'Play video' : 'View image ' + (i + 1));

      /* Theme buttons use margin:0 !important — must setProperty with important */
      if (i === 0) btn.style.setProperty('margin-left', '16px', 'important');
      if (i === last) btn.style.setProperty('margin-right', '16px', 'important');

      var img = document.createElement('img');
      img.src = slide.src;
      img.alt = slide.alt || '';
      img.loading = 'lazy';
      img.draggable = false;
      btn.appendChild(img);

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        goTo(parseInt(btn.getAttribute('data-index'), 10) || 0);
      });

      rail.appendChild(btn);
    });

    shell.appendChild(rail);

    if (spot.after && spot.after.nextSibling) {
      spot.parent.insertBefore(shell, spot.after.nextSibling);
    } else {
      spot.parent.appendChild(shell);
    }

    bindCarousel();
    bindThumbDrag(rail);
    setActive(currentIndex());
    return true;
  }

  function apply() {
    document.documentElement.classList.add(ROOT);
    document.documentElement.setAttribute(INIT, VER);
    /* Drop v9 kill stylesheet if still present from an older paste */
    var oldKill = document.getElementById('ce-yg-pdp-gal-v1-desktop-kill');
    if (oldKill && oldKill.parentNode) oldKill.parentNode.removeChild(oldKill);
    if (window.__ceYgPdpGalV1Watch) {
      clearInterval(window.__ceYgPdpGalV1Watch);
      window.__ceYgPdpGalV1Watch = null;
    }
    ensureCss();

    if (!syncMobileClass()) {
      removeThumbs();
      return false;
    }

    var slides = collectSlides();
    if (slides.length < 2) {
      removeThumbs();
      return false;
    }
    var ok = buildThumbs(slides);
    enableSwipe(carousel());
    return ok;
  }

  function boot() {
    if (!isPdp()) return;
    apply();
    if (window[TIMER_KEY]) clearInterval(window[TIMER_KEY]);
    var tries = 0;
    window[TIMER_KEY] = setInterval(function () {
      tries += 1;
      var ok = apply();
      if ((ok && tries > 4) || tries > 40) {
        clearInterval(window[TIMER_KEY]);
        window[TIMER_KEY] = null;
        if (isMobileView()) enableSwipe(carousel());
      }
    }, 250);

    if (!window.__ceYgPdpGalV1Resize) {
      window.__ceYgPdpGalV1Resize = true;
      var t;
      window.addEventListener('resize', function () {
        clearTimeout(t);
        t = setTimeout(apply, 150);
      });
    }
  }

  window[APPLY_KEY] = apply;

  document.documentElement.setAttribute(INIT, VER);
  document.documentElement.classList.add(ROOT);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
