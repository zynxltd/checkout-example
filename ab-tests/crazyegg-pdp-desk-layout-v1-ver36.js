/**
 * Crazy Egg — PDP Desktop Layout v1 (left thumbs + KF under main)
 *
 * Paste into Crazy Egg Variant → Edit Script
 * Pair with: crazyegg-pdp-desk-layout-v1.css
 *
 * Breakpoints:
 *   ≤599px    → mobile CE variant only
 *   600–900px → Magento tablet
 *   ≥901px    → Variant 2: Magento column + outside left rail + KF under main
 *
 * Example: https://www.yougarden.com/item-p-511603/standard-holly-trees-with-premium-pinecone-planters
 */
(function () {
  'use strict';

  var ROOT = 'ce-yg-pdp-desk-v1';
  var ATTR = 'data-ce-yg-pdp-desk-v1';
  var VER = '36';
  var MQ = '(min-width: 901px)';
  var DESK_MIN = 901;
  var MOBILE_MAX = 599;
  var VISIBLE = 4;
  var GAP = 8;
  var MAIN_TARGET = 500; /* Variant 2 / Magento desktop main */
  var MAIN_MIN = 280;
  var SWIPE_PX = 8;
  var KF_HOST = 'ce-yg-desk-kf';
  var CLOSE_TABS = ['description'];
  var tries = 0;
  var MAX = 40;
  var sized = false;
  var kfMoved = false;
  var resizeTimer = null;

  if (!/\/item-[sp]-/i.test(location.pathname || '')) return;
  if (document.documentElement.getAttribute(ATTR) === VER) return;
  document.documentElement.setAttribute(ATTR, VER);

  function desk() {
    var w = window.innerWidth || 0;
    if (w <= MOBILE_MAX) return false;
    try {
      return window.matchMedia(MQ).matches;
    } catch (e) {
      return w >= DESK_MIN;
    }
  }

  function jq() {
    return window.jQuery || window.$;
  }

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function videoSlideIndexes() {
    var main = qs('#main-image-carousel');
    var idxs = [];
    if (!main) return idxs;
    [].forEach.call(main.querySelectorAll('.slick-slide:not(.slick-cloned)'), function (s) {
      var oc = s.getAttribute('onclick') || '';
      var video =
        s.classList.contains('video') ||
        !!s.querySelector('iframe, video, [onclick*="showVideo"]') ||
        /showVideo\s*\(/.test(oc);
      if (!video) return;
      var idx = parseInt(s.getAttribute('data-slick-index'), 10);
      if (!isNaN(idx) && idx >= 0) idxs.push(idx);
    });
    return idxs;
  }

  function thumbSlideIndex(slideEl) {
    var img = slideEl.querySelector('img');
    var oc =
      slideEl.getAttribute('onclick') ||
      (img && img.getAttribute('onclick')) ||
      '';
    var m = oc.match(/changeSlide\(\s*['\"]?(\d+)/);
    return m ? parseInt(m[1], 10) : NaN;
  }

  function isVideoThumb(slideEl, videoIdxs) {
    var img = slideEl.querySelector('img');
    var oc =
      slideEl.getAttribute('onclick') ||
      (img && img.getAttribute('onclick')) ||
      '';
    var idx = thumbSlideIndex(slideEl);
    if (!isNaN(idx) && videoIdxs.indexOf(idx) !== -1) return true;
    /* Magento video thumbs often use changeSlide('1','') */
    if (/changeSlide\(\s*['\"]?\d+['\"]?\s*,/.test(oc)) return true;
    if (slideEl.classList.contains('video')) return true;
    return false;
  }

  function markVideoClass(slideEl, on) {
    if (!slideEl) return;
    slideEl.classList.toggle('ce-yg-desk-thumb-video', !!on);
    var img = slideEl.querySelector('img');
    if (img) img.classList.toggle('ce-yg-desk-thumb-video', !!on);
  }

  function thumbNodes(car) {
    /* After unslick Magento drops .slick-slide — use direct children with imgs */
    var track = car.querySelector('.slick-track');
    var nodes = track
      ? [].slice.call(track.querySelectorAll('.slick-slide'))
      : [].slice.call(car.children);
    return nodes.filter(function (s) {
      if (s.nodeType !== 1) return false;
      if (s.classList && s.classList.contains('slick-cloned')) return false;
      return !!s.querySelector('img') || s.tagName === 'IMG';
    });
  }

  /* Design: video is always the 2nd thumb in the rail */
  function reorderVideoSecond(car) {
    var videoIdxs = videoSlideIndexes();
    var slides = thumbNodes(car);
    if (slides.length < 2) return;

    var videoSlide = null;
    var i;
    for (i = 0; i < slides.length; i++) {
      markVideoClass(slides[i], false);
      if (!videoSlide && isVideoThumb(slides[i], videoIdxs)) videoSlide = slides[i];
    }
    if (!videoSlide) return;

    var first = slides[0];
    var parent = first.parentNode || car;
    if (videoSlide !== slides[1]) {
      if (first.nextSibling !== videoSlide) {
        parent.insertBefore(videoSlide, first.nextSibling);
      }
    }
    markVideoClass(videoSlide, true);
  }

  function markActiveThumb(index) {
    var car = qs('#opt-image-carousel');
    if (!car) return;
    var imgs = car.querySelectorAll('img');
    var i;
    for (i = 0; i < imgs.length; i++) {
      var on = false;
      var oc = imgs[i].getAttribute('onclick') || '';
      var m = oc.match(/changeSlide\(\s*['\"]?(\d+)/);
      if (m && String(parseInt(m[1], 10)) === String(index)) on = true;
      imgs[i].classList.toggle('ce-yg-desk-thumb-on', on);
      imgs[i].classList.toggle('is-active', on);
    }
  }

  /*
   * Variant 2 sizes: Magento images column stays ~500 (gap to buy unchanged).
   * Thumbs hang outside left; shrink rail if gutter is tight.
   */
  function lockSizesOnce(force) {
    if (sized && !force) return;
    var root = document.documentElement;
    var wrap = qs('.images-wrapper');
    var top = qs('.product-top-wrapper');
    var vw = window.innerWidth || 1400;
    var thumbGap = vw < 1200 ? 6 : GAP;
    var railGap = vw < 1200 ? 8 : 10;

    /* Prefer Magento 46.3% of product-top (stable even after our wrap CSS) */
    var colW = 0;
    if (top) colW = Math.round(top.getBoundingClientRect().width * 0.463);
    if (colW < 200 && wrap) colW = Math.round(wrap.getBoundingClientRect().width);
    if (colW < 200) colW = MAIN_TARGET;

    var mainPx = Math.min(MAIN_TARGET, colW);
    if (mainPx < MAIN_MIN) mainPx = MAIN_MIN;

    var thumb = Math.floor((mainPx - thumbGap * (VISIBLE - 1)) / VISIBLE);
    if (thumb < 64) thumb = 64;
    if (thumb > 119) thumb = 119;

    /* Fit rail into space left of Magento images column */
    var leftEdge = wrap ? Math.round(wrap.getBoundingClientRect().left) : 0;
    var railNeed = thumb + railGap;
    if (leftEdge > 0 && leftEdge < railNeed) {
      thumb = Math.max(56, leftEdge - railGap);
      if (thumb < 56) thumb = 56;
    }

    root.style.setProperty('--ce-yg-desk-wrap', mainPx + 'px');
    root.style.setProperty('--ce-yg-desk-main', mainPx + 'px');
    root.style.setProperty('--ce-yg-desk-thumb', thumb + 'px');
    root.style.setProperty('--ce-yg-desk-thumb-gap', thumbGap + 'px');
    root.style.setProperty('--ce-yg-desk-gap', railGap + 'px');
    sized = true;
  }

  function refreshMainCarousel() {
    var $ = jq();
    var main = qs('#main-image-carousel');
    if (!$ || !main || !$(main).hasClass('slick-initialized')) return;
    try {
      var cur = $(main).slick('slickCurrentSlide') || 0;
      $(main).slick('setPosition');
      $(main).slick('slickGoTo', cur, true);
    } catch (e) {
      /* ignore */
    }
  }

  /* Parse Magento changeSlide(...) from a thumb node / img */
  function readChangeSlide(el) {
    var node = el;
    while (node && node !== document) {
      var oc =
        (node.getAttribute && node.getAttribute('onclick')) ||
        '';
      var m = oc.match(
        /changeSlide\s*\(\s*['\"]?(\d+)['\"]?\s*(?:,\s*['\"]([^'\"]*)['\"]\s*)?\)/
      );
      if (m) {
        return { index: parseInt(m[1], 10), arg2: m[2] };
      }
      if (node === qs('#opt-image-carousel')) break;
      node = node.parentNode;
    }
    return null;
  }

  function activateThumbFromEvent(target) {
    var info = readChangeSlide(target);
    if (!info || isNaN(info.index)) return false;
    try {
      if (typeof window.changeSlide === 'function') {
        if (typeof info.arg2 === 'string') window.changeSlide(String(info.index), info.arg2);
        else window.changeSlide(String(info.index));
      } else {
        var $ = jq();
        var main = qs('#main-image-carousel');
        if ($ && main && $(main).hasClass('slick-initialized')) {
          $(main).slick('slickGoTo', info.index);
        }
      }
      markActiveThumb(info.index);
      return true;
    } catch (e) {
      return false;
    }
  }

  /* Drag/swipe scrolls the rail; a short tap still changes the main image */
  function bindThumbSwipe(car) {
    if (!car || car.getAttribute('data-ce-yg-desk-swipe') === '1') return;
    car.setAttribute('data-ce-yg-desk-swipe', '1');

    var y0 = 0;
    var top0 = 0;
    var dragging = false;
    var moved = false;
    var pointerId = null;
    var startTarget = null;
    var handledTap = false;

    [].forEach.call(car.querySelectorAll('img'), function (img) {
      img.setAttribute('draggable', 'false');
      img.addEventListener('dragstart', function (e) {
        e.preventDefault();
      });
    });

    car.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true;
      moved = false;
      handledTap = false;
      pointerId = e.pointerId;
      y0 = e.clientY;
      top0 = car.scrollTop;
      startTarget = e.target;
      /* Don't setPointerCapture until swipe — early capture eats thumb clicks */
    });

    car.addEventListener(
      'pointermove',
      function (e) {
        if (!dragging || (pointerId !== null && e.pointerId !== pointerId)) return;
        var dy = e.clientY - y0;
        if (!moved && Math.abs(dy) >= SWIPE_PX) {
          moved = true;
          car.classList.add('ce-yg-desk-swiping');
          try {
            car.setPointerCapture(e.pointerId);
          } catch (err) {
            /* ignore */
          }
        }
        if (moved) {
          car.scrollTop = top0 - dy;
          e.preventDefault();
        }
      },
      { passive: false }
    );

    function endSwipe(e) {
      if (!dragging) return;
      if (pointerId !== null && e && e.pointerId !== pointerId) return;

      var wasSwipe = moved;
      var target = startTarget;
      dragging = false;
      pointerId = null;
      startTarget = null;
      car.classList.remove('ce-yg-desk-swiping');

      if (!wasSwipe && target) {
        handledTap = activateThumbFromEvent(target);
      }
      /* Keep moved true until click so swipe doesn't also fire changeSlide */
      setTimeout(function () {
        moved = false;
        handledTap = false;
      }, 0);
    }

    car.addEventListener('pointerup', endSwipe);
    car.addEventListener('pointercancel', endSwipe);

    /*
     * We own thumb activation on pointerup. Always stop Magento's inline
     * onclick so swipe doesn't change the slide, and tap doesn't double-fire.
     */
    car.addEventListener(
      'click',
      function (e) {
        if (!readChangeSlide(e.target) && !handledTap && !moved) return;
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
      },
      true
    );
  }

  function verticalThumbs() {
    var car = qs('#opt-image-carousel');
    var $ = jq();
    if (!car) return false;

    /* Size while Magento layout is still original (before class adds rail) */
    lockSizesOnce();

    if ($ && $.fn && $(car).hasClass('slick-initialized')) {
      try {
        $(car).slick('unslick');
      } catch (e) {
        /* ignore */
      }
    }

    [].forEach.call(car.querySelectorAll('.slick-cloned, .slick-arrow'), function (el) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });

    /* Force every thumb visible — slick leaves non-current slides display:none */
    [].forEach.call(car.querySelectorAll('.slick-slide, img'), function (el) {
      el.style.setProperty('display', 'block', 'important');
      el.style.setProperty('opacity', '1', 'important');
      el.style.setProperty('visibility', 'visible', 'important');
      el.style.removeProperty('width');
      el.style.removeProperty('height');
      el.classList.remove('slick-current', 'slick-active', 'slick-center');
    });

    reorderVideoSecond(car);
    bindThumbSwipe(car);

    var main = qs('#main-image-carousel');
    if ($ && main && $(main).hasClass('slick-initialized')) {
      try {
        markActiveThumb($(main).slick('slickCurrentSlide') || 0);
        $(main)
          .off('afterChange.ceYgDesk')
          .on('afterChange.ceYgDesk', function (e, slick, current) {
            markActiveThumb(current);
          });
      } catch (e2) {
        markActiveThumb(0);
      }
    } else {
      markActiveThumb(0);
    }

    /* One reflow after size lock — avoids slick track offset / flicker loops */
    if ($ && main && $(main).hasClass('slick-initialized')) {
      setTimeout(function () {
        try {
          var cur = $(main).slick('slickCurrentSlide') || 0;
          $(main).slick('setPosition');
          $(main).slick('slickGoTo', cur, true);
        } catch (e3) {
          /* ignore */
        }
      }, 80);
    }
    return true;
  }

  function refreshFeaturesCarousel(host) {
    var $ = jq();
    var feat =
      (host && (qs('#product-features-carousel', host) || qs('.product-features-carousel', host))) ||
      qs('#product-features-carousel');
    if (!$ || !feat) return;

    /* Whole icons only — 5 when wide enough, else 4; list clips peeks */
    var list = feat.querySelector('.slick-list');
    var listW = (list && list.clientWidth) || (host && host.clientWidth) || 500;
    var SHOW = listW < 400 ? 4 : 5;
    var $feat = $(feat);
    var opts = {
      slidesToShow: SHOW,
      slidesToScroll: 1,
      infinite: true,
      arrows: true,
      dots: false,
      speed: 1000,
      cssEase: 'ease-out',
      prevArrow: '<div class="previous-button"><i class="fas fa-chevron-left"></i></div>',
      nextArrow: '<div class="next-button"><i class="fas fa-chevron-right"></i></div>',
      responsive: [
        { breakpoint: 1100, settings: { slidesToShow: SHOW, slidesToScroll: 1 } },
        { breakpoint: 480, settings: { slidesToShow: 4, slidesToScroll: 1 } },
        { breakpoint: 360, settings: { slidesToShow: 3, slidesToScroll: 1 } }
      ]
    };
    var reinited = false;

    function fitIcons() {
      try {
        if ($feat.hasClass('slick-initialized')) {
          if (!reinited) {
            $feat.slick('unslick');
            $feat.slick(opts);
            reinited = true;
          } else {
            $feat.slick('setPosition');
          }
        } else {
          $feat.slick(opts);
          reinited = true;
        }
      } catch (e1) {
        /* ignore */
      }
    }

    fitIcons();
    setTimeout(fitIcons, 50);
    setTimeout(fitIcons, 250);
  }

  /* Move Key Features under main image (Watch Videos position) */
  function moveKeyFeatures() {
    var wrap = qs('.images-wrapper');
    var right = qs('.product-right-wrapper');
    if (!wrap || !right) return false;

    var heading =
      right.querySelector(':scope > .icons-heading') ||
      qs('.ce-yg-desk-kf > .icons-heading') ||
      qs('.icons-heading');
    var icons =
      right.querySelector(':scope > .icons-wrapper') ||
      qs('.ce-yg-desk-kf > .icons-wrapper') ||
      qs('.icons-wrapper');
    if (!icons) return false;

    var host = qs('.' + KF_HOST);
    if (!host) {
      host = document.createElement('div');
      host.className = KF_HOST;
    }

    if (!heading) {
      heading = document.createElement('h2');
      heading.className = 'icons-heading';
      heading.textContent = 'Key Features';
    } else if (!String(heading.textContent || '').trim()) {
      heading.textContent = 'Key Features';
    }

    /* Heading first, then icons */
    if (heading.parentNode !== host || host.firstChild !== heading) {
      host.insertBefore(heading, host.firstChild);
    }
    if (icons.parentNode !== host) host.appendChild(icons);
    else if (heading.nextSibling !== icons) host.appendChild(icons);

    heading.style.setProperty('display', 'block', 'important');
    heading.style.setProperty('visibility', 'visible', 'important');
    heading.style.setProperty('opacity', '1', 'important');
    heading.style.setProperty('color', '#222222', 'important');

    var videoBtn = wrap.querySelector(':scope > .video-button');
    if (host.parentNode !== wrap) {
      if (videoBtn) wrap.insertBefore(host, videoBtn);
      else wrap.appendChild(host);
    }

    kfMoved = true;
    refreshFeaturesCarousel(host);
    return true;
  }

  function restoreKeyFeatures() {
    if (!kfMoved) return;
    var right = qs('.product-right-wrapper');
    var host = qs('.' + KF_HOST);
    if (!right || !host) {
      kfMoved = false;
      return;
    }
    var points = right.querySelector(':scope > .points');
    var heading = host.querySelector('.icons-heading');
    var icons = host.querySelector('.icons-wrapper');
    var insertBefore = points || null;
    if (heading) right.insertBefore(heading, insertBefore);
    if (icons) right.insertBefore(icons, insertBefore);
    if (host.parentNode) host.parentNode.removeChild(host);
    kfMoved = false;
  }

  /* Collapse Description — Plant Calendar stays open like Magento */
  function closeDefaultAccordions() {
    CLOSE_TABS.forEach(function (id) {
      var heading = document.getElementById(id);
      if (!heading || !/\btab-heading\b/.test(heading.className || '')) return;
      var content = heading.nextElementSibling;
      heading.classList.remove('active');
      if (content && /\btab-content\b/.test(content.className || '')) {
        content.classList.remove('active');
        content.style.display = 'none';
      }
    });
  }

  function apply() {
    document.documentElement.classList.add(ROOT);
    sized = false;
    lockSizesOnce(true);
    verticalThumbs();
    moveKeyFeatures();
    refreshMainCarousel();
    closeDefaultAccordions();
    setTimeout(closeDefaultAccordions, 300);
    setTimeout(closeDefaultAccordions, 1000);
    setTimeout(function () {
      if (!desk()) return;
      sized = false;
      lockSizesOnce(true);
      refreshMainCarousel();
      var host = qs('.' + KF_HOST);
      if (host) refreshFeaturesCarousel(host);
    }, 150);
  }

  function clear() {
    restoreKeyFeatures();
    document.documentElement.classList.remove(ROOT);
    document.documentElement.style.removeProperty('--ce-yg-desk-main');
    document.documentElement.style.removeProperty('--ce-yg-desk-thumb');
    document.documentElement.style.removeProperty('--ce-yg-desk-thumb-gap');
    document.documentElement.style.removeProperty('--ce-yg-desk-gap');
    document.documentElement.style.removeProperty('--ce-yg-desk-wrap');
    sized = false;
  }

  function go() {
    if (!desk()) {
      clear();
      return;
    }

    if (!qs('#opt-image-carousel') || !qs('#main-image-carousel')) {
      if (++tries < MAX) setTimeout(go, 250);
      return;
    }

    /* Key Features may load slightly later than the gallery */
    apply();
    if (!kfMoved && tries < MAX) {
      tries += 1;
      setTimeout(function () {
        if (desk()) moveKeyFeatures();
      }, 250);
    }
  }

  function onBp() {
    tries = 0;
    sized = false;
    go();
  }

  function onResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (!desk()) {
        clear();
        return;
      }
      /* Recalc sizes within desktop range */
      sized = false;
      lockSizesOnce(true);
      refreshMainCarousel();
      var host = qs('.' + KF_HOST);
      if (host) refreshFeaturesCarousel(host);
    }, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', go);
  } else {
    go();
  }

  if (window.matchMedia) {
    var mql = window.matchMedia(MQ);
    if (mql.addEventListener) mql.addEventListener('change', onBp);
    else if (mql.addListener) mql.addListener(onBp);
  }
  window.addEventListener('resize', onResize);
})();
