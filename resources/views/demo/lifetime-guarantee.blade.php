@extends('demo.layout')

@section('title', 'Our Lifetime Guarantee — YouGarden')

@section('body_class', 'demo-lifetime-guarantee')

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
            <a href="{{ route('demo.home') }}">Home</a>
            <span class="demo-delivery__crumb-sep">/</span>
            <span aria-current="page">Lifetime Guarantee</span>
        </nav>

        <header class="demo-delivery__hero">
            <h1 class="demo-delivery__title">Our Lifetime Guarantee</h1>
            <p class="demo-delivery__hero-lead">
                We&rsquo;re totally committed to great quality products, timely delivery and great value &mdash; all supported by the service you deserve.
            </p>
        </header>

        <p class="demo-delivery__intro">
            As a team of keen horticulturalists with over 50 years&rsquo; experience, whatever you buy from us, we genuinely want you to be delighted with it &mdash; which is why we are happy to provide you with our complete <strong>Double Satisfaction Guarantee</strong>.
        </p>

        <div class="demo-delivery__highlights" aria-label="Guarantee highlights">
            <div class="demo-delivery__highlight">
                <span class="demo-delivery__highlight-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                </span>
                <p class="demo-delivery__highlight-title">30-day guarantee</p>
                <p class="demo-delivery__highlight-text">Complete &amp; unconditional on all products</p>
            </div>
            <div class="demo-delivery__highlight">
                <span class="demo-delivery__highlight-icon demo-delivery__highlight-icon--snow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M12 2 9 7.5 3.5 6.5 5 12 3.5 17.5 9 16.5 12 22l3-5.5 5.5 1-1.5-5.5L21 12l1.5-5.5-5.5-1L12 2zm0 4.2 1.8 3.3 3.7.7-.7 3.7 2.6 2.6-3.7-.7L12 17.8l-1.7-3.2-3.7.7.7-3.7-2.6-2.6 3.7.7L12 6.2z"/></svg>
                </span>
                <p class="demo-delivery__highlight-title">Lifetime guarantee</p>
                <p class="demo-delivery__highlight-text">On all hardy plants &mdash; look for the snowflake</p>
            </div>
            <div class="demo-delivery__highlight">
                <span class="demo-delivery__highlight-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="28" height="28"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </span>
                <p class="demo-delivery__highlight-title">Double satisfaction</p>
                <p class="demo-delivery__highlight-text">Refund, replace or free replacement</p>
            </div>
        </div>

        <section class="demo-delivery__section" aria-labelledby="guarantee-double">
            <h2 class="demo-delivery__section-title" id="guarantee-double">Double guarantee to you</h2>
            <div class="demo-delivery__double">
                <article class="demo-delivery__double-card">
                    <span class="demo-delivery__step-num" aria-hidden="true">1</span>
                    <h3 class="demo-delivery__step-title">30-day satisfaction</h3>
                    <p>All our products are supplied with a complete and unconditional guarantee for the first <strong>30 days</strong> after you receive them, which is in addition to your statutory rights.</p>
                    <p class="demo-delivery__double-tagline">Not totally happy? Return within 30 days and we&rsquo;ll replace or refund in full.</p>
                </article>
                <article class="demo-delivery__double-card">
                    <span class="demo-delivery__step-num" aria-hidden="true">2</span>
                    <h3 class="demo-delivery__step-title">Lifetime on hardy plants</h3>
                    <p>Thereafter we are delighted to provide you with our <strong>Lifetime Guarantee</strong> on all hardy plants* &mdash; which means just that!</p>
                    <p class="demo-delivery__double-tagline">Should any hardy plant fail to thrive, we&rsquo;ll replace free of charge &mdash; you just pay the P&amp;P.</p>
                </article>
            </div>
        </section>

        <blockquote class="demo-delivery__quote">
            <p>If at any time any hardy tree, shrub, plant or bulb you buy from us does not thrive, let us know and we will send you a direct replacement <strong>free of charge</strong> &mdash; all we ask is that you pay for the current standard Postage, Packing and Insurance for the item.**</p>
        </blockquote>

        <section class="demo-delivery__section" aria-labelledby="guarantee-covered">
            <h2 class="demo-delivery__section-title" id="guarantee-covered">What&rsquo;s covered</h2>

            <div class="demo-delivery__callout demo-delivery__callout--plant">
                <p>
                    <span class="demo-delivery__snowflake" aria-hidden="true">&#10052;</span>
                    <strong>Hardy plants</strong> are defined as plants which we would reasonably expect to overwinter and survive multiple growing seasons in the UK climate. Look out for the snowflake symbol &mdash; this means the product is covered under our guarantee.
                </p>
            </div>

            <div class="demo-delivery__callout demo-delivery__callout--info">
                <p><strong>Replacements.</strong> If the product you ordered is no longer available, we will happily replace it with an equivalent item. If your original order was eligible for free P&amp;P, we ask that you pay the current, standard P&amp;P charge in order to replace items under Lifetime Guarantee.</p>
            </div>

            <div class="demo-delivery__callout demo-delivery__callout--note">
                <p><strong>Please note:</strong> The Guarantee applies to the original plant and not to any replacements. We reserve the right to reject claims where lack of appropriate care has contributed to the failure of the plant. Under no circumstances will we issue cash refunds under our Lifetime Guarantee.</p>
            </div>
        </section>

        <aside class="demo-delivery__help" aria-labelledby="guarantee-help">
            <h2 class="demo-delivery__help-title" id="guarantee-help">Need to make a claim?</h2>
            <p>Get in touch with our customer services team and we&rsquo;ll be happy to help.</p>
            <div class="demo-delivery__help-links">
                <a href="#" class="demo-delivery__help-link">Contact us</a>
                <a href="{{ route('demo.standard-delivery') }}" class="demo-delivery__help-link demo-delivery__help-link--secondary">Delivery information</a>
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
