/**
 * Crazy Egg — tiny Edit Script / Custom JS loader for PDP thumbs (mobile).
 * Paste THIS into CE instead of the full file when CE won't refresh large pastes.
 *
 * Loads: https://yg-cart-drawer-demo.test/ce/thumbnail-gallery/v5.js
 * (Herd must be running; only works on machines that resolve *.test)
 *
 * Leave Edit CSS empty (CSS is injected by v5.js).
 * After changing v5.js, bump VER below and re-paste this stub (or hard-refresh).
 */
(function () {
  if (!/\/item-[sp]-/i.test(location.pathname || "")) return;
  if (document.documentElement.getAttribute("data-ce-yg-thumbs-boot") === "1") return;
  document.documentElement.setAttribute("data-ce-yg-thumbs-boot", "1");

  var BASE = "https://yg-cart-drawer-demo.test/ce/thumbnail-gallery";
  var VER = "20261118t5"; /* bump to bust cache */

  var old = document.getElementById("ce-yg-thumbs");
  if (old && old.parentNode) old.parentNode.removeChild(old);
  document.documentElement.removeAttribute("data-ce-yg-thumbs");
  document.documentElement.classList.remove("ce-yg-thumbs-on");

  var s = document.createElement("script");
  s.src = BASE + "/v5.js?v=" + VER;
  s.async = true;
  s.id = "ce-yg-thumbs-boot-js";
  document.head.appendChild(s);
})();
