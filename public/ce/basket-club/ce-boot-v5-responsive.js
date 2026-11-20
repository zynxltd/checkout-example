/**
 * Crazy Egg Edit Script only (~1KB). Leave Edit CSS empty.
 * Loads hosted v5-responsive.css + v5-responsive.js
 * (club bar + SPF — desktop, tablet, mobile).
 *
 * Blooming Fast logo is a raster PNG — host it (Herd/CDN), do not inline SVG.
 * Change BASE for production CDN / yougarden static host.
 */
(function () {
  if (!/vieword\.csp/i.test(location.href || "")) return;
  if (document.documentElement.getAttribute("data-ygbc5-boot") === "1") return;
  document.documentElement.setAttribute("data-ygbc5-boot", "1");

  var BASE = "https://yg-cart-drawer-demo.test/ce/basket-club";
  var VER = "20261117r13";

  var old = document.getElementById("ygbc5-root");
  if (old && old.parentNode) old.parentNode.removeChild(old);

  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = BASE + "/v5-responsive.css?v=" + VER;
  link.id = "ygbc5-css";
  document.head.appendChild(link);

  var script = document.createElement("script");
  script.src = BASE + "/v5-responsive.js?v=" + VER;
  script.async = true;
  script.id = "ygbc5-js";
  document.head.appendChild(script);
})();
