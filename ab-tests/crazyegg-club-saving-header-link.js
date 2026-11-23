/**
 * Crazy Egg → Edit Script
 * Make .clubSavingHeader navigate to the Discount Club PDP on click.
 */
(function () {
  var el = document.querySelector(".clubSavingHeader");
  if (!el || el.getAttribute("data-ce-club-link") === "1") return;

  el.setAttribute("data-ce-club-link", "1");
  el.style.cursor = "pointer";
  el.setAttribute("role", "link");
  el.setAttribute("tabindex", "0");

  var url =
    "https://www.yougarden.com/item-p-820001/yg-discount-club-1-year-membership";

  function go() {
    location.href = url;
  }

  el.addEventListener("click", go);
  el.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go();
    }
  });
})();
