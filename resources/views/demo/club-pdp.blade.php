@extends('demo.layout')

@section('title', 'YG Discount Club Annual Membership — YouGarden')

@section('body_class', 'demo-club-pdp')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-club-pdp.css') }}?v={{ filemtime(public_path('css/demo-club-pdp.css')) }}">
@endpush

@section('content')
@php
    $was = \App\Services\DemoCart::CLUB_WAS_PRICE;
    $auto = \App\Services\DemoCart::CLUB_PRICE;
    $manual = \App\Services\DemoCart::CLUB_MANUAL_PRICE;
@endphp
<div class="demo-site demo-site--argos-home">
    @include('demo.partials.site-chrome-argos', [
        'cart' => $cart,
        'show_trust' => true,
        'search_placeholder' => 'Search plants, trees or outdoor living',
        'shop_menu' => $shop_menu,
        'trending_links' => $trending_links,
    ])

    <main class="demo-club-pdp__main">
        <nav class="demo-club-pdp__crumb" aria-label="Breadcrumb">
            <a href="{{ route('demo.home') }}">Home</a>
            <span class="demo-club-pdp__crumb-sep" aria-hidden="true">›</span>
            <span aria-current="page">YG Discount Club Annual Membership</span>
        </nav>

        <header class="demo-club-pdp__hero">
            <div class="demo-club-pdp__hero-media">
                <img
                    class="demo-club-pdp__logo"
                    src="{{ asset('images/club/discount-club-logo.png') }}"
                    alt="YouGarden Discount Club"
                    width="420"
                    height="168"
                >
            </div>
            <div class="demo-club-pdp__hero-copy">
                <p class="demo-club-pdp__sku">Item code: 820001</p>
                <h1 class="demo-club-pdp__title">YG Discount Club Annual Membership</h1>
                <p class="demo-club-pdp__eyebrow">Now With More Exclusive Benefits!</p>
                <p class="demo-club-pdp__lede">Join the thousands of happy YouGarden Discount Club Members&hellip; Start saving today &amp; for the lifetime of your membership!</p>
                <p class="demo-club-pdp__lede">Become a YouGarden club member today and gain access to <strong>15% off</strong> every order you make, now and for the lifetime of your membership! Plus, never miss a deal with our ever-popular Auto Renewal Yearly Subscription service!</p>
                <p class="demo-club-pdp__live-note">
                    Mockup of
                    <a href="{{ $live_url }}" target="_blank" rel="noopener">the live club page</a>
                    — add to basket works in this demo.
                </p>
            </div>
        </header>

        <section class="demo-club-pdp__offers" aria-label="Membership options">
            <article class="demo-club-pdp__offer demo-club-pdp__offer--auto">
                <h2 class="demo-club-pdp__offer-title">Auto Renewal Yearly Subscription</h2>
                <p class="demo-club-pdp__offer-desc">12-month club membership. Renewed automatically to ensure you get continued access to leading offers &amp; savings. Plus, the membership price you pay will never go up!</p>
                <p class="demo-club-pdp__offer-price">
                    <span class="demo-club-pdp__was">WAS £{{ number_format($was, 0) }}</span>
                    <span class="demo-club-pdp__now">Now £{{ number_format($auto, 0) }} Per Year</span>
                </p>
                <button
                    type="button"
                    class="demo-club-pdp__btn demo-club-pdp__btn--pink"
                    data-club-pdp-add
                    data-club-sku="{{ \App\Services\DemoCart::CLUB_SKU_AUTO }}"
                >Add to Basket</button>
            </article>

            <article class="demo-club-pdp__offer demo-club-pdp__offer--manual">
                <h2 class="demo-club-pdp__offer-title">One Year Membership</h2>
                <p class="demo-club-pdp__offer-desc">12-month club membership. Renew your membership manually each year to continue getting great garden benefits.</p>
                <p class="demo-club-pdp__offer-price demo-club-pdp__offer-price--single">
                    <span class="demo-club-pdp__now demo-club-pdp__now--purple">£{{ number_format($manual, 0) }} Per Year</span>
                </p>
                <button
                    type="button"
                    class="demo-club-pdp__btn demo-club-pdp__btn--purple"
                    data-club-pdp-add
                    data-club-sku="{{ \App\Services\DemoCart::CLUB_SKU_MANUAL }}"
                >Add to Basket</button>
            </article>
        </section>

        <section class="demo-club-pdp__benefits" aria-labelledby="demo-club-benefits-title">
            <h2 class="demo-club-pdp__benefits-title" id="demo-club-benefits-title">Club Benefits &amp; Features</h2>
            <p class="demo-club-pdp__benefits-intro">YouGarden&rsquo;s leading gardener loyalty scheme just got better with bigger discounts all year round, more vouchers to spend and fantastic content &amp; advice, helping you get the most out of your garden!</p>

            <ul class="demo-club-pdp__benefit-grid">
                <li class="demo-club-pdp__benefit">
                    <img class="demo-club-pdp__benefit-icon" src="{{ asset('images/club/benefit-plants.png') }}" alt="" width="72" height="72" loading="lazy">
                    <h3 class="demo-club-pdp__benefit-title">15% off all Plants &amp; Accessories</h3>
                    <p class="demo-club-pdp__benefit-text">We&rsquo;ve upped the always on discount rate for club members, so we&rsquo;ll automatically take an additional <strong>15% off</strong> every plant and accessory order you make, whilst logged into your account, to ensure you always get the very lowest prices — for the entire lifetime of your membership!</p>
                </li>
                <li class="demo-club-pdp__benefit">
                    <img class="demo-club-pdp__benefit-icon" src="{{ asset('images/club/benefit-machinery.png') }}" alt="" width="72" height="72" loading="lazy">
                    <h3 class="demo-club-pdp__benefit-title">7.5% off Outdoor Living &amp; Machinery</h3>
                    <p class="demo-club-pdp__benefit-text">You&rsquo;ll also get <strong>7.5% off</strong> every garden machinery order you make, helping you save on <strong>EVERY</strong> single product you buy from YouGarden.com!</p>
                </li>
                <li class="demo-club-pdp__benefit">
                    <img class="demo-club-pdp__benefit-icon" src="{{ asset('images/club/benefit-vouchers.png') }}" alt="" width="72" height="72" loading="lazy">
                    <h3 class="demo-club-pdp__benefit-title">£20 in Product Vouchers + 2 x Free P&amp;P Vouchers Worth £6.99 each</h3>
                    <p class="demo-club-pdp__benefit-text">We&rsquo;ll send you a Club Pack which contains details of everything you need to know — including <strong>4 x £5.00 vouchers</strong> + <strong>2 x Free P&amp;P Vouchers</strong> (worth £6.99 each) to spend at YouGarden.com on anything you like, across the season. That&rsquo;s an amazing <strong>£33.98 of value!</strong></p>
                </li>
                <li class="demo-club-pdp__benefit">
                    <img class="demo-club-pdp__benefit-icon" src="{{ asset('images/club/benefit-offers.png') }}" alt="" width="72" height="72" loading="lazy">
                    <h3 class="demo-club-pdp__benefit-title">Exclusive Offers and Expert Gardening Knowledge</h3>
                    <p class="demo-club-pdp__benefit-text">Priority access to brand-new exclusive products at our very best prices, plus insider knowledge and gardening inspiration by email.</p>
                </li>
            </ul>
        </section>

        <p class="demo-club-pdp__status" data-club-pdp-status hidden role="status"></p>
    </main>

    @include('demo.partials.site-shell-footer')
    @include('demo.partials.drawer', ['cart' => $cart])
