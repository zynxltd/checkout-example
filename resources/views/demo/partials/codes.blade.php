{{-- Offer code only in basket; gift vouchers move to checkout (AMO) --}}
@php
    $offerMode = $offerMode ?? (($cart['test_config']['offer_code_mode'] ?? 'visible'));
    $showOfferBlock = $offerMode !== 'hidden' || $hasOffer;
@endphp
@if($showOfferBlock)
<div class="yg-codes @if($offerMode === 'dropdown' && !$hasOffer) yg-codes--dropdown @endif" id="yg-codes">
    <p class="yg-codes__error" id="yg-code-error" hidden></p>

    @if($hasOffer)
    <div class="yg-code-row yg-code-row--set">
        <span class="yg-code-row__text">
            @if(($cart['offer_discount'] ?? 0) > 0)
                Offer <strong>{{ $cart['offer_code'] }} - £{{ number_format($cart['offer_discount'], 2) }} OFF</strong>
            @else
                <strong>{{ $cart['offer_code'] }}</strong>
                <span class="yg-code-badge" aria-label="Offer code applied">Code Applied</span>
            @endif
        </span>
        <button type="button" class="yg-code-row__action" data-remove-code="offer">Remove</button>
    </div>
    @elseif($offerMode !== 'hidden')
    <div class="yg-codes__offer">
        <p class="yg-codes__label" id="yg-codes-label">Have an offer code?</p>
        <div class="yg-code-row">
            <input
                id="yg-input-offer"
                type="text"
                name="offer"
                placeholder="Offer code"
                autocomplete="off"
                aria-labelledby="yg-codes-label"
            >
            <button type="button" data-apply-code="offer">Apply code</button>
        </div>
        <p class="yg-codes__hint">Apply voucher at <a class="yg-codes__hint-link" href="{{ route('demo.checkout') }}">checkout</a>.</p>
    </div>
    @endif
</div>
@endif
