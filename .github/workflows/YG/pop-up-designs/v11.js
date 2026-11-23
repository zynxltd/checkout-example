/**
 * Crazy Egg → Edit Script (VARIANT 11)
 * We accept icons only — clickable/linked to payment methods.
 * No SVG express buttons. No payment-grid.
 *
 * .cards.amz      → Amazon Pay (live widget stays in place)
 * .cards.paypal  → PayPal (borrows live iframe under icon for real click)
 * .cards.apple   → Apple Pay when available
 * .cards.visa / .amex / .mastercard → Continue to Secure Checkout
 *
 * Pair with crazyegg-test-ce-buttons-v11.css
 */
(function () {
    var tries = 0;
    var clubTries = 0;
  
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
  
    function findAmazon() {
      return (
        document.querySelector(".AmazonButtonWrapper") ||
        document.querySelector("#AmazonPayButton")
      );
    }
  
    function findApple() {
      return (
        document.querySelector("#apple-pay:not([data-ce-preview])") ||
        document.querySelector(
          ".apple-pay-button-with-text:not([data-ce-preview])"
        )
      );
    }
  
    function findCheckoutAnchor() {
      var btn = document.querySelector(".checkoutButton");
      if (btn) {
        var a = btn.closest("a[href]");
        if (a) return a;
      }
      return document.querySelector('a[href*="order1.csp"]');
    }
  
    function goCheckout() {
      var a = findCheckoutAnchor();
      if (a) {
        a.click();
        return;
      }
      window.location.href =
        "https://www.yougarden.com/csp/secure/yougdn/web/order1.csp";
    }
  
    function triggerAmazon() {
      var liveEl = findAmazon();
      if (!liveEl) return;
      try {
        var amz =
          liveEl.id === "AmazonPayButton"
            ? liveEl
            : liveEl.querySelector("#AmazonPayButton") || liveEl;
        amz.click();
      } catch (e) {}
    }
  
    function triggerApple() {
      var liveEl = findApple();
      if (!liveEl) return;
      try {
        liveEl.click();
      } catch (e) {}
    }
  
    function wireClickCard(el, handler, label) {
      if (!el || el.getAttribute("data-ce-card-wired") === "1") return;
      el.setAttribute("data-ce-card-wired", "1");
      el.classList.add("ce-card-linked");
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      if (label) el.setAttribute("aria-label", label);
  
      el.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        handler();
      });
  
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handler();
        }
      });
    }
  
    /* PayPal iframe needs a real user gesture on the zoid button.
       Overlay the live #paypal-button-container over the We accept icon.
       Do NOT reparent it (breaks createOrder → stuck about:blank spinner).
       After a checkout attempt, settle at home so the sidebar button stays healthy. */
    function wirePaypalCard(card, liveEl) {
      if (!card || !liveEl || card.getAttribute("data-ce-card-wired") === "1") {
        return;
      }
  
      card.setAttribute("data-ce-card-wired", "1");
      card.classList.add("ce-card-linked");
      card.setAttribute("aria-label", "PayPal");
  
      var homeParent = liveEl.parentNode;
      if (!homeParent) return;
  
      var placeholder = document.createElement("div");
      placeholder.className = "ce-paypal-placeholder";
      placeholder.setAttribute("aria-hidden", "true");
      homeParent.insertBefore(placeholder, liveEl);
  
      var borrowed = false;
      var restoreTimer = null;
      var lockUntil = 0;
      var settleUntil = 0;
      var overCard = false;
      var overLive = false;
      var pendingPutBack = false;
      var checkoutOpened = false;
      var homeStyle = liveEl.getAttribute("style") || "";
  
      function cancelRestore() {
        if (restoreTimer) {
          clearTimeout(restoreTimer);
          restoreTimer = null;
        }
      }
  
      function refreshingLayout() {
        try {
          void liveEl.offsetWidth;
          window.dispatchEvent(new Event("resize"));
        } catch (e) {}
      }
  
      function positionOverCard() {
        var r = card.getBoundingClientRect();
        /* Keep near-natural PayPal size so zoid geometry stays valid */
        var w = Math.max(r.width, 150);
        var h = Math.max(r.height, 48);
        var left = r.left + (r.width - w) / 2;
        var top = r.top + (r.height - h) / 2;
        liveEl.style.setProperty("position", "fixed", "important");
        liveEl.style.setProperty("left", left + "px", "important");
        liveEl.style.setProperty("top", top + "px", "important");
        liveEl.style.setProperty("width", w + "px", "important");
        liveEl.style.setProperty("height", h + "px", "important");
        liveEl.style.setProperty("z-index", "2147483646", "important");
        liveEl.style.setProperty("opacity", "0.01", "important");
        liveEl.style.setProperty("pointer-events", "auto", "important");
        liveEl.style.setProperty("margin", "0", "important");
        liveEl.style.setProperty("overflow", "visible", "important");
      }
  
      function putBack() {
        if (!borrowed && !pendingPutBack) return;
        var hadCheckout = checkoutOpened;
        borrowed = false;
        pendingPutBack = false;
        overCard = false;
        overLive = false;
        lockUntil = 0;
        checkoutOpened = false;
        cancelRestore();
        liveEl.classList.remove("ce-paypal-borrowed");
        if (homeStyle) liveEl.setAttribute("style", homeStyle);
        else liveEl.removeAttribute("style");
        placeholder.classList.remove("is-visible");
        placeholder.style.height = "";
        /* Let Smart Buttons reflow in the home slot; block re-borrow briefly
           so a We accept attempt can't thrash the button before the next click. */
        if (hadCheckout) settleUntil = Date.now() + 2000;
        refreshingLayout();
        setTimeout(refreshingLayout, 100);
        setTimeout(refreshingLayout, 500);
      }
  
      function borrow() {
        if (pendingPutBack) return;
        if (Date.now() < settleUntil) return;
        cancelRestore();
        if (!borrowed) {
          borrowed = true;
          placeholder.style.height = (liveEl.offsetHeight || 50) + "px";
          placeholder.classList.add("is-visible");
          liveEl.classList.add("ce-paypal-borrowed");
        }
        positionOverCard();
      }
  
      function restore() {
        if (!borrowed) return;
        if (pendingPutBack) {
          putBack();
          return;
        }
        if (overCard || overLive || Date.now() < lockUntil) {
          restoreTimer = setTimeout(restore, 300);
          return;
        }
        putBack();
      }
  
      function scheduleRestore() {
        if (pendingPutBack) return;
        cancelRestore();
        restoreTimer = setTimeout(restore, 600);
      }
  
      /* Popup closed — park button at home and settle before allowing another borrow */
      function restoreAfterPopup() {
        if (!borrowed) return;
        pendingPutBack = true;
        overCard = false;
        overLive = false;
        cancelRestore();
        var wait = Math.max(800, lockUntil - Date.now());
        restoreTimer = setTimeout(putBack, wait);
      }
  
      function syncHover() {
        if (pendingPutBack) return;
        if (Date.now() < settleUntil) {
          if (borrowed) scheduleRestore();
          return;
        }
        if (overCard) {
          borrow();
        } else if (borrowed && overLive) {
          cancelRestore();
        } else {
          scheduleRestore();
        }
      }
  
      card.addEventListener("mouseenter", function () {
        overCard = true;
        syncHover();
      });
      card.addEventListener("mouseleave", function () {
        overCard = false;
        syncHover();
      });
  
      /* Home-slot hover must never start a borrow (flicker / poison loop) */
      liveEl.addEventListener("mouseenter", function () {
        if (!borrowed || pendingPutBack) return;
        overLive = true;
        cancelRestore();
      });
      liveEl.addEventListener("mouseleave", function () {
        if (!borrowed) return;
        overLive = false;
        syncHover();
      });
  
      card.addEventListener(
        "touchstart",
        function () {
          if (pendingPutBack || Date.now() < settleUntil) return;
          overCard = true;
          lockUntil = Date.now() + 2500;
          borrow();
        },
        { passive: true }
      );
  
      placeholder.addEventListener("mouseenter", function () {
        putBack();
      });
  
      window.addEventListener("blur", function () {
        if (!borrowed) return;
        checkoutOpened = true;
        lockUntil = Date.now() + 2500;
      });
      window.addEventListener("focus", restoreAfterPopup);
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible") restoreAfterPopup();
      });
  
      window.addEventListener(
        "scroll",
        function () {
          if (!borrowed) return;
          if (pendingPutBack) {
            putBack();
            return;
          }
          positionOverCard();
        },
        true
      );
      window.addEventListener("resize", function () {
        if (borrowed && !pendingPutBack) positionOverCard();
      });
    }
  
    function markUnavailable(el) {
      if (!el) return;
      el.classList.add("ce-card-unavailable");
    }
  
    function enhanceClubSaving() {
      var wrap = document.querySelector(".clubSavingWrapper");
      if (!wrap) {
        if (++clubTries < 40) setTimeout(enhanceClubSaving, 250);
        return;
      }
      if (wrap.getAttribute("data-ce-club-linked") === "1") return;
  
      var link = wrap.querySelector(".clubBuyWrapper a[href]");
      var header = wrap.querySelector(".clubSavingHeader");
      var saving = wrap.querySelector(".clubSaving");
      if (!link || !header || !saving) {
        if (++clubTries < 40) setTimeout(enhanceClubSaving, 250);
        return;
      }
  
      var a = document.createElement("a");
      a.href = link.getAttribute("href");
      a.className = "ce-club-link";
      a.setAttribute("aria-label", "Join Our Club Today And Save");
      wrap.insertBefore(a, header);
      a.appendChild(header);
      a.appendChild(saving);
      wrap.setAttribute("data-ce-club-linked", "1");
    }
  
    function go() {
      var cards = document.querySelector(".h1Wrapper .cards-wrapper");
      if (!cards) {
        if (++tries < 40) setTimeout(go, 250);
        return;
      }
  
      document.documentElement.setAttribute("data-ce-cards-v11", "1");
  
      var amazon = findAmazon();
      var paypal = findPaypal();
      var apple = findApple();
  
      var amzCard = cards.querySelector(".cards.amz");
      var ppCard = cards.querySelector(".cards.paypal");
      var appleCard = cards.querySelector(".cards.apple");
      var visaCard = cards.querySelector(".cards.visa");
      var amexCard = cards.querySelector(".cards.amex");
      var mcCard = cards.querySelector(".cards.mastercard");
  
      if (amzCard && !amzCard.getAttribute("data-ce-card-wired")) {
        if (amazon) wireClickCard(amzCard, triggerAmazon, "Amazon Pay");
        else if (tries >= 40) markUnavailable(amzCard);
      }
  
      if (ppCard && !ppCard.getAttribute("data-ce-card-wired")) {
        if (paypal) wirePaypalCard(ppCard, paypal);
        else if (tries >= 60) markUnavailable(ppCard);
      }
  
      var canApple =
        typeof window.ApplePaySession === "function" &&
        window.ApplePaySession.canMakePayments &&
        window.ApplePaySession.canMakePayments();
  
      if (appleCard && !appleCard.getAttribute("data-ce-card-wired")) {
        if (apple) wireClickCard(appleCard, triggerApple, "Apple Pay");
        else if (!canApple && tries >= 20) markUnavailable(appleCard);
      }
  
      wireClickCard(visaCard, goCheckout, "Continue to Secure Checkout");
      wireClickCard(amexCard, goCheckout, "Continue to Secure Checkout");
      wireClickCard(mcCard, goCheckout, "Continue to Secure Checkout");
  
      var waiting =
        (ppCard && !ppCard.getAttribute("data-ce-card-wired")) ||
        (amzCard && !amzCard.getAttribute("data-ce-card-wired")) ||
        (appleCard &&
          !appleCard.getAttribute("data-ce-card-wired") &&
          canApple);
      if (waiting && tries < 60) {
        tries++;
        setTimeout(go, 250);
      }
    }
  
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        go();
        enhanceClubSaving();
      });
    } else {
      go();
      enhanceClubSaving();
    }
  })();
  