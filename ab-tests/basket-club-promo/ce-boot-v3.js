/**
 * Crazy Egg Edit Script only (~1KB). Leave Edit CSS empty.
 * Clears old ce-yg-club V3 leftovers, then loads hosted ygbc3 assets.
 *
 * Change BASE for production CDN / yougarden static host.
 */
(function () {
  if (!/vieword\.csp/i.test(location.href || "")) return;
  if (document.documentElement.getAttribute("data-ygbc3-boot") === "1") return;
  document.documentElement.setAttribute("data-ygbc3-boot", "1");

  var BASE = "https://yg-cart-drawer-demo.test/ce/basket-club";
  var VER = "20261118b";

  // Strip previous CE class-based promo if still in the DOM
  var old = document.querySelector('[data-ce-yg-club-promo="v3"], .ce-yg-club-promo--v3, #ygbc3-root');
  if (old && old.parentNode) old.parentNode.removeChild(old);

  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = BASE + "/v3.css?v=" + VER;
  link.id = "ygbc3-css";
  document.head.appendChild(link);

  var script = document.createElement("script");
  script.src = BASE + "/v3.js?v=" + VER;
  script.async = true;
  script.id = "ygbc3-js";
  document.head.appendChild(script);
})();
