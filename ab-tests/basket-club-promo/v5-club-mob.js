/**
 * V5 Club Mobile — logo + purple banner → Auto Renew | One-Off | ATC (≤640)
 * Pair: v5-club-mob.css · ce-boot-v5-club-mob.js
 */
(function () {
  if (!/vieword\.csp/i.test(location.href || "")) return;
  if (window.matchMedia && !window.matchMedia("(max-width: 640px)").matches) return;
  /* Skip only if full 2-radio promo already mounted */
  if (
    document.documentElement.getAttribute("data-ygbc5") === "1" &&
    document.getElementById("ygbc5-side-save") &&
    document.getElementById("ygbc5-opt-one")
  )
    return;

  var ATTR = "data-ygbc5";
  var BASE = "https://yg-cart-drawer-demo.test/ce/basket-club";
  var LOGO = BASE + "/assets/yg-club-logo-v3.png";
  var LOGO_SIDE = BASE + "/assets/yg-club-logo-v3-side.png";
  var INFO_URL = "/item-p-820001/yg-discount-club-1-year-membership";
  var ST_AUTO = "ST007814";
  var ST_ONE = "ST003182";
  var tries = 0;
  var MAX = 40;

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

  function getSaving(wrap) {
    wrap = wrap || document.querySelector(".viewordRightWrapper .clubSavingWrapper") || document.querySelector(".clubSavingWrapper");
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
      '<div id="ygbc5-top">' +
      '<span id="ygbc5-logo-wrap">' +
      '<img id="ygbc5-logo" src="' + LOGO + '" alt="YouGarden Discount Club" width="132" height="84">' +
      "</span>" +
      '<div id="ygbc5-banner"><div id="ygbc5-copy">' +
      '<p id="ygbc5-title">Join the Club &amp; <span id="ygbc5-save">Save ' + saving + "</span></p>" +
      '<p id="ygbc5-benefits">' +
      "<span>15% off all Plants &amp; Accessories</span>" +
      '<span class="ygbc5-br">' +
      "<span>£20 Voucher</span>" +
      '<span class="ygbc5-sep" aria-hidden="true"></span>' +
      "<span>2 x Free P&amp;P Vouchers</span>" +
      "</span></p>" +
      "</div></div></div>" +
      '<div id="ygbc5-body" role="radiogroup" aria-label="Club membership options">' +
      '<label id="ygbc5-opt-auto" class="is-selected" data-stno="' + ST_AUTO + '">' +
      '<input type="radio" name="ygbc5-plan" value="' + ST_AUTO + '" checked>' +
      '<span class="ygbc5-radio" aria-hidden="true"></span>' +
      '<span class="ygbc5-opt-text">' +
      '<span class="ygbc5-opt-title">Auto Renew</span>' +
      '<span class="ygbc5-opt-price">£10</span>' +
      '<span class="ygbc5-opt-meta">Per year <span class="ygbc5-was">Was £20</span></span>' +
      "</span></label>" +
      '<label id="ygbc5-opt-one" data-stno="' + ST_ONE + '">' +
      '<input type="radio" name="ygbc5-plan" value="' + ST_ONE + '">' +
      '<span class="ygbc5-radio" aria-hidden="true"></span>' +
      '<span class="ygbc5-opt-text">' +
      '<span class="ygbc5-opt-title">One-Off</span>' +
      '<span class="ygbc5-opt-price">£20</span>' +
      '<span class="ygbc5-opt-meta">12 Months<br>No Renewal</span>' +
      "</span></label>" +
      '<div id="ygbc5-cta">' +
      '<button type="button" id="ygbc5-atc">Add to Basket</button>' +
      '<a id="ygbc5-more" href="' + INFO_URL + '">More Info</a>' +
      "</div></div>";

    var opts = root.querySelectorAll("#ygbc5-opt-auto, #ygbc5-opt-one");
    function sync() {
      Array.prototype.forEach.call(opts, function (o) {
        o.classList.toggle("is-selected", !!(o.querySelector("input") && o.querySelector("input").checked));
      });
    }
    function selectedStno() {
      var checked = root.querySelector('input[name="ygbc5-plan"]:checked');
      return checked ? checked.value : ST_AUTO;
    }
    Array.prototype.forEach.call(opts, function (lab) {
      lab.addEventListener("click", function (e) {
        e.preventDefault();
        var input = lab.querySelector("input");
        if (input) input.checked = true;
        sync();
      });
    });
    root.querySelector("#ygbc5-atc").addEventListener("click", function (e) {
      e.preventDefault();
      addClub(selectedStno());
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
      wrap.getAttribute("data-ygbc5-side") === "3" &&
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
    wrap.setAttribute("data-ygbc5-side", "3");
    wrap.id = "ygbc5-side";
    var fullW = sidebarWidthPx(wrap);
    var widthRule = fullW
      ? "width:" + fullW + "px!important;min-width:" + fullW + "px!important;max-width:none!important;"
      : "width:100%!important;min-width:100%!important;max-width:none!important;";
    wrap.setAttribute(
      "style",
      "display:block!important;" +
        widthRule +
        "box-sizing:border-box!important;padding:0!important;margin:14px 0 10px!important;background:transparent!important;border:0!important;overflow:visible!important;float:none!important;clear:both!important;"
    );
    wrap.innerHTML =
      '<a id="ygbc5-side-link" href="' +
      INFO_URL +
      '" aria-label="Save more with the YouGarden Discount Club">' +
      '<img id="ygbc5-side-logo" src="' +
      LOGO_SIDE +
      '" alt="" width="150" height="42">' +
      '<span id="ygbc5-side-save">Save MORE!</span>' +
      "</a>";
    return true;
  }

  function ensureSidebar() {
    var wrap = findClubWrap();
    if (!wrap) return;
    if (wrap.getAttribute("data-ygbc5-side") !== "3" || !wrap.querySelector("#ygbc5-side-save")) {
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
    var existing = document.getElementById("ygbc5-root");
    if (existing && !document.getElementById("ygbc5-opt-one") && existing.parentNode) {
      existing.parentNode.removeChild(existing);
      existing = null;
    }
    if (!existing) {
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
