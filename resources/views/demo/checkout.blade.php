@extends('demo.layout')

@section('title', 'Checkout — YouGarden Prototype')

@section('body_class', 'demo-checkout-page')
@section('body_attrs')
data-co-line-count="{{ count($cart['items']) }}"
@endsection

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-checkout.css') }}?v={{ filemtime(public_path('css/yg-checkout.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/yg-cart-drawer.css') }}?v={{ filemtime(public_path('css/yg-cart-drawer.css')) }}">
    <style>.co--loading .co-content{visibility:hidden}</style>
@endpush

@section('content')
@php
    $hasVoucher = !empty($cart['voucher_code']);
    $hasOffer = !empty($cart['offer_code']);
    $taxEstimate = round(max(0, $cart['subtotal'] * 0.2 / 1.2), 2);
    $clubActive = ($cart['club_member'] || $cart['club_in_cart']);
    $clubSavingsAmount = ($cart['club_member_savings'] ?? 0) > 0
        ? $cart['club_member_savings']
        : ($clubActive ? ($cart['your_savings'] ?? 0) : 0);
    $showClubSavings = $clubActive && $clubSavingsAmount > 0;
    $showJoinClub = ! $cart['club_member'] && ! $cart['club_in_cart'] && ($cart['club_savings'] ?? 0) > 0;
    $totalSavings = round(
        (float) ($cart['offer_discount'] ?? 0)
        + (float) ($cart['voucher_discount'] ?? 0)
        + ($clubActive ? (float) ($cart['club_member_savings'] ?? 0) : (float) ($cart['savings_from_was'] ?? 0)),
        2
    );
    $payImg = fn (string $file) => asset('images/payments/' . $file);
    $ygPay = fn (string $file) => asset('images/payments/footer/' . $file);
@endphp

