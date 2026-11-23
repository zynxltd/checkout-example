/**
 * Crazy Egg A/B — SEO content block restyle (sitewide)
 *
 * Target: any YouGarden page with .top-heading-block
 * Pair with: crazyegg-seo-heading-block.css (Custom CSS in same variant)
 *
 * Example: https://www.yougarden.com/trees-and-shrubs/garden-shrubs
 *
 * What this explores:
 * 1. Soft rounded white card, centred SEO intro
 * 2. H1 Gelica / H2+body Proxima, forest green accents
 * 3. “Read more” as bold underlined green control (desktop + mobile)
 *
 * Control = no change. Variation = paste CSS + this JS.
 */
(function () {
  'use strict';

  var ROOT_CLASS = 'ce-yg-seo-head';
  var INIT_MARK = 'data-ce-yg-seo-head-init';

  if (document.documentElement.getAttribute(INIT_MARK) === '1') return;
  document.documentElement.setAttribute(INIT_MARK, '1');

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function syncLabel(label, checkbox) {
    if (!label) return;
    var more = label.getAttribute('data-read-more') || 'Read more';
    var less = label.getAttribute('data-read-less') || 'Read less';
    label.setAttribute('data-read-more', more);
    label.setAttribute('data-read-less', less);
    /* Real text node only — Magento ::before/::after are blanked in CSS */
    label.textContent = checkbox && checkbox.checked ? less : more;
  }

  function placeLabelBelowBlurb(wrap, label) {
    if (!wrap || !label) return;
    var lastP = null;
    var kids = wrap.children;
    for (var i = 0; i < kids.length; i++) {
      if (kids[i].tagName === 'P') lastP = kids[i];
    }
    /* Always sit after the last paragraph (mock-up: below the blurb) */
    if (lastP) {
      if (label.previousElementSibling !== lastP) {
        if (lastP.nextSibling) {
          wrap.insertBefore(label, lastP.nextSibling);
        } else {
          wrap.appendChild(label);
        }
      }
    } else {
      wrap.appendChild(label);
    }

    try {
      label.style.setProperty('display', 'block', 'important');
      label.style.setProperty('position', 'static', 'important');
      label.style.setProperty('float', 'none', 'important');
      label.style.setProperty('clear', 'both', 'important');
      label.style.setProperty('left', 'auto', 'important');
      label.style.setProperty('right', 'auto', 'important');
      label.style.setProperty('bottom', 'auto', 'important');
      label.style.setProperty('top', 'auto', 'important');
      label.style.setProperty('margin', '12px auto 0', 'important');
      label.style.setProperty('text-align', 'center', 'important');
      label.style.setProperty('width', '100%', 'important');
    } catch (errL) { /* ignore */ }
  }

  function wireDesktopReadMore(block) {
    var wrap = block.querySelector('.read-more');
    if (!wrap) return;

    try {
      wrap.style.setProperty('display', 'flex', 'important');
      wrap.style.setProperty('flex-direction', 'column', 'important');
      wrap.style.setProperty('align-items', 'center', 'important');
      wrap.style.setProperty('max-height', 'none', 'important');
      wrap.style.setProperty('overflow', 'visible', 'important');
      wrap.style.setProperty('position', 'relative', 'important');
    } catch (errW) { /* ignore */ }

    var checkbox =
      wrap.querySelector('.read-more-checkbox') ||
      document.getElementById('read-more-checkbox');
    var label = wrap.querySelector('.read-more-label');
    if (!label) return;

    placeLabelBelowBlurb(wrap, label);
    syncLabel(label, checkbox);

    if (label.getAttribute('data-ce-seo-label') === '1') return;
    label.setAttribute('data-ce-seo-label', '1');

    if (checkbox) {
      checkbox.addEventListener('change', function () {
        syncLabel(label, checkbox);
      });
    }

    label.addEventListener('click', function () {
      window.setTimeout(function () {
        syncLabel(label, checkbox);
      }, 0);
    });
  }

  function forceCenter(el) {
    if (!el || !el.style) return;
    try {
      el.style.setProperty('text-align', 'center', 'important');
      el.style.setProperty('float', 'none', 'important');
      el.style.setProperty('margin-left', 'auto', 'important');
      el.style.setProperty('margin-right', 'auto', 'important');
    } catch (err) { /* ignore */ }
  }

  function enhanceBlock(block) {
    if (!block) return;

    forceCenter(block);
    forceCenter(block.querySelector('.categoryText'));
    forceCenter(block.querySelector('.read-more'));
    forceCenter(block.querySelector('h1'));

    try {
      block.style.setProperty('width', '100%', 'important');
      block.style.setProperty('max-width', '100%', 'important');
      block.style.setProperty('display', 'block', 'important');
    } catch (errW) { /* ignore */ }

    wireDesktopReadMore(block);

    var mobileToggle = block.querySelector('#mobile-read-more, .mobile-read-more');
    if (mobileToggle) {
      var txt = (mobileToggle.textContent || '').replace(/\s+/g, ' ').trim();
      if (!txt || /read\s*more.*read\s*more/i.test(txt)) {
        mobileToggle.textContent = 'Read more';
      }
    }
  }

  function run() {
    var blocks = document.querySelectorAll('.top-heading-block');
    if (!blocks.length) return;

    document.documentElement.classList.add(ROOT_CLASS);

    for (var i = 0; i < blocks.length; i++) {
      enhanceBlock(blocks[i]);
    }
  }

  ready(run);

  /* Magento / CE sometimes inject category copy late */
  window.setTimeout(run, 800);
  window.setTimeout(run, 2000);
})();
