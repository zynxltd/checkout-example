/**
 * V5 Club Mobile v2 — V4-style mobile design (≤640)
 * Pair: v5-club-mob.css · ce-boot-v5-club-mob.js
 */
(function () {
  if (!/vieword\.csp/i.test(location.href || "")) return;
  if (window.matchMedia && !window.matchMedia("(max-width: 640px)").matches) return;
  if (document.documentElement.getAttribute("data-ygbc5") === "1" && document.getElementById("ygbc5-side-save")) return;

  var ATTR = "data-ygbc5";
  var BASE = "https://yg-cart-drawer-demo.test/ce/basket-club";
  var LOGO = BASE + "/assets/yg-club-badge-mob-v2.png";
  var LOGO_SIDE = BASE + "/assets/yg-club-logo-v3-side.png";
  var INFO_URL = "/item-p-820001/yg-discount-club-1-year-membership";
  var ST_AUTO = "ST007814";
  var ST_ONE = "ST003182";
  var tries = 0;
  var MAX = 40;

  /* Green circle + purple basket with + */
  var PLUS_SVG =
    '<svg class="ygbc5-plus" viewBox="0 0 36 36" width="32" height="32" aria-hidden="true">' +
    '<circle cx="18" cy="18" r="18" fill="#c5e085" style="fill:#c5e085"/>' +
    '<path style="fill:#7b277b" d="M10.2 14.2h15.6l-1.15 11.1c-.12 1.15-1.1 2-2.25 2H13.6c-1.15 0-2.13-.85-2.25-2L10.2 14.2z"/>' +
    '<path d="M13.2 14.2c0-3.2 2.15-5.2 4.8-5.2s4.8 2 4.8 5.2" fill="none" stroke="#7b277b" stroke-width="2.4" stroke-linecap="round" style="stroke:#7b277b"/>' +
    '<path style="fill:#c5e085" d="M17.05 17.6h1.9v7.2h-1.9z"/>' +
    '<path style="fill:#c5e085" d="M14.4 20.25h7.2v1.9h-7.2z"/>' +
    "</svg>";

  function loadGelica() {
    if (document.querySelector('link[data-ygbc5-gelica]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://use.typekit.net/hrf1tkz.css";
    link.setAttribute("data-ygbc5-gelica", "1");
    document.head.appendChild(link);
  }

  function text(el) {
    return ((el && el.textContent) || "").replace(/\s+/g, " ").trim();
  }

  /** Live club saving from basket summary — never hardcode the amount. */
  function getSaving(wrap) {
    wrap = wrap || document.querySelector(".viewordRightWrapper .clubSavingWrapper") || document.querySelector(".clubSavingWrapper");
    if (!wrap) return "£9.00";
    var nodes = [wrap.querySelector(".clubSaving"), wrap.querySelector("a"), wrap];
    var i, raw, m, best = null, bestVal = -1, val;
    for (i = 0; i < nodes.length; i++) {
      raw = text(nodes[i]);
      if (!raw) continue;
      var re = /£\s*([\d,]+(?:\.\d{1,2})?)/g;
      while ((m = re.exec(raw))) {
        val = parseFloat(m[1].replace(/,/g, ""));
        if (!isNaN(val) && val > bestVal) {
          bestVal = val;
          best = "£" + m[1].replace(/,/g, "");
        }
      }
    }
    return best || "£9.00";
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
    return /ST007814|ST003182|ST0007014|ST0003182|Discount Club|Auto Renew|820001|820005/i.test(table.innerText || "");
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
    root.id = "ygbc5-root";
    root.innerHTML =
      '<div id="ygbc5-card">' +
      '<div id="ygbc5-panel">' +
      '<div id="ygbc5-head">' +
      '<img id="ygbc5-logo" src="' + LOGO + '" alt="YouGarden Discount Club" width="151" height="42">' +
      '<p id="ygbc5-title">' +
      '<span id="ygbc5-title-line1">Join the Club &amp; Save</span>' +
      '<span id="ygbc5-title-line2"><span id="ygbc5-save">' + saving + "</span> on this order</span>" +
      "</p>" +
      "</div>" +
      '<p id="ygbc5-benefits">Sign Up Today for 15% Off All Plants &amp; Accessories, £20 in Product Vouchers, Free P&amp;P Vouchers &amp; More!</p>' +
      '<div id="ygbc5-actions">' +
      '<button type="button" class="ygbc5-pill" data-stno="' + ST_AUTO + '">' +
      '<span class="ygbc5-pill-text">Auto Renewal <strong>Now £10</strong> Per Year <span class="ygbc5-was">Was £20</span></span>' +
      PLUS_SVG +
      "</button>" +
      '<button type="button" class="ygbc5-pill" data-stno="' + ST_ONE + '">' +
      '<span class="ygbc5-pill-text">12 Month Membership <strong>£20</strong> (No Auto Renewal)</span>' +
      PLUS_SVG +
      "</button>" +
      "</div></div>" +
      '<a id="ygbc5-more" href="' + INFO_URL + '">Find Out More</a>' +
      "</div>";

    Array.prototype.forEach.call(root.querySelectorAll(".ygbc5-pill"), function (btn) {
      btn.addEventListener("click", function () {
        addClub(btn.getAttribute("data-stno") || ST_AUTO);
      });
    });
    return root;
  }

  function findClubWrap() {
    return (
      document.querySelector(".viewordRightWrapper .clubSavingWrapper") ||
      document.querySelector(".clubSavingWrapper")
    );
  }

  function sidebarWidthPx(wrap) {
    var right = document.querySelector(".viewordRightWrapper");
    var ref =
      (right && (right.querySelector("table") || right.querySelector(".orderTotalWrapper") || right.firstElementChild)) ||
      (wrap && wrap.parentElement) ||
      right;
    var w = ref && ref.clientWidth ? ref.clientWidth : 0;
    if (!w && right) w = right.clientWidth;
    return w > 0 ? w : 0;
  }

  function restyleSidebar(wrap) {
    wrap = wrap || findClubWrap();
    if (!wrap) return false;
    if (
      wrap.getAttribute("data-ygbc5-side") === "2" &&
      wrap.querySelector("#ygbc5-side-save") &&
      wrap.querySelector("#ygbc5-side-logo")
    ) {
      wrap.id = "ygbc5-side";
      var existingW = sidebarWidthPx(wrap);
      if (existingW) {
        wrap.style.setProperty("width", existingW + "px", "important");
        wrap.style.setProperty("max-width", "none", "important");
      }
      return true;
    }
    wrap.setAttribute("data-ygbc5-side", "2");
    wrap.id = "ygbc5-side";
    var fullW = sidebarWidthPx(wrap);
    var widthRule = fullW
      ? "width:" + fullW + "px!important;min-width:" + fullW + "px!important;max-width:none!important;"
      : "width:100%!important;min-width:100%!important;max-width:none!important;";
    wrap.setAttribute(
      "style",
      "display:block!important;" +
        widthRule +
        "box-sizing:border-box!important;padding:0!important;margin:8px 0 10px!important;background:transparent!important;border:0!important;overflow:visible!important;float:none!important;clear:both!important;"
    );
    wrap.innerHTML =
      '<a id="ygbc5-side-link" href="' +
      INFO_URL +
      '" aria-label="Save more with the YouGarden Discount Club" style="position:relative!important;display:flex!important;align-items:center!important;width:100%!important;min-height:40px!important;text-decoration:none!important;background:#7b277b!important;">' +
      '<img id="ygbc5-side-logo" src="' +
      LOGO_SIDE +
      '" alt="" width="150" height="42" style="position:relative!important;z-index:2!important;display:block!important;flex:0 0 auto!important;max-width:55%!important;height:42px!important;margin:-4px 0!important;border:0!important;object-fit:contain!important;">' +
      '<span id="ygbc5-side-save" style="position:relative!important;z-index:1!important;display:flex!important;flex:1 1 auto!important;align-items:center!important;justify-content:center!important;min-height:36px!important;padding:0 12px!important;background:transparent!important;color:#fff!important;font:800 16px/1 Arial,Helvetica,sans-serif!important;white-space:nowrap!important;">Save MORE!</span>' +
      "</a>";
    return true;
  }

  function ensureSidebar() {
    var wrap = findClubWrap();
    if (!wrap) return;
    if (wrap.getAttribute("data-ygbc5-side") !== "2" || !wrap.querySelector("#ygbc5-side-save")) {
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
    var saving = getSaving(club);
    if (clubAlreadyInBasket()) {
      restyleSidebar(club);
      document.documentElement.setAttribute(ATTR, "1");
      ensureSidebar();
      setTimeout(ensureSidebar, 500);
      return;
    }
    if (!anchor) {
      if (++tries < MAX) setTimeout(go, 250);
      return;
    }
    if (!document.getElementById("ygbc5-root")) {
      loadGelica();
      insertAfter(anchor, buildPromo(saving));
    }
    restyleSidebar(club);
    document.documentElement.setAttribute(ATTR, "1");
    ensureSidebar();
    setTimeout(ensureSidebar, 500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
  else go();
})();
