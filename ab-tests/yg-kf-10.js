/**
 * Crazy Egg — PDP Key Features v3 · Variant 10 (mobile) — CRO
 *
 * Same as Variant 5, but Key Features is the **3rd** gallery slide / thumb
 * (slick index 2: image → image → Key Features → …).
 *
 *   • KF icons as one gallery slide at position 3 (mid-page KF hidden)
 *   • Thumbs under hero (≤599px) — KF thumb is 3rd
 *   • "Key Features" jump link right of Feefo (no underline, 15px)
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-pdp-key-features-v3-variant-10.css
 *
 * Example: https://www.yougarden.com/item-p-511603/standard-holly-trees-with-premium-pinecone-planters
 */
(function () {
  'use strict';

  var ROOT = 'ce-yg-pdp-kf-v3v10';
  var VER = '1';
  var INIT = 'data-ce-yg-pdp-kf-v3v10';
  var STYLE_ID = 'ce-yg-pdp-kf-v3v10-css';
  var SLIDE_MARK = 'data-ce-yg-kf-v3v10-slide';
  var RAIL_ID = 'ce-yg-thumbs';
  var THUMBS_ON = 'ce-yg-thumbs-on';
  var MQ_KF = window.matchMedia('(max-width: 1000px)');
  var MQ_THUMBS = window.matchMedia('(max-width: 599px)');
  var viewedSent = false;
  var galleryEngageSent = false;
  var thumbsBound = false;

  if (!/\/item-[sp]-/i.test(window.location.pathname)) return;
  var alreadyBooted = document.documentElement.getAttribute(INIT) === VER;
  document.documentElement.setAttribute(INIT, VER);
  document.documentElement.classList.add(ROOT);

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function jq() {
    return window.jQuery || window.$;
  }

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function carousel() {
    return qs('#main-image-carousel') || qs('.main-image-carousel');
  }

  function ensureCss() {
    var prev = document.getElementById(STYLE_ID);
    if (prev && prev.parentNode) prev.parentNode.removeChild(prev);
    var st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent =
      '@media (max-width:1000px){' +
        'html.ce-yg-pdp-kf-v3v10 .product-right-wrapper>.icons-heading,' +
        'html.ce-yg-pdp-kf-v3v10 .product-right-wrapper>.icons-wrapper,' +
        'html.ce-yg-pdp-kf-v3v10 #product-features-carousel,' +
        'html.ce-yg-pdp-kf-v3v10 .product-features-carousel{display:none!important}' +
        /* Padding lives on .inner — padding on the slick-slide root widens it and shifts the track */
        'html.ce-yg-pdp-kf-v3v10 #main-image-carousel .slick-slide.ce-yg-kf-slide{' +
          'box-sizing:border-box!important;padding:0!important;margin:0;overflow:hidden}' +
        'html.ce-yg-pdp-kf-v3v10 .ce-yg-kf-slide-inner{' +
          'display:flex!important;flex-direction:column;align-items:center;justify-content:center;' +
          'box-sizing:border-box;width:100%;height:100%;aspect-ratio:1/1;padding:12px 10px 14px;' +
          'background:#ffffff;text-align:center}' +
        'html.ce-yg-pdp-kf-v3v10 .ce-yg-kf-slide-title{' +
          'margin:0 0 10px;padding:0;font-family:Rubik,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
          'font-size:17px;font-weight:600;line-height:1.2;color:#264f1c}' +
        'html.ce-yg-pdp-kf-v3v10 .ce-yg-kf-slide-grid,' +
        'html.ce-yg-pdp-kf-v3v10 .ce-yg-kf-slide-grid.cols-2,' +
        'html.ce-yg-pdp-kf-v3v10 .ce-yg-kf-slide-grid.cols-3{' +
          'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px 12px;' +
          'width:100%;max-width:100%;margin:0 auto;box-sizing:border-box;' +
          'align-content:center;justify-items:center}' +
        'html.ce-yg-pdp-kf-v3v10 .ce-yg-kf-slide-item{' +
          'display:flex;flex-direction:column;align-items:center;justify-content:flex-start;text-align:center;' +
          'min-width:0;width:100%}' +
        'html.ce-yg-pdp-kf-v3v10 .ce-yg-kf-slide-item img{' +
          'display:block;width:72px!important;height:72px!important;min-width:72px;min-height:72px;max-width:100%;' +
          'object-fit:contain;margin:0 auto 8px;padding:0;pointer-events:none}' +
        'html.ce-yg-pdp-kf-v3v10 .ce-yg-kf-slide-item span{' +
          'display:block;width:100%;font-family:Rubik,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
          'font-size:12px;line-height:1.25;font-weight:500;color:#264f1c}' +
        /* Feefo is float:left;width:200px — wrap in flex row and kill the float */
        'html.ce-yg-pdp-kf-v3v10 .ce-yg-kf-stars-row{' +
          'display:flex!important;align-items:center;justify-content:space-between;gap:12px;' +
          'width:100%;box-sizing:border-box;clear:both;margin:10px 0 0;padding:0}' +
        'html.ce-yg-pdp-kf-v3v10 .ce-yg-kf-stars-row #feefo-rating,' +
        'html.ce-yg-pdp-kf-v3v10 .ce-yg-kf-stars-row .feefo-rating{' +
          'float:none!important;width:auto!important;max-width:none!important;flex:0 1 auto;' +
          'min-width:0;margin:0!important;display:block}' +
        'html.ce-yg-pdp-kf-v3v10 .ce-yg-kf-stars-row .feefo-product-stars-widget{' +
          'width:auto!important;max-width:100%}' +
        'html.ce-yg-pdp-kf-v3v10 .ce-yg-kf-jump{' +
          'display:inline-flex!important;align-items:center;gap:5px;flex:0 0 auto;margin-left:auto;' +
          'padding:0;border:0;background:transparent;cursor:pointer;' +
          'font-family:Rubik,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
          'font-size:14px;font-weight:400;line-height:1.3;color:#333;' +
          'text-decoration:none;white-space:nowrap;float:none!important}' +
        'html.ce-yg-pdp-kf-v3v10 .ce-yg-kf-jump:hover{color:#1b3a14;text-decoration:none}' +
        'html.ce-yg-pdp-kf-v3v10 .ce-yg-kf-jump-icon{' +
          'display:block;width:18px;height:18px;flex:0 0 18px;color:#333}' +
        'html.ce-yg-pdp-kf-v3v10 .ce-yg-kf-jump-icon svg{display:block;width:100%;height:100%}' +
      '}' +
      '@media (min-width:1001px){' +
        'html.ce-yg-pdp-kf-v3v10 .ce-yg-kf-slide{display:none!important}' +
        'html.ce-yg-pdp-kf-v3v10 .ce-yg-kf-jump,' +
        'html.ce-yg-pdp-kf-v3v10 .ce-yg-kf-stars-row .ce-yg-kf-jump{display:none!important}' +
      '}' +
      '@media (min-width:600px){#ce-yg-thumbs{display:none!important}}' +
      '@media (max-width:599px){' +
        'html.ce-yg-thumbs-on #main-image-carousel .slick-dots{display:none!important}' +
        'html.ce-yg-thumbs-on #main-image-carousel .previous-button,' +
        'html.ce-yg-thumbs-on #main-image-carousel .next-button,' +
        'html.ce-yg-thumbs-on #main-image-carousel .slick-arrow{display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;z-index:9!important}' +
        '#ce-yg-thumbs{display:flex;flex-wrap:nowrap;gap:8px;width:100%;margin:0;padding:8px 0 10px;box-sizing:border-box;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;touch-action:pan-x;background:#fff}' +
        '#ce-yg-thumbs::-webkit-scrollbar{display:none}' +
        '#ce-yg-thumbs .ce-yg-thumb{flex:0 0 calc((100% - 40px)/4);width:calc((100% - 40px)/4);aspect-ratio:1/1;padding:0;margin:0;border:1.5px solid #d7ddd2;border-radius:6px;background:#f5f6f4;overflow:hidden;cursor:pointer;box-sizing:border-box;position:relative}' +
        '#ce-yg-thumbs .ce-yg-thumb:first-child{margin-left:6px!important}' +
        '#ce-yg-thumbs .ce-yg-thumb:last-child{margin-right:6px!important}' +
        '#ce-yg-thumbs .ce-yg-thumb.is-active{border-color:#264f1c;border-width:2px}' +
        '#ce-yg-thumbs .ce-yg-thumb img{display:block;width:100%;height:100%;object-fit:cover;pointer-events:none}' +
        '#ce-yg-thumbs .ce-yg-thumb.is-video::after{content:"";position:absolute;left:50%;top:50%;margin:-7px 0 0 -5px;border-style:solid;border-width:8px 0 8px 13px;border-color:transparent transparent transparent #fff;filter:drop-shadow(0 1px 2px rgba(0,0,0,.4));pointer-events:none}' +
        '#ce-yg-thumbs .ce-yg-thumb.is-kf{background:#ffffff!important;display:flex!important;align-items:center;justify-content:center;padding:5px!important;overflow:hidden}' +
        '#ce-yg-thumbs .ce-yg-thumb.is-kf>img{display:none!important}' +
        '#ce-yg-thumbs .ce-yg-thumb.is-kf .ce-yg-thumb-kf-preview{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;box-sizing:border-box;padding:3px 2px;gap:3px}' +
        '#ce-yg-thumbs .ce-yg-thumb.is-kf .ce-yg-thumb-kf-title{display:block;margin:0;padding:0;font-family:Rubik,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:6px;font-weight:600;line-height:1;color:#264f1c;white-space:nowrap}' +
        '#ce-yg-thumbs .ce-yg-thumb.is-kf .ce-yg-thumb-kf-grid,' +
        '#ce-yg-thumbs .ce-yg-thumb.is-kf .ce-yg-thumb-kf-grid.cols-2,' +
        '#ce-yg-thumbs .ce-yg-thumb.is-kf .ce-yg-thumb-kf-grid.cols-3{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:3px 4px;width:100%;box-sizing:border-box;align-content:center;justify-items:center}' +
        '#ce-yg-thumbs .ce-yg-thumb.is-kf .ce-yg-thumb-kf-grid img{display:block!important;width:100%!important;max-width:22px!important;height:auto!important;aspect-ratio:1/1;object-fit:contain!important;margin:0!important;pointer-events:none}' +
      '}';
    document.head.appendChild(st);
  }

  function labelFrom(desc) {
    if (!desc) return '';
    var html = desc.innerHTML || '';
    if (html) {
      return html
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    return (desc.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function collectIcons() {
    var seen = {};
    var out = [];
    var nodes = document.querySelectorAll(
      '#product-features-carousel .slick-slide:not(.slick-cloned) .icon, ' +
        '#product-features-carousel .icon, ' +
        '.icons-wrapper .icon, ' +
        '.icons-wrapper .slick-slide .icon'
    );
    var i;
    for (i = 0; i < nodes.length; i += 1) {
      var icon = nodes[i];
      var img = icon.querySelector('img');
      var desc = icon.querySelector('.icon-desc');
      var src = img && (img.getAttribute('src') || img.getAttribute('data-src'));
      var alt = (img && (img.getAttribute('alt') || '')) || '';
      var key = src || alt;
      if (!key || seen[key]) continue;
      seen[key] = 1;
      out.push({
        src: src,
        alt: alt,
        label: labelFrom(desc) || alt
      });
      if (out.length >= 9) break;
    }
    return out;
  }

  function trackViewOnce(index, count) {
    if (viewedSent) return;
    viewedSent = true;
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'pdp_kf_carousel_view',
        gallery_index: index,
        kf_icon_count: count,
        page_path: location.pathname
      });
    } catch (e) {
      /* ignore */
    }
  }

  function trackGalleryEngageOnce(index) {
    if (galleryEngageSent) return;
    galleryEngageSent = true;
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'pdp_gallery_engage',
        gallery_action: 'thumb_tap',
        gallery_index: index,
        page_path: location.pathname
      });
    } catch (e) {
      /* ignore */
    }
  }

  function realKfSlide(car) {
    var nodes = (car || carousel() || document).querySelectorAll('.ce-yg-kf-slide');
    var i;
    for (i = 0; i < nodes.length; i += 1) {
      var el = nodes[i];
      var slide = el.classList.contains('slick-slide') ? el : el.closest('.slick-slide');
      if (!slide || slide.classList.contains('slick-cloned')) continue;
      var idx = parseInt(slide.getAttribute('data-slick-index'), 10);
      if (!isNaN(idx) && idx >= 0) return slide;
    }
    return null;
  }

  function removeSlide() {
    var car = carousel();
    if (!car) return;
    var $ = jq();
    var slide = realKfSlide(car);
    while (slide) {
      if ($ && $.fn && $.fn.slick && car.classList.contains('slick-initialized')) {
        var idx = parseInt(slide.getAttribute('data-slick-index'), 10);
        if (!isNaN(idx) && idx >= 0) {
          try {
            $(car).slick('slickRemove', idx);
          } catch (e) {
            if (slide.parentNode) slide.parentNode.removeChild(slide);
          }
        } else if (slide.parentNode) {
          slide.parentNode.removeChild(slide);
        }
      } else if (slide.parentNode) {
        slide.parentNode.removeChild(slide);
      }
      slide = realKfSlide(car);
    }
    car.removeAttribute(SLIDE_MARK);
  }

  function buildSlideHtml(icons) {
    var cols = icons.length <= 4 ? 2 : 3;
    var parts = [];
    /* Root becomes the slick-slide — keep it padding-free so widths match image slides */
    parts.push('<div class="ce-yg-kf-slide" role="group" aria-label="Key features">');
    parts.push('<div class="ce-yg-kf-slide-inner">');
    parts.push('<div class="ce-yg-kf-slide-title">Key Features</div>');
    /* Always 3 cols so 1–9 icons align on a 3×3 grid */
    parts.push('<div class="ce-yg-kf-slide-grid cols-3">');
    icons.forEach(function (item) {
      parts.push('<div class="ce-yg-kf-slide-item">');
      if (item.src) {
        parts.push(
          '<img src="' +
            item.src.replace(/"/g, '&quot;') +
            '" alt="' +
            (item.alt || item.label || '').replace(/"/g, '&quot;') +
            '" width="72" height="72" loading="lazy">'
        );
      }
      parts.push('<span>' + (item.label || item.alt || '') + '</span>');
      parts.push('</div>');
    });
    parts.push('</div></div></div>');
    return parts.join('');
  }

  function bindViewTracking(icons) {
    var car = carousel();
    var $ = jq();
    if (!car || !$ || !$.fn || !$.fn.slick) return;
    if (car.getAttribute('data-ce-yg-kf-v3v10-bound') === '1') return;
    car.setAttribute('data-ce-yg-kf-v3v10-bound', '1');

    $(car).on('afterChange.ceYgKfV3v10', function (e, slick, current) {
      var slide = slick.$slides && slick.$slides.eq(current);
      /* slickAdd uses our root .ce-yg-kf-slide as the slide itself */
      if (
        slide &&
        slide.length &&
        (slide.hasClass('ce-yg-kf-slide') || slide.find('.ce-yg-kf-slide').length)
      ) {
        trackViewOnce(current, icons.length);
      }
      setActiveThumb(current);
    });
  }

  function addSlide(icons) {
    var car = carousel();
    var $ = jq();
    if (!car || !$ || !$.fn || !$.fn.slick) return false;
    if (!car.classList.contains('slick-initialized')) return false;
    if (car.getAttribute(SLIDE_MARK) === VER && realKfSlide(car)) {
      return true;
    }

    removeSlide();
    try {
      var cur = 0;
      try {
        cur = $(car).slick('slickCurrentSlide') || 0;
      } catch (e0) {
        cur = 0;
      }

      /* 3rd thumb / slide (0-based index 2). If fewer than 3 slides, append. */
      var insertAt = 2;
      try {
        var slickObj = $(car).slick('getSlick');
        var count = slickObj && typeof slickObj.slideCount === 'number' ? slickObj.slideCount : 0;
        if (count < 2) insertAt = count;
        else if (count < insertAt) insertAt = count;
      } catch (eCount) {
        insertAt = 2;
      }

      $(car).slick('slickAdd', buildSlideHtml(icons), insertAt);
      try {
        /* Force every slide (incl. KF) to the list width — stops left white gap */
        var list = car.querySelector('.slick-list');
        var w = list ? list.clientWidth : 0;
        if (w) {
          [].forEach.call(car.querySelectorAll('.slick-slide'), function (s) {
            s.style.boxSizing = 'border-box';
            s.style.width = w + 'px';
          });
        }
        $(car).slick('setPosition');
        /* Slides at/after insertAt shift right — keep the same hero image on screen */
        var goTo = cur >= insertAt ? cur + 1 : cur;
        $(car).slick('slickGoTo', goTo, true);
      } catch (e1) {
        /* ignore */
      }
      car.setAttribute(SLIDE_MARK, VER);
      bindViewTracking(icons);
      return !!realKfSlide(car);
    } catch (e) {
      return false;
    }
  }

  /* —— thumbs —— */

  function removeRail() {
    var el = document.getElementById(RAIL_ID);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function thumbSlides() {
    var car = carousel();
    if (!car) return [];
    var nodes = car.querySelectorAll('.slick-slide:not(.slick-cloned)');
    var out = [];
    for (var i = 0; i < nodes.length; i++) {
      var slide = nodes[i];
      var idx = parseInt(slide.getAttribute('data-slick-index'), 10);
      /* slickAdd promotes our markup to the slide root:
         <div class="ce-yg-kf-slide slick-slide">…</div>
         so check the slide itself, not only descendants. */
      var kf = slide.classList.contains('ce-yg-kf-slide')
        ? slide
        : slide.querySelector('.ce-yg-kf-slide');
      if (kf) {
        var kfImgs = kf.querySelectorAll('.ce-yg-kf-slide-item img, .ce-yg-kf-slide-grid img');
        if (!kfImgs.length) kfImgs = kf.querySelectorAll('img');
        var iconSrcs = [];
        var seenSrc = {};
        var k;
        for (k = 0; k < kfImgs.length; k += 1) {
          var s = kfImgs[k].getAttribute('src') || kfImgs[k].getAttribute('data-src');
          if (!s || seenSrc[s]) continue;
          seenSrc[s] = 1;
          iconSrcs.push(s);
          if (iconSrcs.length >= 9) break;
        }
        if (!iconSrcs.length) continue;
        out.push({
          index: idx === idx ? idx : i,
          src: iconSrcs[0],
          iconSrcs: iconSrcs,
          alt: 'Key Features',
          isVideo: false,
          isKf: true
        });
        continue;
      }
      var img = slide.querySelector('img.mainImg') || slide.querySelector('img');
      if (!img) continue;
      var src = img.getAttribute('src') || img.getAttribute('data-lazy') || img.getAttribute('data-src');
      if (!src) continue;
      out.push({
        index: idx === idx ? idx : i,
        src: src,
        alt: img.getAttribute('alt') || '',
        isVideo: !!(slide.classList.contains('video') || slide.querySelector('iframe, video')),
        isKf: false
      });
    }
    out.sort(function (a, b) {
      return a.index - b.index;
    });
    return out;
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
    return 0;
  }

  /* Magento showVideo() swaps carousel for #carousel-video-wrapper + Vimeo iframe.
     Stock changeSlide(i) closes that overlay; plain slickGoTo leaves video stuck on top. */
  function stopCarouselVideo() {
    try {
      var wrap = document.getElementById('carousel-video-wrapper');
      if (wrap) {
        var iframe = wrap.querySelector('iframe, .video-iframe');
        if (iframe) iframe.setAttribute('src', '');
        wrap.innerHTML = '';
        wrap.style.display = 'none';
        if (window.jQuery) window.jQuery(wrap).hide();
      }
      var car = carousel();
      if (car) car.classList.remove('hide');
    } catch (e) {
      /* ignore */
    }
  }

  function goTo(index) {
    /* Prefer Magento helper — hides video wrapper + clears iframe + slickGoTo */
    if (typeof window.changeSlide === 'function') {
      try {
        window.changeSlide(index);
        setActiveThumb(index);
        return;
      } catch (e0) {
        /* fall through */
      }
    }
    stopCarouselVideo();
    var $ = jq();
    var car = carousel();
    if ($ && car && $(car).hasClass('slick-initialized')) {
      try {
        $(car).slick('slickGoTo', index, true);
      } catch (e) {
        /* ignore */
      }
    }
    setActiveThumb(index);
  }

  function kfSlideIndex() {
    /* Must ignore slick clones (data-slick-index="-1") or the link never mounts */
    var slide = realKfSlide(carousel());
    if (!slide) return -1;
    var idx = parseInt(slide.getAttribute('data-slick-index'), 10);
    return isNaN(idx) || idx < 0 ? -1 : idx;
  }

  function goToKfSlide() {
    var idx = kfSlideIndex();
    if (idx < 0) return;
    /* No scrollIntoView — it was flicking the page to the top */
    goTo(idx);
    setActiveThumb(idx);
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'pdp_kf_link_click',
        gallery_index: idx,
        page_path: location.pathname
      });
    } catch (e2) {
      /* ignore */
    }
  }

  function removeKfLink() {
    var jump = document.getElementById('ce-yg-kf-jump');
    var row = document.querySelector('.ce-yg-kf-stars-row');
    if (jump && jump.parentNode) jump.parentNode.removeChild(jump);
    if (row) {
      var rating = row.querySelector('#feefo-rating, .feefo-rating');
      if (rating && row.parentNode) {
        row.parentNode.insertBefore(rating, row);
        row.parentNode.removeChild(row);
      } else if (row.parentNode) {
        row.parentNode.removeChild(row);
      }
    }
  }

  function lightbulbSvg() {
    /* Bulb + flash — Flaticon-style “idea” outline (even ray dashes) */
    return (
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" ' +
      'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M12 1.75v1.85"/>' +
      '<path d="M18.6 4.2l-1.3 1.3"/>' +
      '<path d="M21.25 11h-1.85"/>' +
      '<path d="M4.6 11H2.75"/>' +
      '<path d="M6.7 5.5L5.4 4.2"/>' +
      '<circle cx="12" cy="11.25" r="5"/>' +
      '<path d="M9.85 15.9c.25.85.4 1.4.4 1.85h3.5c0-.45.15-1 .4-1.85"/>' +
      '<path d="M10.1 19.1h3.8"/>' +
      '<path d="M10.6 20.85h2.8"/>' +
      '<path d="M10.15 9.1c.55-.95 1.55-1.55 2.7-1.55"/>' +
      '</svg>'
    );
  }

  function ensureKfLink() {
    if (!MQ_KF.matches || kfSlideIndex() < 0) {
      removeKfLink();
      return false;
    }
    if (document.getElementById('ce-yg-kf-jump')) return true;

    /* Feefo mounts async — wait for the rating shell */
    var rating = qs('#feefo-rating') || qs('.product-right-wrapper .feefo-rating');
    if (!rating) return false;

    var row = rating.closest('.ce-yg-kf-stars-row');
    if (!row) {
      row = document.createElement('div');
      row.className = 'ce-yg-kf-stars-row';
      if (!rating.parentNode) return false;
      rating.parentNode.insertBefore(row, rating);
      row.appendChild(rating);
    }

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'ce-yg-kf-jump';
    btn.className = 'ce-yg-kf-jump';
    btn.setAttribute('aria-label', 'Show key features in the image gallery');
    btn.innerHTML =
      '<span class="ce-yg-kf-jump-icon">' + lightbulbSvg() + '</span>' +
      '<span class="ce-yg-kf-jump-label">Key Features</span>';
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      goToKfSlide();
    });
    row.appendChild(btn);
    return true;
  }

  function watchForKfLink() {
    if (document.documentElement.getAttribute('data-ce-yg-kf-v3v10-link-watch') === '1') return;
    document.documentElement.setAttribute('data-ce-yg-kf-v3v10-link-watch', '1');

    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (ensureKfLink() || tries > 80) clearInterval(timer);
    }, 250);

    var root = qs('.product-right-wrapper') || document.body;
    if (!root || !window.MutationObserver) return;
    var mo = new MutationObserver(function () {
      if (ensureKfLink()) mo.disconnect();
    });
    mo.observe(root, { childList: true, subtree: true });
    setTimeout(function () {
      try {
        mo.disconnect();
      } catch (e) {
        /* ignore */
      }
    }, 20000);
  }

  function setActiveThumb(index) {
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
    var $ = jq();
    var car = carousel();
    if (!$ || !car || !$(car).hasClass('slick-initialized')) return;
    if (car.getAttribute('data-ce-yg-swipe') === '1') return;
    car.setAttribute('data-ce-yg-swipe', '1');
    [].forEach.call(car.querySelectorAll('img'), function (img) {
      img.setAttribute('draggable', 'false');
    });
    try {
      /* refresh=false — true was reflowing the track and shifting the main image */
      $(car).slick('slickSetOption', 'swipe', true, false);
      $(car).slick('slickSetOption', 'touchMove', true, false);
      $(car).slick('slickSetOption', 'draggable', true, false);
      $(car).slick('slickSetOption', 'arrows', true, false);
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

  function kfThumbIsMiniGrid(rail) {
    if (!rail) return false;
    var kfBtn = rail.querySelector('.ce-yg-thumb.is-kf');
    if (!kfBtn) return true; /* no KF slide → nothing to fix */
    var grid = kfBtn.querySelector('.ce-yg-thumb-kf-grid');
    if (!grid) return false;
    return grid.querySelectorAll('img').length > 1;
  }

  function buildKfThumbPreview(iconSrcs) {
    var preview = document.createElement('div');
    preview.className = 'ce-yg-thumb-kf-preview';

    var title = document.createElement('div');
    title.className = 'ce-yg-thumb-kf-title';
    title.textContent = 'Key Features';
    preview.appendChild(title);

    var grid = document.createElement('div');
    grid.className = 'ce-yg-thumb-kf-grid cols-3';
    grid.setAttribute('data-kf-icons', String(iconSrcs.length));

    var i;
    for (i = 0; i < iconSrcs.length; i += 1) {
      var icon = document.createElement('img');
      icon.src = iconSrcs[i];
      icon.alt = '';
      icon.draggable = false;
      grid.appendChild(icon);
    }
    preview.appendChild(grid);
    return preview;
  }

  function buildThumbs(list, force) {
    if (list.length < 2) {
      removeRail();
      return false;
    }

    var existing = document.getElementById(RAIL_ID);
    var canReuse =
      !force &&
      existing &&
      existing.getAttribute('data-ver') === VER &&
      existing.children.length === list.length &&
      kfThumbIsMiniGrid(existing);

    if (canReuse) {
      setActiveThumb(currentIndex());
      return true;
    }

    removeRail();

    var main = qs('#main-image-wrapper') || qs('.main-image-wrapper');
    var car = carousel();
    if (!main) return false;

    var rail = document.createElement('div');
    rail.id = RAIL_ID;
    rail.setAttribute('data-ver', VER);
    rail.setAttribute('role', 'list');

    list.forEach(function (slide, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className =
        'ce-yg-thumb' +
        (slide.isVideo ? ' is-video' : '') +
        (slide.isKf ? ' is-kf' : '');
      btn.setAttribute('data-index', String(slide.index));
      btn.setAttribute(
        'aria-label',
        slide.isKf ? 'View key features' : 'View image ' + (i + 1)
      );

      if (i === 0) btn.style.setProperty('margin-left', '6px', 'important');
      if (i === list.length - 1) btn.style.setProperty('margin-right', '6px', 'important');

      if (slide.isKf && slide.iconSrcs && slide.iconSrcs.length) {
        btn.appendChild(buildKfThumbPreview(slide.iconSrcs));
      } else {
        var img = document.createElement('img');
        img.src = slide.src;
        img.alt = slide.alt;
        img.draggable = false;
        btn.appendChild(img);
      }

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        trackGalleryEngageOnce(slide.index);
        goTo(slide.index);
      });

      rail.appendChild(btn);
    });

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
    setActiveThumb(currentIndex());
    return true;
  }

  function bindThumbsCarousel() {
    var $ = jq();
    var car = carousel();
    if (!$ || !car || thumbsBound) return;
    thumbsBound = true;
    $(car).on('afterChange.ceYgThumbsV3v10', function (e, slick, current) {
      setActiveThumb(current);
    });
  }

  function applyThumbs(force) {
    if (!MQ_THUMBS.matches) {
      document.documentElement.classList.remove(THUMBS_ON);
      removeRail();
      return true;
    }
    document.documentElement.classList.add(THUMBS_ON);
    var list = thumbSlides();
    var ok = buildThumbs(list, force);
    if (ok) {
      bindThumbsCarousel();
      enableSwipe();
    }
    return ok && kfThumbIsMiniGrid(document.getElementById(RAIL_ID));
  }

  function apply() {
    ensureCss();

    var needsKf = false;
    var kfOk = true;
    var linkOk = true;
    if (!MQ_KF.matches) {
      removeSlide();
      removeKfLink();
    } else {
      var icons = collectIcons();
      if (!icons.length) {
        removeSlide();
        removeKfLink();
      } else {
        needsKf = true;
        kfOk = addSlide(icons);
        linkOk = kfOk ? ensureKfLink() : false;
        if (kfOk && !linkOk) watchForKfLink();
      }
    }

    /* Rebuild thumbs after KF slide exists so the mini-grid can copy all icons */
    var thumbsOk = applyThumbs(needsKf);
    return kfOk && thumbsOk && (!needsKf || linkOk || !!document.getElementById('ce-yg-kf-jump'));
  }

  function boot() {
    if (alreadyBooted) {
      ensureCss();
      applyThumbs(true);
      if (!ensureKfLink()) watchForKfLink();
      return;
    }

    apply();
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      var done =
        apply() &&
        kfThumbIsMiniGrid(document.getElementById(RAIL_ID)) &&
        (!MQ_KF.matches || !!document.getElementById('ce-yg-kf-jump') || tries > 40);
      if (done || tries > 60) {
        clearInterval(timer);
        if (MQ_KF.matches && !document.getElementById('ce-yg-kf-jump')) watchForKfLink();
      }
    }, 250);
  }

  ready(boot);

  function onMqChange() {
    apply();
  }

  if (MQ_KF.addEventListener) {
    MQ_KF.addEventListener('change', onMqChange);
    MQ_THUMBS.addEventListener('change', onMqChange);
  } else if (MQ_KF.addListener) {
    MQ_KF.addListener(onMqChange);
    MQ_THUMBS.addListener(onMqChange);
  }

  /* No window.resize → apply(): mobile chrome URL-bar resize was flicking scroll to top */
})();
