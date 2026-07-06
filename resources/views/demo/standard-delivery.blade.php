@extends('demo.layout')

@section('title', 'Standard Delivery — YouGarden')

@section('body_class', 'demo-standard-delivery')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-reviews-footer.css') }}?v={{ filemtime(public_path('css/demo-pdp-reviews-footer.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-standard-delivery.css') }}?v={{ filemtime(public_path('css/demo-standard-delivery.css')) }}">
@endpush

@section('content')
<div class="demo-site">
    @include('demo.partials.site-chrome', ['cart' => $cart, 'show_trust' => true])

    <main class="demo-delivery-main">
        <nav class="demo-delivery__crumb" aria-label="Breadcrumb">
            <a href="{{ route('demo.pdp') }}">Home</a>
            <span class="demo-delivery__crumb-sep">/</span>
            <span aria-current="page">Standard Delivery</span>
        </nav>

        <header class="demo-delivery__hero">
            <h1 class="demo-delivery__title">Standard Delivery</h1>
            <p class="demo-delivery__hero-lead">
                Affordable plants straight to your door — most orders arrive within
                <strong>7&ndash;10 working days</strong>.
            </p>
        </header>

        <div class="demo-delivery__highlights" aria-label="Delivery highlights">
            <div class="demo-delivery__highlight">
                <span class="demo-delivery__highlight-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/></svg>
                </span>
                <p class="demo-delivery__highlight-title">7&ndash;10 working days</p>
                <p class="demo-delivery__highlight-text">Standard delivery on most orders</p>
            </div>
            <div class="demo-delivery__highlight">
                <span class="demo-delivery__highlight-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9 1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                </span>
                <p class="demo-delivery__highlight-title">Fully tracked</p>
                <p class="demo-delivery__highlight-text">InPost or Evri with tracking link</p>
            </div>
            <div class="demo-delivery__highlight">
                <span class="demo-delivery__highlight-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M12 22c4.97 0 9-4.03 9-9 0-4.17-2.84-7.67-6.69-8.69L12 2 9.69 4.31C5.84 5.33 3 8.83 3 13c0 4.97 4.03 9 9 9zm0-2c-3.87 0-7-3.13-7-7 0-3.26 2.22-6.01 5.23-6.79L12 5.1l1.77 1.11C16.78 6.99 19 9.74 19 13c0 3.87-3.13 7-7 7zm-1-7h2v2h-2v-2zm0-6h2v4h-2V7z"/></svg>
                </span>
                <p class="demo-delivery__highlight-title">Nursery fresh</p>
                <p class="demo-delivery__highlight-text">Packed in perfect condition to thrive</p>
            </div>
        </div>

        <section class="demo-delivery__section" aria-labelledby="delivery-timeline">
            <h2 class="demo-delivery__section-title" id="delivery-timeline">What to expect</h2>
            <ol class="demo-delivery__steps">
                <li class="demo-delivery__step">
                    <span class="demo-delivery__step-num" aria-hidden="true">1</span>
                    <div>
                        <h3 class="demo-delivery__step-title">Place your order</h3>
                        <p>Please allow <strong>7&ndash;10 working days</strong> for delivery. Pre-ordered items are sent as soon as possible after the quoted date, and we&rsquo;ll generally ship your entire order together with pre-ordered items.</p>
                    </div>
                </li>
                <li class="demo-delivery__step">
                    <span class="demo-delivery__step-num" aria-hidden="true">2</span>
                    <div>
                        <h3 class="demo-delivery__step-title">Dispatch confirmation</h3>
                        <p>When your order is dispatched, we&rsquo;ll send you an email with details of how to track it.</p>
                    </div>
                </li>
                <li class="demo-delivery__step">
                    <span class="demo-delivery__step-num" aria-hidden="true">3</span>
                    <div>
                        <h3 class="demo-delivery__step-title">Safe delivery</h3>
                        <p>No signature is required. Our courier is asked to leave your order in a safe place on your property. Add delivery instructions at checkout if needed.</p>
                    </div>
                </li>
            </ol>
        </section>

        <section class="demo-delivery__section" aria-labelledby="delivery-couriers">
            <h2 class="demo-delivery__section-title" id="delivery-couriers">Our couriers</h2>
            <div class="demo-delivery__couriers">
                <article class="demo-delivery__courier">
                    <h3 class="demo-delivery__courier-name">InPost</h3>
                    <p>Fully-tracked courier service. We&rsquo;ll send a tracking link when we dispatch your order so you know when it&rsquo;s due to arrive.</p>
                </article>
                <article class="demo-delivery__courier">
                    <h3 class="demo-delivery__courier-name">Evri</h3>
                    <p>Fully-tracked courier service. To avoid perishable items being stuck at depots, no signature is required.</p>
                </article>
                <article class="demo-delivery__courier demo-delivery__courier--post">
                    <h3 class="demo-delivery__courier-name">Royal Mail</h3>
                    <p>Smaller, lighter, single-item orders may be sent through the post &mdash; in which case no tracking is available.</p>
                </article>
            </div>
        </section>

        <section class="demo-delivery__section" aria-labelledby="delivery-details">
            <h2 class="demo-delivery__section-title" id="delivery-details">Important information</h2>

            <div class="demo-delivery__callout demo-delivery__callout--info">
                <p><strong>Tracking &amp; safe place delivery.</strong> We&rsquo;ll send a tracking link when we dispatch your order. Please note, once delivered we cannot be held responsible for loss or theft from your property. If you have any specific delivery instructions, there&rsquo;s an option to enter a short message for the courier at checkout.</p>
            </div>

            <div class="demo-delivery__callout demo-delivery__callout--plant">
                <p><strong>Nursery-fresh plants.</strong> Our experienced nursery team will always send your plants nursery fresh in the perfect condition to thrive when you plant them. Although most plants are very tough and will not be affected by all but the most extreme frosts or heatwaves, we avoid dispatching the most perishable plants if extreme weather is forecast, or over Bank Holiday weekends.</p>
            </div>

            <div class="demo-delivery__callout demo-delivery__callout--note">
                <p><strong>Please note:</strong> We cannot guarantee delivery on a certain day or time. Delivery to outlying postcode areas may take 1&ndash;2 days longer, dependent on your location.</p>
            </div>
        </section>

        <aside class="demo-delivery__help" aria-labelledby="delivery-help">
            <h2 class="demo-delivery__help-title" id="delivery-help">Need help?</h2>
            <p>Questions about your delivery? Our customer services team is here to help.</p>
            <div class="demo-delivery__help-links">
                <a href="#" class="demo-delivery__help-link">Contact us</a>
                <a href="{{ route('demo.account.orders') }}" class="demo-delivery__help-link">Track your order</a>
            </div>
        </aside>
    </main>

    @include('demo.partials.site-shell-footer', ['feefo' => $feefo])
</div>

<div id="yg-drawer-mount">
    @include('demo.partials.drawer', ['cart' => $cart])
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/yg-drawer-theme.js') }}?v={{ filemtime(public_path('js/yg-drawer-theme.js')) }}" defer></script>
@endpush
