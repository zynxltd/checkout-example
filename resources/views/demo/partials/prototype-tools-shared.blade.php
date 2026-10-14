@include('demo.partials.drawer-width-control')
@include('demo.partials.drawer-theme-customizer')
<aside class="demo-controls" aria-label="Prototype controls">
    <h3>Prototype controls</h3>
    <p class="demo-controls__label">YG options</p>
    <label class="demo-toggle"><input type="checkbox" id="toggle-upsells" data-option="upsells" {{ $cart['show_upsells'] ? 'checked' : '' }}><span>Recommendations side tab</span></label>
    <label class="demo-toggle"><input type="checkbox" id="toggle-breakdown" data-option="breakdown" {{ ($cart['show_breakdown'] ?? true) ? 'checked' : '' }}><span>Show breakdown</span></label>
    <label class="demo-toggle"><input type="checkbox" id="toggle-apple-pay" data-option="apple_pay" {{ ($cart['show_apple_pay'] ?? true) ? 'checked' : '' }}><span>Apple Pay (express button)</span></label>
    <p class="demo-controls__label">Payment methods</p>
    <label class="demo-toggle"><input type="checkbox" id="toggle-clearpay" data-option="clearpay" {{ ($cart['show_clearpay'] ?? false) ? 'checked' : '' }}><span>Clearpay</span></label>
    <label class="demo-toggle"><input type="checkbox" id="toggle-klarna" data-option="klarna" {{ ($cart['show_klarna'] ?? false) ? 'checked' : '' }}><span>Klarna</span></label>
    <p class="demo-controls__hint">BNPL options in checkout payment stack (prototype only).</p>
</aside>
