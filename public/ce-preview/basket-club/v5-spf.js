/**
 * Crazy Egg — Superior Plant Food (separate test)
 *
 * Paste into Crazy Egg Variant → Edit Script
 * Pair with: v5-spf.css → Edit CSS
 *
 * Shared SPF banner for club variants 1 & 2.
 * Desktop + tablet + mobile. Own data-ygspf / #ygspf-root
 * (can run alongside club variants).
 */
(function () {
  if (!/vieword\.csp/i.test(location.href || "")) return;

  var ATTR = "data-ygspf";
  var ST_SPF = "ST0021276";
  var PROD_SPF = "100201";
  var alreadyBooted =
    document.documentElement.getAttribute(ATTR) === "1" &&
    !!document.getElementById("ygspf-root");
  var BASE = "https://yg-cart-drawer-demo.test/ce/basket-club";
  var LOGO_BF = BASE + "/assets/yg-blooming-fast-logo-72.png";
  var tries = 0;
  var MAX = 40;
  var adding = false;

  function loadGelica() {
    if (document.querySelector('link[data-ygspf-gelica]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://use.typekit.net/hrf1tkz.css";
    link.setAttribute("data-ygspf-gelica", "1");
    document.head.appendChild(link);
  }

  function mountPoint() {
    return (
      document.querySelector(".viewordLeftWrapper .buttonPromoWrapper") ||
      document.querySelector(".buttonPromoWrapper") ||
      document.querySelector(".viewordLeftWrapper table.mainTable") ||
      document.querySelector("table.mainTable")
    );
  }

  /* Already in bag as “Blooming Fast Pre-Delivery Plant Treatment” (100201). */
  function spfInBasket() {
    if (document.querySelector('a[href*="item-p-' + PROD_SPF + '"]')) return true;
    var scope =
      document.querySelector(".viewordLeftWrapper table.mainTable") ||
      document.querySelector("table.mainTable") ||
      document.querySelector(".viewordLeftWrapper");
    if (!scope) return false;
    var html = scope.innerHTML || "";
    return (
      html.indexOf("item-p-" + PROD_SPF) !== -1 ||
      html.indexOf("Product Code:" + PROD_SPF) !== -1 ||
      /Pre-Delivery Plant Treatment/i.test(html)
    );
  }

  function hideBanner() {
    var root = document.getElementById("ygspf-root");
    if (root && root.parentNode) root.parentNode.removeChild(root);
    /* Still flag so CSS keeps native .promoItemWrapper hidden */
    document.documentElement.setAttribute(ATTR, "1");
  }

  /* Native live SPF CTA — CSS hides .promoItemWrapper; we read its token. */
  function nativeSpfBuy() {
    return (
      document.querySelector(".buttonPromoWrapper .promoBuy") ||
      document.querySelector(".promoItemWrapper .promoBuy") ||
      document.querySelector(".mainButton.promoBuy")
    );
  }

  function spfToken() {
    var btn = nativeSpfBuy();
    var oc = (btn && btn.getAttribute("onclick")) || "";
    var m = oc.match(/doAjaxBag\(\s*['\"]([^'\"]+)['\"]/);
    if (m && m[1]) return m[1];
    /* Fallback: first token on the page */
    var nodes = document.querySelectorAll("[onclick*='doAjaxBag']");
    for (var i = 0; i < nodes.length; i++) {
      var o = nodes[i].getAttribute("onclick") || "";
      var mm = o.match(/doAjaxBag\(\s*['\"]([^'\"]+)['\"]/);
      if (mm && mm[1]) return mm[1];
    }
    return "";
  }

  function markAdding() {
    var cta = document.getElementById("ygspf-cta");
    if (!cta) return;
    cta.disabled = true;
    cta.setAttribute("aria-busy", "true");
    var line = cta.querySelector(".ygspf-cta-line");
    if (line) line.textContent = "Adding…";
  }

  function addSpf(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    }
    if (adding) return;
    if (typeof window.doAjaxBag !== "function") return;

    var token = spfToken();
    if (!token) return;

    adding = true;
    markAdding();

    /*
     * Call doAjaxBag directly (same args as native .promoBuy).
     * Site success: scrollTop:0 + window.location=window.location.
     * With a #ce-abtest-… hash that self-assign can be a no-op, so the
     * basket table never refreshes — force reload if still here.
     */
    window.doAjaxBag(token, ST_SPF, 1, "", "vieword");
    setTimeout(hideBanner, 350);
    setTimeout(function () {
      try {
        location.reload();
      } catch (err) {}
    }, 700);
  }

  function insertAfter(anchor, node) {
    if (anchor.nextSibling) anchor.parentNode.insertBefore(node, anchor.nextSibling);
    else anchor.parentNode.appendChild(node);
  }

  function buildSpf() {
    var root = document.createElement("div");
    root.id = "ygspf-root";
    root.innerHTML =
      '<div id="ygspf">' +
      '<div id="ygspf-inner">' +
      '<div id="ygspf-brand">' +
      '<img id="ygspf-logo" src="' + LOGO_BF + '" alt="Blooming Fast" width="44" height="44">' +
      '<p id="ygspf-title">Superior <strong>Plant Food</strong> Plus</p>' +
      "</div>" +
      '<div id="ygspf-msg">For better results, treat your plants before we send them to you.</div>' +
      '<button type="button" id="ygspf-cta">' +
      '<span class="ygspf-plus" aria-hidden="true">+</span>' +
      '<span class="ygspf-cta-copy">' +
      '<span class="ygspf-cta-line">Add to Basket</span>' +
      '<span class="ygspf-cta-price">for Just £1</span>' +
      "</span></button>" +
      "</div></div>";
    return root;
  }

  /* Capture-phase delegation — survives CE DOM churn / nested span clicks */
  document.addEventListener(
    "click",
    function (e) {
      var t = e.target;
      if (!t) return;
      var cta =
        t.id === "ygspf-cta"
          ? t
          : t.closest
            ? t.closest("#ygspf-cta")
            : null;
      if (!cta) return;
      addSpf(e);
    },
    true
  );

  function go() {
    var anchor = mountPoint();
    if (!anchor) {
      if (++tries < MAX) setTimeout(go, 250);
      return;
    }

    if (spfInBasket()) {
      hideBanner();
      return;
    }

    if (!document.getElementById("ygspf-root")) {
      loadGelica();
      /* Prefer mounting before club root if both tests run */
      var club =
        document.getElementById("ygbc5-root") ||
        document.getElementById("ygbc3-root") ||
        document.getElementById("ygbc4-root");
      if (club && club.parentNode) club.parentNode.insertBefore(buildSpf(), club);
      else insertAfter(anchor, buildSpf());
    }
    document.documentElement.setAttribute(ATTR, "1");
  }

  if (alreadyBooted) {
    if (spfInBasket()) hideBanner();
    return;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
  else go();
})();
