/**
 * Crazy Egg - PDP Hedging Calculator (YouGarden)
 *
 * Generic across all hedging PDPs. 3-step modal:
 *   1) Plant type  2) Pattern  3) Length
 *
 * Types match YG hedging range: Bare Root · Pot Grown · Instant
 *   lengthCm = length × { m:100, ft:30.48, y:91.44 }
 *   spacing: bare 20cm (5/m) · pot 25cm (4/m) · instant 100cm (1/m)
 *   basic:  ceil(lengthCm / spacing)
 *   offset: ceil((lengthCm / spacing) * 2) - 1
 *
 * Paste into Crazy Egg Variant → Custom JS
 * Pair with: crazyegg-pdp-hedging-calculator.css
 *
 * Example: https://www.yougarden.com/item-s-pa197/golden-privet-hedging
 */
(function () {
  'use strict';

  var ROOT = 'ce-yg-hedge-calc';
  var OPEN = 'ce-hc-open';
  var VER = '18';
  var INIT = 'data-ce-yg-hedge-calc';
  var STYLE_ID = 'ce-yg-hedge-calc-css';
  var TRIGGER_ID = 'ce-yg-hedge-calc';
  var MODAL_ID = 'ce-yg-hedge-modal';
  var BIND_KEY = '__ceYgHedgeCalcBound_v18';

  var TO_CM = { m: 100, ft: 30.48, y: 91.44 };
  /* Generic spacing defaults (YG blog ~5–7/m; pot slightly wider; instant = 1m units) */
  var TYPE = {
    bare: { id: 'bare', label: 'Bare Root', spacing: 20, perM: 5, noun: 'plant' },
    pot: { id: 'pot', label: 'Pot Grown', spacing: 25, perM: 4, noun: 'plant' },
    instant: { id: 'instant', label: 'Instant Hedging', spacing: 100, perM: 1, noun: 'metre unit' }
  };

  /* Simple shrub silhouette (original - not T&M asset) */
  function shrub(cx, cy, s) {
    s = s || 1;
    var w = 22 * s;
    var h = 24 * s;
    var x = cx - w / 2;
    var y = cy - h / 2;
    return (
      '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
        '<ellipse fill="#2f7a28" cx="11" cy="16" rx="10" ry="7"/>' +
        '<ellipse fill="#3d9432" cx="5" cy="12" rx="6" ry="6.5"/>' +
        '<ellipse fill="#3d9432" cx="17" cy="12" rx="6" ry="6.5"/>' +
        '<ellipse fill="#4aad3c" cx="11" cy="7" rx="7" ry="7"/>' +
        '<ellipse fill="#58bc48" cx="11" cy="5" rx="4.5" ry="4"/>' +
        '<rect fill="#5a3a1a" x="9.5" y="20" width="3" height="5" rx="1"/>' +
      '</g>'
    );
  }

  var SVG = {
    basic:
      '<svg viewBox="0 0 220 48" aria-hidden="true">' +
        shrub(22, 24, 1) + shrub(66, 24, 1) + shrub(110, 24, 1) + shrub(154, 24, 1) + shrub(198, 24, 1) +
      '</svg>',
    offset:
      '<svg viewBox="0 0 220 78" aria-hidden="true">' +
        shrub(40, 22, 0.95) + shrub(90, 22, 0.95) + shrub(140, 22, 0.95) + shrub(190, 22, 0.95) +
        shrub(22, 56, 0.95) + shrub(65, 56, 0.95) + shrub(110, 56, 0.95) + shrub(155, 56, 0.95) + shrub(198, 56, 0.95) +
      '</svg>',
    helpSingle:
      '<svg viewBox="0 0 280 56" aria-hidden="true" focusable="false">' +
        shrub(28, 28, 1.15) + shrub(84, 28, 1.15) + shrub(140, 28, 1.15) + shrub(196, 28, 1.15) + shrub(252, 28, 1.15) +
      '</svg>',
    helpDouble:
      '<svg viewBox="0 0 280 96" aria-hidden="true" focusable="false">' +
        shrub(48, 26, 1.05) + shrub(108, 26, 1.05) + shrub(168, 26, 1.05) + shrub(228, 26, 1.05) +
        shrub(28, 70, 1.05) + shrub(78, 70, 1.05) + shrub(140, 70, 1.05) + shrub(198, 70, 1.05) + shrub(252, 70, 1.05) +
      '</svg>',
    helpLength:
      '<svg viewBox="0 0 280 72" aria-hidden="true" focusable="false">' +
        '<line x1="24" y1="48" x2="256" y2="48" stroke="#264f1c" stroke-width="2"/>' +
        '<line x1="24" y1="40" x2="24" y2="56" stroke="#264f1c" stroke-width="2"/>' +
        '<line x1="256" y1="40" x2="256" y2="56" stroke="#264f1c" stroke-width="2"/>' +
        shrub(60, 28, 0.85) + shrub(110, 28, 0.85) + shrub(160, 28, 0.85) + shrub(210, 28, 0.85) +
        '<text x="140" y="68" text-anchor="middle" fill="#555" font-size="12" font-family="Arial,Helvetica,sans-serif">Measure the full run</text>' +
      '</svg>',
    typeBare:
      '<svg viewBox="0 0 64 64" aria-hidden="true">' +
        '<ellipse fill="#3d9432" cx="32" cy="18" rx="14" ry="12"/>' +
        '<ellipse fill="#4aad3c" cx="24" cy="14" rx="8" ry="8"/>' +
        '<ellipse fill="#4aad3c" cx="40" cy="14" rx="8" ry="8"/>' +
        '<rect fill="#5a3a1a" x="30" y="28" width="4" height="14" rx="1"/>' +
        '<path fill="none" stroke="#8b5a2b" stroke-width="2" stroke-linecap="round" d="M32 42c-8 4-14 10-16 16M32 42c8 4 14 10 16 16M32 44c-3 6-4 12-3 16M32 44c3 6 4 12 3 16"/>' +
      '</svg>',
    typePot:
      '<svg viewBox="0 0 64 64" aria-hidden="true">' +
        '<ellipse fill="#3d9432" cx="32" cy="16" rx="13" ry="11"/>' +
        '<ellipse fill="#4aad3c" cx="25" cy="12" rx="7" ry="7"/>' +
        '<ellipse fill="#4aad3c" cx="39" cy="12" rx="7" ry="7"/>' +
        '<rect fill="#5a3a1a" x="30" y="24" width="4" height="10" rx="1"/>' +
        '<path fill="#c45c26" d="M20 36h24l-3 18H23z"/>' +
        '<rect fill="#a84b1c" x="18" y="34" width="28" height="5" rx="1"/>' +
      '</svg>',
    typeInstant:
      '<svg viewBox="0 0 64 64" aria-hidden="true">' +
        '<rect fill="#6b4a2e" x="6" y="42" width="52" height="12" rx="2"/>' +
        '<rect fill="#8b6340" x="4" y="40" width="56" height="5" rx="1"/>' +
        shrub(18, 28, 0.7) + shrub(32, 26, 0.75) + shrub(46, 28, 0.7) +
      '</svg>'
  };

  var state = { last: null, picks: [], lastFocus: null, step: 1, type: 'pot' };

  function typeInfo(id) {
    return TYPE[id] || TYPE.pot;
  }

  function typeNoun(n, info) {
    var base = info.noun || 'plant';
    if (n === 1) return base;
    if (base === 'metre unit') return 'metre units';
    return base + 's';
  }

  if (!/\/item-[sp]-/i.test(window.location.pathname)) return;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function textOf(el) {
    return el && el.textContent ? el.textContent.replace(/\s+/g, ' ').trim() : '';
  }

  function pageText() {
    var bits = [textOf(qs('h1')), document.title || '', textOf(qs('.product-heading-wrapper'))];
    qsa('.breadcrumbs a, a[href*="hedging"]').forEach(function (a) {
      bits.push(textOf(a));
    });
    return bits.join(' ');
  }

  function isHedgingPdp() {
    return /hedg/i.test(pageText()) || !!qs('a[href*="/hedging"]');
  }

  function plantsNeeded(lengthValue, unit, pattern, typeId) {
    var info = typeInfo(typeId);
    var lengthCm = lengthValue * (TO_CM[unit] || 100);
    var sp = info.spacing;
    var plants = pattern === 'offset'
      ? Math.ceil((lengthCm / sp) * 2) - 1
      : Math.ceil(lengthCm / sp);
    return {
      plants: Math.max(1, plants),
      metres: lengthCm / 100,
      spacing: sp,
      perM: info.perM,
      lengthCm: lengthCm,
      type: info.id,
      typeLabel: info.label,
      noun: info.noun
    };
  }

  function parsePrice(str) {
    if (!str) return null;
    var m = String(str).replace(/,/g, '').match(/£\s*([\d]+(?:\.\d{1,2})?)/);
    return m ? parseFloat(m[1]) : null;
  }

  function parsePlantsInTitle(title) {
    if (!title) return 1;
    var multi = title.match(/(\d+)\s*[x×]/i);
    return multi ? Math.max(1, parseInt(multi[1], 10) || 1) : 1;
  }

  function styleCode() {
    var m = (window.location.pathname || '').match(/\/item-s-([^/]+)/i);
    if (m) return m[1].toUpperCase();
    var qty = qs('.qtyBlock input[id^="Qty-"]');
    if (qty && qty.id) return qty.id.replace(/^Qty-/i, '');
    return '';
  }

  function parseOptions() {
    var out = [];
    qsa('#style-options-drop-box .option-row, .style-options-drop-box .option-row').forEach(function (row) {
      var title = textOf(qs('.title', row)) || textOf(row);
      var oos = /\bout of stock\b/i.test(title) || (row.className || '').indexOf('discont') !== -1;
      var price = parsePrice(textOf(qs('.price', row))) || parsePrice(title);
      var stno = '';
      var idMatch = (row.id || '').match(/option-row-(.+)$/i);
      if (idMatch) stno = idMatch[1];
      var onclick = row.getAttribute('onclick') || '';
      var ajax = onclick.match(/doAjaxBuyS\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/);
      if (ajax) stno = ajax[1];
      out.push({
        el: row,
        title: title.replace(/\s*-\s*Out of Stock.*/i, '').trim(),
        plants: parsePlantsInTitle(title),
        price: price,
        oos: oos,
        stno: stno,
        style: ajax ? ajax[2] : styleCode()
      });
    });
    return out;
  }

  function setQty(n) {
    var input = qs('.qtyBlock input.updateQty-input, .qtyBlock input[name="Qty"], input[id^="Qty-"]');
    var tot = qs('.qtyBlock input[name="totQty"], input[id^="totQty-"]');
    var val = String(Math.max(1, n | 0));
    if (input) {
      input.value = val;
      try { input.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) { /* */ }
    }
    if (tot) tot.value = val;
  }

  function selectOption(rec) {
    if (!rec || !rec.option) return;
    var o = rec.option;
    if (o.stno && typeof window.doAjaxBuyS === 'function') {
      try { window.doAjaxBuyS(o.stno, o.style || styleCode()); } catch (e) { /* */ }
    } else if (o.el && !o.oos) {
      o.el.click();
    }
    window.setTimeout(function () { setQty(rec.packs); }, 250);
  }

  function clickAddToBasket() {
    var btn =
      qs('.buy-button') ||
      qs('.buttonAddWrapper button') ||
      qs('.atbWrapper button') ||
      qs('button[onclick*="Add"], input[value*="ADD TO BASKET"]');
    if (btn) {
      try { btn.click(); } catch (e) { /* */ }
    }
  }

  function track(name, detail) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: name, ce_hedge_calc: detail || {} });
    } catch (e) { /* */ }
  }

  function ensureCss() {
    var prev = document.getElementById(STYLE_ID);
    if (prev && prev.parentNode) prev.parentNode.removeChild(prev);
    var st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent =
      'html.ce-yg-hedge-calc{--ce-hc-forest:#264f1c;--ce-hc-atb:#468900;--ce-hc-soft:#f3f6f1;--ce-hc-ink:#222;--ce-hc-muted:#555;--ce-hc-line:#e2e6df;--ce-hc-line-strong:#c8d0c3;--ce-hc-rose:#e3185d;--ce-hc-body:Arial,Helvetica,sans-serif}' +
      'html.ce-yg-hedge-calc.ce-hc-open{overflow:hidden!important}' +
      '#ce-yg-hedge-calc,#ce-yg-hedge-modal,#ce-yg-hedge-calc *,#ce-yg-hedge-modal *{box-sizing:border-box}' +
      '#ce-yg-hedge-calc,#ce-yg-hedge-modal{float:none!important;clear:both!important}' +
      '#ce-yg-hedge-calc p,#ce-yg-hedge-calc div,#ce-yg-hedge-calc button,#ce-yg-hedge-calc span,#ce-yg-hedge-calc strong,#ce-yg-hedge-calc svg,#ce-yg-hedge-modal p,#ce-yg-hedge-modal h2,#ce-yg-hedge-modal h3,#ce-yg-hedge-modal h4,#ce-yg-hedge-modal ul,#ce-yg-hedge-modal li,#ce-yg-hedge-modal div,#ce-yg-hedge-modal button,#ce-yg-hedge-modal span,#ce-yg-hedge-modal strong,#ce-yg-hedge-modal svg,#ce-yg-hedge-modal table,#ce-yg-hedge-modal thead,#ce-yg-hedge-modal tbody,#ce-yg-hedge-modal tr,#ce-yg-hedge-modal th,#ce-yg-hedge-modal td{float:none!important}' +
      '#ce-yg-hedge-calc p,#ce-yg-hedge-modal p,#ce-yg-hedge-modal h2,#ce-yg-hedge-modal h3,#ce-yg-hedge-modal h4{width:auto!important;max-width:100%!important}' +
      '#ce-yg-hedge-modal .ce-hc__pane,#ce-yg-hedge-modal .ce-hc__types,#ce-yg-hedge-modal .ce-hc__patterns,#ce-yg-hedge-modal .ce-hc__length-fields,#ce-yg-hedge-modal .ce-hc__result,#ce-yg-hedge-modal .ce-hc__offers,#ce-yg-hedge-modal .ce-hc__offer,#ce-yg-hedge-modal .ce-hc__nav{float:none!important;clear:both!important;width:100%!important;max-width:100%!important}' +
      '#ce-yg-hedge-calc{display:block;width:100%;margin:16px 0 18px;background:transparent!important;font-family:var(--ce-hc-body);overflow:hidden}' +
      '#ce-yg-hedge-calc.is-applied .ce-hc__trigger{display:none!important}' +
      '.ce-hc__trigger{display:flex!important;align-items:center;gap:10px;width:100%;margin:0;padding:14px 16px;border:1px solid #c8d0c3!important;border-radius:8px;background:#fff!important;color:#264f1c!important;font:700 15px/1.35 var(--ce-hc-body);text-align:left;cursor:pointer}' +
      '.ce-hc__trigger:hover,.ce-hc__trigger:focus{border-color:#264f1c!important;box-shadow:0 0 0 1px #264f1c;outline:none}' +
      '.ce-hc__trigger-icon{flex:0 0 auto;display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:#f3f6f1;color:#264f1c}' +
      '.ce-hc__trigger-icon svg{width:18px;height:18px;display:block}' +
      '.ce-hc__trigger-copy{flex:1 1 auto;min-width:0}' +
      '.ce-hc__trigger-copy strong{display:block;font:700 15px/1.3 var(--ce-hc-body);color:#264f1c}' +
      '.ce-hc__trigger-copy span{display:block;margin-top:2px;font:400 13px/1.3 var(--ce-hc-body);color:#555}' +
      '.ce-hc__trigger-chevron{width:16px;height:16px;flex:0 0 auto}' +
      '.ce-hc__applied{display:none;margin:0;padding:18px 16px;border:1px solid #c8d0c3;border-radius:8px;background:#fff;text-align:center;overflow:hidden;clear:both!important;float:none!important;width:100%!important}' +
      '.ce-hc__applied.is-on{display:block}' +
      '.ce-hc__applied-label{display:block!important;margin:0 0 10px;font:700 12px/1.2 var(--ce-hc-body);letter-spacing:.05em;text-transform:uppercase;color:#264f1c;float:none!important;width:100%!important}' +
      '.ce-hc__applied-plants{display:block!important;margin:0 0 6px;font:700 28px/1.2 var(--ce-hc-body);color:#264f1c;float:none!important;width:100%!important;clear:both!important}' +
      '.ce-hc__applied-plants span{color:#e3185d}' +
      '.ce-hc__applied-meta{display:block!important;margin:0 0 14px;font:400 14px/1.4 var(--ce-hc-body);color:#555;float:none!important;width:100%!important;clear:both!important}' +
      '.ce-hc__applied-pack{display:block!important;margin:0 0 12px;padding:12px 0 0;border-top:1px solid #e2e6df;font:400 15px/1.4 var(--ce-hc-body);color:#222;float:none!important;width:100%!important;clear:both!important}' +
      '.ce-hc__applied-pack strong{color:#264f1c}' +
      '.ce-hc__applied-edit{display:inline-block;margin:0;padding:0;border:none;background:none;color:#e3185d;font:700 14px var(--ce-hc-body);text-decoration:underline;cursor:pointer}' +
      '#ce-yg-hedge-modal{position:fixed!important;inset:0!important;z-index:2147483646!important;display:none;align-items:center;justify-content:center;padding:24px;font-family:var(--ce-hc-body);color:#222}' +
      '#ce-yg-hedge-modal.is-open{display:flex!important}' +
      '.ce-hc__scrim{position:absolute;inset:0;background:rgba(18,24,16,.55);cursor:pointer}' +
      '.ce-hc__dialog{position:relative;z-index:1;display:flex;flex-direction:column;width:min(640px,100%);max-height:min(90vh,760px);min-height:0;background:#fff;border-radius:12px;box-shadow:0 18px 48px rgba(0,0,0,.28);overflow:hidden}' +
      '.ce-hc__dialog-head{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 24px 14px;border-bottom:1px solid #e2e6df}' +
      '.ce-hc__dialog-head h3{margin:0;font-size:22px;font-weight:700;line-height:1.2;color:#222}' +
      '.ce-hc__close{width:40px;height:40px;border:none;border-radius:8px;background:transparent;color:#555;font-size:28px;line-height:1;cursor:pointer}' +
      '.ce-hc__progress{display:flex;align-items:center;justify-content:center;gap:10px;padding:16px 24px 0}' +
      '.ce-hc__dot{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;border:2px solid #e2e6df;background:#fff;color:#555;font:700 14px var(--ce-hc-body)}' +
      '.ce-hc__dot.is-active{border-color:#264f1c;background:#264f1c;color:#fff}' +
      '.ce-hc__dot.is-done{border-color:#264f1c;color:#264f1c}' +
      '.ce-hc__dot-line{width:36px;height:2px;background:#e2e6df}.ce-hc__dot-line.is-done{background:#264f1c}' +
      '.ce-hc__dialog-body{flex:1 1 auto;min-height:0;overflow-x:hidden;overflow-y:auto;padding:20px 24px 12px}' +
      '.ce-hc__pane{display:none}.ce-hc__pane.is-on{display:block}' +
      '.ce-hc__step-title{margin:0 0 18px;font-size:18px;font-weight:700;color:#222}' +
      '.ce-hc__help-link{display:inline-block;margin:0 0 16px;padding:0;border:none;background:none;color:#e3185d;font:600 14px var(--ce-hc-body);text-decoration:underline;cursor:pointer}' +
      '.ce-hc__types{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:12px}' +
      '.ce-hc__type{display:flex!important;flex-direction:column;align-items:center;gap:10px;width:100%!important;margin:0;padding:14px 10px;border:2px solid #e2e6df!important;border-radius:10px;background:#fff!important;cursor:pointer;color:#222!important}' +
      '.ce-hc__type.is-active{border-color:#264f1c!important;background:#f3f6f1!important}' +
      '.ce-hc__type-icon{display:flex;align-items:center;justify-content:center;width:64px;height:64px}' +
      '.ce-hc__type-icon svg{width:64px;height:64px;display:block}' +
      '.ce-hc__type-copy{display:block;text-align:center}' +
      '.ce-hc__type-copy strong{display:block;font-size:14px;font-weight:700;color:#222}' +
      '.ce-hc__type-copy span{display:block;margin-top:4px;font-size:12px;line-height:1.3;color:#555}' +
      '.ce-hc__patterns{display:grid!important;grid-template-columns:1fr 1fr!important;gap:14px}' +
      '.ce-hc__pattern{display:flex!important;flex-direction:column;align-items:center;gap:12px;width:100%!important;margin:0;padding:16px 12px;border:2px solid #e2e6df!important;border-radius:10px;background:#fff!important;cursor:pointer;color:#222!important;position:relative!important}' +
      '.ce-hc__pattern.is-active{border-color:#264f1c!important;background:#f3f6f1!important}' +
      '.ce-hc__pattern-diagram{display:flex!important;align-items:center;justify-content:center;width:100%!important;height:72px!important}' +
      '.ce-hc__pattern-diagram.is-offset{height:88px!important}' +
      '.ce-hc__pattern-diagram svg{width:100%!important;height:100%!important;display:block!important}' +
      '.ce-hc__pattern-copy{display:block!important;text-align:center}' +
      '.ce-hc__pattern-copy strong{display:block!important;font-size:16px;font-weight:700;color:#222!important}' +
      '.ce-hc__length-fields{display:grid!important;grid-template-columns:minmax(0,1fr) 130px!important;gap:10px;margin:0;width:100%!important}' +
      '.ce-hc__input,.ce-hc__select{display:block!important;width:100%!important;height:52px;margin:0;padding:0 14px;border:1px solid #c8d0c3;border-radius:8px;background:#fff;color:#222;font:16px/1 var(--ce-hc-body)}' +
      '.ce-hc__select{padding-right:30px;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'8\' viewBox=\'0 0 12 8\'%3E%3Cpath fill=\'%23222\' d=\'M1 1l5 5 5-5\'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center}' +
      '.ce-hc__err{display:none;margin:12px 0 0;font-size:14px;font-weight:600;color:#e3185d}.ce-hc__err.is-on{display:block}' +
      '.ce-hc__result{display:none;clear:both!important}.ce-hc__result.is-on{display:block!important}' +
      '.ce-hc__result-main{display:block!important;margin:0 0 8px;font-size:28px;font-weight:700;line-height:1.2;color:#264f1c;float:none!important;width:100%!important;text-align:center}' +
      '.ce-hc__result-main span{color:#e3185d}' +
      '.ce-hc__result-meta{display:block!important;margin:0 0 20px;font-size:15px;line-height:1.45;color:#555;float:none!important;width:100%!important;text-align:center}' +
      '.ce-hc__offers{display:flex;flex-direction:column;gap:12px;margin:0;padding:0;list-style:none!important;float:none!important;width:100%!important;clear:both!important}' +
      '.ce-hc__offer{display:block!important;margin:0;padding:18px 16px;border:1px solid #e2e6df;border-radius:10px;background:#fff;float:none!important;width:100%!important;text-align:center}' +
      '.ce-hc__offer.is-best{border-color:#264f1c;background:#f7faf5}' +
      '.ce-hc__offer-title{display:block;margin:0 0 6px;font:700 16px/1.3 var(--ce-hc-body);color:#222}' +
      '.ce-hc__offer-meta{display:block;margin:0 0 12px;font:400 14px/1.4 var(--ce-hc-body);color:#555}' +
      '.ce-hc__best{display:inline-block;margin:0 0 10px;padding:3px 8px;border-radius:4px;background:#264f1c;color:#fff;font:700 11px/1 var(--ce-hc-body)}' +
      '.ce-hc__offer-row{display:flex;align-items:baseline;justify-content:center;gap:16px;margin:0 0 14px}' +
      '.ce-hc__offer-qty{font:700 15px/1.2 var(--ce-hc-body);color:#222}' +
      '.ce-hc__offer-total{font:700 18px/1.2 var(--ce-hc-body);color:#e3185d}' +
      '.ce-hc__atb{display:block;width:100%;margin:0;padding:14px 16px;border:none;border-radius:10px;background:#468900;color:#fff;font:700 15px/1.1 Arial,Helvetica,sans-serif;letter-spacing:.4px;cursor:pointer;text-align:center}' +
      '.ce-hc__atb:hover{background:#3d7a00}' +
      '.ce-hc__nav{flex:0 0 auto;display:flex;gap:12px;padding:14px 24px 20px;border-top:1px solid #e2e6df;background:#fff}' +
      '.ce-hc__nav-btn{flex:1 1 0;height:48px;margin:0;border-radius:8px;font:700 15px var(--ce-hc-body);cursor:pointer}' +
      '.ce-hc__nav-btn.is-back{border:1px solid #c8d0c3;background:#fff;color:#222}' +
      '.ce-hc__nav-btn.is-next,.ce-hc__nav-btn.is-calc{border:none;background:#264f1c;color:#fff}' +
      '.ce-hc__nav-btn[hidden]{display:none!important}' +
      '.ce-hc__info{display:none;padding-bottom:8px}.ce-hc__info.is-on{display:block!important}.ce-hc__form.is-hidden{display:none!important}' +
      '.ce-hc__info-pane{display:none}.ce-hc__info-pane.is-on{display:block!important}' +
      '.ce-hc__info h4{margin:0 0 20px;font-size:18px;font-weight:700;line-height:1.3;color:#222;text-align:center;float:none!important;width:auto!important}' +
      '.ce-hc__info-block{margin:0 0 22px;float:none!important;width:100%!important;clear:both!important}' +
      '.ce-hc__info-diagram{display:flex!important;align-items:center;justify-content:center;width:100%!important;min-height:64px;height:auto;margin:0 0 14px;overflow:visible;float:none!important}' +
      '.ce-hc__info-diagram.is-double{min-height:100px}' +
      '.ce-hc__info-diagram.is-length{min-height:80px}' +
      '.ce-hc__info-diagram.is-type{min-height:72px}' +
      '.ce-hc__info-diagram.is-type svg{width:72px!important;max-width:72px!important;height:72px!important}' +
      '.ce-hc__info-diagram svg{width:100%!important;max-width:320px!important;height:auto!important;min-height:48px;display:block!important;visibility:visible!important;opacity:1!important;overflow:visible}' +
      '.ce-hc__info p{margin:0 0 10px;font-size:14px;line-height:1.55;color:#555;text-align:left;float:none!important;width:auto!important}' +
      '.ce-hc__info p:last-child{margin-bottom:0}' +
      '.ce-hc__info p strong{color:#222;font-weight:700}' +
      '.ce-hc__info-back{display:inline-flex;align-items:center;justify-content:center;min-width:110px;height:44px;margin:8px 0 0;padding:0 22px;border:1px solid #333;border-radius:6px;background:#fff;color:#264f1c;font:700 15px var(--ce-hc-body);cursor:pointer}' +
      '.ce-hc__info-back:hover{background:#fafafa}' +
      '@media (max-width:599px){#ce-yg-hedge-modal{padding:0;align-items:flex-end}.ce-hc__dialog{width:100%;max-height:94vh;border-radius:14px 14px 0 0}.ce-hc__dialog-head,.ce-hc__dialog-body,.ce-hc__nav,.ce-hc__progress{padding-left:16px;padding-right:16px}.ce-hc__types{grid-template-columns:1fr!important}.ce-hc__type{flex-direction:row;justify-content:flex-start;text-align:left;gap:14px;padding:12px 14px}.ce-hc__type-copy{text-align:left}.ce-hc__length-fields{grid-template-columns:1fr 110px}.ce-hc__info h4{font-size:16px}.ce-hc__info-diagram{min-height:56px}.ce-hc__info-diagram.is-double{min-height:88px}.ce-hc__info-diagram.is-length{min-height:72px}.ce-hc__info-diagram svg{min-height:44px}}';
    document.head.appendChild(st);
  }

  function mountPoint() {
    /* Sit below PayPal so buy box stays clean */
    var pp = qs('.product-right-wrapper .pp-wrapper') || qs('.pp-wrapper');
    if (pp && pp.parentNode) return { parent: pp.parentNode, before: pp.nextSibling };
    var buy = qs('.product-right-wrapper .buy-wrapper') || qs('.buy-wrapper');
    if (buy && buy.parentNode) return { parent: buy.parentNode, before: buy.nextSibling };
    var price = qs('#main-from-price') || qs('.product-right-wrapper .price-wrapper');
    if (price && price.parentNode) return { parent: price.parentNode, before: price.nextSibling };
    return null;
  }

  function buildTrigger() {
    var wrap = document.createElement('div');
    wrap.id = TRIGGER_ID;
    wrap.setAttribute('data-ce-hc-ver', VER);
    wrap.innerHTML =
      '<button type="button" class="ce-hc__trigger" data-ce-hc="open" aria-haspopup="dialog" aria-controls="' + MODAL_ID + '">' +
        '<span class="ce-hc__trigger-icon" aria-hidden="true">' +
          '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/>' +
          '<path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
        '</span>' +
        '<span class="ce-hc__trigger-copy">' +
          '<strong>Hedging calculator</strong>' +
          '<span>Not sure how many plants you need?</span>' +
        '</span>' +
        '<svg class="ce-hc__trigger-chevron" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 1 0 1.41 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01z"/></svg>' +
      '</button>' +
      '<div class="ce-hc__applied" id="ce-hc-applied" aria-live="polite">' +
        '<div class="ce-hc__applied-label">Your estimate</div>' +
        '<div class="ce-hc__applied-plants" id="ce-hc-applied-plants"></div>' +
        '<div class="ce-hc__applied-meta" id="ce-hc-applied-meta"></div>' +
        '<div class="ce-hc__applied-pack" id="ce-hc-applied-pack"></div>' +
        '<button type="button" class="ce-hc__applied-edit" data-ce-hc="open">Recalculate</button>' +
      '</div>';
    return wrap;
  }

  function buildModal() {
    var el = document.createElement('div');
    el.id = MODAL_ID;
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', 'ce-hc-modal-title');
    el.setAttribute('data-pattern', 'basic');
    el.setAttribute('data-type', 'pot');
    el.setAttribute('data-step', '1');
    el.setAttribute('data-ce-hc-ver', VER);
    el.innerHTML =
      '<div class="ce-hc__scrim" data-ce-hc="close"></div>' +
      '<div class="ce-hc__dialog">' +
        '<div class="ce-hc__dialog-head">' +
          '<h3 id="ce-hc-modal-title">Hedging calculator</h3>' +
          '<button type="button" class="ce-hc__close" data-ce-hc="close" aria-label="Close">×</button>' +
        '</div>' +
        '<div class="ce-hc__progress" id="ce-hc-progress">' +
          '<span class="ce-hc__dot is-active" data-step-dot="1">1</span>' +
          '<span class="ce-hc__dot-line" data-step-line="1"></span>' +
          '<span class="ce-hc__dot" data-step-dot="2">2</span>' +
          '<span class="ce-hc__dot-line" data-step-line="2"></span>' +
          '<span class="ce-hc__dot" data-step-dot="3">3</span>' +
        '</div>' +
        '<div class="ce-hc__dialog-body">' +
          '<div class="ce-hc__form" id="ce-hc-form">' +
            '<div class="ce-hc__pane is-on" data-pane="1">' +
              '<p class="ce-hc__step-title">Plant type</p>' +
              '<button type="button" class="ce-hc__help-link" data-ce-hc="help" data-help="type">Need help choosing?</button>' +
              '<div class="ce-hc__types">' +
                '<button type="button" class="ce-hc__type" data-ce-hc="type" data-type="bare">' +
                  '<span class="ce-hc__type-icon" aria-hidden="true">' + SVG.typeBare + '</span>' +
                  '<span class="ce-hc__type-copy"><strong>Bare Root</strong><span>~5 per metre</span></span>' +
                '</button>' +
                '<button type="button" class="ce-hc__type is-active" data-ce-hc="type" data-type="pot">' +
                  '<span class="ce-hc__type-icon" aria-hidden="true">' + SVG.typePot + '</span>' +
                  '<span class="ce-hc__type-copy"><strong>Pot Grown</strong><span>~4 per metre</span></span>' +
                '</button>' +
                '<button type="button" class="ce-hc__type" data-ce-hc="type" data-type="instant">' +
                  '<span class="ce-hc__type-icon" aria-hidden="true">' + SVG.typeInstant + '</span>' +
                  '<span class="ce-hc__type-copy"><strong>Instant Hedging</strong><span>1 metre unit</span></span>' +
                '</button>' +
              '</div>' +
            '</div>' +
            '<div class="ce-hc__pane" data-pane="2">' +
              '<p class="ce-hc__step-title">Planting pattern</p>' +
              '<button type="button" class="ce-hc__help-link" data-ce-hc="help" data-help="pattern">Single vs double row?</button>' +
              '<div class="ce-hc__patterns">' +
                '<button type="button" class="ce-hc__pattern is-active" data-ce-hc="pattern" data-pattern="basic">' +
                  '<span class="ce-hc__pattern-diagram">' + SVG.basic + '</span>' +
                  '<span class="ce-hc__pattern-copy"><strong>Single row</strong></span>' +
                '</button>' +
                '<button type="button" class="ce-hc__pattern" data-ce-hc="pattern" data-pattern="offset">' +
                  '<span class="ce-hc__pattern-diagram is-offset">' + SVG.offset + '</span>' +
                  '<span class="ce-hc__pattern-copy"><strong>Double row</strong></span>' +
                '</button>' +
              '</div>' +
            '</div>' +
            '<div class="ce-hc__pane" data-pane="3">' +
              '<div class="ce-hc__length-block" id="ce-hc-length-block">' +
                '<p class="ce-hc__step-title">Hedge length</p>' +
                '<button type="button" class="ce-hc__help-link" data-ce-hc="help" data-help="length">How do I measure?</button>' +
                '<div class="ce-hc__length-fields">' +
                  '<input class="ce-hc__input" id="ce-hc-length" type="number" min="0.1" step="0.1" inputmode="decimal" placeholder="e.g. 10" aria-label="Hedge length">' +
                  '<select class="ce-hc__select" id="ce-hc-unit" aria-label="Length unit">' +
                    '<option value="m">Metres</option>' +
                    '<option value="ft">Feet</option>' +
                    '<option value="y">Yards</option>' +
                  '</select>' +
                '</div>' +
                '<p class="ce-hc__err" id="ce-hc-err" role="alert"></p>' +
              '</div>' +
              '<div class="ce-hc__result" id="ce-hc-result" aria-live="polite">' +
                '<p class="ce-hc__result-main" id="ce-hc-result-main"></p>' +
                '<p class="ce-hc__result-meta" id="ce-hc-result-meta"></p>' +
                '<ul class="ce-hc__offers" id="ce-hc-packs"></ul>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="ce-hc__info" id="ce-hc-info">' +
            '<div class="ce-hc__info-pane" data-help-pane="type">' +
              '<h4>Choosing a plant type</h4>' +
              '<div class="ce-hc__info-block">' +
                '<div class="ce-hc__info-diagram is-type" aria-hidden="true">' + SVG.typeBare + '</div>' +
                '<p><strong>Bare Root:</strong> Lifted dormant without soil. Best value for longer hedges, light to handle, plant Nov–Mar. Guide spacing about 5 plants per metre.</p>' +
              '</div>' +
              '<div class="ce-hc__info-block">' +
                '<div class="ce-hc__info-diagram is-type" aria-hidden="true">' + SVG.typePot + '</div>' +
                '<p><strong>Pot Grown:</strong> Container plants you can plant most of the year (avoid frozen or waterlogged ground). Guide spacing about 4 plants per metre.</p>' +
              '</div>' +
              '<div class="ce-hc__info-block">' +
                '<div class="ce-hc__info-diagram is-type" aria-hidden="true">' + SVG.typeInstant + '</div>' +
                '<p><strong>Instant Hedging:</strong> Ready-grown metre lengths for immediate screening. Count 1 metre unit per metre of hedge (double row uses two).</p>' +
              '</div>' +
              '<p>Availability varies by variety and season. Use this calculator on any hedging product page, then pick the pack that matches your type.</p>' +
            '</div>' +
            '<div class="ce-hc__info-pane" data-help-pane="pattern">' +
              '<h4>Single Row vs Double Row</h4>' +
              '<div class="ce-hc__info-block">' +
                '<div class="ce-hc__info-diagram" aria-hidden="true">' + SVG.helpSingle + '</div>' +
                '<p><strong>Single row:</strong> One straight line. Best for narrow borders and budgets. Uses fewer plants; fills in slower.</p>' +
              '</div>' +
              '<div class="ce-hc__info-block">' +
                '<div class="ce-hc__info-diagram is-double" aria-hidden="true">' + SVG.helpDouble + '</div>' +
                '<p><strong>Double row:</strong> Two staggered rows. Thicker hedge with better privacy. Needs more plants and a wider strip.</p>' +
              '</div>' +
            '</div>' +
            '<div class="ce-hc__info-pane" data-help-pane="length">' +
              '<h4>How to measure</h4>' +
              '<div class="ce-hc__info-block">' +
                '<div class="ce-hc__info-diagram is-length" aria-hidden="true">' + SVG.helpLength + '</div>' +
                '<p><strong>Measure end to end</strong> along the line you want to plant. Metres, feet or yards all work - a close estimate is enough.</p>' +
              '</div>' +
            '</div>' +
            '<button type="button" class="ce-hc__info-back" data-ce-hc="help-back">Back</button>' +
          '</div>' +
        '</div>' +
        '<div class="ce-hc__nav" id="ce-hc-nav">' +
          '<button type="button" class="ce-hc__nav-btn is-back" data-ce-hc="back" id="ce-hc-back" hidden>Back</button>' +
          '<button type="button" class="ce-hc__nav-btn is-next" data-ce-hc="next" id="ce-hc-next">Continue</button>' +
          '<button type="button" class="ce-hc__nav-btn is-calc" data-ce-hc="calc" id="ce-hc-calc" hidden>Calculate</button>' +
        '</div>' +
      '</div>';
    return el;
  }

  function modal() {
    return document.getElementById(MODAL_ID);
  }

  function setResultsMode(on) {
    var m = modal();
    if (!m) return;
    var block = qs('#ce-hc-length-block', m);
    var result = qs('#ce-hc-result', m);
    var calc = qs('#ce-hc-calc', m);
    if (block) block.style.display = on ? 'none' : '';
    if (result) {
      if (on) result.classList.add('is-on');
      else result.classList.remove('is-on');
    }
    if (calc) calc.hidden = on || state.step !== 3;
  }

  function setStep(n) {
    var m = modal();
    if (!m) return;
    n = Math.max(1, Math.min(3, n | 0));
    state.step = n;
    m.setAttribute('data-step', String(n));

    qsa('[data-pane]', m).forEach(function (pane) {
      if (pane.getAttribute('data-pane') === String(n)) pane.classList.add('is-on');
      else pane.classList.remove('is-on');
    });

    qsa('[data-step-dot]', m).forEach(function (dot) {
      var sn = parseInt(dot.getAttribute('data-step-dot'), 10);
      dot.classList.remove('is-active', 'is-done');
      if (sn === n) dot.classList.add('is-active');
      else if (sn < n) dot.classList.add('is-done');
    });

    qsa('[data-step-line]', m).forEach(function (line) {
      var sn = parseInt(line.getAttribute('data-step-line'), 10);
      if (sn < n) line.classList.add('is-done');
      else line.classList.remove('is-done');
    });

    var back = qs('#ce-hc-back', m);
    var next = qs('#ce-hc-next', m);
    var calc = qs('#ce-hc-calc', m);
    if (back) back.hidden = n === 1;
    if (next) next.hidden = n === 3;
    if (calc) calc.hidden = n !== 3;
    setResultsMode(false);

    if (n === 3) {
      window.setTimeout(function () {
        var input = qs('#ce-hc-length', m);
        if (input) try { input.focus(); } catch (e) { /* */ }
      }, 40);
    }

    try {
      var body = qs('.ce-hc__dialog-body', m);
      if (body) body.scrollTop = 0;
    } catch (e) { /* */ }
  }

  function setChoice(attr, value, sel, dataKey) {
    var m = modal();
    if (!m) return;
    m.setAttribute(attr, value);
    qsa(sel, m).forEach(function (btn) {
      if (btn.getAttribute(dataKey) === value) btn.classList.add('is-active');
      else btn.classList.remove('is-active');
    });
  }

  function openModal() {
    var m = modal();
    if (!m) {
      inject(true);
      m = modal();
    }
    if (!m) return;
    state.lastFocus = document.activeElement;
    state.last = null;
    state.picks = [];
    state.type = m.getAttribute('data-type') || 'pot';
    m.classList.add('is-open');
    m.style.display = 'flex';
    document.documentElement.classList.add(OPEN);
    showForm();
    setStep(1);
    showErr('');
    track('ce_yg_hedge_calc_open', { path: window.location.pathname });
  }

  function closeModal() {
    var m = modal();
    if (!m) return;
    m.classList.remove('is-open');
    m.style.display = 'none';
    document.documentElement.classList.remove(OPEN);
    if (state.lastFocus && typeof state.lastFocus.focus === 'function') {
      try { state.lastFocus.focus(); } catch (e) { /* */ }
    }
  }

  function showForm() {
    var m = modal();
    if (!m) return;
    var form = qs('#ce-hc-form', m);
    var info = qs('#ce-hc-info', m);
    var nav = qs('#ce-hc-nav', m);
    var progress = qs('#ce-hc-progress', m);
    if (form) form.classList.remove('is-hidden');
    if (info) info.classList.remove('is-on');
    if (nav) nav.style.display = '';
    if (progress) progress.style.display = '';
  }

  function showHelp(topic) {
    var m = modal();
    if (!m) return;
    var form = qs('#ce-hc-form', m);
    var info = qs('#ce-hc-info', m);
    var nav = qs('#ce-hc-nav', m);
    var progress = qs('#ce-hc-progress', m);
    var pane = topic || 'pattern';
    qsa('[data-help-pane]', m).forEach(function (el) {
      if (el.getAttribute('data-help-pane') === pane) el.classList.add('is-on');
      else el.classList.remove('is-on');
    });
    if (form) form.classList.add('is-hidden');
    if (info) info.classList.add('is-on');
    if (nav) nav.style.display = 'none';
    if (progress) progress.style.display = 'none';
    try {
      var body = qs('.ce-hc__dialog-body', m);
      if (body) body.scrollTop = 0;
    } catch (e) { /* */ }
  }

  function showErr(msg) {
    var m = modal();
    var err = m && qs('#ce-hc-err', m);
    if (!err) return;
    err.textContent = msg || '';
    if (msg) err.classList.add('is-on');
    else err.classList.remove('is-on');
  }

  function cleanTitle(title) {
    return String(title || '')
      .replace(/\s*-\s*SKU.*$/i, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function showApplied(result, pick, lengthValue, unit, pattern) {
    var wrap = qs('#' + TRIGGER_ID);
    var box = qs('#ce-hc-applied');
    var plantsEl = qs('#ce-hc-applied-plants');
    var metaEl = qs('#ce-hc-applied-meta');
    var packEl = qs('#ce-hc-applied-pack');
    if (!wrap || !box || !plantsEl || !metaEl || !packEl) return;

    var info = typeInfo(result.type);
    var lenLabel = unit === 'm' ? lengthValue + 'm' : lengthValue + ' ' + unit;
    plantsEl.innerHTML =
      '<span>' + result.plants + '</span> ' + typeNoun(result.plants, info);
    metaEl.textContent =
      info.label + ' · ' + lenLabel + ' · ' + (pattern === 'offset' ? 'Double row' : 'Single row');

    if (pick) {
      packEl.innerHTML =
        '<strong>' + pick.packs + '</strong> × ' +
        cleanTitle(pick.option.title) +
        ' · <strong>£' + pick.totalPrice.toFixed(2) + '</strong>';
    } else {
      packEl.textContent = 'Quantity set to ' + result.plants;
    }

    box.classList.add('is-on');
    wrap.classList.add('is-applied');
  }

  function runCalc() {
    var m = modal();
    if (!m) return;
    var lengthValue = parseFloat((qs('#ce-hc-length', m) || {}).value);
    var unit = (qs('#ce-hc-unit', m) || {}).value || 'm';
    var pattern = m.getAttribute('data-pattern') || 'basic';
    var typeId = m.getAttribute('data-type') || state.type || 'pot';

    showErr('');
    if (isNaN(lengthValue) || lengthValue <= 0) {
      showErr('Please enter a valid hedge length.');
      setResultsMode(false);
      return;
    }

    var result = plantsNeeded(lengthValue, unit, pattern, typeId);
    var info = typeInfo(typeId);
    var options = parseOptions();
    var picks = [];
    var stocked = options.filter(function (o) {
      return !o.oos && o.plants > 0 && o.price != null;
    });
    picks = stocked.map(function (o) {
      var packs = Math.max(1, Math.ceil(result.plants / o.plants));
      var totalPlants = packs * o.plants;
      return {
        option: o,
        packs: packs,
        totalPlants: totalPlants,
        totalPrice: +(packs * o.price).toFixed(2),
        waste: totalPlants - result.plants
      };
    }).sort(function (a, b) {
      if (a.totalPrice !== b.totalPrice) return a.totalPrice - b.totalPrice;
      return a.waste - b.waste;
    }).slice(0, 6);

    state.last = result;
    state.picks = picks;
    state.lastMeta = { lengthValue: lengthValue, unit: unit, pattern: pattern, type: typeId };

    var main = qs('#ce-hc-result-main', m);
    var meta = qs('#ce-hc-result-meta', m);
    var list = qs('#ce-hc-packs', m);

    main.innerHTML =
      'You need <span>' + result.plants + '</span> ' + typeNoun(result.plants, info);
    meta.textContent =
      info.label + ' · ' +
      (pattern === 'offset' ? 'Double row' : 'Single row') +
      ' · ~' + info.perM + ' per metre' +
      ' · ' + (unit === 'm' ? lengthValue + 'm' : lengthValue + ' ' + unit);

    list.innerHTML = '';
    if (!options.length) {
      var li0 = document.createElement('li');
      li0.className = 'ce-hc__offer is-best';
      li0.innerHTML =
        '<span class="ce-hc__offer-title">Use quantity ' + result.plants + '</span>' +
        '<span class="ce-hc__offer-meta">Applied to your current selection</span>' +
        '<button type="button" class="ce-hc__atb" data-ce-hc="apply" data-idx="0">ADD TO BASKET</button>';
      list.appendChild(li0);
    } else if (!picks.length) {
      var li1 = document.createElement('li');
      li1.className = 'ce-hc__offer';
      li1.innerHTML = '<span class="ce-hc__offer-title">No in-stock options available</span>';
      list.appendChild(li1);
    } else {
      picks.slice(0, 3).forEach(function (p, i) {
        var li = document.createElement('li');
        li.className = 'ce-hc__offer' + (i === 0 ? ' is-best' : '');
        li.innerHTML =
          (i === 0 ? '<span class="ce-hc__best">Best value</span>' : '') +
          '<span class="ce-hc__offer-title">' + cleanTitle(p.option.title) + '</span>' +
          '<span class="ce-hc__offer-meta">£' + p.option.price.toFixed(2) + ' each · covers ' +
            p.totalPlants + ' ' + typeNoun(p.totalPlants, info) + '</span>' +
          '<div class="ce-hc__offer-row">' +
            '<span class="ce-hc__offer-qty">Qty ' + p.packs + '</span>' +
            '<span class="ce-hc__offer-total">£' + p.totalPrice.toFixed(2) + '</span>' +
          '</div>' +
          '<button type="button" class="ce-hc__atb" data-ce-hc="apply" data-idx="' + i + '">ADD TO BASKET</button>';
        list.appendChild(li);
      });
    }

    setResultsMode(true);
    try {
      var body = qs('.ce-hc__dialog-body', m);
      if (body) body.scrollTop = 0;
    } catch (e) { /* */ }

    track('ce_yg_hedge_calc_result', {
      length: lengthValue,
      unit: unit,
      type: typeId,
      pattern: pattern,
      spacing: result.spacing,
      plants: result.plants,
      best_packs: picks[0] ? picks[0].packs : null
    });
  }

  function applyResult(idx) {
    if (!state.last) return;
    var i = idx == null ? 0 : parseInt(idx, 10);
    if (isNaN(i)) i = 0;
    var pick = state.picks && state.picks[i] ? state.picks[i] : null;
    var meta = state.lastMeta || {};

    if (pick) {
      selectOption(pick);
      track('ce_yg_hedge_calc_apply', {
        plants: state.last.plants,
        packs: pick.packs,
        title: pick.option.title
      });
    } else {
      setQty(state.last.plants);
      track('ce_yg_hedge_calc_apply', {
        plants: state.last.plants,
        packs: state.last.plants,
        title: 'qty-only'
      });
    }

    showApplied(
      state.last,
      pick,
      meta.lengthValue || 0,
      meta.unit || 'm',
      meta.pattern || 'basic'
    );

    closeModal();
    window.setTimeout(clickAddToBasket, 450);
  }

  function onDocClick(e) {
    var t = e.target;
    if (!t || !t.closest) return;

    var openBtn = t.closest('[data-ce-hc="open"], .ce-hc__trigger');
    if (openBtn && qs('#' + TRIGGER_ID) && qs('#' + TRIGGER_ID).contains(openBtn)) {
      e.preventDefault();
      e.stopPropagation();
      openModal();
      return;
    }

    var m = modal();
    if (!m || !m.classList.contains('is-open')) return;
    var actionEl = t.closest('[data-ce-hc]');
    if (!actionEl || !m.contains(actionEl)) return;

    var action = actionEl.getAttribute('data-ce-hc');
    e.preventDefault();

    if (action === 'close') closeModal();
    else if (action === 'help') showHelp(actionEl.getAttribute('data-help') || 'type');
    else if (action === 'help-back') showForm();
    else if (action === 'type') {
      var tid = actionEl.getAttribute('data-type') || 'pot';
      state.type = tid;
      setChoice('data-type', tid, '[data-ce-hc="type"]', 'data-type');
    }
    else if (action === 'pattern') setChoice('data-pattern', actionEl.getAttribute('data-pattern'), '[data-ce-hc="pattern"]', 'data-pattern');
    else if (action === 'next') setStep(state.step + 1);
    else if (action === 'back') {
      var resultOn = qs('#ce-hc-result', m);
      if (state.step === 3 && resultOn && resultOn.classList.contains('is-on')) {
        setResultsMode(false);
        return;
      }
      setStep(state.step - 1);
    }
    else if (action === 'calc') runCalc();
    else if (action === 'apply') applyResult(actionEl.getAttribute('data-idx'));
  }

  function onDocKey(e) {
    if (e.key === 'Escape') {
      var m = modal();
      if (m && m.classList.contains('is-open')) closeModal();
      return;
    }
    if (e.key === 'Enter' && e.target && e.target.id === 'ce-hc-length') {
      e.preventDefault();
      runCalc();
    }
  }

  function bindOnce() {
    if (window[BIND_KEY]) return;
    window[BIND_KEY] = true;
    document.addEventListener('click', onDocClick, true);
    document.addEventListener('keydown', onDocKey, true);
  }

  function inject(force) {
    if (!isHedgingPdp()) return;
    var existing = document.getElementById(TRIGGER_ID);
    if (existing && existing.getAttribute('data-ce-hc-ver') === VER && document.getElementById(MODAL_ID) && !force) {
      bindOnce();
      return;
    }
    var mount = mountPoint();
    if (!mount || !mount.parent) return;

    ensureCss();
    document.documentElement.classList.add(ROOT);

    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    var oldModal = document.getElementById(MODAL_ID);
    if (oldModal && oldModal.parentNode) oldModal.parentNode.removeChild(oldModal);
    var oldDrawer = document.getElementById('ce-yg-hedge-drawer');
    if (oldDrawer && oldDrawer.parentNode) oldDrawer.parentNode.removeChild(oldDrawer);

    var trigger = buildTrigger();
    var m = buildModal();
    if (mount.before) mount.parent.insertBefore(trigger, mount.before);
    else mount.parent.appendChild(trigger);
    document.body.appendChild(m);

    bindOnce();
    setStep(1);
    track('ce_yg_hedge_calc_view', { path: window.location.pathname });
  }

  document.documentElement.setAttribute(INIT, VER);
  ready(function () {
    inject(true);
    var tries = 0;
    var t = window.setInterval(function () {
      tries += 1;
      if (document.getElementById(TRIGGER_ID) || tries > 20) {
        window.clearInterval(t);
        return;
      }
      inject(true);
    }, 400);
  });
})();
