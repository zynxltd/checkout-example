/**
 * Crazy Egg Edit Script — Club Desktop/Tablet only.
 * Leave Edit CSS empty. Loads v5-club-desk.css + v5-club-desk.js
 */
(function () {
  if (!/vieword\.csp/i.test(location.href || "")) return;
  if (window.matchMedia && window.matchMedia("(max-width: 640px)").matches) return;
  if (document.documentElement.getAttribute("data-ygbc5-boot-desk") === "1") return;
  document.documentElement.setAttribute("data-ygbc5-boot-desk", "1");

  var BASE = "https://yg-cart-drawer-demo.test/ce/basket-club";
  var VER = "20261117t1";

  var old = document.getElementById("ygbc5-root");
  if (old && old.parentNode) old.parentNode.removeChild(old);

  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = BASE + "/v5-club-desk.css?v=" + VER;
  link.id = "ygbc5-css-desk";
  document.head.appendChild(link);

  var script = document.createElement("script");
  script.src = BASE + "/v5-club-desk.js?v=" + VER;
  script.async = true;
  script.id = "ygbc5-js-desk";
  document.head.appendChild(script);
})();