</div>
@endsection

@push('scripts')
<script>
(function () {
    var buttons = document.querySelectorAll('[data-club-pdp-add]');
    var status = document.querySelector('[data-club-pdp-status]');
    if (!buttons.length || !window.YG_DEMO_ROUTES || !window.YG_DEMO_ROUTES.club) return;

    function token() {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    }

    function setStatus(message, isError) {
        if (!status) return;
        status.hidden = !message;
        status.textContent = message || '';
        status.classList.toggle('is-error', !!isError);
    }

    buttons.forEach(function (btn) {
        btn.addEventListener('click', async function () {
            if (btn.disabled) return;
            btn.disabled = true;
            setStatus('Adding membership…', false);
            try {
                var res = await fetch(window.YG_DEMO_ROUTES.club, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': token(),
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({ sku: btn.getAttribute('data-club-sku') || '' }),
                });
                var data = await res.json().catch(function () { return {}; });
                if (!res.ok) {
                    setStatus(data.error || 'Could not add membership.', true);
                    btn.disabled = false;
                    return;
                }
                setStatus('Membership added to basket.', false);
                if (window.YGCartDrawer && typeof window.YGCartDrawer.applyCartResponse === 'function') {
                    window.YGCartDrawer.applyCartResponse(data, { keepOpen: true });
                } else if (data.html && document.querySelector('[data-cart-drawer]')) {
                    location.reload();
                } else {
                    location.href = window.YG_DEMO_ROUTES.checkout || '/checkout';
                }
            } catch (err) {
                setStatus('Could not add membership. Please try again.', true);
                btn.disabled = false;
            }
        });
    });
})();
</script>
@endpush
