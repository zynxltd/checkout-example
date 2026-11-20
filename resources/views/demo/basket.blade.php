@extends('demo.layout')

@section('title', 'Your Shopping Basket — YouGarden Prototype')
@php
    $basketVisual = ($cart['basket_visual'] ?? '1') === '2' ? '2' : '1';
    $basketBodyClass = 'demo-basket-page'.($basketVisual === '2' ? ' demo-basket-page--v2' : '');
    $clubPromo = 'v3';
@endphp
@section('body_class', $basketBodyClass)

@php
    $checkoutUrl = route('demo.checkout');
    $clubUrl = route('demo.account.club');
    $homeUrl = route('demo.home');
    $isEmpty = !empty($cart['is_empty']);
    $subtotal = (float) ($cart['subtotal'] ?? 0);
    $delivery = (float) ($cart['delivery'] ?? 0);
    $savings = (float) ($cart['your_savings'] ?? $cart['savings_from_was'] ?? 0);
    $orderTotal = (float) ($cart['total'] ?? ($subtotal + $delivery));
    $clubSavings = (float) ($cart['club_savings'] ?? 0);
    $showClub = $clubSavings > 0 && empty($cart['club_in_cart']) && empty($cart['club_member']);
    $showClubPromo = $showClub;
    $clubSavingLabel = '£'.number_format($clubSavings, 2);
    $offerCode = $cart['offer_code'] ?? null;
    $voucherCode = $cart['voucher_code'] ?? null;
    $boost = $cart['root_boost'] ?? null;
    $showSpf = $boost && empty($boost['in_basket']);
    $spfLogo = asset('ce/basket-club/assets/yg-blooming-fast-logo-72.png');
    $ymal = array_slice($cart['upsells'] ?? [], 0, 8);
@endphp

@section('content')
@include('demo.partials.site-chrome', [
    'cart' => $cart,
    'active' => null,
])

