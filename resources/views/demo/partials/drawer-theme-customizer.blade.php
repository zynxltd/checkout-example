{{-- PDP only — live colour overrides for #yg-cart-drawer (see yg-drawer-theme.js) --}}
<aside class="yg-drawer-theme" id="yg-drawer-theme" aria-label="Cart drawer theme customiser">
    <button
        type="button"
        class="yg-drawer-theme__toggle"
        data-drawer-theme-toggle
        aria-expanded="false"
        aria-controls="yg-drawer-theme-panel"
    >
        Customise drawer
    </button>
    <div class="yg-drawer-theme__panel" id="yg-drawer-theme-panel">
        <h4 class="yg-drawer-theme__title">Drawer theme</h4>
        <p class="yg-drawer-theme__hint">Colours apply to the cart drawer only. Open the basket to preview.</p>
        <ul class="yg-drawer-theme__fields">
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-header-bg" data-drawer-theme="headerBg" value="#ffffff" aria-label="Header background">
                <label class="yg-drawer-theme__label" for="dt-header-bg">Header background</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-header-text" data-drawer-theme="headerText" value="#264f1c" aria-label="Header text">
                <label class="yg-drawer-theme__label" for="dt-header-text">Header text</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-header-badge-bg" data-drawer-theme="headerBadgeBg" value="#264f1c" aria-label="Item count badge">
                <label class="yg-drawer-theme__label" for="dt-header-badge-bg">Item count badge</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-header-badge-text" data-drawer-theme="headerBadgeText" value="#ffffff" aria-label="Count badge text">
                <label class="yg-drawer-theme__label" for="dt-header-badge-text">Count badge text</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-panel-bg" data-drawer-theme="panelBg" value="#f2e7d8" aria-label="Drawer background">
                <label class="yg-drawer-theme__label" for="dt-panel-bg">Drawer background</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-body-text" data-drawer-theme="bodyText" value="#483f3a" aria-label="Body text">
                <label class="yg-drawer-theme__label" for="dt-body-text">Body text</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-muted-text" data-drawer-theme="mutedText" value="#7a726c" aria-label="Muted text">
                <label class="yg-drawer-theme__label" for="dt-muted-text">Muted text</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-accent-text" data-drawer-theme="accentText" value="#264f1c" aria-label="Accent text">
                <label class="yg-drawer-theme__label" for="dt-accent-text">Accent text</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-price" data-drawer-theme="price" value="#e3185d" aria-label="Prices">
                <label class="yg-drawer-theme__label" for="dt-price">Prices</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-item-bg" data-drawer-theme="itemBg" value="#ffffff" aria-label="Product cards">
                <label class="yg-drawer-theme__label" for="dt-item-bg">Product cards</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-qty-bg" data-drawer-theme="qtyBg" value="#ccea81" aria-label="Quantity buttons">
                <label class="yg-drawer-theme__label" for="dt-qty-bg">Quantity buttons</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-qty-icon" data-drawer-theme="qtyIcon" value="#264f1c" aria-label="Quantity text">
                <label class="yg-drawer-theme__label" for="dt-qty-icon">Quantity text</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-club-bg" data-drawer-theme="clubBg" value="#812881" aria-label="Club banner">
                <label class="yg-drawer-theme__label" for="dt-club-bg">Club banner</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-club-text" data-drawer-theme="clubText" value="#ffffff" aria-label="Club banner text">
                <label class="yg-drawer-theme__label" for="dt-club-text">Club banner text</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-club-btn" data-drawer-theme="clubBtn" value="#e3185d" aria-label="Club button">
                <label class="yg-drawer-theme__label" for="dt-club-btn">Club button</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-apply-bg" data-drawer-theme="applyBtnBg" value="#264f1c" aria-label="Apply code button">
                <label class="yg-drawer-theme__label" for="dt-apply-bg">Apply code button</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-apply-text" data-drawer-theme="applyBtnText" value="#ffffff" aria-label="Apply code text">
                <label class="yg-drawer-theme__label" for="dt-apply-text">Apply code text</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-checkout-bg" data-drawer-theme="checkoutBg" value="#468900" aria-label="Checkout button">
                <label class="yg-drawer-theme__label" for="dt-checkout-bg">Checkout button</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-checkout-text" data-drawer-theme="checkoutText" value="#ffffff" aria-label="Checkout text">
                <label class="yg-drawer-theme__label" for="dt-checkout-text">Checkout text</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-reco-heading" data-drawer-theme="recoHeading" value="#264f1c" aria-label="Recommendations title">
                <label class="yg-drawer-theme__label" for="dt-reco-heading">Recommendations title</label>
            </li>
            <li class="yg-drawer-theme__field">
                <input type="color" id="dt-summary-bg" data-drawer-theme="summaryBg" value="#ffffff" aria-label="Summary area">
                <label class="yg-drawer-theme__label" for="dt-summary-bg">Summary area</label>
            </li>
        </ul>
        <button type="button" class="yg-drawer-theme__reset" data-drawer-theme-reset>Reset to defaults</button>
    </div>
</aside>
