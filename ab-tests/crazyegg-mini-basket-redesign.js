/**
 * Crazy Egg A/B — Mini basket redesign (desktop only)
 *
 * Variation: restyle #mini-basket-show to match the light mockup
 * (white panel, stone header, circular thumbs, pink pill CTA).
 *
 * Paste this entire file into the Crazy Egg variation custom JS.
 * Control = no change. Desktop only (min-width: 1000px).
 *
 * Preview: https://www.yougarden.com/#ce-abtest-6oGhg7i-epPNl3OojR7lfLJxtQkA1DBzI3GsrxkSnbA.tsnQO-ijszw.VZJifgfpvYI.yougarden.com
 * Control: https://www.yougarden.com/
 */
(function () {
  'use strict';

  var DESKTOP_MQ = '(min-width: 1000px)';
  var STYLE_ID = 'ce-yg-mini-basket-v2';
  var MARK = 'data-ce-mini-basket';
  var enhancing = false;

  if (!window.matchMedia(DESKTOP_MQ).matches) return;

  var css =
    '@media (min-width: 1000px) {' +
    '#mini-basket-show.mini-basket-show,' +
    '#basketWrapper #mini-basket-show {' +
      'background: #ffffff !important;' +
      'background-color: #ffffff !important;' +
      'color: #483f3a !important;' +
      'border: 1px solid #e0d6cb !important;' +
      'border-radius: 12px !important;' +
      'box-shadow: 0 16px 40px rgba(38, 79, 28, 0.14) !important;' +
      'overflow: hidden !important;' +
      'padding: 0 !important;' +
      'width: 380px !important;' +
      'max-width: calc(100vw - 24px) !important;' +
      'box-sizing: border-box !important;' +
    '}' +

    /* Keep site show/hide; only restyle when visible */
    '#mini-basket-show * {' +
      'box-sizing: border-box !important;' +
    '}' +

    '#mini-basket-show > .icon,' +
    '#mini-basket-show > span.icon {' +
      'display: none !important;' +
    '}' +

    '#mini-basket-show .ce-mb-head {' +
      'display: flex !important;' +
      'align-items: baseline !important;' +
      'justify-content: space-between !important;' +
      'gap: 12px !important;' +
      'padding: 14px 16px 12px !important;' +
      'background: #f0ede6 !important;' +
      'border-bottom: 1px solid #e0d6cb !important;' +
      'margin: 0 !important;' +
    '}' +
    '#mini-basket-show .ce-mb-head__title {' +
      'margin: 0 !important;' +
      'font-family: Georgia, "Times New Roman", Times, serif !important;' +
      'font-size: 18px !important;' +
      'font-weight: 700 !important;' +
      'color: #264f1c !important;' +
      'line-height: 1.2 !important;' +
    '}' +
    '#mini-basket-show .ce-mb-head__count {' +
      'margin: 0 !important;' +
      'font-family: Arial, Helvetica, sans-serif !important;' +
      'font-size: 13px !important;' +
      'font-weight: 500 !important;' +
      'color: #7a726c !important;' +
      'white-space: nowrap !important;' +
    '}' +

    '#mini-basket-show #top-basket-content {' +
      'max-height: 280px !important;' +
      'overflow-y: auto !important;' +
      'background: #ffffff !important;' +
      'padding: 0 !important;' +
      'margin: 0 !important;' +
      'float: none !important;' +
      'width: 100% !important;' +
    '}' +
    '#mini-basket-show #top-basket-content .row {' +
      'display: flex !important;' +
      'flex-direction: row !important;' +
      'align-items: flex-start !important;' +
      'gap: 12px !important;' +
      'padding: 14px 16px !important;' +
      'margin: 0 !important;' +
      'border: 0 !important;' +
      'border-bottom: 1px solid #efe8df !important;' +
      'background: #ffffff !important;' +
      'float: none !important;' +
      'clear: both !important;' +
      'width: 100% !important;' +
      'height: auto !important;' +
      'min-height: 0 !important;' +
      'overflow: visible !important;' +
    '}' +
    '#mini-basket-show #top-basket-content .row:last-child {' +
      'border-bottom: none !important;' +
    '}' +

    '#mini-basket-show #top-basket-content .row .img {' +
      'flex: 0 0 56px !important;' +
      'width: 56px !important;' +
      'height: 56px !important;' +
      'margin: 0 !important;' +
      'padding: 0 !important;' +
      'float: none !important;' +
      'border: 0 !important;' +
      'background: transparent !important;' +
      'overflow: visible !important;' +
    '}' +
    '#mini-basket-show #top-basket-content .row .img a.ce-mb-link {' +
      'display: block !important;' +
      'width: 56px !important;' +
      'height: 56px !important;' +
      'border-radius: 50% !important;' +
      'overflow: hidden !important;' +
      'text-decoration: none !important;' +
    '}' +
    '#mini-basket-show #top-basket-content .row .img img {' +
      'display: block !important;' +
      'width: 56px !important;' +
      'height: 56px !important;' +
      'max-width: 56px !important;' +
      'object-fit: cover !important;' +
      'border-radius: 50% !important;' +
      'border: 1px solid #e0d6cb !important;' +
      'background: #f0ede6 !important;' +
      'visibility: visible !important;' +
      'opacity: 1 !important;' +
    '}' +

    '#mini-basket-show #top-basket-content .row a.ce-mb-link {' +
      'color: inherit !important;' +
      'text-decoration: none !important;' +
      'cursor: pointer !important;' +
    '}' +

    '#mini-basket-show #top-basket-content .row .titleWrapper {' +
      'flex: 1 1 auto !important;' +
      'min-width: 0 !important;' +
      'float: none !important;' +
      'width: auto !important;' +
      'margin: 0 !important;' +
      'padding: 0 !important;' +
      'overflow: visible !important;' +
    '}' +
    '#mini-basket-show #top-basket-content .row .title,' +
    '#mini-basket-show #top-basket-content .row .title a.ce-mb-link {' +
      'display: block !important;' +
      'font-family: Georgia, "Times New Roman", Times, serif !important;' +
      'font-size: 15px !important;' +
      'font-weight: 700 !important;' +
      'line-height: 1.3 !important;' +
      'color: #483f3a !important;' +
      'margin: 0 0 4px !important;' +
      'padding: 0 !important;' +
      'visibility: visible !important;' +
      'opacity: 1 !important;' +
    '}' +
    '#mini-basket-show #top-basket-content .row .title a.ce-mb-link:hover,' +
    '#mini-basket-show #top-basket-content .row .title a.ce-mb-link:focus {' +
      'color: #264f1c !important;' +
      'text-decoration: underline !important;' +
    '}' +
    '#mini-basket-show #top-basket-content .row .pno {' +
      'font-family: Arial, Helvetica, sans-serif !important;' +
      'font-size: 12px !important;' +
      'font-weight: 400 !important;' +
      'line-height: 1.3 !important;' +
      'color: #7a726c !important;' +
      'margin: 0 !important;' +
      'visibility: visible !important;' +
    '}' +
    '#mini-basket-show #top-basket-content .row .pno span,' +
    '#mini-basket-show #top-basket-content .row .pno strong {' +
      'color: #483f3a !important;' +
      'font-weight: 700 !important;' +
    '}' +

    '#mini-basket-show #top-basket-content .row .priceWrapper {' +
      'flex: 0 0 auto !important;' +
      'display: flex !important;' +
      'flex-direction: column !important;' +
      'align-items: flex-end !important;' +
      'gap: 4px !important;' +
      'text-align: right !important;' +
      'white-space: nowrap !important;' +
      'float: none !important;' +
      'width: auto !important;' +
      'margin: 0 !important;' +
      'padding: 0 !important;' +
    '}' +
    '#mini-basket-show #top-basket-content .row .price {' +
      'font-family: Arial, Helvetica, sans-serif !important;' +
      'font-size: 14px !important;' +
      'font-weight: 700 !important;' +
      'color: #264f1c !important;' +
      'margin: 0 !important;' +
      'visibility: visible !important;' +
    '}' +
    '#mini-basket-show #top-basket-content .row .itemQty {' +
      'font-family: Arial, Helvetica, sans-serif !important;' +
      'font-size: 12px !important;' +
      'font-weight: 400 !important;' +
      'color: #7a726c !important;' +
      'margin: 0 !important;' +
      'text-transform: none !important;' +
      'visibility: visible !important;' +
    '}' +

    '#mini-basket-show .ce-mb-foot {' +
      'display: flex !important;' +
      'align-items: center !important;' +
      'justify-content: space-between !important;' +
      'gap: 12px !important;' +
      'padding: 14px 16px !important;' +
      'background: #ffffff !important;' +
      'border-top: 1px solid #e0d6cb !important;' +
      'margin: 0 !important;' +
      'clear: both !important;' +
      'float: none !important;' +
      'width: 100% !important;' +
    '}' +
    '#mini-basket-show .ce-mb-foot #basket-drop-total,' +
    '#mini-basket-show #basket-drop-total.total,' +
    '#mini-basket-show #basket-drop-total {' +
      'float: none !important;' +
      'display: block !important;' +
      'margin: 0 !important;' +
      'padding: 0 !important;' +
      'font-family: Georgia, "Times New Roman", Times, serif !important;' +
      'font-size: 16px !important;' +
      'font-weight: 700 !important;' +
      'color: #483f3a !important;' +
      'background: transparent !important;' +
      'border: 0 !important;' +
      'width: auto !important;' +
      'visibility: visible !important;' +
    '}' +
    '#mini-basket-show .ce-mb-foot .goto-chckout-btn,' +
    '#mini-basket-show .goto-chckout-btn {' +
      'float: none !important;' +
      'display: block !important;' +
      'margin: 0 !important;' +
      'padding: 0 !important;' +
      'background: transparent !important;' +
      'border: 0 !important;' +
      'width: auto !important;' +
      'visibility: visible !important;' +
    '}' +
    '#mini-basket-show .goto-chckout-btn a {' +
      'display: inline-flex !important;' +
      'align-items: center !important;' +
      'justify-content: center !important;' +
      'border: none !important;' +
      'border-radius: 999px !important;' +
      'padding: 11px 18px !important;' +
      'background: #e3185d !important;' +
      'color: #ffffff !important;' +
      'font-family: Arial, Helvetica, sans-serif !important;' +
      'font-size: 13px !important;' +
      'font-weight: 700 !important;' +
      'line-height: 1 !important;' +
      'text-decoration: none !important;' +
      'white-space: nowrap !important;' +
      'box-shadow: none !important;' +
      'cursor: pointer !important;' +
      'visibility: visible !important;' +
    '}' +
    '#mini-basket-show .goto-chckout-btn a:hover,' +
    '#mini-basket-show .goto-chckout-btn a:focus {' +
      'background: #c41452 !important;' +
      'color: #ffffff !important;' +
      'text-decoration: none !important;' +
    '}' +
    '}';

  function injectStyles() {
    var existing = document.getElementById(STYLE_ID);
    if (existing) existing.parentNode.removeChild(existing);
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    (document.head || document.documentElement).appendChild(style);
  }

  function itemCountLabel() {
    var input = document.getElementById('mini-basket-item-total');
    var n = input && input.value ? String(input.value).trim() : '';
    if (!n) {
      var totals = document.getElementById('mini-basket-totals');
      if (totals) {
        var m = (totals.textContent || '').match(/(\d+)\s*item/i);
        if (m) n = m[1];
      }
    }
    if (!n) {
      n = String(document.querySelectorAll('#top-basket-content .row').length);
    }
    return n + ' item(s)';
  }

  function ensureHeader(panel) {
    var head = panel.querySelector(':scope > .ce-mb-head');
    if (!head) {
      head = document.createElement('div');
      head.className = 'ce-mb-head';
      head.innerHTML =
        '<div class="ce-mb-head__title">Your Basket</div>' +
        '<div class="ce-mb-head__count"></div>';
      panel.insertBefore(head, panel.firstChild);
    }
    var countEl = head.querySelector('.ce-mb-head__count');
    if (countEl) {
      var next = itemCountLabel();
      if (countEl.textContent !== next) countEl.textContent = next;
    }
  }

  function ensureFooter(panel) {
    var total = panel.querySelector('#basket-drop-total');
    var btn = panel.querySelector('.goto-chckout-btn');
    if (!total || !btn) return;

    var foot = panel.querySelector(':scope > .ce-mb-foot');
    if (!foot) {
      foot = document.createElement('div');
      foot.className = 'ce-mb-foot';
      if (total.parentNode === panel) {
        panel.insertBefore(foot, total);
      } else {
        panel.appendChild(foot);
      }
    }
    if (total.parentNode !== foot) foot.appendChild(total);
    if (btn.parentNode !== foot) foot.appendChild(btn);

    var link = btn.querySelector('a');
    if (link) {
      var cleaned = (link.textContent || '').replace(/\s*[»>]\s*$/, '').trim();
      if (cleaned !== 'View Basket') link.textContent = 'View Basket';
    }
  }

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/['’"“”]/g, '')
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');
  }

  function productNumberFromRow(row) {
    var pno = row.querySelector('.pno');
    if (!pno) return '';
    var code = pno.querySelector('span, strong');
    if (code) return (code.textContent || '').replace(/\D/g, '').trim();
    var m = (pno.textContent || '').match(/(\d{4,})/);
    return m ? m[1] : '';
  }

  function productUrl(row, num) {
    var titleEl = row.querySelector('.title');
    var titleText = '';
    if (titleEl) {
      var existing = titleEl.querySelector('a.ce-mb-link');
      titleText = existing ? existing.textContent : titleEl.textContent;
    }
    if (!titleText) {
      var img = row.querySelector('.img img');
      titleText = (img && img.getAttribute('alt')) || '';
    }
    return '/item-p-' + num + '/' + (slugify(titleText) || 'product');
  }

  function wrapWithLink(el, href, label) {
    if (!el) return;
    if (el.querySelector && el.querySelector('a.ce-mb-link')) return;
    if (el.tagName === 'A' && el.classList && el.classList.contains('ce-mb-link')) return;

    var a = document.createElement('a');
    a.className = 'ce-mb-link';
    a.href = href;
    a.setAttribute('data-ga4-type', 'navigation_links_clicks');
    if (label) a.setAttribute('aria-label', label);
    while (el.firstChild) a.appendChild(el.firstChild);
    el.appendChild(a);
  }

  function linkRowProducts(row) {
    if (row.getAttribute('data-ce-linked') === '1') return;
    var num = productNumberFromRow(row);
    if (!num) return;

    var href = productUrl(row, num);
    var titleEl = row.querySelector('.title');
    var titleText = titleEl ? (titleEl.textContent || '').trim() : 'View product';
    wrapWithLink(row.querySelector('.img'), href, titleText);
    wrapWithLink(titleEl, href, titleText);
    row.setAttribute('data-ce-linked', '1');
  }

  function tidyRows(panel) {
    var rows = panel.querySelectorAll('#top-basket-content .row');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var pno = row.querySelector('.pno');
      if (pno && !pno.querySelector('strong')) {
        var num = '';
        var existingCode = pno.querySelector('span');
        if (existingCode) num = (existingCode.textContent || '').replace(/\D/g, '').trim();
        if (!num) {
          var raw = (pno.textContent || '').replace(/Product\s*(Number|No\.?)\s*:?/i, '').trim();
          num = raw.replace(/\D/g, '') || raw;
        }
        if (num) {
          pno.textContent = '';
          pno.appendChild(document.createTextNode('Product No. '));
          var strong = document.createElement('strong');
          strong.textContent = num;
          pno.appendChild(strong);
        }
      }

      var qty = row.querySelector('.itemQty');
      if (qty && !qty.getAttribute('data-ce-tidy')) {
        var q = (qty.textContent || '').replace(/QTY\s*:?\s*/i, '').trim();
        qty.textContent = 'Qty ' + q;
        qty.setAttribute('data-ce-tidy', '1');
      }

      linkRowProducts(row);
    }
  }

  function enhance() {
    if (enhancing) return;
    if (!window.matchMedia(DESKTOP_MQ).matches) return;
    var panel = document.getElementById('mini-basket-show');
    if (!panel) return;

    enhancing = true;
    try {
      ensureHeader(panel);
      ensureFooter(panel);
      tidyRows(panel);
    } catch (err) {
      /* keep basket usable even if enhance fails */
    }
    enhancing = false;
  }

  injectStyles();
  document.documentElement.setAttribute(MARK, '1');
  enhance();

  var scheduled = null;
  function scheduleEnhance() {
    if (enhancing || scheduled) return;
    scheduled = setTimeout(function () {
      scheduled = null;
      enhance();
    }, 120);
  }

  var root = document.getElementById('basketWrapper');
  if (window.MutationObserver && root) {
    var obs = new MutationObserver(function () {
      if (enhancing) return;
      scheduleEnhance();
    });
    obs.observe(root, { childList: true, subtree: true });
  }

  document.addEventListener(
    'mouseenter',
    function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      if (t.closest('#basketWrapper')) scheduleEnhance();
    },
    true
  );
})();
