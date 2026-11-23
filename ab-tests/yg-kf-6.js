/**
 * Crazy Egg — PDP Key Features v3 · Variant 7 (mobile) — popup modal
 *
 * Same as Variant 6, but Key Features opens as a centered popup modal
 * instead of a right slide-out:
 *   • Hide mid-page Key Features (description sits higher)
 *   • Thumbs under hero (≤599px)
 *   • Clean “Key Features” link + lightbulb beside Feefo
 *   • Opens a centered modal with the icon grid (1–9)
 *
 * No KF slide in the image carousel (avoids gallery shift bugs).
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-pdp-key-features-v3-variant-7.css
 *
 * Example: https://www.yougarden.com/item-p-511603/standard-holly-trees-with-premium-pinecone-planters
 *
 * Sample: MDE 0.8% · 90% confidence · ~3 weeks · ~30,418 users (pv)
 */
(function () {
    'use strict';
  
    var ROOT = 'ce-yg-pdp-kf-v3v7';
    var VER = '1';
    var INIT = 'data-ce-yg-pdp-kf-v3v7';
    var STYLE_ID = 'ce-yg-pdp-kf-v3v7-css';
    var RAIL_ID = 'ce-yg-thumbs';
    var THUMBS_ON = 'ce-yg-thumbs-on';
    var MODAL_ID = 'ce-yg-kf-modal';
    var MQ = window.matchMedia('(max-width: 1000px)');
    var MQ_THUMBS = window.matchMedia('(max-width: 599px)');
    var galleryEngageSent = false;
    var thumbsBound = false;
    var modalOpenTracked = false;
  
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
          'html.ce-yg-pdp-kf-v3v7 .product-right-wrapper>.icons-heading,' +
          'html.ce-yg-pdp-kf-v3v7 .product-right-wrapper>.icons-wrapper,' +
          'html.ce-yg-pdp-kf-v3v7 #product-features-carousel,' +
          'html.ce-yg-pdp-kf-v3v7 .product-features-carousel{display:none!important}' +
          'html.ce-yg-pdp-kf-v3v7 .ce-yg-kf-stars-row{' +
            'display:flex!important;align-items:center;justify-content:space-between;gap:12px;' +
            'width:100%;box-sizing:border-box;clear:both;margin:10px 0 0;padding:0}' +
          'html.ce-yg-pdp-kf-v3v7 .ce-yg-kf-stars-row #feefo-rating,' +
          'html.ce-yg-pdp-kf-v3v7 .ce-yg-kf-stars-row .feefo-rating{' +
            'float:none!important;width:auto!important;max-width:none!important;flex:0 1 auto;' +
            'min-width:0;margin:0!important}' +
          'html.ce-yg-pdp-kf-v3v7 .ce-yg-kf-jump{' +
            'display:inline-flex!important;align-items:center;gap:5px;flex:0 0 auto;margin-left:auto;' +
            'padding:0;border:0;background:transparent;cursor:pointer;' +
            'font-family:Rubik,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
            'font-size:14px;font-weight:400;line-height:1.3;color:#333;' +
            'text-decoration:none;white-space:nowrap}' +
          'html.ce-yg-pdp-kf-v3v7 .ce-yg-kf-jump:hover{color:#1b3a14}' +
          'html.ce-yg-pdp-kf-v3v7 .ce-yg-kf-jump-icon{' +
            'display:block;width:18px;height:18px;flex:0 0 18px;color:#333}' +
          'html.ce-yg-pdp-kf-v3v7 .ce-yg-kf-jump-icon svg{display:block;width:100%;height:100%}' +
          '#ce-yg-kf-modal-root{position:fixed;inset:0;z-index:99999;pointer-events:none;' +
            'display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box}' +
          '#ce-yg-kf-modal-root.is-open{pointer-events:auto}' +
          '#ce-yg-kf-modal-scrim{' +
            'position:absolute;inset:0;background:rgba(0,0,0,.5);opacity:0;' +
            'transition:opacity .22s ease}' +
          '#ce-yg-kf-modal-root.is-open #ce-yg-kf-modal-scrim{opacity:1}' +
          '#ce-yg-kf-modal{' +
            'position:relative;z-index:1;width:min(340px,92vw);max-height:min(78vh,560px);' +
            'background:#fff;border-radius:12px;box-shadow:0 16px 40px rgba(0,0,0,.28);' +
            'opacity:0;transform:scale(.94) translateY(12px);' +
            'transition:opacity .22s ease,transform .22s ease;' +
            'display:flex;flex-direction:column;box-sizing:border-box;overflow:hidden}' +
          '#ce-yg-kf-modal-root.is-open #ce-yg-kf-modal{opacity:1;transform:scale(1) translateY(0)}' +
          '#ce-yg-kf-modal-head{' +
            'display:flex;align-items:center;justify-content:space-between;gap:12px;' +
            'padding:16px 16px 12px;border-bottom:1px solid #e5ebe0;flex:0 0 auto}' +
          '#ce-yg-kf-modal-title{' +
            'margin:0;font-family:Rubik,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
            'font-size:17px;font-weight:500;line-height:1.25;color:#264f1c}' +
          '#ce-yg-kf-modal-close{' +
            'width:36px;height:36px;border:0;border-radius:18px;background:#f3f5f1;' +
            'cursor:pointer;font-size:22px;line-height:1;color:#264f1c}' +
          '#ce-yg-kf-modal-body{overflow:auto;-webkit-overflow-scrolling:touch;padding:18px 16px 24px;flex:1 1 auto}' +
          '#ce-yg-kf-modal-grid{display:grid;gap:16px 10px;width:100%;box-sizing:border-box}' +
          '#ce-yg-kf-modal-grid.cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}' +
          '#ce-yg-kf-modal-grid.cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}' +
          '.ce-yg-kf-modal-item{display:flex;flex-direction:column;align-items:center;text-align:center;min-width:0}' +
          '.ce-yg-kf-modal-item img{display:block;width:56px;height:56px;object-fit:contain;margin:0 auto 8px}' +
          '.ce-yg-kf-modal-item span{' +
            'display:block;width:100%;font-family:Rubik,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
            'font-size:12px;line-height:1.3;font-weight:400;color:#264f1c}' +
          'body.ce-yg-kf-modal-open{overflow:hidden}' +
        '}' +
        '@media (min-width:1001px){' +
          'html.ce-yg-pdp-kf-v3v7 .ce-yg-kf-jump,' +
          'html.ce-yg-pdp-kf-v3v7 #ce-yg-kf-modal-root{display:none!important}' +
        '}' +
        '@media (min-width:600px){#ce-yg-thumbs{display:none!important}}' +
        '@media (max-width:599px){' +
          'html.ce-yg-thumbs-on #main-image-carousel .slick-dots{display:none!important}' +
          'html.ce-yg-thumbs-on #main-image-carousel .previous-button,' +
          'html.ce-yg-thumbs-on #main-image-carousel .next-button,' +
          'html.ce-yg-thumbs-on #main-image-carousel .slick-arrow{' +
            'display:block!important;visibility:visible!important;opacity:1!important;' +
            'pointer-events:auto!important;z-index:9!important}' +
          '#ce-yg-thumbs{display:flex;flex-wrap:nowrap;gap:6px;width:100%;margin:0;padding:6px 0 8px;' +
            'box-sizing:border-box;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;' +
            'touch-action:pan-x;background:#fff}' +
          '#ce-yg-thumbs::-webkit-scrollbar{display:none}' +
          '#ce-yg-thumbs .ce-yg-thumb{flex:0 0 calc((100% - 30px)/4);width:calc((100% - 30px)/4);' +
            'aspect-ratio:1/1;padding:0;margin:0;border:1.5px solid #d7ddd2;border-radius:6px;' +
            'background:#f5f6f4;overflow:hidden;cursor:pointer;box-sizing:border-box;position:relative}' +
          '#ce-yg-thumbs .ce-yg-thumb:first-child{margin-left:6px!important}' +
          '#ce-yg-thumbs .ce-yg-thumb:last-child{margin-right:6px!important}' +
          '#ce-yg-thumbs .ce-yg-thumb.is-active{border-color:#264f1c;border-width:2px}' +
          '#ce-yg-thumbs .ce-yg-thumb img{display:block;width:100%;height:100%;object-fit:cover;pointer-events:none}' +
          '#ce-yg-thumbs .ce-yg-thumb.is-video::after{content:"";position:absolute;left:50%;top:50%;' +
            'margin:-7px 0 0 -5px;border-style:solid;border-width:8px 0 8px 13px;' +
            'border-color:transparent transparent transparent #fff;' +
            'filter:drop-shadow(0 1px 2px rgba(0,0,0,.4));pointer-events:none}' +
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
        out.push({ src: src, alt: alt, label: labelFrom(desc) || alt });
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
  
    /* —— centered popup modal —— */
  
    function closeModal() {
      var root = document.getElementById('ce-yg-kf-modal-root');
      if (root) root.classList.remove('is-open');
      document.body.classList.remove('ce-yg-kf-modal-open');
    }
  
    function openModal() {
      var root = document.getElementById('ce-yg-kf-modal-root');
      if (!root) return;
      root.classList.add('is-open');
      document.body.classList.add('ce-yg-kf-modal-open');
      if (!modalOpenTracked) {
        modalOpenTracked = true;
        try {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'pdp_kf_modal_open',
            page_path: location.pathname
          });
        } catch (e) {
          /* ignore */
        }
      }
    }
  
    function ensureModal(icons) {
      var root = document.getElementById('ce-yg-kf-modal-root');
      if (root) {
        if (root.getAttribute('data-icons') === String(icons.length)) return root;
        root.parentNode.removeChild(root);
      }
  
      root = document.createElement('div');
      root.id = 'ce-yg-kf-modal-root';
      root.setAttribute('data-icons', String(icons.length));
  
      var scrim = document.createElement('div');
      scrim.id = 'ce-yg-kf-modal-scrim';
      scrim.addEventListener('click', closeModal);
  
      var panel = document.createElement('div');
      panel.id = MODAL_ID;
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      panel.setAttribute('aria-label', 'Key Features');
  
      var head = document.createElement('div');
      head.id = 'ce-yg-kf-modal-head';
      var title = document.createElement('h2');
      title.id = 'ce-yg-kf-modal-title';
      title.textContent = 'Key Features';
      var closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.id = 'ce-yg-kf-modal-close';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.innerHTML = '&times;';
      closeBtn.addEventListener('click', closeModal);
      head.appendChild(title);
      head.appendChild(closeBtn);
  
      var body = document.createElement('div');
      body.id = 'ce-yg-kf-modal-body';
      var cols = icons.length <= 4 ? 2 : 3;
      var grid = document.createElement('div');
      grid.id = 'ce-yg-kf-modal-grid';
      grid.className = 'cols-' + cols;
  
      icons.forEach(function (item) {
        var cell = document.createElement('div');
        cell.className = 'ce-yg-kf-modal-item';
        if (item.src) {
          var img = document.createElement('img');
          img.src = item.src;
          img.alt = item.alt || item.label || '';
          img.width = 56;
          img.height = 56;
          img.loading = 'lazy';
          cell.appendChild(img);
        }
        var span = document.createElement('span');
        span.textContent = item.label || item.alt || '';
        cell.appendChild(span);
        grid.appendChild(cell);
      });
  
      body.appendChild(grid);
      panel.appendChild(head);
      panel.appendChild(body);
      root.appendChild(scrim);
      root.appendChild(panel);
      document.body.appendChild(root);
      return root;
    }
  
    function removeModal() {
      closeModal();
      var root = document.getElementById('ce-yg-kf-modal-root');
      if (root && root.parentNode) root.parentNode.removeChild(root);
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
        }
      }
    }
  
    function ensureKfLink(icons) {
      if (!MQ.matches || !icons.length) {
        removeKfLink();
        removeModal();
        return false;
      }
  
      ensureModal(icons);
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
      btn.setAttribute('aria-haspopup', 'dialog');
      btn.innerHTML =
        '<span class="ce-yg-kf-jump-icon">' + lightbulbSvg() + '</span>' +
        '<span class="ce-yg-kf-jump-label">Key Features</span>';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openModal();
      });
      row.appendChild(btn);
      return true;
    }
  
    function watchForKfLink(icons) {
      if (document.documentElement.getAttribute('data-ce-yg-kf-v3v7-link-watch') === '1') return;
      document.documentElement.setAttribute('data-ce-yg-kf-v3v7-link-watch', '1');
      var tries = 0;
      var timer = setInterval(function () {
        tries += 1;
        if (ensureKfLink(icons) || tries > 80) clearInterval(timer);
      }, 250);
      var root = qs('.product-right-wrapper') || document.body;
      if (!root || !window.MutationObserver) return;
      var mo = new MutationObserver(function () {
        if (ensureKfLink(icons)) mo.disconnect();
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
  
    /* —— thumbs (same as V2) —— */
  
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
  
    function buildThumbs(list) {
      if (list.length < 2) {
        removeRail();
        return false;
      }
      var existing = document.getElementById(RAIL_ID);
      if (existing && existing.getAttribute('data-ver') === VER && existing.children.length === list.length) {
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
        btn.className = 'ce-yg-thumb' + (slide.isVideo ? ' is-video' : '');
        btn.setAttribute('data-index', String(slide.index));
        btn.setAttribute('aria-label', 'View image ' + (i + 1));
        if (i === 0) btn.style.setProperty('margin-left', '6px', 'important');
        if (i === list.length - 1) btn.style.setProperty('margin-right', '6px', 'important');
        var img = document.createElement('img');
        img.src = slide.src;
        img.alt = slide.alt;
        img.draggable = false;
        btn.appendChild(img);
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          if (!galleryEngageSent) {
            galleryEngageSent = true;
            try {
              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                event: 'pdp_gallery_engage',
                gallery_action: 'thumb_tap',
                gallery_index: slide.index,
                page_path: location.pathname
              });
            } catch (err) {
              /* ignore */
            }
          }
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
      $(car).on('afterChange.ceYgThumbsV3v7', function (e, slick, current) {
        setActiveThumb(current);
      });
    }
  
    function applyThumbs() {
      if (!MQ_THUMBS.matches) {
        document.documentElement.classList.remove(THUMBS_ON);
        removeRail();
        return true;
      }
      document.documentElement.classList.add(THUMBS_ON);
      var ok = buildThumbs(thumbSlides());
      if (ok) {
        bindThumbsCarousel();
        enableSwipe();
      }
      return ok;
    }
  
    function apply() {
      ensureCss();
      var icons = collectIcons();
      var linkOk = true;
  
      if (!MQ.matches) {
        removeKfLink();
        removeModal();
      } else if (!icons.length) {
        removeKfLink();
        removeModal();
      } else {
        linkOk = ensureKfLink(icons);
        if (!linkOk) watchForKfLink(icons);
      }
  
      var thumbsOk = applyThumbs();
      return thumbsOk && (linkOk || !!document.getElementById('ce-yg-kf-jump') || !icons.length || !MQ.matches);
    }
  
    function boot() {
      if (alreadyBooted) {
        ensureCss();
        applyThumbs();
        var icons = collectIcons();
        if (!ensureKfLink(icons) && icons.length) watchForKfLink(icons);
        return;
      }
  
      apply();
      var tries = 0;
      var timer = setInterval(function () {
        tries += 1;
        if (apply() || tries > 60) clearInterval(timer);
      }, 250);
  
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
      });
    }
  
    ready(boot);
  
    function onMqChange() {
      apply();
    }
  
    if (MQ.addEventListener) {
      MQ.addEventListener('change', onMqChange);
      MQ_THUMBS.addEventListener('change', onMqChange);
    } else if (MQ.addListener) {
      MQ.addListener(onMqChange);
      MQ_THUMBS.addListener(onMqChange);
    }
  })();
    