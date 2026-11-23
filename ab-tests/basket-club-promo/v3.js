/**
 * Basket Club Promo V3 — unique ygbc3_* IDs (load via ce-boot-v3.js)
 * Pair with: v3.css
 *
 * Change BASE for production CDN / yougarden static host.
 */
(function () {
  if (!/vieword\.csp/i.test(location.href || "")) return;
  if (document.documentElement.getAttribute("data-ygbc3") === "1" && document.getElementById("ygbc3-side-save")) return;

  var ATTR = "data-ygbc3";
  var BASE = "https://yg-cart-drawer-demo.test/ce/basket-club";
  var LOGO = BASE + "/assets/yg-club-logo-v3.png";
  var LOGO_SIDE = BASE + "/assets/yg-club-logo-v3-side.png";
  var LOGO_BF = BASE + "/assets/yg-blooming-fast-logo-72.png";

  var INFO_URL = "/item-p-820001/yg-discount-club-1-year-membership";
  var ST_AUTO = "ST007814"; // Auto Renewal £10 — from live club PDP doAjaxBag
  var ST_ONE = "ST003182"; // One Year £20 — from live club PDP doAjaxBag
  /* Live £1 plant-food promo on vieword: .promoBuy → ST0021276 */
  var ST_SPF = "ST0021276";
  var tries = 0;
  var MAX = 40;

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

  /* Same ATC path as live basket .promoBuy / club PDP */
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

  function syncSelected(root) {
    Array.prototype.forEach.call(root.querySelectorAll("#ygbc3-opt-auto, #ygbc3-opt-one"), function (card) {
      var input = card.querySelector("input");
      card.classList.toggle("ygbc3-is-selected", !!(input && input.checked));
    });
  }

  function buildPromo(saving) {
    var root = document.createElement("div");
    root.id = "ygbc3-root";
    root.innerHTML =
      '<div id="ygbc3-spf">' +
      '<div id="ygbc3-spf-inner">' +
      '<div id="ygbc3-spf-brand">' +
      '<img id="ygbc3-spf-logo" src="' + LOGO_BF + '" alt="Blooming Fast" width="44" height="44">' +
      '<p id="ygbc3-spf-title">Superior <strong>Plant Food</strong> Plus</p>' +
      "</div>" +
      '<div id="ygbc3-spf-msg">For better results, treat your plants before we send them to you.</div>' +
      '<button type="button" id="ygbc3-spf-cta">' +
      '<span class="ygbc3-spf-plus" aria-hidden="true">+</span>' +
      '<span class="ygbc3-spf-cta-copy">' +
      '<span class="ygbc3-spf-cta-line">Add to Basket</span>' +
      '<span class="ygbc3-spf-cta-price">for Just £1</span>' +
      "</span></button>" +
      "</div></div>" +
      '<div id="ygbc3-top">' +
      '<span id="ygbc3-logo-wrap">' +
      '<img id="ygbc3-logo" src="' + LOGO + '" alt="YouGarden Discount Club" width="160" height="119">' +
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
      '<input type="radio" name="ygbc3-plan" value="' + ST_AUTO + '" checked>' +
      '<span class="ygbc3-radio" aria-hidden="true"></span>' +
      '<span class="ygbc3-opt-text">' +
      '<span class="ygbc3-opt-main">£10 / Year Auto-Renew</span>' +
      '<span class="ygbc3-opt-meta">Per Year <span class="ygbc3-was">Was £20</span></span>' +
      "</span></label>" +
      '<label id="ygbc3-opt-one">' +
      '<input type="radio" name="ygbc3-plan" value="' + ST_ONE + '">' +
      '<span class="ygbc3-radio" aria-hidden="true"></span>' +
      '<span class="ygbc3-opt-text">' +
      '<span class="ygbc3-opt-main">£20 One-Off</span>' +
      '<span class="ygbc3-opt-meta">12 months | No Renewal</span>' +
      "</span></label>" +
      '<div id="ygbc3-cta">' +
      '<button type="button" id="ygbc3-atc">Add to Basket</button>' +
      '<a id="ygbc3-more" href="' + INFO_URL + '">More Info</a>' +
      "</div></div>";

    var spfCta = root.querySelector("#ygbc3-spf-cta");
    if (spfCta) {
      spfCta.addEventListener("click", function (e) {
        e.preventDefault();
        addToBasket(ST_SPF);
      });
    }

    root.addEventListener("change", function () {
      syncSelected(root);
    });
    Array.prototype.forEach.call(root.querySelectorAll("#ygbc3-opt-auto, #ygbc3-opt-one"), function (card) {
      card.addEventListener("click", function () {
        var input = card.querySelector("input");
        if (input) input.checked = true;
        syncSelected(root);
      });
    });
    root.querySelector("#ygbc3-atc").addEventListener("click", function () {
      var checked = root.querySelector('input[name="ygbc3-plan"]:checked');
      addToBasket(checked ? checked.value : ST_AUTO);
    });
    return root;
  }

  function findClubWrap() {
    return (
      document.querySelector(".viewordRightWrapper .clubSavingWrapper") ||
      document.querySelector(".clubSavingWrapper")
    );
  }

  function restyleSidebar(wrap) {
    wrap = wrap || findClubWrap();
    if (!wrap) return false;

    if (
      wrap.getAttribute("data-ygbc3-side") === "5" &&
      wrap.querySelector("#ygbc3-side-save") &&
      wrap.querySelector("#ygbc3-side-logo")
    ) {
      wrap.id = "ygbc3-side";
      return true;
    }

    wrap.setAttribute("data-ygbc3-side", "5");
    wrap.id = "ygbc3-side";
    wrap.setAttribute(
      "style",
      "display:block!important;width:100%!important;max-width:none!important;box-sizing:border-box!important;padding:0!important;margin:14px 0 10px!important;background:transparent!important;border:0!important;overflow:visible!important;float:none!important;clear:both!important;"
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

  function go() {
    var club = findClubWrap();
    var anchor = mountPoint();

    if (!club) {
      if (++tries < MAX) setTimeout(go, 250);
      return;
    }

    if (clubAlreadyInBasket()) {
      restyleSidebar(club);
      document.documentElement.setAttribute(ATTR, "1");
      ensureSidebar();
      setTimeout(ensureSidebar, 500);
      setTimeout(ensureSidebar, 1500);
      setTimeout(ensureSidebar, 3000);
      return;
    }

    if (!anchor) {
      if (++tries < MAX) setTimeout(go, 250);
      return;
    }

    if (!document.getElementById("ygbc3-root")) {
      loadGelica();
      insertAfter(anchor, buildPromo(getSaving()));
    }

    restyleSidebar(club);
    document.documentElement.setAttribute(ATTR, "1");
    ensureSidebar();
    setTimeout(ensureSidebar, 500);
    setTimeout(ensureSidebar, 1500);
    setTimeout(ensureSidebar, 3000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
  else go();
})();
