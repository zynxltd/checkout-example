/**
 * Basket Club Promo V4 — SELF-CONTAINED for Crazy Egg Edit Script
 * Paste this whole file into CE Edit Script. Leave Edit CSS empty.
 * CSS + PNG logos inlined — no Laravel/CDN host required.
 */
(function () {
  if (!/vieword\.csp/i.test(location.href || "")) return;

  /* Clear prior inject so CE re-paste / preview refresh works */
  document.documentElement.removeAttribute("data-ygbc4");
  var _old = document.getElementById("ygbc4-root");
  if (_old && _old.parentNode) _old.parentNode.removeChild(_old);
  var _side = document.getElementById("ygbc4-side");
  if (_side) {
    _side.removeAttribute("data-ygbc4-side");
    _side.removeAttribute("id");
  }
  var _css = document.getElementById("ygbc4-css-inline");
  if (_css && _css.parentNode) _css.parentNode.removeChild(_css);

  var ATTR = "data-ygbc4";
  if (!document.getElementById("ygbc4-css-inline")) {
    var s = document.createElement("style");
    s.id = "ygbc4-css-inline";
    s.textContent = '#ygbc4-root,#ygbc4-root *{box-sizing:border-box;}#ygbc4-root{--ygbc4-purple:#7b277b;--ygbc4-green:#c5e085;--ygbc4-gelica:"gelica",Georgia,"Times New Roman",serif;clear:both;position:relative;width:100%;margin:78px 0 18px;padding:0;overflow:visible !important;font-family:Arial,Helvetica,sans-serif;line-height:1.2;color:#fff;background:transparent;border:0;}html[data-ygbc4="1"] .viewordLeftWrapper,html[data-ygbc4="1"] .buttonPromoWrapper{overflow:visible !important;}#ygbc4-inner{display:grid;grid-template-columns:minmax(260px,31%) minmax(0,1fr);gap:6px;align-items:stretch;width:100%;overflow:visible;}#ygbc4-left{position:relative;display:flex;flex-direction:column;justify-content:flex-start;gap:0 !important;min-height:100%;padding:0 !important;margin:0 !important;background:var(--ygbc4-green) !important;border-radius:12px;overflow:visible;font-size:0;}#ygbc4-logo{position:absolute;left:-12px;top:-30px;width:70px;height:auto;z-index:3;display:block;pointer-events:none;border:0;image-rendering:auto;-ms-interpolation-mode:bicubic;}#ygbc4-copy{flex:1 1 auto;display:flex;flex-direction:column;justify-content:center;align-items:center;margin:0 !important;padding:42px 8px 14px;text-align:center !important;background:var(--ygbc4-purple) !important;border-radius:12px 12px 0 0;}#ygbc4-eyebrow{margin:0 !important;padding:0 !important;font-family:var(--ygbc4-gelica) !important;font-size:24px !important;font-weight:500 !important;line-height:1.1 !important;color:#ffffff !important;text-align:center !important;}#ygbc4-save{margin:2px 0 !important;padding:0 !important;font-family:var(--ygbc4-gelica) !important;font-size:40px !important;font-weight:700 !important;line-height:1 !important;color:#ffffff !important;text-align:center !important;letter-spacing:-0.03em;white-space:nowrap !important;}#ygbc4-sub{margin:0 !important;padding:0 !important;font-family:var(--ygbc4-gelica) !important;font-size:24px !important;font-weight:500 !important;line-height:1.1 !important;color:#ffffff !important;text-align:center !important;}#ygbc4-more,html[data-ygbc4="1"] a#ygbc4-more{display:block !important;flex:0 0 auto;width:100% !important;max-width:none !important;margin:-2px 0 0 !important;padding:14px 10px !important;border:0 !important;border-top:0 !important;border-radius:0 0 12px 12px !important;outline:0 !important;box-shadow:none !important;background:var(--ygbc4-green) !important;color:var(--ygbc4-purple) !important;font-family:var(--ygbc4-gelica) !important;font-size:17px !important;font-weight:700 !important;text-align:center !important;text-decoration:none !important;line-height:1.2 !important;position:relative;top:0 !important;z-index:1;}#ygbc4-more:hover,#ygbc4-more:focus,html[data-ygbc4="1"] a#ygbc4-more:hover,html[data-ygbc4="1"] a#ygbc4-more:focus{filter:brightness(0.97);color:var(--ygbc4-purple) !important;text-decoration:none !important;}#ygbc4-right{display:flex;flex-direction:column;justify-content:center;gap:16px;min-width:0;padding:18px 20px;background:var(--ygbc4-purple) !important;border-radius:12px;border:0 !important;outline:0 !important;box-shadow:none !important;}#ygbc4-benefits{margin:0 !important;padding:0 4px !important;font-family:var(--ygbc4-gelica) !important;font-size:20px !important;font-weight:500 !important;line-height:1.3 !important;color:#ffffff !important;text-align:center !important;}#ygbc4-actions{display:flex;flex-direction:column;gap:10px;}.ygbc4-pill{position:relative;display:flex !important;flex-direction:row;align-items:center;justify-content:center;gap:8px;width:100%;margin:0 !important;padding:9px 48px 9px 16px !important;border:0 !important;border-radius:999px;background:#ffffff !important;color:var(--ygbc4-purple) !important;cursor:pointer;text-align:center !important;}.ygbc4-pill:hover,.ygbc4-pill:focus{filter:brightness(0.98);}.ygbc4-pill-text{flex:0 1 auto;min-width:0;font-family:var(--ygbc4-gelica) !important;font-size:19px !important;font-weight:500 !important;line-height:1.2 !important;color:var(--ygbc4-purple) !important;text-align:center !important;}.ygbc4-pill-text strong{font-family:var(--ygbc4-gelica) !important;font-weight:700 !important;font-size:1.2em !important;color:var(--ygbc4-purple) !important;}.ygbc4-was{text-decoration:line-through;font-weight:500;}.ygbc4-plus{position:absolute;right:6px;top:50%;margin-top:-17px;flex:0 0 auto;width:34px;height:34px;display:block;}html[data-ygbc4="1"]{--ygbc4-purple:#7b277b;--ygbc4-green:#c5e085;}html[data-ygbc4="1"] .viewordRightWrapper,html[data-ygbc4="1"] .viewordRightWrapper .clubSavingWrapper,html[data-ygbc4="1"] #ygbc4-side{overflow:visible !important;}#ygbc4-side,html[data-ygbc4="1"] .clubSavingWrapper{position:relative;display:block !important;width:100% !important;max-width:none !important;box-sizing:border-box !important;padding:0 !important;margin:14px 0 10px !important;background:transparent !important;border:0 !important;overflow:visible !important;float:none !important;clear:both !important;}#ygbc4-side-link{--ygbc4-side-bar-h:34px;position:relative;display:flex !important;flex-direction:row !important;flex-wrap:nowrap !important;align-items:flex-end !important;justify-content:flex-start !important;gap:0 !important;width:100% !important;min-height:calc(var(--ygbc4-side-bar-h) + 12px) !important;padding:12px 0 0 !important;text-decoration:none !important;overflow:visible !important;line-height:1 !important;background:transparent !important;box-sizing:border-box !important;}#ygbc4-side-link::before{content:"";position:absolute;left:38%;right:0;bottom:0;top:auto;height:var(--ygbc4-side-bar-h);margin:0;background:#7b277b !important;border-radius:0;z-index:0;pointer-events:none;}#ygbc4-side-logo{position:relative;z-index:2;flex:0 0 auto !important;width:auto !important;max-width:58% !important;height:42px !important;max-height:42px !important;margin:0 !important;padding:0 !important;display:block !important;visibility:visible !important;border:0 !important;background:transparent !important;border-radius:0 !important;box-shadow:none !important;object-fit:contain;object-position:left bottom;}#ygbc4-side-save{position:relative;z-index:1;flex:1 1 0% !important;align-self:flex-end !important;display:flex !important;align-items:center !important;justify-content:center !important;visibility:visible !important;opacity:1 !important;min-width:0 !important;height:var(--ygbc4-side-bar-h) !important;min-height:var(--ygbc4-side-bar-h) !important;margin:0 !important;padding:0 10px 0 6px !important;background:transparent !important;color:#ffffff !important;font-family:Arial,Helvetica,sans-serif !important;font-size:15px !important;font-weight:800 !important;letter-spacing:0.02em;text-align:center !important;text-transform:none !important;white-space:nowrap !important;line-height:1 !important;}@media (max-width:1024px) and (min-width:701px){#ygbc4-side-link{--ygbc4-side-bar-h:32px;padding-top:10px;}#ygbc4-side-link::before{left:40%;}#ygbc4-side-logo{height:38px !important;max-height:38px !important;max-width:55% !important;}#ygbc4-side-save{font-size:14px !important;}}@media (max-width:700px){#ygbc4-root{margin-top:64px;}#ygbc4-inner{grid-template-columns:1fr;gap:6px;}#ygbc4-logo{left:-8px;top:-24px;width:58px;}#ygbc4-copy{padding-top:38px;}#ygbc4-eyebrow,#ygbc4-sub{font-size:20px !important;}#ygbc4-save{font-size:32px !important;}#ygbc4-benefits{font-size:16px !important;}.ygbc4-pill-text{font-size:16px !important;}#ygbc4-side,html[data-ygbc4="1"] .clubSavingWrapper{margin:10px 0 8px !important;}#ygbc4-side-link{--ygbc4-side-bar-h:30px;min-height:calc(var(--ygbc4-side-bar-h) + 10px);padding-top:10px;}#ygbc4-side-link::before{left:42%;}#ygbc4-side-logo{height:36px !important;max-height:36px !important;max-width:52% !important;}#ygbc4-side-save{font-size:13px !important;padding:0 8px 0 4px !important;}}';
    document.head.appendChild(s);
  }
  var LOGO_C = "data:image/png;base64,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";
  var LOGO_SIDE = "data:image/png;base64,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";

  var INFO_URL = "/item-p-820001/yg-discount-club-1-year-membership";
  var ST_AUTO = "ST007814";
  var ST_ONE = "ST003182";
  var tries = 0;
  var MAX = 40;

  var PLUS_SVG =
    '<svg class="ygbc4-plus" viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">' +
    '<circle cx="18" cy="18" r="18" fill="#c5e085"/>' +
    '<path d="M18 10v16M10 18h16" stroke="#802d7d" stroke-width="3.2" stroke-linecap="round"/>' +
    "</svg>";

  function loadGelica() {
    if (document.querySelector('link[data-ygbc4-gelica]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://use.typekit.net/hrf1tkz.css";
    link.setAttribute("data-ygbc4-gelica", "1");
    document.head.appendChild(link);
  }

  function text(el) {
    return ((el && el.textContent) || "").replace(/\s+/g, " ").trim();
  }

  /** Live club saving from basket summary (.clubSaving) — never hardcode. */
  function getSaving(wrap) {
    wrap = wrap || document.querySelector(".viewordRightWrapper .clubSavingWrapper") || document.querySelector(".clubSavingWrapper");
    if (!wrap) return "£9.00";

    var candidates = [
      wrap.querySelector(".clubSaving"),
      wrap.querySelector("[class*='clubSaving']"),
      wrap.querySelector("a"),
      wrap
    ];
    var i, raw, m;
    for (i = 0; i < candidates.length; i++) {
      raw = text(candidates[i]);
      if (!raw) continue;
      m = raw.match(/£\s*([\d,]+(?:\.\d{1,2})?)/);
      if (m) return "£" + m[1].replace(/,/g, "");
    }
    return "£9.00";
  }

  function getToken() {
    var nodes = document.querySelectorAll("[onclick*='doAjaxBag']");
    for (var i = 0; i < nodes.length; i++) {
      var oc = nodes[i].getAttribute("onclick") || "";
      var m = oc.match(/doAjaxBag\(\s*['\"]([^'\"]+)['\"]/);
      if (m && m[1]) return m[1];
    }
    return "";
  }

  function clubAlreadyInBasket() {
    var table = document.querySelector("table.mainTable");
    if (!table) return false;
    return /ST007814|ST003182|ST0007014|ST0003182|Discount Club|Auto Renew|820001|820005/i.test(
      table.innerText || ""
    );
  }

  function mountPoint() {
    return (
      document.querySelector(".viewordLeftWrapper .buttonPromoWrapper") ||
      document.querySelector(".buttonPromoWrapper") ||
      document.querySelector(".viewordLeftWrapper table.mainTable") ||
      document.querySelector("table.mainTable")
    );
  }

  function addClub(stno) {
    var token = getToken();
    if (!token || typeof window.doAjaxBag !== "function") {
      location.href = INFO_URL;
      return;
    }
    window.doAjaxBag(token, stno, 1, "", "vieword");
  }

  function insertAfter(anchor, node) {
    if (anchor.nextSibling) anchor.parentNode.insertBefore(node, anchor.nextSibling);
    else anchor.parentNode.appendChild(node);
  }

  function buildPromo(saving) {
    var root = document.createElement("div");
    root.id = "ygbc4-root";
    root.innerHTML =
      '<div id="ygbc4-inner">' +
      '<div id="ygbc4-left">' +
      '<img id="ygbc4-logo" src="' + LOGO_C + '" alt="YouGarden Discount Club" width="56" height="50">' +
      '<div id="ygbc4-copy">' +
      '<p id="ygbc4-eyebrow">Join our club &amp;</p>' +
      '<p id="ygbc4-save">Save ' + saving + "</p>" +
      '<p id="ygbc4-sub">on this order</p>' +
      "</div>" +
      '<a id="ygbc4-more" href="' + INFO_URL + '">More Info Here</a>' +
      "</div>" +
      '<div id="ygbc4-right">' +
      '<p id="ygbc4-benefits">Sign Up Today for 15% Off All Plants &amp; Accessories,<br>£20 in Product Vouchers, Free P&amp;P Vouchers &amp; More!</p>' +
      '<div id="ygbc4-actions">' +
      '<button type="button" class="ygbc4-pill" data-stno="' + ST_AUTO + '">' +
      '<span class="ygbc4-pill-text">Auto Renewal <strong>Now £10</strong> Per Year <span class="ygbc4-was">Was £20</span></span>' +
      PLUS_SVG +
      "</button>" +
      '<button type="button" class="ygbc4-pill" data-stno="' + ST_ONE + '">' +
      '<span class="ygbc4-pill-text">12 Month Membership <strong>£20</strong> (No Auto Renewal)</span>' +
      PLUS_SVG +
      "</button>" +
      "</div></div></div>";

    Array.prototype.forEach.call(root.querySelectorAll(".ygbc4-pill"), function (btn) {
      btn.addEventListener("click", function () {
        addClub(btn.getAttribute("data-stno") || ST_AUTO);
      });
    });
    return root;
  }

  function findClubWrap() {
    return (
      document.querySelector(".viewordRightWrapper .clubSavingWrapper") ||
      document.querySelector(".clubSavingWrapper") ||
      (function () {
        var right = document.querySelector(".viewordRightWrapper");
        if (!right) return null;
        var link =
          right.querySelector("a[href*='discount-club']") ||
          right.querySelector("a[href*='820001']") ||
          right.querySelector("a[href*='820005']");
        return link ? link.closest("div") || link.parentElement : null;
      })()
    );
  }

  function restyleSidebar(wrap) {
    wrap = wrap || findClubWrap();
    if (!wrap) return false;

    /* Rebuild unless already on current layout (transparent row + purple save only) */
    if (
      wrap.getAttribute("data-ygbc4-side") === "6" &&
      wrap.querySelector("#ygbc4-side-save") &&
      wrap.querySelector("#ygbc4-side-logo")
    ) {
      wrap.id = "ygbc4-side";
      return true;
    }

    wrap.setAttribute("data-ygbc4-side", "6");
    wrap.id = "ygbc4-side";
    wrap.setAttribute(
      "style",
      "display:block!important;width:100%!important;max-width:none!important;box-sizing:border-box!important;padding:0!important;margin:14px 0 10px!important;background:transparent!important;border:0!important;overflow:visible!important;float:none!important;clear:both!important;"
    );
    wrap.innerHTML =
      '<a id="ygbc4-side-link" href="' +
      INFO_URL +
      '" aria-label="Save more with the YouGarden Discount Club">' +
      '<img id="ygbc4-side-logo" src="' +
      LOGO_SIDE +
      '" alt="" width="150" height="42">' +
      '<span id="ygbc4-side-save">Save MORE!</span>' +
      "</a>";
flex-direction:row!important;flex-wrap:nowrap!important;align-items:center!important;width:100%!important;min-height:42px!important;box-sizing:border-box!important;text-decoration:none!important;background:transparent!important;overflow:visible!important;">' +
      '<img id="ygbc4-side-logo" src="' +
      LOGO_SIDE +
      '" alt="" width="150" height="42" style="position:relative!important;z-index:2!important;display:block!important;flex:0 0 auto!important;width:auto!important;max-width:58%!important;height:42px!important;margin:0 -22px 0 0!important;padding:0!important;border:0!important;background:transparent!important;">' +
      '<span id="ygbc4-side-save" style="position:relative!important;z-index:1!important;display:flex!important;flex:1 1 auto!important;align-items:center!important;justify-content:center!important;min-height:34px!important;padding:0 12px 0 28px!important;margin:0!important;background:#7b277b!important;color:#ffffff!important;font:800 16px/1.2 Arial,Helvetica,sans-serif!important;letter-spacing:0.02em!important;white-space:nowrap!important;visibility:visible!important;opacity:1!important;">Save MORE!</span>' +
      "</a>";
    return true;
  }

  function ensureSidebar() {
    var wrap = findClubWrap();
    if (!wrap) return;
    if (wrap.getAttribute("data-ygbc4-side") !== "6" || !wrap.querySelector("#ygbc4-side-save")) {
      restyleSidebar(wrap);
    }
  }

  function go() {
    var club = findClubWrap();
    var anchor = mountPoint();

    if (!club) {
      if (++tries < MAX) setTimeout(go, 250);
      return;
    }

    /* Capture live saving BEFORE wiping .clubSaving in restyleSidebar */
    var saving = getSaving(club);

    if (clubAlreadyInBasket()) {
      restyleSidebar(club);
      document.documentElement.setAttribute(ATTR, "1");
      return;
    }

    if (!anchor) {
      if (++tries < MAX) setTimeout(go, 250);
      return;
    }

    if (!document.getElementById("ygbc4-root")) {
      loadGelica();
      insertAfter(anchor, buildPromo(saving));
    }

    restyleSidebar(club);
    document.documentElement.setAttribute(ATTR, "1");

    /* YG may re-render the summary — keep Save MORE in place */
    ensureSidebar();
    setTimeout(ensureSidebar, 500);
    setTimeout(ensureSidebar, 1500);
    setTimeout(ensureSidebar, 3000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
  else go();
})();
