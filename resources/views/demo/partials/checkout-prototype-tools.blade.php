<div class="demo-prototype-stack" id="demo-checkout-prototype-stack">
    <button type="button" class="demo-prototype-stack__dock" data-prototype-dock aria-expanded="false" aria-controls="demo-checkout-prototype-stack-body">Prototype tools</button>
    <div class="demo-prototype-stack__body" id="demo-checkout-prototype-stack-body">
        <div class="demo-prototype-stack__bar">
            <span class="demo-prototype-stack__bar-title">Prototype tools</span>
            <button type="button" class="demo-prototype-stack__minimize" data-prototype-minimize aria-label="Minimise prototype tools">Minimise</button>
        </div>
        <div class="demo-prototype-stack__content">
            <aside class="demo-controls" aria-label="Checkout prototype controls">
                <h3>Checkout layout</h3>
                <label class="demo-toggle">
                    <input
                        type="checkbox"
                        id="toggle-checkout-codes-top"
                        data-option="checkout_codes_top"
                        {{ !empty($cart['checkout_codes_top']) ? 'checked' : '' }}
                    >
                    <span>Codes below express checkout</span>
                </label>
                <p class="demo-controls__hint">On: offer and voucher fields sit under PayPal / Amazon Pay. Off: fields stay in the order summary sidebar.</p>
                <label class="demo-toggle">
                    <input
                        type="checkbox"
                        id="toggle-checkout-codes-ticket"
                        data-option="checkout_codes_ticket"
                        {{ !empty($cart['checkout_codes_ticket']) ? 'checked' : '' }}
                    >
                    <span>Dashed coupon border</span>
                </label>
                <p class="demo-controls__hint">Cut-out ticket style on the codes card below express checkout.</p>
                <p class="demo-controls__label">Express checkout</p>
                <label class="demo-toggle">
                    <input
                        type="checkbox"
                        id="toggle-checkout-apple-pay"
                        data-option="apple_pay"
                        {{ ($cart['show_apple_pay'] ?? true) ? 'checked' : '' }}
                    >
                    <span>Apple Pay (express button)</span>
                </label>
                <p class="demo-controls__hint">Shows or hides the Apple Pay button under PayPal and Amazon Pay.</p>
                <p class="demo-controls__label">Payment methods</p>
                <label class="demo-toggle">
                    <input
                        type="checkbox"
                        id="toggle-checkout-clearpay"
                        data-option="clearpay"
                        {{ ($cart['show_clearpay'] ?? true) ? 'checked' : '' }}
                    >
                    <span>Clearpay</span>
                </label>
                <label class="demo-toggle">
                    <input
                        type="checkbox"
                        id="toggle-checkout-klarna"
                        data-option="klarna"
                        {{ ($cart['show_klarna'] ?? true) ? 'checked' : '' }}
                    >
                    <span>Klarna</span>
                </label>
                <p class="demo-controls__hint">Show or hide BNPL options in the payment stack (prototype only — not a live integration).</p>
            </aside>
        </div>
    </div>
</div>