<main class="centralWrapper text" id="main">
    <div class="h1Wrapper">
        <h1>Your Shopping Basket</h1>

        <div class="mobile-top-total mobile-only">
            <div class="head">Basket Total:</div>
            <div class="value">£{{ number_format($orderTotal, 2) }}</div>
        </div>

        <div class="cards-wrapper" aria-label="We accept">
            <div class="cards amz" role="img" aria-label="Amazon Pay"></div>
            <div class="cards paypal" role="img" aria-label="PayPal"></div>
            <div class="cards mastercard" role="img" aria-label="Mastercard"></div>
            <div class="cards amex" role="img" aria-label="American Express"></div>
            <div class="cards visa" role="img" aria-label="Visa"></div>
            <div class="text">We accept:</div>
        </div>
    </div>

    @if($isEmpty)
        <div class="demo-basket-empty">
            <p>Your shopping basket is empty.</p>
            <p><a href="{{ $homeUrl }}">Continue shopping</a></p>
        </div>
    @else
        <div class="viewordLeftWrapper">
            <div id="section2Wrapper">
                <div class="payment-grid-wrap payment-grid-wrap--row" aria-label="Express checkout">
                    <div class="payment-grid payment-grid--row">
                        <div class="ce-express-slot ce-express-slot--paypal">
                            <a
                                href="{{ $checkoutUrl }}"
                                class="co-express-btn co-express-btn--paypal ce-express-face"
                                aria-label="Buy with PayPal"
                                style="--co-express-bg: url('{{ asset('images/payments/express/paypal-button.svg') }}')"
                            >
                                <span class="ce-express-label">Buy with PayPal</span>
                            </a>
                        </div>
                        <div class="ce-express-slot ce-express-slot--amazon">
                            <a
                                href="{{ $checkoutUrl }}"
                                class="co-express-btn co-express-btn--amazon ce-express-face"
                                aria-label="Amazon Pay"
                                style="--co-express-bg: url('{{ asset('images/payments/express/amazon-pay-button.svg') }}')"
                            >
                                <span class="ce-express-label">amazon pay</span>
                            </a>
                        </div>
                        <div class="ce-express-slot ce-express-slot--apple">
                            <a
                                href="{{ $checkoutUrl }}"
                                class="co-express-btn co-express-btn--apple ce-express-face ce-express-face--svg"
                                aria-label="Pay with Apple Pay"
                            >
                                {{-- Inline SVG stays sharp on retina; <img>/CSS-bg SVGs rasterise soft in Chrome --}}
                                <span class="ce-express-artwork" aria-hidden="true">
                                    @include('demo.partials.apple-pay-button-svg')
                                </span>
                                <span class="ce-express-label">Pay with Apple Pay</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="basketReload mobile-hide">
                    Your shopping basket contains items from a previous visit to the site.<br>
                    Please check your order carefully before proceeding to checkout.
                </div>

                <table class="mainTable">
                    <thead>
                        <tr>
                            <th width="38%">Item Description</th>
                            <th width="20%" class="headItemPrice">Item Price</th>
                            <th width="24%" class="headQty">Quantity</th>
                            <th width="18%" class="headTotal">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($cart['items'] as $item)
                            @php
                                $productUrl = $item['url'] ?? route('demo.pdp');
                                $unit = (float) ($item['unit_price'] ?? $item['price'] ?? 0);
                                $was = (float) ($item['was_price'] ?? 0);
                                $lineSaving = (float) ($item['line_saving'] ?? 0);
                                $lineTotal = (float) ($item['line_total'] ?? ($unit * (int) $item['qty']));
                                $qty = (int) $item['qty'];
                                $sku = $item['sku'];
                            @endphp
                            <tr data-basket-row="{{ $sku }}">
                                <td>
                                    <div class="prodImageWrapper">
                                        <a href="{{ $productUrl }}">
                                            <img
                                                src="{{ asset($item['image']) }}"
                                                class="prodImage"
                                                alt=""
                                                width="100"
                                                height="100"
                                                loading="lazy"
                                            >
                                        </a>
                                    </div>
                                    <div class="descWrapper">
                                        <div class="desc">
                                            <a href="{{ $productUrl }}">{{ $item['name'] }}</a>
                                        </div>
                                        <div class="pno">Product Code:{{ $sku }}</div>
                                        @if(!empty($item['variant']))
                                            <div class="despatchedFrom">{{ $item['variant'] }}</div>
                                        @endif
                                    </div>
                                </td>
                                <td>
                                    <div class="divider">&nbsp;</div>
                                    <div class="singlePrice">£{{ number_format($unit, 2) }}</div>
                                    @if($was > $unit)
                                        <div class="singleWasPrice">was <span>£{{ number_format($was, 2) }}</span></div>
                                    @endif
                                    @if($lineSaving > 0)
                                        <div class="saving">Saving: £{{ number_format($lineSaving, 2) }}</div>
                                    @endif
                                </td>
                                <td>
                                    <div class="divider">&nbsp;</div>
                                    <div class="qtyWrapper">
                                        <div class="qtyMinus" data-basket-qty-delta="-1" data-sku="{{ $sku }}" role="button" tabindex="0" aria-label="Decrease quantity"></div>
                                        <div class="qtyBox">
                                            <input
                                                type="text"
                                                class="updateQty-input"
                                                value="{{ $qty }}"
                                                inputmode="numeric"
                                                autocomplete="off"
                                                data-basket-qty
                                                data-sku="{{ $sku }}"
                                                aria-label="Quantity for {{ $item['name'] }}"
                                            >
                                        </div>
                                        <div class="qtyPlus" data-basket-qty-delta="1" data-sku="{{ $sku }}" role="button" tabindex="0" aria-label="Increase quantity"></div>
                                    </div>
                                    <div class="removeWrapper">
                                        <button type="button" class="remove" data-basket-remove="{{ $sku }}">x Remove</button>
                                    </div>
                                </td>
                                <td class="lineTotalCell">
                                    <div class="lineTotal">&nbsp; £{{ number_format($lineTotal, 2) }}</div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>

                <div class="buttonPromoWrapper">
                    <a href="{{ $homeUrl }}" class="continueButton basket">Continue Shopping</a>

                    @if($showSpf)
                        <div id="ygspf-root" data-basket-spf>
                            <div id="ygspf">
                                <div id="ygspf-inner">
                                    <div id="ygspf-brand">
                                        <img id="ygspf-logo" src="{{ $spfLogo }}" alt="Blooming Fast" width="44" height="44">
                                        <p id="ygspf-title">Superior <strong>Plant Food</strong> Plus</p>
                                    </div>
                                    <div id="ygspf-msg">For better results, treat your plants before we send them to you.</div>
                                    <button
                                        type="button"
                                        id="ygspf-cta"
                                        data-basket-spf-add="{{ $boost['sku'] }}"
                                        aria-label="Add Superior Plant Food Plus for £1"
                                    >
                                        <span class="ygspf-plus" aria-hidden="true">+</span>
                                        <span class="ygspf-cta-copy">
                                            <span class="ygspf-cta-line">Add to Basket</span>
                                            <span class="ygspf-cta-price">for Just £1</span>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    @endif
                </div>

                @if($showClubPromo)
                    @include('demo.partials.basket-club-promo', [
                        'variant' => $clubPromo,
                        'saving' => $clubSavingLabel,
                        'clubUrl' => $clubUrl,
                    ])
                @endif

                @if(count($ymal))
                    <div class="upsellsWrapper">
                        <div class="upsellHeading">You May Also Like</div>
                        <div class="featuredSlider" id="linkedItems" data-basket-ymal-carousel tabindex="0" aria-label="You may also like products">
                            @foreach($ymal as $upsell)
                                <div class="upsell-box">
                                    <a href="{{ route('demo.pdp') }}">
                                        <div class="imgWrapper">
                                            <img
                                                src="{{ asset($upsell['image']) }}"
                                                alt="{{ $upsell['name'] }}"
                                                width="210"
                                                height="210"
                                                loading="lazy"
                                            >
                                        </div>
                                    </a>
                                    <div class="title">{{ $upsell['name'] }}</div>
                                    <div class="rating" aria-hidden="true">★★★★★</div>
                                    <div class="priceWrapper">
                                        <div class="price">Just <span>£{{ number_format((float) $upsell['price'], 2) }}</span></div>
                                    </div>
                                    <button
                                        type="button"
                                        class="mainButtonGreen moreInfo"
                                        data-basket-upsell-add="{{ $upsell['sku'] }}"
                                        @if(!empty($upsell['in_basket'])) disabled @endif
                                    >{{ !empty($upsell['in_basket']) ? 'IN BASKET' : 'ADD TO BASKET' }}</button>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endif
            </div>
        </div>

        <div id="section2Right">
            <div class="viewordRightWrapper" id="section2ScrollWrapper">
                <div class="buttonsWrapper top mobile-hide">
                    <a href="{{ $checkoutUrl }}">
                        <div class="checkoutButton">
                            <svg class="lock-icon" aria-hidden="true" viewBox="0 0 448 512" width="12" height="14"><path fill="currentColor" d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"/></svg>
                            Continue To Secure Checkout
                        </div>
                    </a>
                </div>

                <div class="totalsOuterWrapper">
                    <div class="totalsContainer">
                        <div class="subTotalsRow">
                            <div class="head">Items Subtotal:</div>
                            <div class="total">£{{ number_format($subtotal, 2) }}</div>
                        </div>
                        <div class="subTotalsRow">
                            <div class="head">Delivery Cost:</div>
                            <div class="total">£{{ number_format($delivery, 2) }}</div>
                        </div>
                        @if($savings > 0)
                            <div class="subTotalsRow">
                                <div class="head">Total Saving</div>
                                <div class="total save">£{{ number_format($savings, 2) }}</div>
                            </div>
                        @endif
                        <div class="subTotalsRow total">
                            <div class="head">Order Total:</div>
                            <div class="total">£{{ number_format($orderTotal, 2) }}</div>
                        </div>
                    </div>
                </div>

                @if($showClubPromo)
                    @include('demo.partials.basket-club-promo-side', [
                        'variant' => $clubPromo,
                        'saving' => $clubSavingLabel,
                        'clubUrl' => $clubUrl,
                    ])
                @elseif($showClub)
                    <div class="clubSavingWrapper">
                        <a href="{{ $clubUrl }}" class="ce-club-link" aria-label="Join Our Club Today And Save">
                            <div class="clubSavingHeader">Join Our Club Today And Save:</div>
                            <div class="clubSaving">£{{ number_format($clubSavings, 2) }}</div>
                        </a>
                        <div class="clubBuyWrapper">
                            <a href="{{ $clubUrl }}"><div class="more">More Information »</div></a>
                        </div>
                    </div>
                @endif

                <div class="mediaSelectWrapper">
                    <div class="head">Do you have an offer code?</div>
                    <form data-basket-offer-form>
                        <input
                            type="text"
                            class="offerInput"
                            name="PromotionCode"
                            value="{{ $offerCode ?? '' }}"
                            autocomplete="off"
                            aria-label="Offer code"
                        >
                        <input type="submit" class="codeApply" value="Apply">
                    </form>
                    <div class="codeText {{ $offerCode ? 'valid' : '' }}" data-basket-offer-msg>{{ $offerCode ? 'Code '.$offerCode.' applied' : '' }}</div>
                    <div class="infoText">Only 1 offer code per order.<br>Please check you have the right code applied.</div>
                </div>

                <div class="voucherWrapper" id="voucherWrapper">
                    <div class="head">Voucher</div>
                    <form data-basket-voucher-form>
                        <input
                            type="text"
                            name="voucherCode"
                            id="voucherCode"
                            class="offerInput"
                            value="{{ $voucherCode ?? '' }}"
                            autocomplete="off"
                            aria-label="Voucher code"
                        >
                        <input type="submit" value="Apply" class="codeApply">
                    </form>
                    <div class="infoText">
                        <span>Enter your 16 digit gift voucher code or 10 digit postage voucher code</span><br>
                        Only 1 voucher can be used at a time
                        <div class="voucherCodeMsg" id="voucherCodeMsg" data-basket-voucher-msg>{{ $voucherCode ? 'Voucher '.$voucherCode.' applied' : '' }}</div>
                    </div>
                </div>

                <div class="buttonsWrapper">
                    <a href="{{ $checkoutUrl }}">
                        <div class="checkoutButton">
                            <svg class="lock-icon" aria-hidden="true" viewBox="0 0 448 512" width="12" height="14"><path fill="currentColor" d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"/></svg>
                            Continue To Secure Checkout
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <div class="viewordClear"></div>
    @endif
