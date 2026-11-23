/**
 * Crazy Egg A/B — PDP tab accordion restyle (CRO)
 *
 * Target: YouGarden PDP pages with .centralWrapper.text > .tab-heading
 * Pair with: crazyegg-pdp-accordion.css (Custom CSS in same variant)
 *
 * What this does:
 * - Wraps each .tab-heading + matching #tab-content-* into a card
 * - Replaces chevron with SHOW / HIDE pill (mock-up)
 * - Independent open/close (multiple sections can stay open)
 * - Moves live DOM nodes (no clone) so Feefo / Vimeo / blooming table keep working
 * - Plant Calendar: always open, no hide control, restyled chart
 * - Description also open by default; other sections closed
 * - Patches scrollToTabSection / doTabs so WATCH VIDEOS opens + scrolls to Videos
 *
 * Does NOT implement sticky / scroll Add to Basket (see description notes).
 *
 * Control = no change. Variation = paste CSS + this JS.
 */
(function () {
  'use strict';

  var ROOT_CLASS = 'ce-yg-pdp-acc';
  var INIT_MARK = 'data-ce-yg-pdp-acc-init';
  var STYLE_ID = 'ce-pdp-acc-critical-css';
  var HOST_CLASS = 'ce-pdp-acc';
  var PINNED_ID = 'plantcalendar';
  var DEFAULT_OPEN_ID = 'description';

  if (document.documentElement.getAttribute(INIT_MARK) === '1') return;
  document.documentElement.setAttribute(INIT_MARK, '1');

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function injectCriticalCss() {
    if (document.getElementById(STYLE_ID)) return;
    var css =
      'html.ce-yg-pdp-acc .centralWrapper.text.ce-pdp-acc{' +
        'display:flex;flex-direction:column;gap:12px;' +
        'padding-top:8px;padding-bottom:28px;box-sizing:border-box;' +
      '}' +
      'html.ce-yg-pdp-acc .ce-pdp-acc__item{' +
        'border-radius:22px;background:#f5ede1;border:1px solid transparent;overflow:hidden;' +
      '}' +
      'html.ce-yg-pdp-acc .ce-pdp-acc__item.is-open,' +
      'html.ce-yg-pdp-acc .ce-pdp-acc__item.is-pinned{' +
        'background:#fff;border-color:#e6ddd2;' +
      '}' +
      'html.ce-yg-pdp-acc .ce-pdp-acc__item .tab-heading{' +
        'display:flex!important;align-items:center;justify-content:space-between;gap:16px;' +
        'width:100%;margin:0!important;padding:16px 18px!important;box-sizing:border-box;' +
        'border:none!important;background:transparent!important;cursor:pointer;' +
        'font-family:gelica,Gelica,Georgia,serif!important;font-size:1.12rem!important;' +
        'font-weight:700!important;color:#365722!important;text-align:left!important;' +
      '}' +
      'html.ce-yg-pdp-acc .ce-pdp-acc__item.is-pinned .tab-heading{cursor:default;}' +
      'html.ce-yg-pdp-acc .ce-pdp-acc__item .tab-heading .arrow,' +
      'html.ce-yg-pdp-acc .ce-pdp-acc__item .tab-heading .svg-inline--fa{display:none!important;}' +
      'html.ce-yg-pdp-acc .ce-pdp-acc__control{' +
        'flex-shrink:0;font-family:proxima-nova,Proxima Nova,Arial,sans-serif!important;' +
        'font-size:11px!important;font-weight:700!important;letter-spacing:.06em;' +
        'text-transform:uppercase;color:#6c943f!important;padding:6px 14px;' +
        'border-radius:999px;background:#fff;line-height:1.2;pointer-events:none;' +
      '}' +
      'html.ce-yg-pdp-acc .ce-pdp-acc__item.is-open .ce-pdp-acc__control{background:#e4edd8;}' +
      'html.ce-yg-pdp-acc .ce-pdp-acc__item .tab-content{' +
        'display:none!important;margin:0!important;padding:0 18px 18px!important;' +
        'border:none!important;background:transparent!important;' +
      '}' +
      'html.ce-yg-pdp-acc .ce-pdp-acc__item.is-open>.tab-content,' +
      'html.ce-yg-pdp-acc .ce-pdp-acc__item.is-pinned>.tab-content{display:block!important;}';

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function findHost() {
    var hosts = document.querySelectorAll('.centralWrapper.text');
    for (var i = 0; i < hosts.length; i++) {
      if (hosts[i].querySelector('.tab-heading') && hosts[i].querySelector('.tab-content')) {
        return hosts[i];
      }
    }
    return null;
  }

  function headingLabel(heading) {
    var clone = heading.cloneNode(true);
    var arrow = clone.querySelector('.arrow');
    if (arrow) arrow.remove();
    return (clone.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function findContent(heading) {
    var id = heading.id;
    if (id) {
      var byId = document.getElementById('tab-content-' + id);
      if (byId) return byId;
    }
    var next = heading.nextElementSibling;
    if (next && next.classList && next.classList.contains('tab-content')) return next;
    return null;
  }

  function setOpen(item, open) {
    if (item.classList.contains('is-pinned')) {
      open = true;
    }
    var heading = item.querySelector('.tab-heading');
    var content = item.querySelector('.tab-content');
    var control = item.querySelector('[data-ce-pdp-acc-label]');

    item.classList.toggle('is-open', open);
    if (heading) {
      heading.classList.toggle('active', open);
      if (!item.classList.contains('is-pinned')) {
        heading.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
    }
    if (content) {
      content.classList.toggle('active', open);
      content.style.display = open ? 'block' : 'none';
      content.hidden = !open;
    }
    if (control) control.textContent = open ? 'Hide' : 'Show';
  }

  function enhanceHeading(heading, pinned) {
    var titleText = headingLabel(heading);
    heading.innerHTML = '';

    var title = document.createElement('span');
    title.className = 'ce-pdp-acc__title';
    title.textContent = titleText;
    heading.appendChild(title);

    if (pinned) {
      heading.removeAttribute('role');
      heading.removeAttribute('tabindex');
      heading.removeAttribute('aria-expanded');
      return;
    }

    heading.setAttribute('role', 'button');
    heading.setAttribute('tabindex', '0');

    var control = document.createElement('span');
    control.className = 'ce-pdp-acc__control';
    control.setAttribute('data-ce-pdp-acc-label', '');
    control.textContent = 'Show';
    heading.appendChild(control);
  }

  function wireItem(item) {
    if (item.classList.contains('is-pinned')) return;

    var heading = item.querySelector('.tab-heading');
    if (!heading || heading.getAttribute('data-ce-pdp-acc-wired') === '1') return;
    heading.setAttribute('data-ce-pdp-acc-wired', '1');

    function toggle(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
      }
      setOpen(item, !item.classList.contains('is-open'));
    }

    heading.addEventListener('click', toggle, true);
    heading.addEventListener(
      'keydown',
      function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) {
          e.preventDefault();
          toggle(e);
        }
      },
      true
    );
  }

  function buildAccordion(host) {
    if (!host || host.getAttribute('data-ce-pdp-acc-built') === '1') return false;

    var headings = [].filter.call(host.children, function (el) {
      return el.classList && el.classList.contains('tab-heading');
    });
    if (headings.length < 2) return false;

    document.documentElement.classList.add(ROOT_CLASS);
    host.classList.add(HOST_CLASS);

    headings.forEach(function (heading) {
      if (heading.closest('.ce-pdp-acc__item')) return;

      var content = findContent(heading);
      if (!content) return;

      var pinned = heading.id === PINNED_ID;
      var item = document.createElement('div');
      item.className = 'ce-pdp-acc__item' + (pinned ? ' is-pinned is-open' : '');
      if (heading.id) item.setAttribute('data-ce-pdp-acc-id', heading.id);

      heading.parentNode.insertBefore(item, heading);
      item.appendChild(heading);
      item.appendChild(content);

      enhanceHeading(heading, pinned);
      wireItem(item);

      var shouldOpen = pinned || heading.id === DEFAULT_OPEN_ID;
      setOpen(item, shouldOpen);
    });

    host.setAttribute('data-ce-pdp-acc-built', '1');
    patchTabNav();
    return true;
  }

  function findItemById(id) {
    if (!id) return null;
    var item = document.querySelector('.ce-pdp-acc__item[data-ce-pdp-acc-id="' + id + '"]');
    if (item) return item;
    var heading = document.getElementById(id);
    return heading ? heading.closest('.ce-pdp-acc__item') : null;
  }

  function openSectionById(id) {
    var item = findItemById(id);
    if (!item) return null;
    setOpen(item, true);
    return item;
  }

  /**
   * Live WATCH VIDEOS: scrollToTabSection('video') → scroll to #video + doTabs('video')
   * doTabs only slideDowns #tab-content-*, which loses to our display:none !important
   * unless the card has .is-open — so patch both globals after accordion builds.
   */
  function patchTabNav() {
    if (window.__ceYgPdpAccTabNavPatched) return;
    window.__ceYgPdpAccTabNavPatched = true;

    var origDoTabs = window.doTabs;
    window.doTabs = function (id) {
      if (openSectionById(id)) return;
      if (typeof origDoTabs === 'function') return origDoTabs.apply(this, arguments);
    };

    var origScroll = window.scrollToTabSection;
    window.scrollToTabSection = function (id) {
      openSectionById(id);

      var $ = window.jQuery || window.$;
      var heading = document.getElementById(id);
      var head = document.getElementById('head-scroll');
      var offset = head ? head.offsetHeight : 0;

      if ($ && heading && typeof $.fn.animate === 'function') {
        setTimeout(function () {
          openSectionById(id);
        }, 1000);
        try {
          $('html, body').stop().animate(
            { scrollTop: $(heading).offset().top - offset },
            1000
          );
          return;
        } catch (err) {
          /* fall through */
        }
      }

      if (heading) {
        var top = heading.getBoundingClientRect().top + window.pageYOffset - offset;
        if (window.scrollTo) {
          try {
            window.scrollTo({ top: top, behavior: 'smooth' });
          } catch (e2) {
            window.scrollTo(0, top);
          }
        }
      } else if (typeof origScroll === 'function') {
        return origScroll.apply(this, arguments);
      }
    };
  }

  function boot() {
    injectCriticalCss();
    var host = findHost();
    if (!host) return;
    buildAccordion(host);
  }

  ready(boot);

  if (window.MutationObserver) {
    var tries = 0;
    var mo = new MutationObserver(function () {
      tries += 1;
      if (document.querySelector('.centralWrapper.text.ce-pdp-acc[data-ce-pdp-acc-built="1"]') || tries > 40) {
        mo.disconnect();
        return;
      }
      boot();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
