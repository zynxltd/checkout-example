/**
 * Crazy Egg Edit Script — Superior Plant Food (all viewports).
 * Leave Edit CSS empty. Loads v5-spf.css + v5-spf.js
 * Can run with club desk/mob tests (separate #ygspf-root).
 */
(function () {
  if (!/vieword\.csp/i.test(location.href || "")) return;
  if (document.documentElement.getAttribute("data-ygspf-boot") === "1") return;
  document.documentElement.setAttribute("data-ygspf-boot", "1");

  var BASE = "https://yg-cart-drawer-demo.test/ce/basket-club";
  var VER = "20261117t1";

  var old = document.getElementById("ygspf-root");
  if (old && old.parentNode) old.parentNode.removeChild(old);

  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = BASE + "/v5-spf.css?v=" + VER;
  link.id = "ygspf-css";
  document.head.appendChild(link);

  var script = document.createElement("script");
  script.src = BASE + "/v5-spf.js?v=" + VER;
  script.async = true;
  script.id = "ygspf-js";
  document.head.appendChild(script);
})();
