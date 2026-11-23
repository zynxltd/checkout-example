/**
 * Basket Club Promo V1 — hosted assets (load via ce-boot-v1.js)
 * Pair with: v1.css
 *
 * Change BASE for production CDN / yougarden static host.
 */
(function () {
  if (!/vieword\.csp/i.test(location.href || "")) return;
  if (document.documentElement.getAttribute("data-ce-yg-club-v1") === "1") return;

  var ATTR = "data-ce-yg-club-v1";
  var BASE = "https://yg-cart-drawer-demo.test/ce/basket-club";
  var LOGO_ICON = BASE + "/assets/yg-club-logo-v1.png";
  var LOGO_ICON_SM = BASE + "/assets/yg-club-logo-v1-sm.png";
  var ICO_PLANT = '<img src="' + BASE + '/assets/yg-club-icon-plant.png" alt="" width="34" height="48">';
  var ICO_VOUCHER = '<img src="' + BASE + '/assets/yg-club-icon-vouchers.png" alt="" width="40" height="33">';
  var ICO_VAN = '<img src="' + BASE + '/assets/yg-club-icon-van.png" alt="" width="42" height="25">';

  var INFO_URL = "/item-p-820001/yg-discount-club-1-year-membership";
  var ST_AUTO = "ST0007014";
  var ST_ONE = "ST0003182";
  var tries = 0;
  var MAX = 40;

  function loadGelica() {
    if (document.querySelector('link[data-ce-yg-club-gelica]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://use.typekit.net/hrf1tkz.css";
    link.setAttribute("data-ce-yg-club-gelica", "1");
    document.head.appendChild(link);
  }

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

  function benefit(icon, label) {
    return (
      '<div class="ce-yg-club-promo__benefit">' +
      '<span class="ce-yg-club-promo__benefit-icon" aria-hidden="true">' +
      icon +
      "</span>" +
      '<span class="ce-yg-club-promo__benefit-label">' +
      label +
      "</span></div>"
    );
  }

  function buildPromo(saving) {
    var root = document.createElement("div");
    root.className = "ce-yg-club-promo ce-yg-club-promo--v1";
    root.setAttribute("data-ce-yg-club-promo", "v1");
    root.innerHTML =
      '<div class="ce-yg-club-promo__inner">' +
      '<img class="ce-yg-club-promo__logo" src="' + LOGO_ICON + '" alt="YouGarden Discount Club" width="70" height="70">' +
      '<div class="ce-yg-club-promo__lead">' +
      '<div class="ce-yg-club-promo__copy">' +
      '<p class="ce-yg-club-promo__eyebrow">Join our club &amp;</p>' +
      '<p class="ce-yg-club-promo__save">Save ' + saving + "</p>" +
      '<p class="ce-yg-club-promo__sub">on this order</p>' +
      '<a class="ce-yg-club-promo__more" href="' + INFO_URL + '">More Info</a>' +
      "</div></div>" +
      '<div class="ce-yg-club-promo__benefits">' +
      benefit(ICO_PLANT, "<strong>15% Off</strong>All Plants and Accessories") +
      benefit(ICO_VOUCHER, "<strong>£20</strong>In Vouchers") +
      benefit(ICO_VAN, "<strong>2 x Free</strong>P&amp;P Vouchers<br>(Worth £6.99 Each)") +
      "</div>" +
      '<div class="ce-yg-club-promo__choose" role="radiogroup" aria-label="Club membership options">' +
      '<label class="ce-yg-club-promo__opt is-selected">' +
      '<input type="radio" name="ce-yg-club-v1" value="' + ST_AUTO + '" checked>' +
      '<span class="ce-yg-club-promo__radio" aria-hidden="true"></span>' +
      '<span class="ce-yg-club-promo__opt-text">' +
      '<span class="ce-yg-club-promo__opt-title">Auto Renewal</span>' +
      '<span class="ce-yg-club-promo__opt-price">Now £10</span>' +
      '<span class="ce-yg-club-promo__meta">Per Year <span class="ce-yg-club-promo__was">Was £20</span></span>' +
      "</span></label>" +
      '<label class="ce-yg-club-promo__opt ce-yg-club-promo__opt--one">' +
      '<input type="radio" name="ce-yg-club-v1" value="' + ST_ONE + '">' +
      '<span class="ce-yg-club-promo__radio" aria-hidden="true"></span>' +
      '<span class="ce-yg-club-promo__opt-text">' +
      '<span class="ce-yg-club-promo__opt-title">One Year</span>' +
      '<span class="ce-yg-club-promo__opt-row">' +
      '<span class="ce-yg-club-promo__opt-price">£20</span>' +
      '<span class="ce-yg-club-promo__meta">No Auto<br>Renew</span>' +
      "</span></span></label>" +
      '<button type="button" class="ce-yg-club-promo__atc">Add to Basket</button>' +
      "</div></div>";

    var opts = root.querySelectorAll(".ce-yg-club-promo__opt");
    Array.prototype.forEach.call(opts, function (lab) {
      lab.addEventListener("change", function () {
        Array.prototype.forEach.call(opts, function (o) {
          o.classList.toggle("is-selected", !!(o.querySelector("input") && o.querySelector("input").checked));
        });
      });
      lab.addEventListener("click", function () {
        var input = lab.querySelector("input");
        if (input) input.checked = true;
        Array.prototype.forEach.call(opts, function (o) {
          o.classList.toggle("is-selected", !!(o.querySelector("input") && o.querySelector("input").checked));
        });
      });
    });
    root.querySelector(".ce-yg-club-promo__atc").addEventListener("click", function () {
      var checked = root.querySelector('input[name="ce-yg-club-v1"]:checked');
      addClub(checked ? checked.value : ST_AUTO);
    });
    return root;
  }

  function restyleSidebar(saving) {
    var wrap = document.querySelector(".clubSavingWrapper");
    if (!wrap || wrap.getAttribute("data-ce-yg-club-side") === "1") return;
    wrap.setAttribute("data-ce-yg-club-side", "1");
    wrap.classList.add("ce-yg-club-side--v1");
    wrap.innerHTML =
      '<a class="ce-yg-club-side__link" href="' + INFO_URL + '">' +
      '<img class="ce-yg-club-side__logo" src="' + LOGO_ICON_SM + '" alt="" width="40" height="36">' +
      '<span class="ce-yg-club-side__text">Join to Save an Extra <strong>' + saving + "</strong></span>" +
      "</a>";
  }

  function go() {
    if (clubAlreadyInBasket()) {
      document.documentElement.setAttribute(ATTR, "1");
      return;
    }
    var anchor = mountPoint();
    var club = document.querySelector(".clubSavingWrapper");
    if (!anchor || !club) {
      if (++tries < MAX) setTimeout(go, 250);
      return;
    }
    if (document.querySelector('[data-ce-yg-club-promo="v1"]')) {
      document.documentElement.setAttribute(ATTR, "1");
      return;
    }
    loadGelica();
    var saving = getSaving();
    insertAfter(anchor, buildPromo(saving));
    restyleSidebar(saving);
    document.documentElement.setAttribute(ATTR, "1");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
  else go();
})();
