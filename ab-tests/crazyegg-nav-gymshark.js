/**
 * Crazy Egg A/B — Desktop nav, Gymshark-style columns (Variant)
 *
 * Control: Magento #desktopNav as live today
 * Variant: parse the live menu from #desktopNav and render a white bar
 *          with a full-width multi-column panel (≥1001px only)
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-nav-gymshark.css
 *
 * Live: https://www.yougarden.com/
 */
(function () {
  'use strict';

  var MQ = '(min-width: 1001px)';
  var MARK = 'ce-yg-gs';
  var ROOT_ID = 'ce-yg-gs';
  var READY_CLASS = 'ce-yg-gs--ready';
  var OPEN_HTML = 'ce-yg-gs--open';
  var MAX_LINKS = 8;

  if (!window.matchMedia || !window.matchMedia(MQ).matches) return;
  if (document.getElementById(ROOT_ID)) return;

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function cleanText(el) {
    if (!el) return '';
    return String(el.getAttribute('title') || el.textContent || '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function hrefOf(el) {
    if (!el) return '';
    return el.getAttribute('href') || '';
  }

  function parseMenuFeed(menu) {
    var items = [];

    qsa(':scope > li', menu).forEach(function (li) {
      if (li.classList.contains('tv-button')) {
        var tvA = qs('a', li);
        var tvImg = qs('picture img, img', li);
        items.push({
          type: 'tv',
          label: 'YouGarden TV',
          href: hrefOf(tvA) || 'https://www.yougarden.com/tv-live',
          img: tvImg
            ? tvImg.getAttribute('src') ||
              tvImg.getAttribute('data-src') ||
              '/csp/yougdn/web/images/common/YGTV.png?v=26'
            : '/csp/yougdn/web/images/common/YGTV.png?v=26',
          imgAlt: tvImg ? tvImg.getAttribute('alt') || 'YouGarden TV' : 'YouGarden TV'
        });
        return;
      }

      var topA = qs(':scope > a', li);
      var item = {
        type: 'top',
        id: li.id || '',
        label: cleanText(topA),
        href: hrefOf(topA),
        isNew: li.classList.contains('new'),
        isSale: li.classList.contains('sale'),
        columns: []
      };

      var drop = qs(':scope > ul.drop-down', li);
      if (drop) {
        var mains = qsa('.menu-left-wrapper .main-cats', drop);
        if (mains.length) {
          mains.forEach(function (mc) {
            var a = qs(':scope > a', mc);
            var col = {
              id: mc.id || '',
              label: cleanText(a),
              href: hrefOf(a),
              children: []
            };
            var rb = qs('#right-block-' + mc.id, drop);
            if (rb) {
              qsa('a', rb).forEach(function (link) {
                var lab = cleanText(link);
                if (!lab) return;
                col.children.push({ label: lab, href: hrefOf(link) });
              });
            }
            item.columns.push(col);
          });
        } else {
          qsa('a', drop).forEach(function (link) {
            var lab = cleanText(link);
            if (!lab || lab === item.label) return;
            item.columns.push({ label: lab, href: hrefOf(link), children: [] });
          });
        }
      }

      if (item.label) items.push(item);
    });

    return items;
  }

  function visibleChildren(col) {
    var seen = {};
    var out = [];
    (col.children || []).forEach(function (ch) {
      var lab = String(ch.label || '').replace(/\s+/g, ' ').trim();
      if (!lab || /^view all\b/i.test(lab)) return;
      if (col.href && ch.href === col.href) return;
      var key = (ch.href || '') + '|' + lab;
      if (seen[key]) return;
      seen[key] = 1;
      out.push({ label: lab, href: ch.href || '#' });
    });
    return out;
  }

  function el(tag, className, attrs) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] == null || attrs[k] === '') return;
        if (k === 'text') node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    return node;
  }

  function linkEl(className, href, label) {
    return el('a', className, {
      href: href || '#',
      text: label,
      'data-ga4-type': 'navigation_links_clicks'
    });
  }

  function pageTiles() {
    var tiles = [];
    var seen = {};
    qsa('a').forEach(function (a) {
      if (a.closest('#' + ROOT_ID) || a.closest('#desktopNav')) return;
      var img = qs('img', a);
      if (!img) return;
      var href = hrefOf(a);
      if (!href || /\/item[-/]/i.test(href)) return;
      var rect = a.getBoundingClientRect();
      if (rect.width < 140 || rect.width > 520 || rect.height < 80) return;
      var src = img.currentSrc || img.getAttribute('src') || '';
      if (!src || seen[href]) return;
      seen[href] = 1;
      tiles.push({
        href: href,
        label: cleanText(a) || img.getAttribute('alt') || '',
        src: src,
        alt: img.getAttribute('alt') || ''
      });
    });
    return tiles;
  }

  function featuresFor(item, tiles) {
    if (!item.href) return [];
    var paths = {};
    function add(href) {
      if (!href) return;
      try {
        paths[new URL(href, window.location.origin).pathname.replace(/\/$/, '')] = 1;
      } catch (e) {}
    }
    add(item.href);
    (item.columns || []).forEach(function (col) {
      add(col.href);
      (col.children || []).forEach(function (ch) {
        add(ch.href);
      });
    });
    var picked = [];
    tiles.forEach(function (tile) {
      if (picked.length >= 2) return;
      var path = '';
      try {
        path = new URL(tile.href, window.location.origin).pathname.replace(/\/$/, '');
      } catch (e) {
        return;
      }
      if (paths[path]) picked.push(tile);
    });
    return picked;
  }

  function buildPanel(item, features) {
    var panel = el('div', 'ce-yg-gs__panel', {
      role: 'region',
      'aria-label': item.label + ' menu'
    });
    var inner = el('div', 'ce-yg-gs__panel-inner' + (features.length ? ' has-features' : ''));
    var cols = el('div', 'ce-yg-gs__cols');

    item.columns.forEach(function (col) {
      var colEl = el('div', 'ce-yg-gs__col');
      colEl.appendChild(linkEl('ce-yg-gs__col-title', col.href || item.href, col.label));

      var kids = visibleChildren(col);
      var shown = kids.slice(0, MAX_LINKS);
      var list = el('ul', 'ce-yg-gs__links');
      shown.forEach(function (ch) {
        var li = el('li');
        li.appendChild(linkEl(null, ch.href, ch.label));
        list.appendChild(li);
      });
      if (kids.length > shown.length && col.href) {
        var more = el('li');
        more.appendChild(linkEl('ce-yg-gs__more', col.href, 'View all'));
        list.appendChild(more);
      }
      if (list.childNodes.length) colEl.appendChild(list);
      cols.appendChild(colEl);
    });

    inner.appendChild(cols);

    if (features.length) {
      var rail = el('div', 'ce-yg-gs__features');
      features.forEach(function (tile) {
        var card = el('a', 'ce-yg-gs__feature', {
          href: tile.href,
          'data-ga4-type': 'navigation_links_clicks'
        });
        card.appendChild(el('img', null, { src: tile.src, alt: tile.alt || tile.label }));
        card.appendChild(el('span', null, { text: tile.label }));
        rail.appendChild(card);
      });
      inner.appendChild(rail);
    }

    panel.appendChild(inner);
    return panel;
  }

  function buildNav(items) {
    var tiles = pageTiles();
    var root = el('nav', 'ce-yg-gs', { id: ROOT_ID, 'aria-label': 'Primary' });
    var bar = el('div', 'ce-yg-gs__bar');
    root.appendChild(bar);

    items.forEach(function (item) {
      var wrap = el(
        'div',
        'ce-yg-gs__item' +
          (item.isNew ? ' is-new' : '') +
          (item.isSale ? ' is-sale' : '') +
          (item.type === 'tv' ? ' ce-yg-gs__tv' : '')
      );

      var trigger;
      if (item.type === 'tv') {
        trigger = el('a', 'ce-yg-gs__link', {
          href: item.href,
          title: item.label,
          'data-ga4-type': 'navigation_links_clicks'
        });
        if (item.img) {
          trigger.appendChild(el('img', null, { src: item.img, alt: item.imgAlt || item.label }));
        } else {
          trigger.textContent = item.label;
        }
      } else {
        var isButton = !item.href || item.href === 'javascript:void(0);';
        trigger = el(
          isButton ? 'button' : 'a',
          'ce-yg-gs__link',
          isButton
            ? { type: 'button', text: item.label }
            : {
                href: item.href,
                text: item.label,
                title: item.label,
                'data-ga4-type': 'navigation_links_clicks'
              }
        );
      }

      if (item.columns && item.columns.length) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-haspopup', 'true');
      }

      wrap.appendChild(trigger);

      if (item.columns && item.columns.length) {
        wrap.appendChild(buildPanel(item, featuresFor(item, tiles)));
        wrap.addEventListener('mouseenter', function () {
          openItem(wrap);
        });
        wrap.addEventListener('mouseleave', function () {
          closeItem(wrap);
        });
        trigger.addEventListener('focus', function () {
          openItem(wrap);
        });
      }

      bar.appendChild(wrap);
    });

    return root;
  }

  var openTimer = null;
  var closeTimer = null;

  function openItem(wrap) {
    clearTimeout(closeTimer);
    openTimer = setTimeout(function () {
      qsa('#' + ROOT_ID + ' .ce-yg-gs__item.is-open').forEach(function (n) {
        if (n !== wrap) {
          n.classList.remove('is-open');
          var prev = qs('.ce-yg-gs__link', n);
          if (prev) prev.setAttribute('aria-expanded', 'false');
        }
      });
      wrap.classList.add('is-open');
      var trigger = qs('.ce-yg-gs__link', wrap);
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add(OPEN_HTML);
    }, 60);
  }

  function closeItem(wrap) {
    clearTimeout(openTimer);
    closeTimer = setTimeout(function () {
      wrap.classList.remove('is-open');
      var trigger = qs('.ce-yg-gs__link', wrap);
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (!qs('#' + ROOT_ID + ' .ce-yg-gs__item.is-open')) {
        document.documentElement.classList.remove(OPEN_HTML);
      }
    }, 140);
  }

  function closeAll() {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    qsa('#' + ROOT_ID + ' .is-open').forEach(function (n) {
      n.classList.remove('is-open');
      var trigger = qs('.ce-yg-gs__link', n);
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
    document.documentElement.classList.remove(OPEN_HTML);
  }

  function mount() {
    var source = qs('#desktopNav');
    var menu = qs('#desktopNav ul.menu') || qs('ul.menu');
    if (!source || !menu) return false;
    if (qs('#' + ROOT_ID, source)) return true;

    var feed = parseMenuFeed(menu);
    if (!feed.length) return false;

    source.appendChild(buildNav(feed));

    if (!qs('.ce-yg-gs__backdrop')) {
      document.body.appendChild(el('div', 'ce-yg-gs__backdrop', { 'aria-hidden': 'true' }));
    }

    source.classList.add(READY_CLASS);
    document.documentElement.classList.add(MARK);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });

    return true;
  }

  function start() {
    if (mount()) return;
    var tries = 0;
    var t = setInterval(function () {
      tries += 1;
      if (mount() || tries > 40) clearInterval(t);
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
