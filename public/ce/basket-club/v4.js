/**
 * Crazy Egg — Basket Club V4 (all devices)
 *
 * Paste into Crazy Egg Variant → Edit Script
 * Pair with: v4.css → Edit CSS
 *
 *   641+  — two-panel (save | benefits + pills)
 *   ≤640  — badge + headline → benefits → pills → Find Out More
 */
(function () {
  if (!/vieword\.csp/i.test(location.href || "")) return;

  var ATTR = "data-ygbc4";
  var LAYOUT = "data-ygbc4-layout";
  var BASE = "https://yg-cart-drawer-demo.test/ce/basket-club";
  var LOGO_C = "data:image/png;base64,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";
  var LOGO_SIDE = "data:image/png;base64,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";
  var LOGO_BADGE_M = BASE + "/assets/yg-club-badge-mob-v2.png";
  var INFO_URL = "/item-p-820001/yg-discount-club-1-year-membership";
  var ST_AUTO = "ST007814";
  var ST_ONE = "ST003182";
  var MQ = "(max-width: 640px)";
  var tries = 0;
  var MAX = 40;
  var mountedLayout = null;

  /* Green circle + purple basket with + */
  var PLUS_SVG =
    '<svg class="ygbc4-plus" viewBox="0 0 36 36" width="32" height="32" aria-hidden="true">' +
    '<circle cx="18" cy="18" r="18" fill="#c5e085" style="fill:#c5e085"/>' +
    /* basket body */
    '<path style="fill:#7b277b" d="M10.2 14.2h15.6l-1.15 11.1c-.12 1.15-1.1 2-2.25 2H13.6c-1.15 0-2.13-.85-2.25-2L10.2 14.2z"/>' +
    /* handle arc */
    '<path d="M13.2 14.2c0-3.2 2.15-5.2 4.8-5.2s4.8 2 4.8 5.2" fill="none" stroke="#7b277b" stroke-width="2.4" stroke-linecap="round" style="stroke:#7b277b"/>' +
    /* plus */
    '<path style="fill:#c5e085" d="M17.05 17.6h1.9v7.2h-1.9z"/>' +
    '<path style="fill:#c5e085" d="M14.4 20.25h7.2v1.9h-7.2z"/>' +
    "</svg>";

  function isMob() {
    return !!(window.matchMedia && window.matchMedia(MQ).matches);
  }

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

  /** Live club saving from basket summary — never hardcode the amount. */
  function getSaving(wrap) {
    wrap =
      wrap ||
      document.querySelector(".viewordRightWrapper .clubSavingWrapper") ||
      document.querySelector(".clubSavingWrapper");
    if (!wrap) return "£9.00";
    var candidates = [
      wrap.querySelector(".clubSaving"),
      wrap.querySelector("[class*='clubSaving']"),
      wrap.querySelector("a"),
      wrap
    ];
    var i, raw, m, best = null, bestVal = -1, val;
    for (i = 0; i < candidates.length; i++) {
      raw = text(candidates[i]);
      if (!raw) continue;
      /* Prefer the largest £ amount (live save can be £110+; ignore tiny noise) */
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

  function restyleSidebar(wrap, saving) {
    wrap = wrap || findClubWrap();
    if (!wrap) return false;
    saving = saving || getSaving(wrap);

    if (
      wrap.getAttribute("data-ygbc4-side") === "7" &&
      wrap.querySelector("#ygbc4-side-save") &&
      wrap.querySelector("#ygbc4-side-logo")
    ) {
      wrap.id = "ygbc4-side";
      var amt = wrap.querySelector("#ygbc4-side-amt");
      if (amt) amt.textContent = saving;
      return true;
    }

    wrap.setAttribute("data-ygbc4-side", "7");
    wrap.id = "ygbc4-side";
    wrap.setAttribute(
      "style",
      "display:block!important;width:100%!important;max-width:none!important;box-sizing:border-box!important;padding:0!important;margin:14px 0 10px!important;background:transparent!important;border:0!important;overflow:visible!important;float:none!important;clear:both!important;"
    );
    wrap.innerHTML =
      '<a id="ygbc4-side-link" href="' +
      INFO_URL +
      '" aria-label="Join the YouGarden Discount Club to save an extra ' +
      saving +
      '">' +
      '<img id="ygbc4-side-logo" src="' +
      LOGO_C +
      '" alt="" width="40" height="40">' +
      '<span id="ygbc4-side-save">Join to Save an Extra <strong id="ygbc4-side-amt">' +
      saving +
      "</strong></span>" +
      "</a>";
    return true;
  }

  function ensureSidebar() {
    restyleSidebar(findClubWrap());
  }

  function bindPills(root) {
    Array.prototype.forEach.call(root.querySelectorAll(".ygbc4-pill"), function (btn) {
      btn.addEventListener("click", function () {
        addClub(btn.getAttribute("data-stno") || ST_AUTO);
      });
    });
  }

  /* Desktop / tablet — two-panel */
  function buildDesk(saving) {
    var root = document.createElement("div");
    root.id = "ygbc4-root";
    root.setAttribute("data-layout", "desk");
    root.innerHTML =
      '<div id="ygbc4-inner">' +
      '<div id="ygbc4-left">' +
      '<img id="ygbc4-logo" src="' +
      LOGO_C +
      '" alt="YouGarden Discount Club" width="56" height="50">' +
      '<div id="ygbc4-copy">' +
      '<p id="ygbc4-eyebrow">Join our club &amp;</p>' +
      '<p id="ygbc4-save">Save ' +
      saving +
      "</p>" +
      '<p id="ygbc4-sub">on this order</p>' +
      "</div>" +
      '<a id="ygbc4-more" href="' +
      INFO_URL +
      '">More Info Here</a>' +
      "</div>" +
      '<div id="ygbc4-right">' +
      '<p id="ygbc4-benefits">Sign Up Today for 15% Off All Plants &amp; Accessories,<br>£20 in Product Vouchers, Free P&amp;P Vouchers &amp; More!</p>' +
      '<div id="ygbc4-actions">' +
      '<button type="button" class="ygbc4-pill" data-stno="' +
      ST_AUTO +
      '">' +
      '<span class="ygbc4-pill-text">Auto Renewal <strong>Now £10</strong> Per Year <span class="ygbc4-was">Was £20</span></span>' +
      PLUS_SVG +
      "</button>" +
      '<button type="button" class="ygbc4-pill" data-stno="' +
      ST_ONE +
      '">' +
      '<span class="ygbc4-pill-text">12 Month Membership <strong>£20</strong> (No Auto Renewal)</span>' +
      PLUS_SVG +
      "</button>" +
      "</div></div></div>";
    bindPills(root);
    return root;
  }

  /* Mobile — badge | headline → benefits → pills → Find Out More */
  function buildMob(saving) {
    var root = document.createElement("div");
    root.id = "ygbc4-root";
    root.setAttribute("data-layout", "mob");
    root.innerHTML =
      '<div id="ygbc4-card">' +
      '<div id="ygbc4-panel">' +
      '<div id="ygbc4-head">' +
      '<img id="ygbc4-logo-m" src="' +
      LOGO_BADGE_M +
      '" alt="YouGarden Discount Club" width="151" height="42">' +
      '<p id="ygbc4-title">' +
      '<span id="ygbc4-title-line1">Join the Club &amp; Save</span>' +
      '<span id="ygbc4-title-line2"><span id="ygbc4-save">' +
      saving +
      "</span> on this order</span>" +
      "</p>" +
      "</div>" +
      '<p id="ygbc4-benefits">Sign Up Today for 15% Off All Plants &amp; Accessories, £20 in Product Vouchers, Free P&amp;P Vouchers &amp; More!</p>' +
      '<div id="ygbc4-actions">' +
      '<button type="button" class="ygbc4-pill" data-stno="' +
      ST_AUTO +
      '">' +
      '<span class="ygbc4-pill-text">Auto Renewal <strong>Now £10</strong> Per Year <span class="ygbc4-was">Was £20</span></span>' +
      PLUS_SVG +
      "</button>" +
      '<button type="button" class="ygbc4-pill" data-stno="' +
      ST_ONE +
      '">' +
      '<span class="ygbc4-pill-text">12 Month Membership <strong>£20</strong> (No Auto Renewal)</span>' +
      PLUS_SVG +
      "</button>" +
      "</div></div>" +
      '<a id="ygbc4-more" href="' +
      INFO_URL +
      '">Find Out More</a>' +
      "</div>";
    bindPills(root);
    return root;
  }

  function clearRoot() {
    var existing = document.getElementById("ygbc4-root");
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    mountedLayout = null;
  }

  function mount(layout) {
    var club = findClubWrap();
    var anchor = mountPoint();
    if (!club) return false;

    var saving = getSaving(club);

    if (clubAlreadyInBasket()) {
      restyleSidebar(club, saving);
      document.documentElement.setAttribute(ATTR, "1");
      document.documentElement.setAttribute(LAYOUT, layout);
      ensureSidebar();
      return true;
    }
    if (!anchor) return false;

    if (mountedLayout !== layout) clearRoot();
    if (!document.getElementById("ygbc4-root")) {
      loadGelica();
      insertAfter(anchor, layout === "mob" ? buildMob(saving) : buildDesk(saving));
      mountedLayout = layout;
    }

    restyleSidebar(club, saving);
    document.documentElement.setAttribute(ATTR, "1");
    document.documentElement.setAttribute(LAYOUT, layout);
    ensureSidebar();
    setTimeout(ensureSidebar, 500);
    setTimeout(ensureSidebar, 1500);
    setTimeout(ensureSidebar, 3000);
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
    document.documentElement.removeAttribute(LAYOUT);
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