<div class="co co--loading" id="co-root" aria-busy="true">
    <script>
        (function () {
            var type = performance.getEntriesByType && performance.getEntriesByType('navigation')[0]?.type;
            if (type && type !== 'navigate') {
                var root = document.getElementById('co-root');
                root.classList.remove('co--loading');
                root.classList.add('co--ready');
                root.removeAttribute('aria-busy');
            }
        })();
    </script>
    <header class="co-header">
        <a href="{{ route('demo.pdp') }}" class="co-header__logo" aria-label="YouGarden home">
            <img src="{{ asset('images/yougarden-logo.png') }}" alt="YouGarden" width="180" height="48">
        </a>
        <a href="{{ route('demo.pdp') }}" class="co-header__cart" aria-label="Return to shop">
            @include('demo.partials.icon', ['name' => 'cart', 'width' => 24, 'height' => 24])
        </a>
    </header>

    <div class="co-layout">
        <main class="co-main">
            @include('demo.partials.checkout-skeleton')
            <div class="co-content">
            <section class="co-express" aria-labelledby="co-express-title">
                <h2 id="co-express-title" class="co-express__title">Choose an express checkout</h2>
                @include('demo.partials.checkout-express-buttons')
                <div class="co-express__payments" aria-label="Accepted payment methods">
                    <p class="co-express__payments-label">We accept:</p>
                    <ul class="co-pay-cards">
                        <li><img src="{{ $ygPay('amazonpayments.png') }}" alt="Amazon Payments"></li>
                        <li><img src="{{ $ygPay('paypal.png') }}" alt="PayPal"></li>
                        <li><img src="{{ $ygPay('mastercard.png') }}" alt="Mastercard"></li>
                        <li><img src="{{ $ygPay('visa.png') }}" alt="Visa"></li>
                        <li><img src="{{ $ygPay('amex.png') }}" alt="American Express"></li>
                        <li><img class="co-pay-cards__apple" src="{{ $ygPay('apple_pay_accept.png') }}" alt="Apple Pay"></li>
                    </ul>
                </div>
            </section>

            <div class="co-divider" role="separator">
                <span>Or continue below with</span>
            </div>

            <form class="co-form" id="co-form" action="{{ route('demo.checkout.complete') }}" method="post" novalidate>
                @csrf
                <section class="co-section" id="co-contact-section">
                    <div class="co-section__head">
                        <h2 class="co-section__title">Contact</h2>
                        <button type="button" class="co-section__link" id="co-login-toggle">Log in</button>
                        <span class="co-section__signed-in" id="co-signed-in" hidden>Signed in</span>
                    </div>

                    <div id="co-login-panel" class="co-login-panel" hidden>
                        <p class="co-login-panel__intro">Sign in to your YouGarden account</p>
                        <label class="co-field">
                            <span class="co-field__label">Email</span>
                            <input type="email" id="co-login-email" class="co-field__input" autocomplete="username">
                        </label>
                        <label class="co-field">
                            <span class="co-field__label">Password</span>
                            <input type="password" id="co-login-password" class="co-field__input" autocomplete="current-password">
                        </label>
                        <button type="button" class="co-login-panel__submit" id="co-login-submit">Sign in</button>
                        <button type="button" class="co-login-panel__guest" id="co-login-guest">Continue as guest</button>
                    </div>

                    <div id="co-contact-guest">
                        <label class="co-field">
                            <span class="co-field__label">Email</span>
                            <input type="email" name="email" id="co-guest-email" class="co-field__input" autocomplete="email" placeholder=" ">
                        </label>
                        <label class="co-check co-check--account">
                            <input type="checkbox" name="create_account" id="co-create-account" value="1">
                            <span>Create an account?</span>
                        </label>

                        <div id="co-account-fields" hidden>
                            <p class="co-field__help" id="co-account-help">
                                If you wish to create an account please enter a password below.
                            </p>

                            <div class="co-field-row">
                                <label class="co-field">
                                    <span class="co-field__label">Title</span>
                                    <select name="account_title" id="co-account-title" class="co-field__input co-field__select" autocomplete="honorific-prefix">
                                        <option value="">Please select…</option>
                                        <option value="MR">MR</option>
                                        <option value="MRS">MRS</option>
                                        <option value="MS">MS</option>
                                        <option value="MISS">MISS</option>
                                        <option value="DR">DR</option>
                                    </select>
                                </label>
                                <label class="co-field">
                                    <span class="co-field__label">Telephone Number</span>
                                    <input type="tel" name="account_phone" id="co-account-phone" class="co-field__input" autocomplete="tel">
                                </label>
                            </div>

                            <div class="co-field-row">
                                <label class="co-field">
                                    <span class="co-field__label">First name</span>
                                    <input type="text" name="account_first_name" id="co-account-first-name" class="co-field__input" autocomplete="given-name">
                                </label>
                                <label class="co-field">
                                    <span class="co-field__label">Last name</span>
                                    <input type="text" name="account_last_name" id="co-account-last-name" class="co-field__input" autocomplete="family-name">
                                </label>
                            </div>

                            <div class="co-field-row">
                                <label class="co-field">
                                    <span class="co-field__label">Password</span>
                                    <input type="password" name="password" id="co-account-password" class="co-field__input" autocomplete="new-password" placeholder=" " aria-describedby="co-account-help">
                                </label>
                                <label class="co-field">
                                    <span class="co-field__label">Retype Password</span>
                                    <input type="password" name="password_confirmation" id="co-account-password-confirm" class="co-field__input" autocomplete="new-password" placeholder=" " aria-describedby="co-account-help">
                                </label>
                            </div>
                        </div>
                        <label class="co-check">
                            <input type="checkbox" name="marketing" checked>
                            <span>I&rsquo;d like to receive email updates with exclusive offers, new launches and sale early access.</span>
                        </label>
                    </div>
                </section>

                <section class="co-section co-section--billing" id="co-billing-section">
                    <h2 class="co-section__title co-section__title--yg">Billing address</h2>
                    <p class="co-section__note co-section__note--lead">The address where the card is registered</p>

                    @include('demo.partials.checkout-postcode-lookup', ['prefix' => 'billing'])
                    <p class="co-manual-link-wrap">
                        <button type="button" class="co-section__link" id="co-billing-manual-toggle" aria-expanded="false" aria-controls="co-billing-fields">
                            Enter address manually
                        </button>
                    </p>

                    <div id="co-billing-fields" class="co-address-fields" hidden>
                        <label class="co-field">
                            <span class="co-field__label">Country/Region</span>
                            <select name="billing_region" class="co-field__input co-field__select" autocomplete="billing country">
                                @foreach(config('countries') as $code => $name)
                                <option value="{{ $code }}" @selected($code === 'GB')>{{ $name }}</option>
                                @endforeach
                            </select>
                        </label>
                        <div class="co-field-row">
                            <label class="co-field">
                                <span class="co-field__label">First name</span>
                                <input type="text" name="billing_first_name" id="co-billing-first-name" class="co-field__input" autocomplete="billing given-name">
                            </label>
                            <label class="co-field">
                                <span class="co-field__label">Last name</span>
                                <input type="text" name="billing_last_name" id="co-billing-last-name" class="co-field__input" autocomplete="billing family-name">
                            </label>
                        </div>
                        <label class="co-field">
                            <span class="co-field__label">Address</span>
                            <input type="text" name="billing_address1" id="co-billing-address1" class="co-field__input" autocomplete="billing address-line1">
                        </label>
                        <label class="co-field">
                            <span class="co-field__label">Apartment, suite, etc. (optional)</span>
                            <input type="text" name="billing_address2" id="co-billing-address2" class="co-field__input" autocomplete="billing address-line2">
                        </label>
                        <label class="co-field">
                            <span class="co-field__label">City</span>
                            <input type="text" name="billing_city" id="co-billing-city" class="co-field__input" autocomplete="billing address-level2">
                        </label>
                        <label class="co-field">
                            <span class="co-field__label">Phone</span>
                            <input type="tel" name="billing_phone" id="co-billing-phone" class="co-field__input" autocomplete="billing tel">
                        </label>
                    </div>
                </section>

                <section class="co-section co-section--delivery" id="co-delivery-section">
                    <input type="hidden" name="delivery_same_as_billing" id="co-delivery-same-as-billing" value="1">

                    <div class="co-address-head">
                        <div>
                            <h2 class="co-section__title co-section__title--yg">Your delivery</h2>
                            <p class="co-address-status" id="co-delivery-status">Your order will be delivered to your billing address</p>
                        </div>
                        <button
                            type="button"
                            class="co-address-toggle"
                            id="co-delivery-toggle"
                            aria-expanded="false"
                            aria-controls="co-delivery-fields"
                        >
                            Choose alternative delivery address
                        </button>
                    </div>

                    <div id="co-delivery-fields" class="co-address-fields" hidden>
                        <label class="co-field">
                            <span class="co-field__label">Country/Region</span>
                            <select name="delivery_region" class="co-field__input co-field__select" autocomplete="shipping country">
                                @foreach(config('countries') as $code => $name)
                                <option value="{{ $code }}" @selected($code === 'GB')>{{ $name }}</option>
                                @endforeach
                            </select>
                        </label>
                        <div class="co-field-row">
                            <label class="co-field">
                                <span class="co-field__label">First name</span>
                                <input type="text" name="delivery_first_name" id="co-delivery-first-name" class="co-field__input" autocomplete="shipping given-name">
                            </label>
                            <label class="co-field">
                                <span class="co-field__label">Last name</span>
                                <input type="text" name="delivery_last_name" id="co-delivery-last-name" class="co-field__input" autocomplete="shipping family-name">
                            </label>
                        </div>
                        <label class="co-field">
                            <span class="co-field__label">Address</span>
                            <input type="text" name="delivery_address1" id="co-delivery-address1" class="co-field__input" autocomplete="shipping address-line1">
                        </label>
                        <label class="co-field">
                            <span class="co-field__label">Apartment, suite, etc. (optional)</span>
                            <input type="text" name="delivery_address2" id="co-delivery-address2" class="co-field__input" autocomplete="shipping address-line2">
                        </label>
                        <label class="co-field">
                            <span class="co-field__label">City</span>
                            <input type="text" name="delivery_city" id="co-delivery-city" class="co-field__input" autocomplete="shipping address-level2">
                        </label>
                        @include('demo.partials.checkout-postcode-lookup', ['prefix' => 'delivery'])
                        <label class="co-field">
                            <span class="co-field__label">Phone</span>
                            <input type="tel" name="delivery_phone" id="co-delivery-phone" class="co-field__input" autocomplete="shipping tel">
                        </label>
                    </div>

                    <label class="co-check co-check--billing">
                        <input type="checkbox" name="save_info">
                        <span>Save this information for next time</span>
                    </label>
                </section>

                <section class="co-section co-section--yg">
                    <h2 class="co-section__title co-section__title--yg">Sending As A Gift?</h2>
                    <label class="co-check co-check--gift">
                        <input type="checkbox" name="is_gift" id="co-gift-toggle" value="1">
                        <span>If you&rsquo;re sending this order as a gift, please tick here to write a message (optional) and ensure that the delivery receipt is sent without prices showing.</span>
                    </label>
                    <div class="co-gift-message" id="co-gift-message" hidden>
                        <label class="co-field">
                            <span class="co-field__label">Gift message (optional)</span>
                            <textarea name="gift_message" class="co-field__input co-field__textarea" rows="4" maxlength="500" placeholder="Add a personal message for the recipient"></textarea>
                        </label>
                    </div>
                </section>

                <section class="co-section co-section--yg">
                    <h2 class="co-section__title co-section__title--yg">Courier Notes:</h2>
                    <div class="co-courier-field">
                        <input
                            type="text"
                            name="courier_notes"
                            id="co-courier-notes"
                            class="co-field__input co-courier-field__input"
                            maxlength="50"
                            aria-describedby="co-courier-hint co-courier-count"
                        >
                        <span class="co-courier-field__limit" id="co-courier-count">(Max. 50 characters)</span>
                    </div>
                    <p class="co-courier-note" id="co-courier-hint">
                        *Please Note: Instructions entered here will appear on the label for the courier only. They are not seen by our packing team and cannot be used for product or delivery date requests.
                    </p>
                </section>

                <section class="co-section">
                    <h2 class="co-section__title">Shipping method</h2>
                    <div class="co-shipping">
                        <label class="co-shipping__option">
                            <input type="radio" name="shipping" value="standard" checked>
                            <span class="co-shipping__name">Standard delivery</span>
                            <span class="co-shipping__price">£{{ number_format($cart['delivery'], 2) }}</span>
                        </label>
                    </div>
                </section>

                <section class="co-section co-section--payment">
                    <h2 class="co-section__title">Payment</h2>
                    <p class="co-section__note co-section__note--lead">All transactions are secure and encrypted.</p>

                    <div class="co-paystack" id="co-paystack">
                        <div class="co-payopt is-selected" data-payopt="card">
                            <label class="co-payopt__row">
                                <input type="radio" name="payment_method" value="card" class="co-payopt__radio" checked>
                                <span class="co-payopt__name">Credit card</span>
                                <span class="co-payopt__marks" aria-hidden="true">
                                    <img class="co-payopt__logo" src="{{ $ygPay('visa.png') }}" alt="Visa">
                                    <img class="co-payopt__logo" src="{{ $ygPay('mastercard.png') }}" alt="Mastercard">
                                    <img class="co-payopt__logo" src="{{ $ygPay('amex.png') }}" alt="American Express">
                                </span>
                            </label>
                            <div class="co-payopt__panel" id="co-payopt-card">
                                <label class="co-field">
                                    <span class="co-field__label">Card number</span>
                                    <input type="text" name="card_number" class="co-field__input" inputmode="numeric" autocomplete="cc-number" placeholder=" ">
                                </label>
                                <div class="co-field-row">
                                    <label class="co-field">
                                        <span class="co-field__label">Expiration date (MM / YY)</span>
                                        <input type="text" class="co-field__input" autocomplete="cc-exp" placeholder=" ">
                                    </label>
                                    <label class="co-field">
                                        <span class="co-field__label">Security code</span>
                                        <input type="text" class="co-field__input" autocomplete="cc-csc" placeholder=" ">
                                    </label>
                                </div>
                                <label class="co-field">
                                    <span class="co-field__label">Name on card</span>
                                    <input type="text" class="co-field__input" autocomplete="cc-name">
                                </label>
                            </div>
                        </div>

                        <div class="co-payopt" data-payopt="paypal">
                            <label class="co-payopt__row">
                                <input type="radio" name="payment_method" value="paypal" class="co-payopt__radio">
                                <span class="co-payopt__name">PayPal</span>
                                <img class="co-payopt__logo" src="{{ $ygPay('paypal.png') }}" alt="PayPal">
                            </label>
                        </div>

                        <div class="co-payopt" data-payopt="clearpay">
                            <label class="co-payopt__row">
                                <input type="radio" name="payment_method" value="clearpay" class="co-payopt__radio">
                                <span class="co-payopt__name">Clearpay</span>
                                <img class="co-payopt__logo" src="{{ $ygPay('clearpay.png') }}" alt="Clearpay">
                            </label>
                        </div>

                        <div class="co-payopt" data-payopt="klarna">
                            <label class="co-payopt__row">
                                <input type="radio" name="payment_method" value="klarna" class="co-payopt__radio">
                                <span class="co-payopt__name">Klarna</span>
                                <span class="co-payopt__klarna-wrap">
                                    <img class="co-payopt__logo" src="{{ $ygPay('klarna.png') }}" alt="Klarna">
                                    <span class="co-payopt__sub">Pay flexibly</span>
                                </span>
                            </label>
                        </div>
                    </div>
                </section>

                <button type="submit" class="co-pay-now" id="co-pay-now">
                    Pay now · £{{ number_format($cart['total'], 2) }}
                </button>

                <p class="co-legal">
                    <a href="#" data-prototype-link>Privacy policy</a>
                    <span aria-hidden="true">·</span>
                    <a href="#" data-prototype-link>Terms of service</a>
                </p>

                <div class="co-marketing-notice">
                    <p>We would like to tell you about our exclusive offers and new products via email, post and SMS.</p>
                    <p>
                        To opt out and see further details, <a href="#" data-prototype-link>click here</a>.
                        To see how we store and use your data please see our <a href="#" data-prototype-link>privacy policy</a>.
                    </p>
                </div>
            </form>
            </div>{{-- /.co-content --}}
        </main>

        <aside class="co-summary" id="co-summary" aria-label="Order summary">
            @include('demo.partials.checkout-skeleton-summary')
            <button
                type="button"
                class="co-summary__toggle"
                id="co-summary-toggle"
                aria-expanded="false"
                aria-controls="co-summary-panel"
            >
                <span class="co-summary__toggle-left">
                    <span class="co-summary__toggle-label">Order summary</span>
                    <svg class="co-summary__chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                        <path d="M2 4.5 6 8l4-3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
                <span class="co-summary__toggle-total co-content">£{{ number_format($cart['total'], 2) }}</span>
            </button>
            <div class="co-summary__inner co-content" id="co-summary-panel">
                <ul class="co-summary__items">
                    @foreach($cart['items'] as $item)
                    @include('demo.partials.checkout-summary-item', ['item' => $item])
                    @endforeach
                </ul>

                @if($showJoinClub)
                <div class="co-club-join">
                    <div class="yg-club-bar">
                        <p class="yg-club-bar__lead">
                            <span class="yg-club-bar__lead-line">Join Our Club</span>
                            <span class="yg-club-bar__lead-line">Today &amp;</span>
                        </p>
                        <p class="yg-club-bar__save">Save £{{ number_format($cart['club_savings'], 2) }}!</p>
                        <button
                            type="button"
                            class="yg-club-bar__btn"
                            data-co-club-open
                            aria-haspopup="dialog"
                            aria-controls="co-club-modal"
                        >
                            Add to basket
                        </button>
                    </div>
                </div>
                @elseif($showClubSavings)
                <div class="co-club-savings" role="status">
                    <p class="co-club-savings__label">Your Club Member Saving Is:</p>
                    <p class="co-club-savings__amount">£{{ number_format($clubSavingsAmount, 2) }}</p>
                    <p class="co-club-savings__note">Member prices are included in your subtotal below.</p>
                </div>
                @endif

                <div class="co-summary__codes" id="co-voucher-block">
                    @if($hasOffer)
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
                    @endif
                    @if($hasVoucher)
                    <div class="co-code-applied co-code-applied--voucher">
                        <span>Voucher <strong>{{ $cart['voucher_code'] }} - £{{ number_format($cart['voucher_discount'], 2) }} OFF</strong> applied</span>
                        <button type="button" class="co-code-applied__remove" data-remove-voucher>Remove</button>
                    </div>
                    @else
                    <div class="co-code-row">
                        <input
                            type="text"
                            id="co-voucher-input"
                            class="co-code-row__input"
                            placeholder="Gift card or voucher code"
                            autocomplete="off"
                            aria-describedby="co-voucher-hint"
                        >
                        <button type="button" class="co-code-row__btn" id="co-voucher-apply">Apply</button>
                    </div>
                    <p class="co-code-hint" id="co-voucher-hint">Gift vouchers are 16 or 10 digits. Demo: try <strong>VOUCHER</strong> at checkout. Offer codes are applied in the basket.</p>
                    <p class="co-code-error" id="co-voucher-error" hidden></p>
                    @endif
                </div>

                <dl class="co-summary__totals">
                    <div class="co-summary__row">
                        <dt>Subtotal</dt>
                        <dd>£{{ number_format($cart['subtotal'], 2) }}</dd>
                    </div>
                    @if($hasOffer && ($cart['offer_discount'] ?? 0) > 0)
                    <div class="co-summary__row co-summary__row--promo">
                        <dt>Offer discount</dt>
                        <dd>−£{{ number_format($cart['offer_discount'], 2) }}</dd>
                    </div>
                    @endif
                    @if($hasVoucher && ($cart['voucher_discount'] ?? 0) > 0)
                    <div class="co-summary__row co-summary__row--promo">
                        <dt>Voucher discount</dt>
                        <dd>−£{{ number_format($cart['voucher_discount'], 2) }}</dd>
                    </div>
                    @endif
                    <div class="co-summary__row">
                        <dt>Delivery</dt>
                        <dd>£{{ number_format($cart['delivery'], 2) }}</dd>
                    </div>
                    @if($totalSavings > 0)
                    <div class="co-summary__row co-summary__row--save co-summary__row--save-total">
                        <dt>Total savings</dt>
                        <dd>£{{ number_format($totalSavings, 2) }}</dd>
                    </div>
                    @endif
                    <div class="co-summary__row co-summary__row--total">
                        <dt>Total</dt>
                        <dd>
                            <span class="co-summary__currency">GBP</span>
                            £{{ number_format($cart['total'], 2) }}
                        </dd>
                    </div>
                </dl>
                <p class="co-summary__tax">Including £{{ number_format($taxEstimate, 2) }} in taxes</p>
            </div>
        </aside>
    </div>

    <footer class="co-footer">
        <a href="{{ route('demo.pdp') }}">← Return to shop</a>
        <span class="co-footer__badge">Prototype checkout</span>
    </footer>
</div>

@if($showJoinClub)
<div class="co-club-modal" id="co-club-modal" hidden>
    <div class="co-club-modal__overlay" data-co-club-close tabindex="-1" aria-hidden="true"></div>
    <div
        class="co-club-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="co-club-modal-title"
    >
        <button type="button" class="co-club-modal__close" data-co-club-close aria-label="Close club membership">
            @include('demo.partials.icon', ['name' => 'close', 'width' => 20, 'height' => 20])
        </button>
        <h2 id="co-club-modal-title" class="visually-hidden">YG Discount Club membership</h2>
        @include('demo.partials.club-panel', ['cart' => $cart])
    </div>
</div>
@endif
@endsection

@push('scripts')
    <script src="{{ asset('js/yg-checkout.js') }}?v={{ filemtime(public_path('js/yg-checkout.js')) }}" defer></script>
@endpush
