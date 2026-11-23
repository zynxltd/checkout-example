/**
 * Crazy Egg Edit Script — Club Mobile — logo+banner 1×3 (≤640).
 * Leave Edit CSS empty. Loads v5-club-mob.css + v5-club-mob.js
 */
(function () {
  if (!/vieword\.csp/i.test(location.href || "")) return;
  if (window.matchMedia && !window.matchMedia("(max-width: 640px)").matches) return;
  document.documentElement.removeAttribute("data-ygbc5-boot-mob");
  document.documentElement.removeAttribute("data-ygbc5");
  document.documentElement.setAttribute("data-ygbc5-boot-mob", "1");

  var BASE = "https://yg-cart-drawer-demo.test/ce/basket-club";
  var VER = "20261117t26";

  var old = document.getElementById("ygbc5-root");
  if (old && old.parentNode) old.parentNode.removeChild(old);
  var oldCss = document.getElementById("ygbc5-css-mob");
  if (oldCss && oldCss.parentNode) oldCss.parentNode.removeChild(oldCss);
  var oldJs = document.getElementById("ygbc5-js-mob");
  if (oldJs && oldJs.parentNode) oldJs.parentNode.removeChild(oldJs);

  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = BASE + "/v5-club-mob.css?v=" + VER;
  link.id = "ygbc5-css-mob";
  document.head.appendChild(link);

  var script = document.createElement("script");
  script.src = BASE + "/v5-club-mob.js?v=" + VER;
  script.async = true;
  script.id = "ygbc5-js-mob";
  document.head.appendChild(script);
})();
