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

  if (!window.matchMedia(DESKTOP_MQ).matches) return;
  if (document.documentElement.getAttribute(MARK) === '1') return;
  document.documentElement.setAttribute(MARK, '1');

  var css =
    '@media (min-width: 1000px) {' +
    /* ---- Panel ---- */
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

    /* Hide old caret / brown triangle */
    '#mini-basket-show > .icon,' +
    '#mini-basket-show > span.icon {' +
      'display: none !important;' +
    '}' +

    /* Injected header */
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
      'font-family: "proxima-nova", "Proxima Nova", Arial, Helvetica, sans-serif !important;' +
      'font-size: 13px !important;' +
      'font-weight: 500 !important;' +
      'color: #7a726c !important;' +
      'white-space: nowrap !important;' +
    '}' +

    /* Item list */
    '#mini-basket-show #top-basket-content {' +
      'max-height: 280px !important;' +
      'overflow-y: auto !important;' +
      'overscroll-behavior: contain !important;' +
      'background: #ffffff !important;' +
      'padding: 0 !important;' +
      'margin: 0 !important;' +
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
      'background: transparent !important;' +
      'float: none !important;' +
      'clear: both !important;' +
      'width: auto !important;' +
      'box-sizing: border-box !important;' +
    '}' +
    '#mini-basket-show #top-basket-content .row:last-child {' +
      'border-bottom: none !important;' +
    '}' +

    /* Circular product thumbs */
    '#mini-basket-show #top-basket-content .row .img {' +
      'flex: 0 0 56px !important;' +
      'width: 56px !important;' +
      'height: 56px !important;' +
      'margin: 0 !important;' +
      'padding: 0 !important;' +
      'float: none !important;' +
      'border: 0 !important;' +
      'background: transparent !important;' +
    '}' +
    '#mini-basket-show #top-basket-content .row .img img {' +
      'display: block !important;' +
      'width: 56px !important;' +
      'height: 56px !important;' +
      'object-fit: cover !important;' +
      'border-radius: 50% !important;' +
      'border: 1px solid #e0d6cb !important;' +
      'background: #f0ede6 !important;' +
    '}' +

    /* Product image / title links (built from product no.) */
    '#mini-basket-show #top-basket-content .row a.ce-mb-link {' +
      'color: inherit !important;' +
      'text-decoration: none !important;' +
      'cursor: pointer !important;' +
    '}' +
    '#mini-basket-show #top-basket-content .row .img a.ce-mb-link {' +
      'display: block !important;' +
      'width: 56px !important;' +
      'height: 56px !important;' +
      'border-radius: 50% !important;' +
      'overflow: hidden !important;' +
    '}' +
    '#mini-basket-show #top-basket-content .row a.ce-mb-link:hover .title,' +
    '#mini-basket-show #top-basket-content .row a.ce-mb-link:focus .title,' +
    '#mini-basket-show #top-basket-content .row .title a.ce-mb-link:hover,' +
    '#mini-basket-show #top-basket-content .row .title a.ce-mb-link:focus {' +
      'color: #264f1c !important;' +
      'text-decoration: underline !important;' +
    '}' +

    /* Title + product no. */
    '#mini-basket-show #top-basket-content .row .titleWrapper {' +
      'flex: 1 1 auto !important;' +
      'min-width: 0 !important;' +
      'float: none !important;' +
      'width: auto !important;' +
      'margin: 0 !important;' +
      'padding: 0 !important;' +
    '}' +
    '#mini-basket-show #top-basket-content .row .title,' +
    '#mini-basket-show #top-basket-content .row .title a.ce-mb-link {' +
      'font-family: Georgia, "Times New Roman", Times, serif !important;' +
      'font-size: 15px !important;' +
      'font-weight: 700 !important;' +
      'line-height: 1.3 !important;' +
      'color: #483f3a !important;' +
      'margin: 0 0 4px !important;' +
      'padding: 0 !important;' +
    '}' +
    '#mini-basket-show #top-basket-content .row .title a.ce-mb-link {' +
      'display: inline !important;' +
      'margin: 0 !important;' +
    '}' +
    '#mini-basket-show #top-basket-content .row .pno {' +
      'font-family: "proxima-nova", "Proxima Nova", Arial, Helvetica, sans-serif !important;' +
      'font-size: 12px !important;' +
      'font-weight: 400 !important;' +
      'line-height: 1.3 !important;' +
      'color: #7a726c !important;' +
      'margin: 0 !important;' +
    '}' +
    '#mini-basket-show #top-basket-content .row .pno span {' +
      'color: #7a726c !important;' +
      'font-weight: 400 !important;' +
    '}' +

    /* Price + qty */
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
      'font-family: "proxima-nova", "Proxima Nova", Arial, Helvetica, sans-serif !important;' +
      'font-size: 14px !important;' +
      'font-weight: 700 !important;' +
      'color: #264f1c !important;' +
      'margin: 0 !important;' +
    '}' +
    '#mini-basket-show #top-basket-content .row .itemQty {' +
      'font-family: "proxima-nova", "Proxima Nova", Arial, Helvetica, sans-serif !important;' +
      'font-size: 12px !important;' +
      'font-weight: 400 !important;' +
      'color: #7a726c !important;' +
      'margin: 0 !important;' +
      'text-transform: none !important;' +
    '}' +

    /* Footer row */
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
    '}' +
    '#mini-basket-show .ce-mb-foot #basket-drop-total,' +
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
    '}' +
    '#mini-basket-show .goto-chckout-btn a {' +
      'display: inline-flex !important;' +
      'align-items: center !important;' +
      'justify-content: center !important;' +
      'appearance: none !important;' +
      'border: none !important;' +
      'border-radius: 999px !important;' +
      'padding: 11px 18px !important;' +
      'background: #e3185d !important;' +
      'color: #ffffff !important;' +
      'font-family: "proxima-nova", "Proxima Nova", Arial, Helvetica, sans-serif !important;' +
      'font-size: 13px !important;' +
      'font-weight: 700 !important;' +
      'line-height: 1 !important;' +
      'text-decoration: none !important;' +
      'white-space: nowrap !important;' +
      'box-shadow: none !important;' +
      'cursor: pointer !important;' +
    '}' +
    '#mini-basket-show .goto-chckout-btn a:hover,' +
    '#mini-basket-show .goto-chckout-btn a:focus {' +
      'background: #c41452 !important;' +
      'color: #ffffff !important;' +
      'text-decoration: none !important;' +
    '}' +
    '}'; /* end desktop media query */

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
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
        var m = totals.textContent.match(/(\d+)\s*item/i);
        if (m) n = m[1];
      }
    }
    if (!n) {
      var rows = document.querySelectorAll('#top-basket-content .row');
      n = String(rows.length);
    }
    return n + ' item(s)';
  }

  function ensureHeader(panel) {
    var head = panel.querySelector('.ce-mb-head');
    if (!head) {
      head = document.createElement('div');
      head.className = 'ce-mb-head';
      head.innerHTML =
        '<div class="ce-mb-head__title">Your Basket</div>' +
        '<div class="ce-mb-head__count"></div>';
      panel.insertBefore(head, panel.firstChild);
    }
    var countEl = head.querySelector('.ce-mb-head__count');
    if (countEl) countEl.textContent = itemCountLabel();
  }

  function ensureFooter(panel) {
    var total = panel.querySelector('#basket-drop-total');
    var btn = panel.querySelector('.goto-chckout-btn');
    if (!total || !btn) return;

    var foot = panel.querySelector('.ce-mb-foot');
    if (!foot) {
      foot = document.createElement('div');
      foot.className = 'ce-mb-foot';
      total.parentNode.insertBefore(foot, total);
      foot.appendChild(total);
      foot.appendChild(btn);
    } else {
      if (total.parentNode !== foot) foot.appendChild(total);
      if (btn.parentNode !== foot) foot.appendChild(btn);
    }

    var link = btn.querySelector('a');
    if (link) {
      var label = (link.textContent || '').replace(/\s*»\s*$/, '').trim();
      if (label !== 'View Basket') link.textContent = 'View Basket';
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
    var span = pno.querySelector('span');
    if (span) return span.textContent.replace(/\D/g, '').trim();
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
    var slug = slugify(titleText) || 'product';
    return '/item-p-' + num + '/' + slug;
  }

  function wrapWithLink(el, href, label) {
    if (!el || el.querySelector('a.ce-mb-link') || (el.tagName === 'A' && el.classList.contains('ce-mb-link'))) {
      return;
    }
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
    var titleText = titleEl ? titleEl.textContent.trim() : 'View product';
    var imgWrap = row.querySelector('.img');

    wrapWithLink(imgWrap, href, titleText);
    wrapWithLink(titleEl, href, titleText);
    row.setAttribute('data-ce-linked', '1');
  }

  function tidyRows(panel) {
    var rows = panel.querySelectorAll('#top-basket-content .row');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var pno = row.querySelector('.pno');
      if (pno && !pno.getAttribute('data-ce-tidy')) {
        var span = pno.querySelector('span');
        var num = span ? span.textContent.trim() : '';
        if (!num) {
          var raw = (pno.textContent || '').replace(/Product\s*(Number|No\.?)\s*:?/i, '').trim();
          num = raw.replace(/\D/g, '') || raw;
        }
        pno.textContent = '';
        pno.appendChild(document.createTextNode('Product No. ' + num));
        pno.setAttribute('data-ce-tidy', '1');
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
    if (!window.matchMedia(DESKTOP_MQ).matches) return;
    var panel = document.getElementById('mini-basket-show');
    if (!panel) return;
    ensureHeader(panel);
    ensureFooter(panel);
    tidyRows(panel);
  }

  injectStyles();
  enhance();

  // Basket content is often rebuilt on hover / ATC — re-apply lightly
  var scheduled = false;
  function scheduleEnhance() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(function () {
      scheduled = false;
      enhance();
    }, 50);
  }

  var root = document.getElementById('basketWrapper') || document.body;
  if (window.MutationObserver && root) {
    var obs = new MutationObserver(scheduleEnhance);
    obs.observe(root, { childList: true, subtree: true, characterData: true });
  }

  document.addEventListener('mouseover', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    if (t.closest('#basketWrapper') || t.closest('#top-basket') || t.closest('#mini-basket-show')) {
      scheduleEnhance();
    }
  }, true);
})();
