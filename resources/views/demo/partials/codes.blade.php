{{-- Offer code only in basket; gift vouchers move to checkout (AMO) --}}
<div class="yg-codes" id="yg-codes">
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
    @else
    <div class="yg-codes__offer">
        <div class="yg-code-row">
            <input
                id="yg-input-offer"
                type="text"
                name="offer"
                placeholder="Have a code?"
                autocomplete="off"
                aria-label="Offer code"
            >
            <button type="button" data-apply-code="offer">Apply code</button>
        </div>
    </div>
    @endif
</div>
