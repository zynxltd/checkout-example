/**
 * Crazy Egg Edit Script only (~1KB). Leave Edit CSS empty.
 * Loads hosted v2.css + v2.js from BASE.
 *
 * Change BASE for production CDN / yougarden static host.
 */
(function () {
  if (!/vieword\.csp/i.test(location.href || "")) return;
  if (document.documentElement.getAttribute("data-ce-yg-club-boot-v2") === "1") return;
  document.documentElement.setAttribute("data-ce-yg-club-boot-v2", "1");

  var BASE = "https://yg-cart-drawer-demo.test/ce/basket-club";

  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = BASE + "/v2.css";
  document.head.appendChild(link);

  var script = document.createElement("script");
  script.src = BASE + "/v2.js";
  script.async = true;
  document.head.appendChild(script);
})();