</main>

@include('demo.partials.site-footer')

<div id="yg-drawer-mount">
    @include('demo.partials.drawer', ['cart' => $cart])
</div>

<div class="demo-prototype-stack" id="demo-basket-prototype-stack">
    <button type="button" class="demo-prototype-stack__dock" data-prototype-dock aria-expanded="false" aria-controls="demo-basket-prototype-stack-body" aria-label="Prototype tools"></button>
    <div class="demo-prototype-stack__body" id="demo-basket-prototype-stack-body">
        <div class="demo-prototype-stack__bar">
            <span class="demo-prototype-stack__bar-title">Prototype tools</span>
            <button type="button" class="demo-prototype-stack__minimize" data-prototype-minimize aria-label="Minimise prototype tools">Minimise</button>
        </div>
        <div class="demo-prototype-stack__content">
            @include('demo.partials.prototype-tools-shared')
        </div>
    </div>
</div>
<script src="{{ asset('js/demo-prototype-stack.js') }}?v={{ filemtime(public_path('js/demo-prototype-stack.js')) }}" defer></script>
<script src="{{ asset('js/demo-basket-page.js') }}?v={{ filemtime(public_path('js/demo-basket-page.js')) }}" defer></script>
@endsection

@push('head')
<link rel="stylesheet" href="{{ asset('css/demo-site-footer.css') }}?v={{ filemtime(public_path('css/demo-site-footer.css')) }}">
<link rel="stylesheet" href="{{ asset('css/demo-basket-page.css') }}?v={{ filemtime(public_path('css/demo-basket-page.css')) }}">
@if($basketVisual === '2')
<link rel="stylesheet" href="{{ asset('css/demo-basket-page-v2.css') }}?v={{ filemtime(public_path('css/demo-basket-page-v2.css')) }}">
@endif
@if($showClubPromo)
@php
    $clubPromoHtmlAttr = $clubPromo === 'v3' ? 'data-ygbc3' : 'data-ce-yg-club-'.$clubPromo;
@endphp
<script>
    document.documentElement.setAttribute(@json($clubPromoHtmlAttr), '1');
    @if($clubPromo === 'v3')
    document.documentElement.setAttribute('data-ygbc3-layout', window.matchMedia('(max-width: 640px)').matches ? 'mob' : 'desk');
    @endif
</script>
<link rel="stylesheet" href="{{ asset('ce/basket-club/'.$clubPromo.'.css') }}?v={{ filemtime(public_path('ce/basket-club/'.$clubPromo.'.css')) }}">
@endif
@endpush
