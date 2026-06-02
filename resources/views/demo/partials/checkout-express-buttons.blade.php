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
    <button
        type="button"
        class="co-express-btn co-express-btn--apple"
        data-express="apple"
        aria-label="Apple Pay"
        style="--co-express-bg: url('{{ $expressPay('apple-pay-button.svg') }}')"
    ></button>
</div>
