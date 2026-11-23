/**
 * Crazy Egg — PDP Key Features v3 · Variant 1 (mobile)
 *
 * Remove the mid-page Key Features carousel and append the same icons
 * (1–9) as a single slide in the main image carousel. Description /
 * bullets sit higher; dots make start/end clear.
 *
 * Lightbulb + “Key Features” beside Feefo jumps to that gallery slide.
 * KF slide background is white (no lime).
 *
 * Desktop unchanged. Mobile ≤1000px only.
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-pdp-key-features-v3.css
 *
 * Example: https://www.yougarden.com/item-p-511603/standard-holly-trees-with-premium-pinecone-planters
 *
 * Sample: MDE 0.8% · 90% confidence · ~3 weeks · ~30,418 users (pv)
 */
(function () {
  'use strict';

  var ROOT = 'ce-yg-pdp-kf-v3';
  var VER = '4';
  var INIT = 'data-ce-yg-pdp-kf-v3';
  var STYLE_ID = 'ce-yg-pdp-kf-v3-css';
  var SLIDE_MARK = 'data-ce-yg-kf-v3-slide';
  var MQ = window.matchMedia('(max-width: 1000px)');
  var viewedSent = false;

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
        'html.ce-yg-pdp-kf-v3 .product-right-wrapper>.icons-heading,' +
        'html.ce-yg-pdp-kf-v3 .product-right-wrapper>.icons-wrapper,' +
        'html.ce-yg-pdp-kf-v3 #product-features-carousel,' +
        'html.ce-yg-pdp-kf-v3 .product-features-carousel{display:none!important}' +
        'html.ce-yg-pdp-kf-v3 #main-image-carousel .slick-slide.ce-yg-kf-slide{' +
          'padding:0!important;background:transparent!important}' +
        'html.ce-yg-pdp-kf-v3 .ce-yg-kf-slide-inner{' +
          'display:flex!important;flex-direction:column;align-items:center;justify-content:center;' +
          'box-sizing:border-box;width:100%;aspect-ratio:1/1;padding:18px 14px 22px;' +
          'background:#ffffff;text-align:center}' +
        'html.ce-yg-pdp-kf-v3 .ce-yg-kf-slide-title{' +
          'margin:0 0 14px;padding:0;font-family:Rubik,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
          'font-size:16px;font-weight:600;line-height:1.2;color:#264f1c}' +
        'html.ce-yg-pdp-kf-v3 .ce-yg-kf-slide-grid{' +
          'display:grid;gap:12px 8px;width:100%;max-width:340px;margin:0 auto;box-sizing:border-box}' +
        'html.ce-yg-pdp-kf-v3 .ce-yg-kf-slide-grid.cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}' +
        'html.ce-yg-pdp-kf-v3 .ce-yg-kf-slide-grid.cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}' +
        'html.ce-yg-pdp-kf-v3 .ce-yg-kf-slide-item{' +
          'display:flex;flex-direction:column;align-items:center;justify-content:flex-start;text-align:center;' +
          'min-width:0}' +
        'html.ce-yg-pdp-kf-v3 .ce-yg-kf-slide-item img{' +
          'display:block;width:52px!important;height:52px!important;min-width:52px;min-height:52px;' +
          'object-fit:contain;margin:0 auto 6px;padding:0;pointer-events:none}' +
        'html.ce-yg-pdp-kf-v3 .ce-yg-kf-slide-item span{' +
          'display:block;width:100%;font-family:Rubik,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
          'font-size:11px;line-height:1.25;font-weight:500;color:#264f1c}' +
        'html.ce-yg-pdp-kf-v3 .ce-yg-kf-stars-row{' +
          'display:flex!important;align-items:center;justify-content:space-between;gap:12px;' +
          'width:100%;box-sizing:border-box;clear:both;margin:10px 0 0;padding:0}' +
        'html.ce-yg-pdp-kf-v3 .ce-yg-kf-stars-row #feefo-rating,' +
        'html.ce-yg-pdp-kf-v3 .ce-yg-kf-stars-row .feefo-rating{' +
          'float:none!important;width:auto!important;max-width:none!important;flex:0 1 auto;' +
          'min-width:0;margin:0!important}' +
        'html.ce-yg-pdp-kf-v3 .ce-yg-kf-jump{' +
          'display:inline-flex!important;align-items:center;gap:5px;flex:0 0 auto;margin-left:auto;' +
          'padding:0;border:0;background:transparent;cursor:pointer;' +
          'font-family:Rubik,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
          'font-size:14px;font-weight:400;line-height:1.3;color:#333;' +
          'text-decoration:none;white-space:nowrap}' +
        'html.ce-yg-pdp-kf-v3 .ce-yg-kf-jump:hover{color:#1b3a14}' +
        'html.ce-yg-pdp-kf-v3 .ce-yg-kf-jump-icon{' +
          'display:block;width:18px;height:18px;flex:0 0 18px;color:#333}' +
        'html.ce-yg-pdp-kf-v3 .ce-yg-kf-jump-icon svg{display:block;width:100%;height:100%}' +
      '}' +
      '@media (min-width:1001px){' +
        'html.ce-yg-pdp-kf-v3 .ce-yg-kf-slide,' +
        'html.ce-yg-pdp-kf-v3 .ce-yg-kf-jump,' +
        'html.ce-yg-pdp-kf-v3 .ce-yg-kf-stars-row .ce-yg-kf-jump{display:none!important}' +
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

  function equaliseSlideWidths(car) {
    if (!car) return;
    var track = car.querySelector('.slick-track');
    var slides = car.querySelectorAll('.slick-slide');
    if (!track || !slides.length) return;
    var widths = [];
    var i;
    for (i = 0; i < slides.length; i += 1) {
      if (slides[i].classList.contains('ce-yg-kf-slide')) continue;
      var w = slides[i].offsetWidth;
      if (w > 0) widths.push(w);
    }
    if (!widths.length) return;
    widths.sort(function (a, b) {
      return a - b;
    });
    var target = widths[Math.floor(widths.length / 2)];
    if (!target) return;
    for (i = 0; i < slides.length; i += 1) {
      if (!slides[i].classList.contains('ce-yg-kf-slide')) continue;
      slides[i].style.width = target + 'px';
      slides[i].style.boxSizing = 'border-box';
    }
  }

  function bindViewTracking(icons) {
    var car = carousel();
    var $ = jq();
    if (!car || !$ || !$.fn || !$.fn.slick) return;
    if (car.getAttribute('data-ce-yg-kf-v3-bound') === '1') return;
    car.setAttribute('data-ce-yg-kf-v3-bound', '1');

    $(car).on('afterChange.ceYgKfV3', function (e, slick, current) {
      var slide = slick.$slides && slick.$slides.eq(current);
      if (
        slide &&
        slide.length &&
        (slide.hasClass('ce-yg-kf-slide') || slide.find('.ce-yg-kf-slide').length)
      ) {
        trackViewOnce(current, icons.length);
      }
    });
  }

  function addSlide(icons) {
    var car = carousel();
    var $ = jq();
    if (!car || !$ || !$.fn || !$.fn.slick) return false;
    if (!car.classList.contains('slick-initialized')) return false;
    if (car.getAttribute(SLIDE_MARK) === VER && realKfSlide(car)) {
      equaliseSlideWidths(car);
      return true;
    }

    removeSlide();
    try {
      $(car).slick('slickAdd', buildSlideHtml(icons));
      car.setAttribute(SLIDE_MARK, VER);
      equaliseSlideWidths(car);
      bindViewTracking(icons);
      return !!realKfSlide(car);
    } catch (e) {
      return false;
    }
  }

  function kfSlideIndex() {
    var slide = realKfSlide(carousel());
    if (!slide) return -1;
    var idx = parseInt(slide.getAttribute('data-slick-index'), 10);
    return isNaN(idx) || idx < 0 ? -1 : idx;
  }

  function goToKfSlide() {
    var idx = kfSlideIndex();
    if (idx < 0) return;
    var $ = jq();
    var car = carousel();
    if ($ && car && $(car).hasClass('slick-initialized')) {
      try {
        $(car).slick('slickGoTo', idx, true);
      } catch (e) {
        /* ignore */
      }
    }
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

  function ensureKfLink() {
    if (!MQ.matches || kfSlideIndex() < 0) {
      removeKfLink();
      return false;
    }
    if (document.getElementById('ce-yg-kf-jump')) return true;

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
    if (document.documentElement.getAttribute('data-ce-yg-kf-v3-link-watch') === '1') return;
    document.documentElement.setAttribute('data-ce-yg-kf-v3-link-watch', '1');

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

  function apply() {
    ensureCss();

    if (!MQ.matches) {
      removeSlide();
      removeKfLink();
      return false;
    }

    var icons = collectIcons();
    if (!icons.length) {
      removeSlide();
      removeKfLink();
      return false;
    }

    var slideOk = addSlide(icons);
    var linkOk = slideOk ? ensureKfLink() : false;
    if (slideOk && !linkOk) watchForKfLink();
    return slideOk && (linkOk || !!document.getElementById('ce-yg-kf-jump'));
  }

  function boot() {
    if (alreadyBooted) {
      ensureCss();
      if (!ensureKfLink()) watchForKfLink();
      return;
    }

    apply();
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (!MQ.matches) {
        clearInterval(timer);
        return;
      }
      if (apply() || tries > 40) {
        clearInterval(timer);
        if (MQ.matches && !document.getElementById('ce-yg-kf-jump')) watchForKfLink();
      }
    }, 250);
  }

  ready(boot);

  if (MQ.addEventListener) {
    MQ.addEventListener('change', apply);
  } else if (MQ.addListener) {
    MQ.addListener(apply);
  }
})();
