/**
 * Crazy Egg → Edit Script
 * Puts Amazon + PayPal + Apple Pay above the table with real spacing.
 * Uses inline styles so gaps still work if Custom CSS is ignored.
 */
(function () {
  if (!/vieword\.csp/i.test(location.href)) return;
  if (!window.matchMedia("(min-width: 1001px)").matches) return;
  if (document.documentElement.getAttribute("data-ce-express") === "1") return;

  var tries = 0;

  function findPaypal() {
    var frame =
      document.querySelector('iframe[title="PayPal"]') ||
      document.querySelector('iframe[name*="paypal_buttons"]');
    if (frame) {
      return (
        frame.closest("#paypal-button-container") ||
        frame.closest(".pp-button-container") ||
        frame.parentElement
      );
    }
    return (
      document.querySelector("#paypal-button-container") ||
      document.querySelector(".pp-button-container")
    );
  }

  function go() {
    var table = document.querySelector(
      "#section2Wrapper table.mainTable, .viewordLeftWrapper table.mainTable"
    );
    var amazon =
      document.querySelector(".AmazonButtonWrapper") ||
      document.querySelector("#AmazonPayButton");
    var paypal = findPaypal();
    var apple =
      document.querySelector("#apple-pay") ||
      document.querySelector(".apple-pay-button-with-text");

    if (!table || !amazon || !paypal) {
      if (++tries < 60) setTimeout(go, 250);
      return;
    }

    document.documentElement.setAttribute("data-ce-express", "1");

    var row = document.querySelector(".ce-express");
    if (!row) {
      row = document.createElement("div");
      row.className = "ce-express";
      table.parentNode.insertBefore(row, table);
    }

    /* Rebuild row order: Amazon | PayPal | Apple Pay */
    if (amazon.parentNode !== row) row.appendChild(amazon);
    if (paypal.parentNode !== row) row.appendChild(paypal);
    if (apple && apple.parentNode !== row) row.appendChild(apple);

    /* Inline spacing — reliable in Crazy Egg */
    row.style.cssText =
      "display:flex!important;flex-direction:row!important;align-items:stretch!important;" +
      "gap:16px!important;width:100%!important;max-width:100%!important;" +
      "margin:0 0 28px!important;padding:0!important;box-sizing:border-box!important;clear:both!important;";

    var kids = row.children;
    var i;
    for (i = 0; i < kids.length; i++) {
      kids[i].style.cssText =
        "flex:1 1 0!important;min-width:0!important;width:auto!important;" +
        "height:50px!important;margin:0!important;overflow:hidden!important;box-sizing:border-box!important;";
    }

    /* Hide Amazon microtext */
    var micro = row.querySelectorAll(
      ".amazonpay-button-microtext, picture.amazonpay-button-microtext, picture"
    );
    for (i = 0; i < micro.length; i++) {
      micro[i].style.cssText = "display:none!important;height:0!important;";
    }

    /* PayPal iframe fill */
    var frames = row.querySelectorAll("iframe");
    for (i = 0; i < frames.length; i++) {
      frames[i].style.cssText =
        "display:block!important;width:100%!important;height:50px!important;border:none!important;";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", go);
  } else {
    go();
  }
})();
