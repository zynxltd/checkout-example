@extends('demo.layout')

@section('title', 'Sale — Save up to 58% on garden favourites | YouGarden')

@section('body_class', 'demo-listing demo-sale')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-reviews-footer.css') }}?v={{ filemtime(public_path('css/demo-pdp-reviews-footer.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-listing.css') }}?v={{ filemtime(public_path('css/demo-listing.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/sale-landing.css') }}?v={{ filemtime(public_path('css/sale-landing.css')) }}">
@endpush

@section('content')
<div class="demo-site demo-site--sale" data-sale-page>
    @include('demo.partials.site-chrome', [
        'cart' => $cart,
        'show_trust' => true,
        'search_placeholder' => 'Search sale plants, roses or fruit',
        'shop_menu' => $shop_menu,
        'trending_links' => $trending_links,
    ])

    <main class="demo-listing-main demo-sale__main">
        <nav class="demo-listing__crumb" aria-label="Breadcrumb">
            <a href="{{ route('demo.home') }}" class="demo-listing__crumb-link--home">
                <span class="demo-listing__crumb-home" aria-hidden="true">@include('demo.partials.icon', ['name' => 'home', 'width' => 14, 'height' => 14])</span>
                <span class="visually-hidden">Home</span>
            </a>
            <span class="demo-listing__crumb-sep" aria-hidden="true">|</span>
            <span aria-current="page">Sale</span>
        </nav>

        <header class="demo-listing-seo-intro">
            <h1 class="demo-listing-seo-intro__title">Sale</h1>
            <h2 class="demo-listing-seo-intro__subtitle">Save on garden favourites</h2>
            <div class="demo-listing-seo-intro__copy" id="listing-seo-intro" data-collapsed="true">
                <div class="demo-listing-seo-intro__body">
                    <p>Shop clearance and seasonal deals on plants, roses, trees and outdoor living — with the same filters and product cards as our category pages.</p>
                </div>
                <button
                    type="button"
                    class="demo-listing-seo-intro__toggle"
                    id="listing-seo-intro-toggle"
                    aria-expanded="false"
                    aria-controls="listing-seo-intro"
                >Read more</button>
            </div>
        </header>

        @include('demo.partials.listing-filters', ['listing' => $listing])

        <section class="yg-sale-products" id="sale-all-deals" aria-labelledby="yg-sale-heading">
            <div class="yg-sale-products__head">
                <h2 id="yg-sale-heading" class="yg-sale-products__title">
                    <span data-sale-heading>All sale items</span>
                </h2>
            </div>
            <div class="resListingWrapper demo-listing__grid yg-sale-products__grid" data-sale-grid="all">
                @foreach ($all_deals as $deal)
                    @include('demo.partials.sale-product-card', ['deal' => $deal, 'eager' => $loop->index < 4])
                @endforeach
            </div>
            <p class="yg-sale-empty" data-sale-empty hidden>No deals match your filters — try resetting them.</p>
        </section>
    </main>

    @include('demo.partials.site-shell-footer')

    <button type="button" class="demo-listing-back-top" id="demo-listing-back-top" aria-label="Back to top">↑</button>
</div>

<div id="yg-drawer-mount">
    @include('demo.partials.drawer', ['cart' => $cart])
</div>

@include('demo.partials.listing-quick-view')

<div class="demo-prototype-stack" id="demo-listing-prototype-stack">
    <button type="button" class="demo-prototype-stack__dock" data-prototype-dock aria-expanded="false" aria-controls="demo-listing-prototype-stack-body">Prototype tools</button>
    <div class="demo-prototype-stack__body" id="demo-listing-prototype-stack-body">
        <div class="demo-prototype-stack__bar">
            <span class="demo-prototype-stack__bar-title">Prototype tools</span>
            <button type="button" class="demo-prototype-stack__minimize" data-prototype-minimize aria-label="Minimise prototype tools">Minimise</button>
        </div>
        <div class="demo-prototype-stack__content">
            <aside class="demo-controls" aria-label="Listing prototype controls">
                <h3>Product cards</h3>
                <label class="demo-toggle">
                    <input type="checkbox" id="toggle-listing-hide-find-out-more">
                    <span>Hide “Find out more”</span>
                </label>
                <label class="demo-toggle">
                    <input type="checkbox" id="toggle-listing-hide-email-when-available">
                    <span>Hide “Email when available”</span>
                </label>
                <p class="demo-controls__label">Filters (desktop)</p>
                <label class="demo-toggle">
                    <input type="checkbox" id="toggle-listing-inline-filters">
                    <span>Inline page filters</span>
                </label>
                <p class="demo-controls__hint">Desktop only: swaps the drawer button for on-page filters using the same drawer styling. Saved in this browser.</p>
            </aside>
            @include('demo.partials.drawer-theme-customizer')
        </div>
    </div>
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/yg-drawer-theme.js') }}?v={{ filemtime(public_path('js/yg-drawer-theme.js')) }}" defer></script>
    <script src="{{ asset('js/demo-prototype-stack.js') }}?v={{ filemtime(public_path('js/demo-prototype-stack.js')) }}" defer></script>
    <script src="{{ asset('js/demo-listing-filters.js') }}?v={{ filemtime(public_path('js/demo-listing-filters.js')) }}" defer></script>
    <script src="{{ asset('js/demo-listing-prototype.js') }}?v={{ filemtime(public_path('js/demo-listing-prototype.js')) }}" defer></script>
    <script src="{{ asset('js/demo-listing-quick-view.js') }}?v={{ filemtime(public_path('js/demo-listing-quick-view.js')) }}" defer></script>
    <script>
    (function () {
        var btn = document.getElementById('demo-listing-back-top');
        if (btn) {
            window.addEventListener('scroll', function () {
                btn.classList.toggle('is-visible', window.scrollY > 400);
            }, { passive: true });
            btn.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        var intro = document.getElementById('listing-seo-intro');
        var toggle = document.getElementById('listing-seo-intro-toggle');
        if (intro && toggle) {
            toggle.addEventListener('click', function () {
                var collapsed = intro.getAttribute('data-collapsed') !== 'false';
                intro.setAttribute('data-collapsed', collapsed ? 'false' : 'true');
                toggle.setAttribute('aria-expanded', collapsed ? 'true' : 'false');
                toggle.textContent = collapsed ? 'Read less' : 'Read more';
            });
        }
    })();
    </script>
@endpush
