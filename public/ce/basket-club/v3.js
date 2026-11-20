/**
 * Crazy Egg — Basket Club V3 (all devices) — Variant 1
 *
 * Paste into Crazy Egg Variant → Edit Script
 * Pair with: v3.css → Edit CSS
 *
 *   ≤640  — logo + overlapping purple banner → radios + ATC
 *   641+  — logo/banner + 1×3 (tablet styles in CSS)
 * SPF is a separate test: v5-spf.css + v5-spf.js
 *
 * Images still load from BASE (Herd/CDN).
 */
(function () {
  if (!/vieword\.csp/i.test(location.href || "")) return;

  var ATTR = "data-ygbc3";
  var LAYOUT = "data-ygbc3-layout";
  var BASE = "https://yg-cart-drawer-demo.test/ce/basket-club";
  var LOGO = BASE + "/assets/yg-club-logo-v3.png";
  var LOGO_SIDE = BASE + "/assets/yg-club-logo-v3-side.png";
  var INFO_URL = "/item-p-820001/yg-discount-club-1-year-membership";
  var ST_AUTO = "ST007814";
  var ST_ONE = "ST003182";
  var MQ = "(max-width: 640px)";
  var tries = 0;
  var MAX = 40;
  var mountedLayout = null;

  function isMob() {
    return !!(window.matchMedia && window.matchMedia(MQ).matches);
  }

  function loadGelica() {
    if (document.querySelector('link[data-ygbc3-gelica]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://use.typekit.net/hrf1tkz.css";
    link.setAttribute("data-ygbc3-gelica", "1");
    document.head.appendChild(link);
  }

  function text(el) {
    return ((el && el.textContent) || "").replace(/\s+/g, " ").trim();
  }

  function getSaving(wrap) {
    wrap =
      wrap ||
      document.querySelector(".viewordRightWrapper .clubSavingWrapper") ||
      document.querySelector(".clubSavingWrapper");
    if (!wrap) return "£9.00";
    var nodes = [wrap.querySelector(".clubSaving"), wrap.querySelector("a"), wrap];
    for (var i = 0; i < nodes.length; i++) {
      var raw = text(nodes[i]);
      if (!raw) continue;
      var m = raw.match(/£\s*([\d,]+(?:\.\d{1,2})?)/);
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

  function addToBasket(stno) {
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

  function findClubWrap() {
    return (
      document.querySelector(".viewordRightWrapper .clubSavingWrapper") ||
      document.querySelector(".clubSavingWrapper")
    );
  }

  function sidebarWidthPx(wrap) {
    var right = document.querySelector(".viewordRightWrapper");
    var ref =
      (right &&
        (right.querySelector("table") ||
          right.querySelector(".orderTotalWrapper") ||
          right.firstElementChild)) ||
      (wrap && wrap.parentElement) ||
      right;
    var w = ref && ref.clientWidth ? ref.clientWidth : 0;
    if (!w && right) w = right.clientWidth;
    return w > 0 ? w : 0;
  }

  function restyleSidebar(wrap) {
    wrap = wrap || findClubWrap();
    if (!wrap) return false;

    var fullW = sidebarWidthPx(wrap);
    var widthRule = fullW
      ? "width:" + fullW + "px!important;min-width:" + fullW + "px!important;max-width:none!important;"
      : "width:100%!important;min-width:100%!important;max-width:none!important;";

    if (
      wrap.getAttribute("data-ygbc3-side") === "5" &&
      wrap.querySelector("#ygbc3-side-save") &&
      wrap.querySelector("#ygbc3-side-logo")
    ) {
      wrap.id = "ygbc3-side";
      if (fullW) {
        wrap.style.setProperty("width", fullW + "px", "important");
        wrap.style.setProperty("max-width", "none", "important");
      }
      return true;
    }

    wrap.setAttribute("data-ygbc3-side", "5");
    wrap.id = "ygbc3-side";
    wrap.setAttribute(
      "style",
      "display:block!important;" +
        widthRule +
        "box-sizing:border-box!important;padding:0!important;margin:14px 0 10px!important;background:transparent!important;border:0!important;overflow:visible!important;float:none!important;clear:both!important;"
    );
    wrap.innerHTML =
      '<a id="ygbc3-side-link" href="' +
      INFO_URL +
      '" aria-label="Save more with the YouGarden Discount Club">' +
      '<img id="ygbc3-side-logo" src="' +
      LOGO_SIDE +
      '" alt="" width="160" height="44">' +
      '<span id="ygbc3-side-save">Save MORE!</span>' +
      "</a>";
    return true;
  }

  function ensureSidebar() {
    var wrap = findClubWrap();
    if (!wrap) return;
    if (wrap.getAttribute("data-ygbc3-side") !== "5" || !wrap.querySelector("#ygbc3-side-save")) {
      restyleSidebar(wrap);
    }
  }

  function bindOpts(root, selectedClass) {
    var opts = root.querySelectorAll("#ygbc3-opt-auto, #ygbc3-opt-one");
    function sync() {
      Array.prototype.forEach.call(opts, function (card) {
        var input = card.querySelector("input");
        card.classList.toggle(selectedClass, !!(input && input.checked));
      });
    }
    Array.prototype.forEach.call(opts, function (card) {
      card.addEventListener("click", function (e) {
        e.preventDefault();
        var input = card.querySelector("input");
        if (input) input.checked = true;
        sync();
      });
    });
    root.addEventListener("change", sync);
    root.querySelector("#ygbc3-atc").addEventListener("click", function (e) {
      e.preventDefault();
      var checked = root.querySelector('input[name="ygbc3-plan"]:checked');
      addToBasket(checked ? checked.value : ST_AUTO);
    });
  }

  /* Desktop / tablet — logo | banner + 1×3 */
  function buildDesk(saving) {
    var root = document.createElement("div");
    root.id = "ygbc3-root";
    root.setAttribute("data-layout", "desk");
    root.innerHTML =
      '<div id="ygbc3-top">' +
      '<span id="ygbc3-logo-wrap">' +
      '<img id="ygbc3-logo" src="' +
      LOGO +
      '" alt="YouGarden Discount Club" width="160" height="119">' +
      "</span>" +
      '<div id="ygbc3-banner">' +
      '<div id="ygbc3-copy">' +
      '<p id="ygbc3-title">Join the YouGarden Club &amp; <span id="ygbc3-save">Save ' +
      saving +
      "</span> on this order</p>" +
      '<p id="ygbc3-benefits">' +
      "<span>15% off all Plants &amp; Accessories</span>" +
      '<span class="ygbc3-sep" aria-hidden="true"></span>' +
      "<span>£20 in Product Vouchers</span>" +
      '<span class="ygbc3-sep" aria-hidden="true"></span>' +
      "<span>2 x Free P&amp;P Vouchers</span>" +
      "</p></div></div></div>" +
      '<div id="ygbc3-body" role="radiogroup" aria-label="Club membership options">' +
      '<label id="ygbc3-opt-auto" class="ygbc3-is-selected">' +
      '<input type="radio" name="ygbc3-plan" value="' +
      ST_AUTO +
      '" checked>' +
      '<span class="ygbc3-radio" aria-hidden="true"></span>' +
      '<span class="ygbc3-opt-text">' +
      '<span class="ygbc3-opt-main">£10 / Year Auto-Renew</span>' +
      '<span class="ygbc3-opt-meta">Per Year <span class="ygbc3-was">Was £20</span></span>' +
      "</span></label>" +
      '<label id="ygbc3-opt-one">' +
      '<input type="radio" name="ygbc3-plan" value="' +
      ST_ONE +
      '">' +
      '<span class="ygbc3-radio" aria-hidden="true"></span>' +
      '<span class="ygbc3-opt-text">' +
      '<span class="ygbc3-opt-main">£20 One-Off</span>' +
      '<span class="ygbc3-opt-meta">12 months | No Renewal</span>' +
      "</span></label>" +
      '<div id="ygbc3-cta">' +
      '<button type="button" id="ygbc3-atc">Add to Basket</button>' +
      '<a id="ygbc3-more" href="' +
      INFO_URL +
      '">More Info</a>' +
      "</div></div>";

    bindOpts(root, "ygbc3-is-selected");
    return root;
  }

  /* Mobile — logo overlapping banner → compact radios + ATC */
  function buildMob(saving) {
    var root = document.createElement("div");
    root.id = "ygbc3-root";
    root.setAttribute("data-layout", "mob");
    root.innerHTML =
      '<div id="ygbc3-top">' +
      '<span id="ygbc3-logo-wrap">' +
      '<img id="ygbc3-logo" src="' +
      LOGO +
      '" alt="YouGarden Discount Club" width="132" height="84">' +
      "</span>" +
      '<div id="ygbc3-banner"><div id="ygbc3-copy">' +
      '<p id="ygbc3-title">Join the Club &amp; <span id="ygbc3-save">Save ' +
      saving +
      "</span></p>" +
      '<p id="ygbc3-benefits">' +
      "<span>15% off all Plants &amp; Accessories</span>" +
      '<span class="ygbc3-br">' +
      "<span>£20 Voucher</span>" +
      '<span class="ygbc3-sep" aria-hidden="true"></span>' +
      "<span>2 x Free P&amp;P Vouchers</span>" +
      "</span></p>" +
      "</div></div></div>" +
      '<div id="ygbc3-body" role="radiogroup" aria-label="Club membership options">' +
      '<label id="ygbc3-opt-auto" class="ygbc3-is-selected" data-stno="' +
      ST_AUTO +
      '">' +
      '<input type="radio" name="ygbc3-plan" value="' +
      ST_AUTO +
      '" checked>' +
      '<span class="ygbc3-radio" aria-hidden="true"></span>' +
      '<span class="ygbc3-opt-text">' +
      '<span class="ygbc3-opt-title">Auto Renew</span>' +
      '<span class="ygbc3-opt-price">£10</span>' +
      '<span class="ygbc3-opt-meta">Per year <span class="ygbc3-was">Was £20</span></span>' +
      "</span></label>" +
      '<label id="ygbc3-opt-one" data-stno="' +
      ST_ONE +
      '">' +
      '<input type="radio" name="ygbc3-plan" value="' +
      ST_ONE +
      '">' +
      '<span class="ygbc3-radio" aria-hidden="true"></span>' +
      '<span class="ygbc3-opt-text">' +
      '<span class="ygbc3-opt-title">One-Off</span>' +
      '<span class="ygbc3-opt-price">£20</span>' +
      '<span class="ygbc3-opt-meta">12 Months<br>No Renewal</span>' +
      "</span></label>" +
      '<div id="ygbc3-cta">' +
      '<button type="button" id="ygbc3-atc">Add to Basket</button>' +
      '<a id="ygbc3-more" href="' +
      INFO_URL +
      '">More Info</a>' +
      "</div></div>";

    bindOpts(root, "ygbc3-is-selected");
    return root;
  }

  function clearRoot() {
    var existing = document.getElementById("ygbc3-root");
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    mountedLayout = null;
  }

  function mount(layout) {
    var club = findClubWrap();
    var anchor = mountPoint();
    if (!club) return false;
    if (clubAlreadyInBasket()) {
      restyleSidebar(club);
      document.documentElement.setAttribute(ATTR, "1");
      document.documentElement.setAttribute(LAYOUT, layout);
      ensureSidebar();
      return true;
    }
    if (!anchor) return false;

    if (mountedLayout !== layout) clearRoot();
    if (!document.getElementById("ygbc3-root")) {
      loadGelica();
      var saving = getSaving(club);
      insertAfter(anchor, layout === "mob" ? buildMob(saving) : buildDesk(saving));
      mountedLayout = layout;
    }

    restyleSidebar(club);
    document.documentElement.setAttribute(ATTR, "1");
    document.documentElement.setAttribute(LAYOUT, layout);
    ensureSidebar();
    setTimeout(ensureSidebar, 500);
    setTimeout(ensureSidebar, 1500);
    return true;
  }

  function go() {
    var layout = isMob() ? "mob" : "desk";
    if (mount(layout)) return;
    if (++tries < MAX) setTimeout(go, 250);
  }

  function onBreakpointChange() {
    tries = 0;
    clearRoot();
    document.documentElement.removeAttribute(ATTR);
    go();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
  else go();

  if (window.matchMedia) {
    var mql = window.matchMedia(MQ);
    if (mql.addEventListener) mql.addEventListener("change", onBreakpointChange);
    else if (mql.addListener) mql.addListener(onBreakpointChange);
  }
})();
