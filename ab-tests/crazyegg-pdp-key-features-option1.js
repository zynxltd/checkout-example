/**
 * Crazy Egg — PDP Key Features · Option 1 (mobile) — CRO
 *
 * Asana: Product Pages — Mobile — Display all key features
 * Hide mid-page KF carousel; pull icons into one main-gallery slide
 * so description sits higher and start/end is clear (dots/thumbs).
 *
 *   • Clones this PDP’s Magento KF icons (img + label) into a grid slide
 *   • Mid-page #product-features-carousel / .icons-wrapper hidden
 *   • Thumbs under hero ≤599px
 *
 * Brand SVG library (icon+label pairs) for design / composites:
 *   ab-tests/assets/yg-kf-icons/*.svg
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-pdp-key-features-option1.css
 *
 * Example: https://www.yougarden.com/item-p-300165/duo-fruit-tree--peach-redhaven-and-apricot-early-orange
 *
 * Sample: MDE 0.8% · 90% confidence · ~3 weeks · ~30,418 users (pv)
 * Primary metric: add_to_cart
 */
(function () {
  'use strict';

  var ROOT = 'ce-yg-pdp-kf-opt1';
  var VER = '1';
  var INIT = 'data-ce-yg-pdp-kf-opt1';
  var STYLE_ID = 'ce-yg-pdp-kf-opt1-css';
  var SLIDE_MARK = 'data-ce-yg-kf-opt1-slide';
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
        'html.ce-yg-pdp-kf-opt1 .product-right-wrapper>.icons-heading,' +
        'html.ce-yg-pdp-kf-opt1 .product-right-wrapper>.icons-wrapper,' +
        'html.ce-yg-pdp-kf-opt1 #product-features-carousel,' +
        'html.ce-yg-pdp-kf-opt1 .product-features-carousel{display:none!important}' +
        /* Padding lives on .inner — padding on the slick-slide root widens it and shifts the track */
        'html.ce-yg-pdp-kf-opt1 #main-image-carousel .slick-slide.ce-yg-kf-slide{' +
          'box-sizing:border-box!important;padding:0!important;margin:0;overflow:hidden}' +
        'html.ce-yg-pdp-kf-opt1 .ce-yg-kf-slide-inner{' +
          'display:flex!important;flex-direction:column;align-items:center;justify-content:center;' +
          'box-sizing:border-box;width:100%;height:100%;aspect-ratio:1/1;padding:18px 14px 22px;' +
          'background:#ffffff;text-align:center}' +
        'html.ce-yg-pdp-kf-opt1 .ce-yg-kf-slide-title{' +
          'margin:0 0 14px;padding:0;font-family:Rubik,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
          'font-size:16px;font-weight:600;line-height:1.2;color:#264f1c}' +
        'html.ce-yg-pdp-kf-opt1 .ce-yg-kf-slide-grid{' +
          'display:grid;gap:12px 8px;width:100%;max-width:340px;margin:0 auto;box-sizing:border-box}' +
        'html.ce-yg-pdp-kf-opt1 .ce-yg-kf-slide-grid.cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}' +
        'html.ce-yg-pdp-kf-opt1 .ce-yg-kf-slide-grid.cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}' +
        'html.ce-yg-pdp-kf-opt1 .ce-yg-kf-slide-item{' +
          'display:flex;flex-direction:column;align-items:center;justify-content:flex-start;text-align:center;' +
          'min-width:0}' +
        'html.ce-yg-pdp-kf-opt1 .ce-yg-kf-slide-item img{' +
          'display:block;width:52px!important;height:52px!important;min-width:52px;min-height:52px;' +
          'object-fit:contain;margin:0 auto 6px;padding:0;pointer-events:none}' +
        'html.ce-yg-pdp-kf-opt1 .ce-yg-kf-slide-item span{' +
          'display:block;width:100%;font-family:Rubik,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
          'font-size:11px;line-height:1.25;font-weight:500;color:#264f1c}' +
'}' +
      '@media (min-width:1001px){' +
        'html.ce-yg-pdp-kf-opt1 .ce-yg-kf-slide{display:none!important}' +
      '}' +
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
        '#ce-yg-thumbs .ce-yg-thumb.is-kf{background:#ffffff!important;display:flex!important;align-items:center;justify-content:center;padding:3px!important;overflow:hidden}' +
        '#ce-yg-thumbs .ce-yg-thumb.is-kf>img{display:none!important}' +
        '#ce-yg-thumbs .ce-yg-thumb.is-kf .ce-yg-thumb-kf-preview{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;box-sizing:border-box;padding:2px}' +
        '#ce-yg-thumbs .ce-yg-thumb.is-kf .ce-yg-thumb-kf-title{display:block;margin:0 0 2px;padding:0;font-family:Rubik,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:5px;font-weight:600;line-height:1;color:#264f1c;white-space:nowrap}' +
        '#ce-yg-thumbs .ce-yg-thumb.is-kf .ce-yg-thumb-kf-grid{display:grid!important;gap:1px;width:92%;box-sizing:border-box;align-content:center;justify-items:center}' +
        '#ce-yg-thumbs .ce-yg-thumb.is-kf .ce-yg-thumb-kf-grid.cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}' +
        '#ce-yg-thumbs .ce-yg-thumb.is-kf .ce-yg-thumb-kf-grid.cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}' +
        '#ce-yg-thumbs .ce-yg-thumb.is-kf .ce-yg-thumb-kf-grid img{display:block!important;width:100%!important;max-width:18px!important;height:auto!important;aspect-ratio:1/1;object-fit:contain!important;margin:0!important;pointer-events:none}' +
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
    parts.push('<div class="ce-yg-kf-slide-grid cols-' + cols + '">');
    icons.forEach(function (item) {
      parts.push('<div class="ce-yg-kf-slide-item">');
      if (item.src) {
        parts.push(
          '<img src="' +
            item.src.replace(/"/g, '&quot;') +
            '" alt="' +
            (item.alt || item.label || '').replace(/"/g, '&quot;') +
            '" width="52" height="52" loading="lazy">'
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
    if (car.getAttribute('data-ce-yg-kf-opt1-bound') === '1') return;
    car.setAttribute('data-ce-yg-kf-opt1-bound', '1');

    $(car).on('afterChange.ceYgKfOpt1', function (e, slick, current) {
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
      $(car).slick('slickAdd', buildSlideHtml(icons));
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
        $(car).slick('slickGoTo', cur, true);
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

  function goTo(index) {
    var $ = jq();
    var car = carousel();
    if ($ && car && $(car).hasClass('slick-initialized')) {
      try {
        $(car).slick('slickGoTo', index, true);
      } catch (e) {
        /* ignore */
      }
    }
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
    var cols = iconSrcs.length <= 4 ? 2 : 3;
    var preview = document.createElement('div');
    preview.className = 'ce-yg-thumb-kf-preview';

    var title = document.createElement('div');
    title.className = 'ce-yg-thumb-kf-title';
    title.textContent = 'Key Features';
    preview.appendChild(title);

    var grid = document.createElement('div');
    grid.className = 'ce-yg-thumb-kf-grid cols-' + cols;
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
    $(car).on('afterChange.ceYgThumbsV3v9', function (e, slick, current) {
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
    if (!MQ_KF.matches) {
      removeSlide();
    } else {
      var icons = collectIcons();
      if (!icons.length) {
        removeSlide();
      } else {
        needsKf = true;
        kfOk = addSlide(icons);
      }
    }

    /* Rebuild thumbs after KF slide exists so the mini-grid can copy all icons */
    var thumbsOk = applyThumbs(needsKf);
    return kfOk && thumbsOk;
  }

  function boot() {
    if (alreadyBooted) {
      ensureCss();
      applyThumbs(true);
      return;
    }

    apply();
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      var done = apply() && kfThumbIsMiniGrid(document.getElementById(RAIL_ID));
      if (done || tries > 60) clearInterval(timer);
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
