@php
    $placement = $placement ?? 'summary';
    $isExpress = $placement === 'express';
    $showOfferInput = $v40 && ! $hasOffer;
    $showVoucherInput = ! $hasVoucher;
    $showOfferHint = $isExpress && $showOfferInput;
    $showVoucherHint = $isExpress && $showVoucherInput;
@endphp
<div @class([
    'co-summary__codes' => ! $isExpress,
    'co-codes__inner' => $isExpress,
]) id="co-voucher-block">
    @if($isExpress)
    <div class="co-codes__row co-codes__row--fields">
    @endif
        @if($hasOffer)
        <div @class(['co-code-field', 'co-code-field--offer', 'co-code-field--applied' => $isExpress])>
            @if($isExpress)
            <span class="co-code-field__label">Offer code</span>
            @endif
            <div class="co-code-applied co-code-applied--offer">
                <span>
                    Offer
                    @if(($cart['offer_discount'] ?? 0) > 0)
                        <strong>{{ $cart['offer_code'] }} - £{{ number_format($cart['offer_discount'], 2) }} OFF</strong>
                        applied
                    @else
                        <strong>{{ $cart['offer_code'] }}</strong>
                        <span class="co-code-badge" aria-label="Offer code applied">Code Applied</span>
                    @endif
                </span>
                <button type="button" class="co-code-applied__remove" data-remove-offer>Remove</button>
            </div>
        </div>
        @elseif($v40)
        <div class="co-code-field co-code-field--offer">
            @if($isExpress)
            <span class="co-code-field__label">Offer code</span>
            @endif
            <div class="co-code-row co-code-row--offer">
                <input
                    type="text"
                    id="co-offer-input"
                    class="co-code-row__input"
                    placeholder="{{ $isExpress ? 'Enter code' : 'Offer code' }}"
                    autocomplete="off"
                    aria-describedby="co-offer-hint"
                >
                <button type="button" class="co-code-row__btn" id="co-offer-apply">Apply</button>
            </div>
            @unless($isExpress)
            <p class="co-code-hint" id="co-offer-hint">Offer codes from promotions.</p>
            @endunless
            <p class="co-code-error" id="co-offer-error" hidden></p>
        </div>
        @endif
        @if($hasVoucher)
        <div @class(['co-code-field', 'co-code-field--voucher', 'co-code-field--applied' => $isExpress])>
            @if($isExpress)
            <span class="co-code-field__label">Gift card or voucher</span>
            @endif
            <div class="co-code-applied co-code-applied--voucher">
                <span>
                    Voucher
                    @if(strcasecmp((string) $cart['voucher_code'], 'voucher') === 0)
                        <strong>£{{ number_format($cart['voucher_discount'], 2) }} OFF</strong>
                    @else
                        <strong>{{ $cart['voucher_code'] }} - £{{ number_format($cart['voucher_discount'], 2) }} OFF</strong>
                    @endif
                    applied
                </span>
                <button type="button" class="co-code-applied__remove" data-remove-voucher>Remove</button>
            </div>
        </div>
        @else
        <div class="co-code-field co-code-field--voucher">
            @if($isExpress)
            <span class="co-code-field__label">Gift card or voucher</span>
            @endif
            <div class="co-code-row">
                <input
                    type="text"
                    id="co-voucher-input"
                    class="co-code-row__input"
                    placeholder="{{ $isExpress ? 'Enter code' : 'Gift card or voucher code' }}"
                    autocomplete="off"
                    aria-describedby="co-voucher-hint"
                >
                <button type="button" class="co-code-row__btn" id="co-voucher-apply">Apply</button>
            </div>
            @unless($isExpress)
            <p class="co-code-hint" id="co-voucher-hint">Gift vouchers are 16 or 10 digits.</p>
            @endunless
            <p class="co-code-error" id="co-voucher-error" hidden></p>
        </div>
        @endif
    @if($isExpress)
    </div>
    @if($showOfferHint || $showVoucherHint)
    <div class="co-codes__row co-codes__row--hints">
        <div class="co-codes__hint-cell">
            @if($showOfferHint)
            <p class="co-code-hint" id="co-offer-hint">From promotions, emails and adverts.</p>
            @endif
        </div>
        <div class="co-codes__hint-cell">
            @if($showVoucherHint)
            <p class="co-code-hint" id="co-voucher-hint">16 or 10 digit gift card number.</p>
            @endif
        </div>
    </div>
    @endif
    @endif
</div>
