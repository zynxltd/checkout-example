/**
 * Crazy Egg — PDP Desktop Layout v1 (left thumbs + KF modal)
 *
 * Paste into Crazy Egg Variant → Edit Script
 * Pair with: crazyegg-pdp-desk-layout-v1.css
 *
 * Breakpoints:
 *   ≤599px    → mobile CE variant only
 *   600–900px → Magento tablet
 *   ≥901px    → left thumbs + main; KF via lightbulb link → modal tour
 *   901–1499  → thumbs INSIDE
 *   ≥1500     → thumbs OUTSIDE left
 *
 * Example: https://www.yougarden.com/item-p-511603/standard-holly-trees-with-premium-pinecone-planters
 */
(function () {
  'use strict';

  var ROOT = 'ce-yg-pdp-desk-v1';
  var NARROW = 'ce-yg-desk-narrow';
  var ATTR = 'data-ce-yg-pdp-desk-v1';
  var VER = '56';
  var MQ = '(min-width: 901px)';
  var DESK_MIN = 901;
  var MOBILE_MAX = 599;
  var WIDE_MIN = 1500; /* outside rail only when viewport truly wide */
  var VISIBLE = 4;
  var GAP = 8; /* 4×thumb + 3×gap === main (flush) */
  var MAIN_TARGET = 640; /* full desktop only */
  var MAIN_MIN = 260;
  var MIN_BUY = 320;
  var GUTTER = 20;
  var SIDE_PAD = 5; /* centralWrapper padding-right — match CSS */
  var SWIPE_PX = 14;
  var KF_TOUR_MS = 5000; /* full auto carousel duration then close */

  /* Mid desktop: balanced vs buy (not tiny gallery / huge buy) */
  function mainCapForViewport(vw) {
    if (vw < 1025) return 400; /* ~900–1024 */
    if (vw < 1101) return 440; /* ~1025–1100 */
    if (vw < 1201) return 480; /* ~1101–1200 */
    if (vw < 1301) return 520; /* ~1201–1300 */
    if (vw < WIDE_MIN) return 580; /* ~1301–1499 */
    return MAIN_TARGET; /* ≥1500 */
  }

  /* Rail shows exactly VISIBLE whole thumbs — no partial peek */
  function stackHeight(thumb, gap) {
    return thumb * VISIBLE + gap * (VISIBLE - 1);
  }

  function thumbFromMain(mainPx, gap) {
    var t = Math.floor((mainPx - gap * (VISIBLE - 1)) / VISIBLE);
    if (t < 56) t = 56;
    if (t > 160) t = 160;
    return t;
  }
  var KF_HOST = 'ce-yg-desk-kf';
  var KF_TRIGGER = 'ce-yg-desk-kf-trigger';
  var KF_MODAL = 'ce-yg-desk-kf-modal';
  var CLOSE_TABS = ['description'];
  var tries = 0;
  var MAX = 40;
  var sized = false;
  var kfMoved = false;
  var resizeTimer = null;
  var kfTourTimer = null;
  var kfStepTimer = null;
  var kfOpen = false;

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
   * Main scaled by viewport band (mid desktop was oversized).
   * Thumbs flush: 4×thumb + 3×gap === main.
   * Mid (<1500): thumbs INSIDE. Wide: OUTSIDE when gutter allows.
   * Gallery always leaves MIN_BUY beside it.
   */
  function lockSizesOnce(force) {
    if (sized && !force) return;
    var root = document.documentElement;
    var wrap = qs('.images-wrapper');
    var top = qs('.product-top-wrapper');
    var row =
      (top && top.querySelector(':scope > .centralWrapper')) ||
      (wrap && wrap.parentElement) ||
      top;
    var vw = window.innerWidth || 1400;
    var thumbGap = vw < 1200 ? 6 : GAP;
    var railGap = vw < 1200 ? 8 : 10;
    var mainCap = mainCapForViewport(vw);

    /* Measure the float containing block (centralWrapper), not product-top alone */
    var parentW = 0;
    if (row) parentW = Math.round(row.getBoundingClientRect().width);
    if (parentW < 400 && top) parentW = Math.round(top.getBoundingClientRect().width);
    if (parentW < 400) parentW = Math.min(1300, Math.round(vw * 0.92));

    /* Inner width after side padding on centralWrapper */
    var innerW = Math.max(320, parentW - SIDE_PAD);
    var maxGallery = innerW - MIN_BUY - GUTTER;
    var pctCap = Math.floor(innerW * (vw < 1301 ? 0.5 : 0.52));
    if (maxGallery > pctCap) maxGallery = pctCap;
    if (maxGallery < 300) maxGallery = Math.floor(innerW * 0.45);
    if (maxGallery > mainCap + 160) maxGallery = mainCap + 160;

    var leftEdge = wrap ? Math.round(wrap.getBoundingClientRect().left) : 0;
    var probeThumb = thumbFromMain(Math.min(mainCap, maxGallery), thumbGap);
    var useInside =
      vw < WIDE_MIN || (leftEdge > 0 && leftEdge < probeThumb + railGap + 4);

    var mainPx;
    var thumb;
    var galleryW;

    if (useInside) {
      root.classList.add(NARROW);
      /* Prefer viewport mainCap — don't inflate to fill maxGallery */
      mainPx = Math.min(mainCap, Math.floor(maxGallery * 0.72));
      if (mainPx < MAIN_MIN) mainPx = MAIN_MIN;
      thumb = thumbFromMain(mainPx, thumbGap);
      mainPx = stackHeight(thumb, thumbGap);
      galleryW = thumb + railGap + mainPx;
      if (galleryW > maxGallery) {
        mainPx = Math.max(MAIN_MIN, maxGallery - railGap - Math.max(56, thumb));
        thumb = thumbFromMain(mainPx, thumbGap);
        mainPx = stackHeight(thumb, thumbGap);
        galleryW = thumb + railGap + mainPx;
        while (galleryW > maxGallery && mainPx > MAIN_MIN) {
          mainPx -= 4;
          thumb = thumbFromMain(mainPx, thumbGap);
          mainPx = stackHeight(thumb, thumbGap);
          galleryW = thumb + railGap + mainPx;
        }
      }
    } else {
      root.classList.remove(NARROW);
      mainPx = Math.min(mainCap, maxGallery);
      if (mainPx < MAIN_MIN) mainPx = MAIN_MIN;
      thumb = thumbFromMain(mainPx, thumbGap);
      mainPx = stackHeight(thumb, thumbGap);
      galleryW = mainPx; /* thumbs hang outside */
      if (galleryW > maxGallery) {
        mainPx = maxGallery;
        thumb = thumbFromMain(mainPx, thumbGap);
        mainPx = stackHeight(thumb, thumbGap);
        galleryW = mainPx;
      }
    }

    root.style.setProperty('--ce-yg-desk-wrap', parentW + 'px');
    root.style.setProperty('--ce-yg-desk-gallery', galleryW + 'px');
    root.style.setProperty('--ce-yg-desk-main', mainPx + 'px');
    root.style.setProperty('--ce-yg-desk-thumb', thumb + 'px');
    root.style.setProperty('--ce-yg-desk-thumb-gap', thumbGap + 'px');
    root.style.setProperty('--ce-yg-desk-gap', railGap + 'px');
    root.style.setProperty('--ce-yg-desk-rail', mainPx + 'px');
    root.style.setProperty('--ce-yg-desk-gutter', GUTTER + 'px');

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

  /* Magento main slide onclick="showVideo('id')" — thumb only has changeSlide('n','') */
  function videoIdForIndex(index) {
    var main = qs('#main-image-carousel');
    if (!main) return null;
    var slide = main.querySelector(
      '.slick-slide[data-slick-index="' + index + '"]:not(.slick-cloned)'
    );
    if (!slide) return null;
    var oc = slide.getAttribute('onclick') || '';
    var m = oc.match(/showVideo\s*\(\s*['\"]?(\d+)/);
    return m ? m[1] : null;
  }

  function activateThumbFromEvent(target) {
    var info = readChangeSlide(target);
    if (!info || isNaN(info.index)) return false;
    try {
      var $ = jq();
      var main = qs('#main-image-carousel');
      var vid = videoIdForIndex(info.index);

      /*
       * Always go through Magento changeSlide first — it hides #carousel-video-wrapper
       * and un-hides the main carousel. slickGoTo alone leaves the video overlay up
       * (looks like the "wrong" image after leaving video).
       */
      if (typeof window.changeSlide === 'function') {
        window.changeSlide(String(info.index));
      } else if ($ && main && $(main).hasClass('slick-initialized')) {
        if (typeof window.closeVideo === 'function') {
          try {
            window.closeVideo();
          } catch (e0) {
            /* ignore */
          }
        }
        $(main).slick('slickGoTo', info.index, true);
      }

      /* Video thumb → open Vimeo player (Magento stores id on the main slide) */
      if (vid && typeof window.showVideo === 'function') {
        window.showVideo(vid);
      }

      markActiveThumb(info.index);
      return true;
    } catch (e) {
      return false;
    }
  }

  /* Drag/swipe scrolls the rail; taps activate via click (not pointerup) */
  function bindThumbSwipe(car) {
    if (!car || car.getAttribute('data-ce-yg-desk-swipe') === '1') return;
    car.setAttribute('data-ce-yg-desk-swipe', '1');

    var y0 = 0;
    var top0 = 0;
    var dragging = false;
    var moved = false;
    var pointerId = null;

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
      pointerId = e.pointerId;
      y0 = e.clientY;
      top0 = car.scrollTop;
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
      dragging = false;
      pointerId = null;
      car.classList.remove('ce-yg-desk-swiping');
      /* Keep moved through the following click event, then clear */
      setTimeout(function () {
        moved = false;
      }, 0);
    }

    car.addEventListener('pointerup', endSwipe);
    car.addEventListener('pointercancel', endSwipe);

    /*
     * Own thumb activation on click. Stop Magento inline onclick (avoids
     * double-fire). If this was a swipe, skip activate. Previously we
     * activated on pointerup AND killed click — micro-swipes left the main
     * stuck on the video/poster ("wrong image" when tapping image 1).
     */
    car.addEventListener(
      'click',
      function (e) {
        if (!readChangeSlide(e.target)) return;
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') {
          e.stopImmediatePropagation();
        }
        if (moved) return;
        activateThumbFromEvent(e.target);
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

  /* Hide Magento KF block — shown via lightbulb link + modal instead */
  function hideKeyFeatures() {
    var right = qs('.product-right-wrapper');
    var host = qs('.' + KF_HOST);
    if (host && host.parentNode) host.parentNode.removeChild(host);
    if (!right) {
      kfMoved = true;
      return false;
    }
    var heading = right.querySelector(':scope > .icons-heading');
    var icons = right.querySelector(':scope > .icons-wrapper');
    if (heading) {
      heading.style.setProperty('display', 'none', 'important');
      heading.setAttribute('data-ce-yg-desk-kf-hide', '1');
    }
    if (icons) {
      icons.style.setProperty('display', 'none', 'important');
      icons.setAttribute('data-ce-yg-desk-kf-hide', '1');
    }
    kfMoved = true;
    return !!icons;
  }

  function collectKfItems() {
    var icons = qs('.product-right-wrapper > .icons-wrapper') || qs('.icons-wrapper');
    if (!icons) return [];
    var seen = {};
    var items = [];
    [].forEach.call(icons.querySelectorAll('.icon'), function (el) {
      if (el.closest && el.closest('.slick-cloned')) return;
      var img = el.querySelector('img');
      var desc = el.querySelector('.icon-desc');
      var src = img ? img.getAttribute('src') || '' : '';
      var label = desc ? String(desc.textContent || '').replace(/\s+/g, ' ').trim() : '';
      if (!src && !label) return;
      var key = src || label;
      if (seen[key]) return;
      seen[key] = true;
      items.push({ src: src, label: label, alt: (img && img.getAttribute('alt')) || label });
    });
    return items;
  }

  function ensureKfModal() {
    var modal = qs('#' + KF_MODAL);
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = KF_MODAL;
    modal.className = KF_MODAL;
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<div class="ce-yg-desk-kf-backdrop" data-ce-yg-kf-close="1"></div>' +
      '<div class="ce-yg-desk-kf-dialog" role="dialog" aria-modal="true" aria-label="Key Features">' +
      '<button type="button" class="ce-yg-desk-kf-close" data-ce-yg-kf-close="1" aria-label="Close">&times;</button>' +
      '<p class="ce-yg-desk-kf-eyebrow">Key Features</p>' +
      '<div class="ce-yg-desk-kf-stage">' +
      '<div class="ce-yg-desk-kf-track"></div>' +
      '</div>' +
      '<div class="ce-yg-desk-kf-dots"></div>' +
      '<div class="ce-yg-desk-kf-progress"><span></span></div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.getAttribute && t.getAttribute('data-ce-yg-kf-close') === '1') {
        closeKfModal();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && kfOpen) closeKfModal();
    });
    return modal;
  }

  function clearKfTimers() {
    if (kfTourTimer) {
      clearTimeout(kfTourTimer);
      kfTourTimer = null;
    }
    if (kfStepTimer) {
      clearInterval(kfStepTimer);
      kfStepTimer = null;
    }
  }

  function setKfSlide(modal, index, total) {
    var track = modal.querySelector('.ce-yg-desk-kf-track');
    var dots = modal.querySelectorAll('.ce-yg-desk-kf-dot');
    var slides = modal.querySelectorAll('.ce-yg-desk-kf-slide');
    if (track) {
      track.style.transform = 'translate3d(' + -index * 100 + '%,0,0)';
    }
    var i;
    for (i = 0; i < slides.length; i++) {
      slides[i].classList.toggle('is-active', i === index);
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].classList.toggle('is-active', i === index);
    }
  }

  function closeKfModal() {
    clearKfTimers();
    var modal = qs('#' + KF_MODAL);
    if (!modal) {
      kfOpen = false;
      return;
    }
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('ce-yg-desk-kf-open');
    kfOpen = false;
  }

  function openKfModal() {
    var items = collectKfItems();
    if (!items.length) return;
    var modal = ensureKfModal();
    var track = modal.querySelector('.ce-yg-desk-kf-track');
    var dots = modal.querySelector('.ce-yg-desk-kf-dots');
    var progress = modal.querySelector('.ce-yg-desk-kf-progress > span');
    if (!track || !dots) return;

    clearKfTimers();
    track.innerHTML = '';
    dots.innerHTML = '';

    var i;
    for (i = 0; i < items.length; i++) {
      var slide = document.createElement('div');
      slide.className = 'ce-yg-desk-kf-slide' + (i === 0 ? ' is-active' : '');
      slide.innerHTML =
        '<div class="ce-yg-desk-kf-card">' +
        (items[i].src
          ? '<img src="' +
            items[i].src +
            '" alt="' +
            (items[i].alt || items[i].label).replace(/"/g, '') +
            '">'
          : '') +
        '<p>' +
        (items[i].label || 'Feature') +
        '</p>' +
        '</div>';
      track.appendChild(slide);

      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'ce-yg-desk-kf-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Feature ' + (i + 1));
      dots.appendChild(dot);
    }

    track.style.width = '';
    [].forEach.call(track.children, function (child) {
      child.style.flex = '0 0 100%';
      child.style.width = '100%';
      child.style.minWidth = '100%';
    });

    setKfSlide(modal, 0, items.length);
    if (progress) {
      progress.style.transition = 'none';
      progress.style.width = '0%';
      void progress.offsetWidth;
      progress.style.transition = 'width ' + KF_TOUR_MS + 'ms linear';
      progress.style.width = '100%';
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('ce-yg-desk-kf-open');
    kfOpen = true;

    var step = 0;
    var stepMs = Math.max(600, Math.floor(KF_TOUR_MS / items.length));
    kfStepTimer = setInterval(function () {
      step += 1;
      if (step >= items.length) {
        clearKfTimers();
        return;
      }
      setKfSlide(modal, step, items.length);
    }, stepMs);

    kfTourTimer = setTimeout(function () {
      closeKfModal();
    }, KF_TOUR_MS + 350);
  }

  function injectKfTrigger() {
    var right = qs('.product-right-wrapper');
    if (!right) return false;
    hideKeyFeatures();
    if (!collectKfItems().length) return false;

    var feefo = right.querySelector('#feefo-rating, .feefo-rating');
    var trigger = qs('.' + KF_TRIGGER);
    if (!trigger) {
      trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = KF_TRIGGER;
      trigger.innerHTML =
        '<span class="ce-yg-desk-kf-bulb" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M9 18h6"/><path d="M10 21h4"/>' +
        '<path d="M12 3a6 6 0 0 0-3.5 10.7c.6.5 1 1.2 1.1 2v.3h4.8v-.3c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3z"/>' +
        '</svg></span>' +
        '<span class="ce-yg-desk-kf-label">Key Features</span>' +
        '<span class="ce-yg-desk-kf-hint">See highlights</span>';
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (kfOpen) closeKfModal();
        else openKfModal();
      });
    }

    if (feefo) {
      feefo.style.setProperty('display', 'none', 'important');
      feefo.setAttribute('data-ce-yg-desk-kf-hide', '1');
      if (trigger.parentNode !== right || trigger.nextSibling !== feefo) {
        right.insertBefore(trigger, feefo);
      }
    } else {
      var price = right.querySelector('.price-wrapper');
      if (price) right.insertBefore(trigger, price);
      else right.insertBefore(trigger, right.firstChild);
    }

    ensureKfModal();
    return true;
  }

  function restoreKeyFeatures() {
    closeKfModal();
    var trigger = qs('.' + KF_TRIGGER);
    if (trigger && trigger.parentNode) trigger.parentNode.removeChild(trigger);
    var modal = qs('#' + KF_MODAL);
    if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
    var host = qs('.' + KF_HOST);
    if (host && host.parentNode) host.parentNode.removeChild(host);
    [].forEach.call(document.querySelectorAll('[data-ce-yg-desk-kf-hide]'), function (el) {
      el.style.removeProperty('display');
      el.removeAttribute('data-ce-yg-desk-kf-hide');
    });
    document.documentElement.classList.remove('ce-yg-desk-kf-open');
    kfMoved = false;
    kfOpen = false;
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
    injectKfTrigger();
    refreshMainCarousel();
    closeDefaultAccordions();
    setTimeout(closeDefaultAccordions, 300);
    setTimeout(closeDefaultAccordions, 1000);
    setTimeout(function () {
      if (!desk()) return;
      sized = false;
      lockSizesOnce(true);
      refreshMainCarousel();
      injectKfTrigger();
    }, 150);
  }

  function clear() {
    restoreKeyFeatures();
    document.documentElement.classList.remove(ROOT);
    document.documentElement.classList.remove(NARROW);
    document.documentElement.style.removeProperty('--ce-yg-desk-main');
    document.documentElement.style.removeProperty('--ce-yg-desk-thumb');
    document.documentElement.style.removeProperty('--ce-yg-desk-thumb-gap');
    document.documentElement.style.removeProperty('--ce-yg-desk-gap');
    document.documentElement.style.removeProperty('--ce-yg-desk-wrap');
    document.documentElement.style.removeProperty('--ce-yg-desk-gallery');
    document.documentElement.style.removeProperty('--ce-yg-desk-rail');
    document.documentElement.style.removeProperty('--ce-yg-desk-gutter');
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

    /* KF icons may load slightly later than the gallery */
    apply();
    if (tries < MAX) {
      tries += 1;
      setTimeout(function () {
        if (desk()) injectKfTrigger();
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
      injectKfTrigger();
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
