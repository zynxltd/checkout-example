/**
 * Crazy Egg A/B — Desktop navigation megamenu (Variant)
 *
 * Control: Magento #desktopNav as live today
 * Variant: parse menu data from #desktopNav (live menu “feed” / DOM),
 *          hide source nav, render modern megamenu (≥1001px only)
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-desktop-nav-megamenu.css
 *
 * Live: https://www.yougarden.com/
 */
(function () {
  'use strict';

  var MQ = '(min-width: 1001px)';
  var MARK = 'ce-yg-desk-nav';
  var ROOT_ID = 'ce-yg-desk-nav';
  var READY_CLASS = 'ce-yg-desk-nav--ready';
  var OPEN_HTML = 'ce-yg-desk-nav--open';

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

  /** Parse Magento desktop menu DOM (= menu feed on page) */
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
        viewAll: null,
        columns: []
      };

      var drop = qs(':scope > ul.drop-down', li);
      if (drop) {
        var viewAll = qs('.menu-left-wrapper .cat-heading a', drop);
        if (viewAll) {
          item.viewAll = { label: cleanText(viewAll), href: hrefOf(viewAll) };
        }

        var mains = qsa('.menu-left-wrapper .main-cats', drop);
        if (mains.length) {
          mains.forEach(function (mc) {
            var a = qs(':scope > a', mc);
            var col = {
              id: mc.id || '',
              label: cleanText(a).replace(/\s+$/, ''),
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
          // Contact / simple panels
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

  function el(tag, className, attrs) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] == null || attrs[k] === '') return;
        if (k === 'text') node.textContent = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    return node;
  }

  function buildPanel(item) {
    var panel = el('div', 'ce-yg-desk-nav__panel', { role: 'region', 'aria-label': item.label + ' menu' });
    var inner = el('div', 'ce-yg-desk-nav__panel-inner');
    panel.appendChild(inner);

    var hasFlyout = item.columns.some(function (c) {
      return c.children && c.children.length;
    });

    if (!hasFlyout) {
      var simple = el('ul', 'ce-yg-desk-nav__simple');
      item.columns.forEach(function (c) {
        var li = el('li');
        var a = el('a', null, { href: c.href || '#', text: c.label, 'data-ga4-type': 'navigation_links_clicks' });
        li.appendChild(a);
        simple.appendChild(li);
      });
      inner.style.gridTemplateColumns = '1fr';
      inner.appendChild(simple);
      return panel;
    }

    var left = el('div');
    if (item.viewAll && item.viewAll.href) {
      left.appendChild(
        el('a', 'ce-yg-desk-nav__viewall', {
          href: item.viewAll.href,
          text: item.viewAll.label,
          'data-ga4-type': 'navigation_links_clicks'
        })
      );
    }

    var cats = el('ul', 'ce-yg-desk-nav__cats');
    var right = el('div');
    var firstId = null;

    item.columns.forEach(function (col, idx) {
      var id = col.id || 'col-' + idx;
      if (!firstId) firstId = id;

      var li = el('li');
      var btn = el('button', 'ce-yg-desk-nav__cat-btn' + (idx === 0 ? ' is-active' : ''), {
        type: 'button',
        'data-col': id
      });
      btn.appendChild(document.createTextNode(col.label));
      btn.appendChild(el('span', null, { text: '›' }));
      btn.addEventListener('mouseenter', function () {
        activateCol(panel, id);
      });
      btn.addEventListener('focus', function () {
        activateCol(panel, id);
      });
      // keep link behaviour: click goes to category
      btn.addEventListener('click', function (e) {
        if (col.href && col.href !== 'javascript:void(0);') {
          window.location.href = col.href;
        } else {
          e.preventDefault();
        }
      });
      li.appendChild(btn);
      cats.appendChild(li);

      var subs = el('ul', 'ce-yg-desk-nav__subs' + (idx === 0 ? ' is-active' : ''), {
        'data-col': id
      });
      if (col.href && col.href !== 'javascript:void(0);') {
        var all = el('li');
        all.appendChild(
          el('a', null, {
            href: col.href,
            text: 'View all ' + col.label,
            'data-ga4-type': 'navigation_links_clicks'
          })
        );
        subs.appendChild(all);
      }
      (col.children || []).forEach(function (ch) {
        var sli = el('li');
        sli.appendChild(
          el('a', null, {
            href: ch.href || '#',
            text: ch.label,
            'data-ga4-type': 'navigation_links_clicks'
          })
        );
        subs.appendChild(sli);
      });
      right.appendChild(subs);
    });

    left.appendChild(cats);
    inner.appendChild(left);
    inner.appendChild(right);
    return panel;
  }

  function activateCol(panel, id) {
    qsa('.ce-yg-desk-nav__cat-btn', panel).forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-col') === id);
    });
    qsa('.ce-yg-desk-nav__subs', panel).forEach(function (s) {
      s.classList.toggle('is-active', s.getAttribute('data-col') === id);
    });
  }

  function buildNav(items) {
    var root = el('nav', 'ce-yg-desk-nav', {
      id: ROOT_ID,
      'aria-label': 'Primary'
    });
    var inner = el('div', 'ce-yg-desk-nav__inner');
    root.appendChild(inner);

    items.forEach(function (item) {
      var wrap = el('div', 'ce-yg-desk-nav__item' +
        (item.isNew ? ' is-new' : '') +
        (item.isSale ? ' is-sale' : '') +
        (item.type === 'tv' ? ' ce-yg-desk-nav__tv' : ''));

      var link;
      if (item.type === 'tv') {
        link = el('a', 'ce-yg-desk-nav__link', {
          href: item.href,
          title: item.label,
          'data-ga4-type': 'navigation_links_clicks'
        });
        if (item.img) {
          var img = el('img', null, { src: item.img, alt: item.imgAlt || item.label });
          link.appendChild(img);
        } else {
          link.textContent = item.label;
        }
      } else {
        var isButton = !item.href || item.href === 'javascript:void(0);';
        link = el(isButton ? 'button' : 'a', 'ce-yg-desk-nav__link', isButton
          ? { type: 'button', text: item.label }
          : { href: item.href, text: item.label, title: item.label, 'data-ga4-type': 'navigation_links_clicks' });
        if (item.columns && item.columns.length) {
          link.appendChild(el('i', 'ce-yg-desk-nav__caret', { 'aria-hidden': 'true' }));
        }
      }

      wrap.appendChild(link);

      if (item.columns && item.columns.length) {
        wrap.appendChild(buildPanel(item));
        wrap.addEventListener('mouseenter', function () {
          openItem(wrap);
        });
        wrap.addEventListener('mouseleave', function () {
          closeItem(wrap);
        });
        link.addEventListener('focus', function () {
          openItem(wrap);
        });
      }

      inner.appendChild(wrap);
    });

    return root;
  }

  var openTimer = null;
  var closeTimer = null;

  function openItem(wrap) {
    clearTimeout(closeTimer);
    openTimer = setTimeout(function () {
      qsa('#' + ROOT_ID + ' .ce-yg-desk-nav__item.is-open').forEach(function (n) {
        if (n !== wrap) n.classList.remove('is-open');
      });
      wrap.classList.add('is-open');
      document.documentElement.classList.add(OPEN_HTML);
    }, 80);
  }

  function closeItem(wrap) {
    clearTimeout(openTimer);
    closeTimer = setTimeout(function () {
      wrap.classList.remove('is-open');
      if (!qs('#' + ROOT_ID + ' .ce-yg-desk-nav__item.is-open')) {
        document.documentElement.classList.remove(OPEN_HTML);
      }
    }, 120);
  }

  function mount() {
    var source = qs('#desktopNav');
    var shell = qs('#desktopNav > .centralWrapper') || source;
    var menu = qs('#desktopNav ul.menu') || qs('ul.menu');
    if (!source || !shell || !menu) return false;
    if (qs('#' + ROOT_ID, source)) return true;

    var feed = parseMenuFeed(menu);
    if (!feed.length) return false;

    // Mount INSIDE #desktopNav so Magento float / header layout stays intact
    var nav = buildNav(feed);
    shell.appendChild(nav);

    if (!qs('.ce-yg-desk-nav__backdrop')) {
      document.body.appendChild(el('div', 'ce-yg-desk-nav__backdrop', { 'aria-hidden': 'true' }));
    }

    source.classList.add(READY_CLASS);
    document.documentElement.classList.add(MARK);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        qsa('#' + ROOT_ID + ' .is-open').forEach(function (n) {
          n.classList.remove('is-open');
        });
        document.documentElement.classList.remove(OPEN_HTML);
      }
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
