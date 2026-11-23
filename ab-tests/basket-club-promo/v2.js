/**
 * Basket Club Promo V2 — hosted assets (load via ce-boot-v2.js)
 * Pair with: v2.css
 *
 * Change BASE for production CDN / yougarden static host.
 */
(function () {
  if (!/vieword\.csp/i.test(location.href || "")) return;
  if (document.documentElement.getAttribute("data-ce-yg-club-v2") === "1") return;

  var ATTR = "data-ce-yg-club-v2";
  var BASE = "https://yg-cart-drawer-demo.test/ce/basket-club";
  var LOGO_ICON = BASE + "/assets/yg-club-logo-icon-96.png";
  var LOGO_PRIMARY = BASE + "/assets/yg-club-logo-primary-140.png";

  var INFO_URL = "/item-p-820001/yg-discount-club-1-year-membership";
  var ST_AUTO = "ST0007014";
  var ST_ONE = "ST0003182";
  var tries = 0;
  var MAX = 40;

  function text(el) {
    return ((el && el.textContent) || "").replace(/\s+/g, " ").trim();
  }

  function getSaving() {
    var el = document.querySelector(".clubSavingWrapper .clubSaving");
    var m = text(el).match(/£[\d,.]+/);
    return m ? m[0] : "£9.00";
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
    return /ST0007014|ST0003182|Discount Club|Auto Renew|820001|820005/i.test(
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

  var PLUS =
    '<svg class="ce-yg-club-promo__plus" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="11" fill="#7cb342"/>' +
    '<path d="M12 7v10M7 12h10" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>' +
    "</svg>";

  function buildPromo(saving) {
    var root = document.createElement("div");
    root.className = "ce-yg-club-promo ce-yg-club-promo--v2";
    root.setAttribute("data-ce-yg-club-promo", "v2");
    root.innerHTML =
      '<div class="ce-yg-club-promo__inner">' +
      '<div class="ce-yg-club-promo__left">' +
      '<img class="ce-yg-club-promo__logo" src="' + LOGO_ICON + '" alt="YouGarden Discount Club" width="96" height="85">' +
      '<p class="ce-yg-club-promo__title">Join our club &amp; <span class="ce-yg-club-promo__save">Save ' +
      saving +
      "</span> on this order</p>" +
      '<a class="ce-yg-club-promo__find" href="' + INFO_URL + '">More Info Here</a>' +
      "</div>" +
      '<div class="ce-yg-club-promo__right">' +
      '<p class="ce-yg-club-promo__sub">Sign Up Today for 15% Off All Plants &amp; Accessories, £20 in Product Vouchers, Free P&amp;P Vouchers &amp; More!</p>' +
      '<div class="ce-yg-club-promo__actions">' +
      '<button type="button" class="ce-yg-club-promo__pill" data-stno="' + ST_AUTO + '">' +
      '<span>Auto Renewal <strong>Now £10</strong> Per Year <span class="ce-yg-club-promo__was">Was £20</span></span>' +
      PLUS +
      "</button>" +
      '<button type="button" class="ce-yg-club-promo__pill" data-stno="' + ST_ONE + '">' +
      '<span>12 Month Membership <strong>£20</strong> (No Auto Renewal)</span>' +
      PLUS +
      "</button>" +
      "</div></div></div>";

    Array.prototype.forEach.call(root.querySelectorAll(".ce-yg-club-promo__pill"), function (btn) {
      btn.addEventListener("click", function () {
        addClub(btn.getAttribute("data-stno") || ST_AUTO);
      });
    });
    return root;
  }

  function restyleSidebar() {
    var wrap = document.querySelector(".clubSavingWrapper");
    if (!wrap || wrap.getAttribute("data-ce-yg-club-side") === "1") return;
    wrap.setAttribute("data-ce-yg-club-side", "1");
    wrap.classList.add("ce-yg-club-side--v2");
    wrap.innerHTML =
      '<a class="ce-yg-club-side__link" href="' + INFO_URL + '" aria-label="Save more with the YouGarden Discount Club">' +
      '<img class="ce-yg-club-side__logo" src="' + LOGO_PRIMARY + '" alt="YouGarden Discount Club" width="140" height="36">' +
      '<span class="ce-yg-club-side__save">Save MORE!</span>' +
      "</a>";
  }

  function go() {
    if (clubAlreadyInBasket()) {
      document.documentElement.setAttribute(ATTR, "1");
      restyleSidebar();
      return;
    }
    var anchor = mountPoint();
    var club = document.querySelector(".clubSavingWrapper");
    if (!anchor || !club) {
      if (++tries < MAX) setTimeout(go, 250);
      return;
    }
    if (document.querySelector('[data-ce-yg-club-promo="v2"]')) {
      document.documentElement.setAttribute(ATTR, "1");
      return;
    }
    insertAfter(anchor, buildPromo(getSaving()));
    restyleSidebar();
    document.documentElement.setAttribute(ATTR, "1");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
  else go();
})();
