@php
    $expressPay = fn (string $file) => asset('images/payments/express/' . $file);
@endphp
<div class="co-express__buttons">
    <button
        type="button"
        class="co-express-btn co-express-btn--paypal"
        data-express="paypal"
        aria-label="PayPal"
        style="--co-express-bg: url('{{ $expressPay('paypal-button.svg') }}')"
    ></button>
    <button
        type="button"
        class="co-express-btn co-express-btn--amazon"
        data-express="amazon"
        aria-label="Amazon Pay"
        style="--co-express-bg: url('{{ $expressPay('amazon-pay-button.svg') }}')"
    ></button>
    @if(($cart['show_apple_pay'] ?? true))
    <button
        type="button"
        class="co-express-btn co-express-btn--apple co-express-btn--apple-svg"
        data-express="apple"
        aria-label="Apple Pay"
    >
        {{-- Inline SVG stays sharp on retina; CSS-bg SVGs crop badly in the 3-up row --}}
        <span class="co-express-btn__artwork" aria-hidden="true">
            @include('demo.partials.apple-pay-button-svg')
        </span>
    </button>
    @endif
</div>
