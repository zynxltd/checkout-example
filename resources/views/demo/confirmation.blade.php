@extends('demo.layout')

@section('title', 'Thank you — YouGarden')

@section('body_class', 'demo-confirmation-page')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-checkout.css') }}?v={{ filemtime(public_path('css/yg-checkout.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/yg-confirmation.css') }}?v={{ filemtime(public_path('css/yg-confirmation.css')) }}">
@endpush

@section('content')
@php
    $addr = $order['shipping_address'];
    $placedAt = $order['placed_at'] instanceof \DateTimeInterface
        ? $order['placed_at']
        : \Illuminate\Support\Carbon::parse($order['placed_at']);
@endphp

<div class="cr">
    <header class="cr-header">
        <a href="{{ route('demo.pdp') }}" class="cr-header__logo" aria-label="YouGarden home">
            <img src="{{ asset('images/yougarden-logo.png') }}" alt="YouGarden" width="180" height="48">
        </a>
    </header>

    <div class="cr-layout">
        <main class="cr-main">
            <div class="cr-status" role="status">
                <span class="cr-status__icon" aria-hidden="true">
                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                        <circle cx="25" cy="25" r="24" stroke="currentColor" stroke-width="2"/>
                        <path d="M14 25.5 21.5 33 36 17" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
                <h1 class="cr-status__title">Thank you, {{ $order['first_name'] }}!</h1>
            </div>

            <div class="cr-order-meta">
                <p class="cr-order-meta__number">Order {{ $order['number'] }}</p>
                <p class="cr-order-meta__confirm">Confirmation {{ $order['confirmation'] }}</p>
            </div>

            <p class="cr-email-notice">
                You&rsquo;ll receive a confirmation email at
                <strong>{{ $order['email'] }}</strong>
            </p>

            <div class="cr-track-card" role="region" aria-label="Delivery location map preview">
                <div class="cr-track-card__map">
                    <div class="cr-map-placeholder" aria-hidden="true">
                        <svg class="cr-map-placeholder__canvas" viewBox="0 0 640 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="cr-map-sky" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="#e8f0e4"/>
                                    <stop offset="100%" stop-color="#d4e6cf"/>
                                </linearGradient>
                            </defs>
                            <rect width="640" height="200" fill="url(#cr-map-sky)"/>
                            <path fill="#c8dcc0" d="M0 140h640v60H0z"/>
                            <path fill="#f4f7f2" stroke="#dfe8da" stroke-width="2" d="M0 72h180v88H0zm220 0h420v88H220z"/>
                            <path fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" d="M-20 100h280M120 20v160M360 48h300M480 0v200"/>
                            <path fill="none" stroke="#f0f4ee" stroke-width="6" stroke-linecap="round" d="M80 140h200M300 120h240M200 60h120"/>
                            <ellipse cx="520" cy="36" rx="48" ry="28" fill="#b8d4ae" opacity=".85"/>
                            <ellipse cx="88" cy="152" rx="36" ry="20" fill="#b8d4ae" opacity=".7"/>
                        </svg>
                        <span class="cr-map-placeholder__pin">
                            <svg width="28" height="36" viewBox="0 0 28 36" fill="none" aria-hidden="true">
                                <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z" fill="#264f1c"/>
                                <circle cx="14" cy="13" r="5" fill="#fff"/>
                            </svg>
                        </span>
                    </div>
                    <p class="cr-map-placeholder__label">
                        <span class="cr-map-placeholder__city">{{ $addr['city'] }}</span>
                        <span class="cr-map-placeholder__postcode">{{ $addr['postcode'] }}</span>
                    </p>
                </div>
                <p class="cr-track-card__hint">Your order is confirmed — we&rsquo;ll email you when it ships.</p>
            </div>

            <section class="cr-details" aria-labelledby="cr-details-title">
                <h2 id="cr-details-title" class="cr-details__title">Order details</h2>

                <div class="cr-details__grid">
                    <div class="cr-details__block">
                        <h3 class="cr-details__label">Contact information</h3>
                        <p>{{ $order['email'] }}</p>
                    </div>

                    <div class="cr-details__block">
                        <h3 class="cr-details__label">Shipping address</h3>
                        <p>
                            {{ $addr['name'] }}<br>
                            {{ $addr['line1'] }}<br>
                            @if($addr['line2'])
                            {{ $addr['line2'] }}<br>
                            @endif
                            {{ $addr['city'] }}<br>
                            {{ $addr['postcode'] }}<br>
                            {{ $addr['country'] }}
                        </p>
                    </div>

                    <div class="cr-details__block">
                        <h3 class="cr-details__label">Shipping method</h3>
                        <p>{{ $order['shipping_method'] }}</p>
                    </div>

                    <div class="cr-details__block">
                        <h3 class="cr-details__label">Payment</h3>
                        <p>{{ $order['payment_summary'] }}</p>
                        <p class="cr-details__muted">£{{ number_format($order['total'], 2) }} · {{ $placedAt->format('j M Y') }}</p>
                    </div>
                </div>
            </section>

            <div class="cr-actions">
                <a href="{{ route('demo.pdp') }}" class="cr-btn cr-btn--primary">Continue shopping</a>
                <a href="#" class="cr-btn cr-btn--secondary" data-prototype-link>View order status</a>
            </div>

            <p class="cr-prototype-note">Prototype receipt — basket cleared for demo. Add items again to run another checkout.</p>
        </main>

        <aside class="cr-summary" aria-label="Order summary">
            <h2 class="cr-summary__title">Order summary</h2>

            <ul class="co-summary__items">
                @foreach($order['items'] as $item)
                <li class="co-summary-item">
                    <div class="co-summary-item__thumb">
                        <img src="{{ asset($item['image']) }}" alt="" width="64" height="64" loading="lazy">
                        <span class="co-summary-item__qty" aria-label="Quantity: {{ $item['qty'] }}">{{ $item['qty'] }}</span>
                    </div>
                    <div class="co-summary-item__info">
                        <p class="co-summary-item__name">{{ $item['name'] }}</p>
                        @if(!empty($item['variant']))
                        <p class="co-summary-item__variant">{{ $item['variant'] }}</p>
                        @endif
                    </div>
                    <p class="co-summary-item__price">£{{ number_format($item['line_total'], 2) }}</p>
                </li>
                @endforeach
            </ul>

            <dl class="co-summary__totals">
                <div class="co-summary__row">
                    <dt>Subtotal</dt>
                    <dd>£{{ number_format($order['subtotal'], 2) }}</dd>
                </div>
                @if($order['your_savings'] > 0)
                <div class="co-summary__row co-summary__row--save">
                    <dt>Savings</dt>
                    <dd>−£{{ number_format($order['your_savings'], 2) }}</dd>
                </div>
                @endif
                @if($order['code_discount'] > 0)
                <div class="co-summary__row co-summary__row--promo">
                    <dt>Discounts</dt>
                    <dd>−£{{ number_format($order['code_discount'], 2) }}</dd>
                </div>
                @endif
                <div class="co-summary__row">
                    <dt>Shipping</dt>
                    <dd>£{{ number_format($order['delivery'], 2) }}</dd>
                </div>
                <div class="co-summary__row co-summary__row--total">
                    <dt>Total</dt>
                    <dd>
                        <span class="co-summary__currency">GBP</span>
                        £{{ number_format($order['total'], 2) }}
                    </dd>
                </div>
            </dl>
            <p class="co-summary__tax">Including £{{ number_format($order['tax_estimate'], 2) }} in taxes</p>

            @if($order['offer_code'] || $order['voucher_code'])
            <div class="cr-summary__codes">
                @if($order['offer_code'])
                <p>Offer <strong>{{ $order['offer_code'] }}</strong> applied</p>
                @endif
                @if($order['voucher_code'])
                <p>Voucher <strong>{{ $order['voucher_code'] }} - £{{ number_format($order['voucher_discount'], 2) }} OFF</strong> applied</p>
                @endif
            </div>
            @endif
        </aside>
    </div>
</div>
@endsection

@push('scripts')
    <script>
        document.querySelectorAll('[data-prototype-link]').forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Prototype link — not wired in this demo.');
            });
        });
    </script>
@endpush
