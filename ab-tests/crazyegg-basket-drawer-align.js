/**
 * Crazy Egg → Edit Script
 * Basket page (vieword.csp) → align with YouGarden cart slide-out drawer.
 *
 * Pair with: crazyegg-basket-drawer-align.css
 *
 * Pre-test
 * - MDE: 0.9%
 * - Daily visitors: 933
 * - Duration: 4 weeks
 * - Confidence: 90%
 * - Approx sample: 933 × 28 ≈ 26,124 sessions (~13,062 / variant)
 *
 * Scope: vieword.csp only. Keeps Magento qty/remove/checkout handlers intact.
 */
(function () {
  if (!/vieword\.csp/i.test(location.href || "")) return;
  if (document.documentElement.getAttribute("data-ce-yg-basket-drawer") === "1") {
    return;
  }

  var ATTR = "data-ce-yg-basket-drawer";
  var tries = 0;
  var MAX_TRIES = 40;

  var ICONS = {
    trash:
      '<svg class="ce-yg-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6 7h12v2H6V7zm2 3h2v8H8v-8zm3 0h2v8h-2v-8zm3 0h2v8h-2v-8zM9 4h6l1 2h4v2H4V6h4l1-2z"/></svg>',
    cart:
      '<svg class="ce-yg-checkout__icon" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false"><path fill="currentColor" d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7.2 14h9.7c.8 0 1.5-.5 1.7-1.2l1.8-6.3A1 1 0 0 0 19.5 5H6.2L5.7 3.3A1 1 0 0 0 4.7 2.5H2v2h2l2.4 8.6-.9 1.6A2 2 0 0 0 7.2 16H19v-2H7.2l.5-1.2z"/></svg>',
    minus:
      '<svg class="ce-yg-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path fill="currentColor" d="M5 11h14v2H5z"/></svg>',
    plus:
      '<svg class="ce-yg-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>',
  };

  function text(el) {
    return (el && (el.textContent || "") || "").replace(/\s+/g, " ").trim();
  }

  function moneyText(el) {
    var m = text(el).match(/£[\d,.]+/);
    return m ? m[0] : text(el);
  }

  function parseMoney(el) {
    var n = text(el).replace(/[^\d.]/g, "");
    return parseFloat(n) || 0;
  }

  function formatMoney(n) {
    return "£" + n.toFixed(2);
  }

  function rebuildRow(tr) {
    if (!tr || tr.getAttribute("data-ce-yg-item") === "1") return;
    var cells = tr.cells;
    if (!cells || cells.length < 4) return;
    if (tr.querySelector("th")) return;

    var descTd = cells[0];
    var priceTd = cells[1];
    var qtyTd = cells[2];
    var totalTd = cells[3];

    var imgWrap = descTd.querySelector(".prodImageWrapper");
    var descWrap = descTd.querySelector(".descWrapper");
    if (!imgWrap || !descWrap) return;

    var qtyWrap = qtyTd.querySelector(".qtyWrapper");
    var removeLink = qtyTd.querySelector("a.remove");
    var input = qtyTd.querySelector("input.updateQty-input");
    var minus = qtyTd.querySelector(".qtyMinus");
    var plus = qtyTd.querySelector(".qtyPlus");
    var singlePrice = priceTd.querySelector(".singlePrice");
    var wasEl = priceTd.querySelector(".singleWasPrice");
    var savingEl = priceTd.querySelector(".saving");
    var lineTotalEl = totalTd.querySelector(".lineTotal");

    var qty = input ? parseInt(input.value, 10) || 1 : 1;
    var now = moneyText(lineTotalEl) || moneyText(singlePrice);
    var unitWas = wasEl ? parseMoney(wasEl.querySelector("span") || wasEl) : 0;
    var lineWas = unitWas > 0 ? formatMoney(unitWas * qty) : "";
    var saving = text(savingEl);

    var pnoEl = descWrap.querySelector(".pno");
    var pnoRaw = text(pnoEl);
    var sku = (pnoRaw.match(/(\d+[A-Za-z0-9-]*)\s*$/) || [])[1] || pnoRaw.replace(/^Product\s*(Code|No\.?)\s*:?\s*/i, "");
    if (pnoEl) {
      pnoEl.innerHTML = "Product No. <strong></strong>";
      var strong = pnoEl.querySelector("strong");
      if (strong) strong.textContent = sku;
    }

    var nameEl = descWrap.querySelector(".desc a, .desc");
    var despatched = descWrap.querySelector(".despatchedFrom");
    var descBlock = descWrap.querySelector(".desc");

    var card = document.createElement("div");
    card.className = "ce-yg-item";

    if (imgWrap.parentNode) imgWrap.parentNode.removeChild(imgWrap);
    imgWrap.classList.add("ce-yg-item__img-wrap");
    var img = imgWrap.querySelector("img");
    if (img) img.classList.add("ce-yg-item__img");
    card.appendChild(imgWrap);

    var main = document.createElement("div");
    main.className = "ce-yg-item__main";
    if (descWrap.parentNode) descWrap.parentNode.removeChild(descWrap);
    descWrap.classList.add("ce-yg-item__desc");
    if (nameEl && nameEl.tagName === "A") nameEl.classList.add("ce-yg-item__name");
    if (despatched) {
      despatched.classList.add("ce-yg-item__variant");
      /* Keep despatch copy; strip bold noise for drawer-like muted line */
      despatched.innerHTML = text(despatched);
    }
    /* Drawer order: Product No. → name → variant */
    if (pnoEl && descBlock) {
      descWrap.insertBefore(pnoEl, descBlock);
    }
    main.appendChild(descWrap);

    var foot = document.createElement("div");
    foot.className = "ce-yg-item__foot";

    var controls = document.createElement("div");
    controls.className = "ce-yg-item__controls";

    var qtyPill = document.createElement("div");
    qtyPill.className = "ce-yg-qty";
    if (qtyWrap && qtyWrap.parentNode) qtyWrap.parentNode.removeChild(qtyWrap);
    if (minus) {
      minus.innerHTML = ICONS.minus;
      minus.setAttribute("aria-label", "Decrease quantity");
      minus.classList.add("ce-yg-qty__btn");
    }
    if (plus) {
      plus.innerHTML = ICONS.plus;
      plus.setAttribute("aria-label", "Increase quantity");
      plus.classList.add("ce-yg-qty__btn");
    }
    if (input) {
      input.classList.add("ce-yg-qty__input");
      input.setAttribute("aria-label", "Quantity");
    }
    if (qtyWrap) {
      qtyWrap.classList.add("ce-yg-qty__inner");
      qtyPill.appendChild(qtyWrap);
    }
    controls.appendChild(qtyPill);

    if (removeLink) {
      var removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "ce-yg-item__remove";
      removeBtn.setAttribute("aria-label", "Remove item");
      removeBtn.innerHTML = ICONS.trash;
      removeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof removeLink.onclick === "function") {
          removeLink.onclick.call(removeLink, e);
        } else if (removeLink.href && removeLink.href !== "javascript:void(0);") {
          location.href = removeLink.href;
        } else {
          removeLink.click();
        }
      });
      controls.appendChild(removeBtn);
      removeLink.style.display = "none";
      removeLink.setAttribute("aria-hidden", "true");
      /* keep link in DOM for any Magento scripts that query it */
      controls.appendChild(removeLink);
    }

    var priceBox = document.createElement("div");
    priceBox.className = "ce-yg-item__price";
    var nowEl = document.createElement("span");
    nowEl.className = "ce-yg-item__now";
    nowEl.textContent = now;
    priceBox.appendChild(nowEl);
    if (lineWas) {
      var wasLine = document.createElement("span");
      wasLine.className = "ce-yg-item__was-line";
      wasLine.innerHTML = 'was <span class="ce-yg-item__was"></span>';
      wasLine.querySelector(".ce-yg-item__was").textContent = lineWas;
      priceBox.appendChild(wasLine);
    }
    if (saving) {
      var saveLine = document.createElement("span");
      saveLine.className = "ce-yg-item__saving";
      saveLine.textContent = saving;
      priceBox.appendChild(saveLine);
    }

    foot.appendChild(controls);
    foot.appendChild(priceBox);
    main.appendChild(foot);
    card.appendChild(main);

    while (tr.firstChild) tr.removeChild(tr.firstChild);
    var cell = document.createElement("td");
    cell.colSpan = 4;
    cell.className = "ce-yg-item-cell";
    cell.appendChild(card);
    tr.appendChild(cell);
    tr.classList.add("ce-yg-item-row");
    tr.setAttribute("data-ce-yg-item", "1");
  }

  function rebuildClub(club) {
    if (!club || club.getAttribute("data-ce-yg-club") === "1") return;
    var amount = text(club.querySelector(".clubSaving"));
    var link = club.querySelector("a");
    var href = link ? link.getAttribute("href") : "/item-p-820001/yg-discount-club-1-year-membership";
    if (!amount) return;

    var bar = document.createElement("a");
    bar.className = "ce-yg-club-bar";
    bar.href = href;
    bar.setAttribute(
      "aria-label",
      "Join the Club and save " + amount + " — more information"
    );
    bar.innerHTML =
      '<span class="ce-yg-club-bar__lead">' +
      '<span class="ce-yg-club-bar__lead-line">Join the</span>' +
      '<span class="ce-yg-club-bar__lead-line">Club &amp;</span>' +
      "</span>" +
      '<span class="ce-yg-club-bar__save">Save ' +
      amount +
      "!</span>" +
      '<span class="ce-yg-club-bar__btn">More Info</span>';

    club.innerHTML = "";
    club.appendChild(bar);
    club.classList.add("ce-yg-club-wrap");
    club.setAttribute("data-ce-yg-club", "1");
  }

  function restyleOffer(media) {
    if (!media || media.getAttribute("data-ce-yg-offer") === "1") return;
    var head = media.querySelector(".head");
    if (head) head.textContent = "Offer code";
    var input = media.querySelector("input.offerInput");
    if (input) {
      input.setAttribute("placeholder", "Enter offer code");
      input.setAttribute("aria-label", "Offer code");
    }
    var apply = media.querySelector("input.codeApply, .codeApply");
    if (apply) {
      if (apply.tagName === "INPUT") apply.value = "Apply code";
      else apply.textContent = "Apply code";
    }
    var info = media.querySelector(".infoText");
    if (info) {
      info.innerHTML =
        'Have a gift or postage voucher? <a class="ce-yg-codes__hint-link" href="#voucherWrapper">Apply at checkout.</a>';
    }
    media.classList.add("ce-yg-codes");
    media.setAttribute("data-ce-yg-offer", "1");
  }

  function restyleCheckoutButtons() {
    var buttons = document.querySelectorAll(".checkoutButton");
    var i;
    for (i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      if (btn.getAttribute("data-ce-yg-checkout") === "1") continue;
      btn.innerHTML =
        ICONS.cart +
        '<span class="ce-yg-checkout__label">Proceed to Checkout</span>';
      btn.classList.add("ce-yg-checkout");
      btn.setAttribute("data-ce-yg-checkout", "1");
    }
  }

  function restyleTitle() {
    var h1 = document.querySelector(".h1Wrapper h1, #section2Wrapper h1, h1");
    if (h1 && /shopping basket/i.test(text(h1))) {
      h1.textContent = "Your Basket";
    }
  }

  function restyleTotals() {
    var rows = document.querySelectorAll(".totalsContainer .subTotalsRow");
    var i;
    for (i = 0; i < rows.length; i++) {
      var row = rows[i];
      var head = row.querySelector(".head");
      if (!head) continue;
      var label = text(head).replace(/:$/, "");
      if (/Items Subtotal/i.test(label)) head.textContent = "Subtotal";
      else if (/Delivery Cost/i.test(label)) head.textContent = "Delivery";
      else if (/Total Saving/i.test(label)) head.textContent = "Total Saving";
      else if (/Order Total/i.test(label)) head.textContent = "Order Total";
    }
  }

  /* Drawer summary order: club → offer → totals → checkout → express */
  function reorderSummary() {
    var right = document.querySelector(".viewordRightWrapper");
    if (!right || right.getAttribute("data-ce-yg-order") === "1") return;

    var club = right.querySelector(".clubSavingWrapper");
    var offer = right.querySelector(".mediaSelectWrapper");
    var voucher = right.querySelector("#voucherWrapper, .voucherWrapper");
    var totals = right.querySelector(".totalsOuterWrapper");
    var topBtn = right.querySelector(".buttonsWrapper.top");
    var bottomBtn = null;
    var wrappers = right.querySelectorAll(".buttonsWrapper");
    var w;
    for (w = 0; w < wrappers.length; w++) {
      if (!wrappers[w].classList.contains("top")) bottomBtn = wrappers[w];
    }

    var frag = document.createDocumentFragment();
    if (club) frag.appendChild(club);
    if (offer) frag.appendChild(offer);
    if (voucher) frag.appendChild(voucher);
    if (totals) frag.appendChild(totals);
    if (topBtn) frag.appendChild(topBtn);
    if (bottomBtn && bottomBtn !== topBtn) frag.appendChild(bottomBtn);

    /* Keep any remaining nodes (express pay hosts, etc.) after */
    var leftovers = [];
    while (right.firstChild) leftovers.push(right.removeChild(right.firstChild));
    right.appendChild(frag);
    for (w = 0; w < leftovers.length; w++) {
      right.appendChild(leftovers[w]);
    }

    /* One primary checkout after totals; keep express pay hosts in bottom wrapper */
    if (topBtn && bottomBtn && bottomBtn !== topBtn) {
      var dup = bottomBtn.querySelector(".checkoutButton, a[href*='order1.csp']");
      if (dup) {
        var dupWrap = dup.closest("a") || dup;
        dupWrap.classList.add("ce-yg-dup-checkout");
        dupWrap.style.display = "none";
      }
    }

    right.setAttribute("data-ce-yg-order", "1");
  }

  function go() {
    var table =
      document.querySelector("#section2Wrapper table.mainTable") ||
      document.querySelector(".viewordLeftWrapper table.mainTable") ||
      document.querySelector("table.mainTable");
    if (!table) {
      if (++tries < MAX_TRIES) setTimeout(go, 200);
      return;
    }

    document.documentElement.setAttribute(ATTR, "1");
    document.body.classList.add("ce-yg-basket-drawer");

    restyleTitle();

    var headerRow = table.querySelector("tr");
    if (headerRow && headerRow.querySelector("th")) {
      headerRow.classList.add("ce-yg-table-head");
    }

    var rows = table.querySelectorAll("tr");
    var r;
    for (r = 0; r < rows.length; r++) {
      rebuildRow(rows[r]);
    }

    rebuildClub(document.querySelector(".clubSavingWrapper"));
    restyleOffer(document.querySelector(".mediaSelectWrapper"));
    restyleTotals();
    restyleCheckoutButtons();
    reorderSummary();

    var voucher = document.querySelector("#voucherWrapper, .voucherWrapper");
    if (voucher) voucher.classList.add("ce-yg-voucher");

    /* Soften left-column duplicate CTA — primary CTA lives in summary */
    var leftTop = document.querySelector(
      ".viewordLeftWrapper .buttonsWrapper.top.left"
    );
    if (leftTop) leftTop.classList.add("ce-yg-left-checkout");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", go);
  } else {
    go();
  }
})();
