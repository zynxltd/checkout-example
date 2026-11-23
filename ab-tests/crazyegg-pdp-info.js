/**
 * Crazy Egg A/B — PDP product information hub + mobile sticky ATC
 *
 * Target: https://www.yougarden.com/item-s-pa021/allium-purple-sensation (all PDPs)
 * Pair with: crazyegg-pdp-info.css (Custom CSS in same variant)
 *
 * 1. Replaces plain accordion with chip + card “Product information” hub (mock-up)
 * 2. Mobile-only sticky add-to-basket bar after scrolling past buy box
 */
(function () {
  'use strict';

  var ROOT_CLASS = 'ce-yg-pdp-info';
  var INIT_MARK = 'data-ce-yg-pdp-info-init';
  var STYLE_ID = 'ce-yg-pdp-info-fallback';
  var MOBILE_MQ = '(max-width: 767px)';

  var SECTION_TITLES = [
    'Description',
    'Top Tips',
    'Care Information',
    'Delivery Information',
    'Reviews',
    'Videos'
  ];

  if (document.documentElement.getAttribute(INIT_MARK)) return;
  if (!/\/item-[sp]-/i.test(window.location.pathname)) return;

  document.documentElement.setAttribute(INIT_MARK, '1');
  document.documentElement.classList.add(ROOT_CLASS);

  /* Minimal fallback if CSS sheet not pasted */
  function injectFallbackCss() {
    if (document.getElementById(STYLE_ID)) return;
    var link = document.querySelector('link[href*="crazyegg-pdp-info"]');
    if (link) return;
    /* CSS should be pasted in CE — JS-only fallback is minimal */
  }

  function slugify(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function normaliseTitle(text) {
    var t = (text || '').replace(/\s+/g, ' ').trim();
    for (var i = 0; i < SECTION_TITLES.length; i++) {
      if (t.indexOf(SECTION_TITLES[i]) === 0) return SECTION_TITLES[i];
    }
    return t.split(' ').slice(0, 4).join(' ');
  }

  function findAccordionSections() {
    var found = [];
    var seen = {};

    var candidates = document.querySelectorAll(
      '#wrapper h2, #wrapper h3, #wrapper h4, #wrapper a, #wrapper button, ' +
      '#wrapper [role="button"], #wrapper .panel-heading, #wrapper .accordion-toggle, ' +
      '#wrapper .collapse-toggle, #wrapper [data-toggle="collapse"]'
    );

    candidates.forEach(function (el) {
      if (el.closest('.ce-yg-pdp-info')) return;

      var title = normaliseTitle(el.textContent);
      if (!title || title.length > 40) return;

      var matched = null;
      for (var i = 0; i < SECTION_TITLES.length; i++) {
        if (title === SECTION_TITLES[i] || title.indexOf(SECTION_TITLES[i]) === 0) {
          matched = SECTION_TITLES[i];
          break;
        }
      }
      if (!matched || seen[matched]) return;
      seen[matched] = true;

      var panel = findPanelForHeader(el);
      if (!panel) return;

      found.push({ title: matched, header: el, panel: panel });
    });

    return found;
  }

  function findPanelForHeader(header) {
    var next = header.nextElementSibling;
    if (next && next !== header && (next.textContent || '').trim().length > 20) {
      return next;
    }

    var parent = header.parentElement;
    if (parent) {
      next = parent.nextElementSibling;
      if (next && (next.textContent || '').trim().length > 20) return next;
      var inner = parent.querySelector('.collapse, .panel-collapse, .accordion-body, .panel-body, .content, .tab-content');
      if (inner) return inner;
    }

    var aria = header.getAttribute('aria-controls') || header.getAttribute('data-target') || header.getAttribute('href');
    if (aria && aria.charAt(0) === '#') {
      var target = document.querySelector(aria);
      if (target) return target;
    }

    return null;
  }

  function buildInfoHub(sections) {
    if (!sections.length) return null;

    var root = document.createElement('div');
    root.className = 'ce-yg-pdp-info';
    root.setAttribute('data-ce-yg-pdp-info', '');

    var heading = document.createElement('h2');
    heading.className = 'ce-yg-pdp-info__heading';
    heading.textContent = 'Product information';
    root.appendChild(heading);

    var nav = document.createElement('nav');
    nav.className = 'ce-yg-pdp-info__nav';
    nav.setAttribute('aria-label', 'Product information sections');

    var cards = document.createElement('div');
    cards.className = 'ce-yg-pdp-info__cards';

    sections.forEach(function (section, index) {
      var id = slugify(section.title);
      var isOpen = index === 0;

      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'ce-yg-pdp-info__chip' + (isOpen ? ' is-active' : '');
      chip.setAttribute('data-ce-info-jump', id);
      chip.textContent = section.title;
      nav.appendChild(chip);

      var card = document.createElement('article');
      card.className = 'ce-yg-pdp-info-card' + (isOpen ? ' is-open' : '');
      card.id = 'ce-yg-pdp-info-' + id;

      var toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'ce-yg-pdp-info-card__toggle';
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.innerHTML =
        '<span class="ce-yg-pdp-info-card__title">' + section.title + '</span>' +
        '<span class="ce-yg-pdp-info-card__control" data-ce-info-label>' + (isOpen ? 'Hide' : 'Show') + '</span>';

      var panel = document.createElement('div');
      panel.className = 'ce-yg-pdp-info-card__panel';
      panel.id = 'ce-yg-pdp-info-panel-' + id;
      if (!isOpen) panel.hidden = true;
      panel.innerHTML = section.panel.innerHTML;

      card.appendChild(toggle);
      card.appendChild(panel);
      cards.appendChild(card);

      section.header.closest('.panel, .accordion-item, .fp-section, div') &&
        (function () {
          var wrap = section.header.closest('.panel, .accordion-item, .row, .fp-section');
          if (wrap) wrap.classList.add('ce-yg-pdp-info-source');
          else {
            section.header.classList.add('ce-yg-pdp-info-source');
            section.panel.classList.add('ce-yg-pdp-info-source');
          }
        })();
    });

    root.appendChild(nav);
    root.appendChild(cards);

    return root;
  }

  function wireInfoHub(root) {
    var cards = [].slice.call(root.querySelectorAll('.ce-yg-pdp-info-card'));

    function setOpen(card, open) {
      var toggle = card.querySelector('.ce-yg-pdp-info-card__toggle');
      var panel = card.querySelector('.ce-yg-pdp-info-card__panel');
      var label = card.querySelector('[data-ce-info-label]');
      card.classList.toggle('is-open', open);
      if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (panel) panel.hidden = !open;
      if (label) label.textContent = open ? 'Hide' : 'Show';
    }

    function setChip(id) {
      root.querySelectorAll('[data-ce-info-jump]').forEach(function (chip) {
        chip.classList.toggle('is-active', chip.getAttribute('data-ce-info-jump') === id);
      });
    }

    cards.forEach(function (card) {
      var toggle = card.querySelector('.ce-yg-pdp-info-card__toggle');
      if (!toggle) return;
      toggle.addEventListener('click', function () {
        var open = !card.classList.contains('is-open');
        setOpen(card, open);
        if (open) setChip(card.id.replace('ce-yg-pdp-info-', ''));
      });
    });

    root.querySelectorAll('[data-ce-info-jump]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var id = chip.getAttribute('data-ce-info-jump');
        var card = root.querySelector('#ce-yg-pdp-info-' + id);
        if (!card) return;
        setOpen(card, true);
        setChip(id);
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  }

  function initInfoHub() {
    if (document.querySelector('[data-ce-yg-pdp-info]')) return;

    var sections = findAccordionSections();
    if (sections.length < 2) return;

    var hub = buildInfoHub(sections);
    if (!hub) return;

    var insertBefore = sections[0].header;
    while (insertBefore && insertBefore.parentElement && insertBefore.parentElement !== document.body) {
      if (insertBefore.parentElement.id === 'wrapper' || insertBefore.parentElement.classList.contains('centralWrapper')) break;
      insertBefore = insertBefore.parentElement;
    }

    var anchor = sections[0].header.closest('.fp-section, .centralWrapper, #wrapper > div');
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(hub, anchor);
    } else if (insertBefore && insertBefore.parentNode) {
      insertBefore.parentNode.insertBefore(hub, insertBefore);
    } else {
      var wrapper = document.getElementById('wrapper');
      if (wrapper) wrapper.appendChild(hub);
    }

    wireInfoHub(hub);
  }

  /* —— Mobile sticky ATC —— */
  function findAtcButton() {
    var selectors = [
      '#addToBasket',
      '#add-to-basket',
      'button[name="addToBasket"]',
      'input[name="addToBasket"]',
      '.add-to-basket',
      '.addToBasket',
      '[id*="addToBasket"]',
      'button.mainButtonGreen',
      '.buy-box button[type="submit"]',
      '#buyBox button[type="submit"]'
    ];

    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el && !el.closest('.ce-yg-pdp-sticky-atc')) return el;
    }

    var buttons = document.querySelectorAll('#wrapper button, #wrapper input[type="submit"]');
    for (var j = 0; j < buttons.length; j++) {
      var text = (buttons[j].value || buttons[j].textContent || '').toLowerCase();
      if (text.indexOf('add to basket') !== -1 || text.indexOf('add to bag') !== -1) {
        return buttons[j];
      }
    }

    return null;
  }

  function findProductMeta() {
    var nameEl =
      document.querySelector('h1.product-title, h1.item-title, #wrapper h1, .product-name h1, h1');
    var priceEl =
      document.querySelector('.price .now, .product-price, .item-price, .price-now, [class*="price"] .value');

    var name = nameEl ? nameEl.textContent.replace(/\s+/g, ' ').trim() : 'Your plant';
    var price = '';

    if (priceEl) {
      price = priceEl.textContent.replace(/\s+/g, ' ').trim();
    } else {
      var priceMatch = document.body.innerText.match(/£[\d,.]+/);
      if (priceMatch) price = priceMatch[0];
    }

    return { name: name, price: price };
  }

  function initStickyAtc() {
    if (!window.matchMedia || !window.matchMedia(MOBILE_MQ).matches) return;

    var atcBtn = findAtcButton();
    if (!atcBtn) return;

    var meta = findProductMeta();
    var bar = document.createElement('div');
    bar.className = 'ce-yg-pdp-sticky-atc';
    bar.innerHTML =
      '<div class="ce-yg-pdp-sticky-atc__copy">' +
      '<strong class="ce-yg-pdp-sticky-atc__name"></strong>' +
      '<p class="ce-yg-pdp-sticky-atc__price"></p>' +
      '</div>' +
      '<button type="button" class="ce-yg-pdp-sticky-atc__btn">Add to basket</button>';

    bar.querySelector('.ce-yg-pdp-sticky-atc__name').textContent = meta.name;
    bar.querySelector('.ce-yg-pdp-sticky-atc__price').textContent = meta.price;

    bar.querySelector('.ce-yg-pdp-sticky-atc__btn').addEventListener('click', function () {
      atcBtn.click();
      bar.classList.add('is-visible');
    });

    document.body.appendChild(bar);

    var buyBox = atcBtn.closest('.buy-box, .buyBox, .product-buy, .item-buy, form, #wrapper');
    var showAfter = 0;

    function calcThreshold() {
      if (buyBox) {
        var rect = buyBox.getBoundingClientRect();
        showAfter = window.scrollY + rect.bottom + 40;
      } else {
        showAfter = 320;
      }
    }

    calcThreshold();

    var ticking = false;
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () {
          var visible = window.scrollY > showAfter;
          bar.classList.toggle('is-visible', visible);
          document.documentElement.classList.toggle('ce-yg-pdp-sticky-visible', visible);
          ticking = false;
        });
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', calcThreshold, { passive: true });
    onScroll();
  }

  function boot() {
    injectFallbackCss();
    initInfoHub();
    initStickyAtc();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  if (window.MutationObserver) {
    var mo = new MutationObserver(function () {
      if (!document.querySelector('[data-ce-yg-pdp-info]')) initInfoHub();
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
})();
