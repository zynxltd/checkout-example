@extends('demo.layout')

@section('title', 'Just landed — new plants this season | YouGarden')

@section('body_class', 'demo-listing demo-new')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-reviews-footer.css') }}?v={{ filemtime(public_path('css/demo-pdp-reviews-footer.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-listing.css') }}?v={{ filemtime(public_path('css/demo-listing.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/editorial-landing.css') }}?v={{ filemtime(public_path('css/editorial-landing.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/new-arrivals.css') }}?v={{ filemtime(public_path('css/new-arrivals.css')) }}">
@endpush

@section('content')
<div class="demo-site demo-site--new" data-new-page>
    @include('demo.partials.site-chrome', [
        'cart' => $cart,
        'show_trust' => true,
        'search_placeholder' => 'Search new plants',
        'shop_menu' => $shop_menu,
        'trending_links' => $trending_links,
    ])

    @include('demo.partials.editorial-landing', [
        'crumb' => 'New',
        'chip_attr' => 'data-new-chip',
        'hero' => $hero,
        'roundels' => $roundels,
        'roundel_label' => 'Shop new arrivals',
        'strip' => $strip,
    ])

    <main class="demo-listing-main demo-new__main">
        @include('demo.partials.editorial-banners', [
            'chip_attr' => 'data-new-chip',
            'campaigns' => $campaigns,
            'depts' => $depts,
            'spotlight' => $spotlight,
        ])


        <nav class="yg-new-chips" aria-label="New arrivals collections">
            <button type="button" class="yg-new-chip is-on" data-new-chip="all" aria-pressed="true">All new</button>
            <button type="button" class="yg-new-chip" data-new-chip="week" aria-pressed="false">This week</button>
            <button type="button" class="yg-new-chip" data-new-chip="house" aria-pressed="false">Houseplants</button>
            <button type="button" class="yg-new-chip" data-new-chip="outdoor" aria-pressed="false">Outdoor</button>
            <button type="button" class="yg-new-chip" data-new-chip="collections" aria-pressed="false">Collections</button>
        </nav>

        <section class="yg-new-grid" id="yg-new-grid" aria-labelledby="yg-new-grid-heading">
            <div class="yg-new-grid__head">
                <h2 id="yg-new-grid-heading">Shop all new</h2>
                <p data-new-count>{{ $count }} plants</p>
            </div>

            <div class="resListingWrapper demo-listing__grid yg-new-grid__cards">
                @foreach ($arrivals as $product)
                    @php
                        $isOutOfStock = ! empty($product['out_of_stock']);
                        $qvPayload = \App\Services\DemoCart::quickViewPayload($product);
                        $groups = implode(' ', $product['groups'] ?? []);
                    @endphp
                    <article
                        class="category-box yg-new-card{{ $isOutOfStock ? ' is-out-of-stock' : '' }}"
                        data-qv-card
                        data-new-card
                        data-new-groups="{{ $groups }}"
                        data-availability="{{ $isOutOfStock ? 'out-of-stock' : 'in-stock' }}"
                        data-qv-json="{{ json_encode($qvPayload, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE) }}"
                    >
                        <a href="{{ $product['url'] }}" class="category-box__hit">
                        <div class="imgWrapper">
                            <img
                                src="{{ asset($product['image']) }}"
                                alt="{{ $product['name'] }}"
                                width="500"
                                height="500"
                                loading="lazy"
                            >
                            <span class="yg-new-flag">New</span>
                            <span class="yg-new-when">{{ $product['arrived'] }}</span>
                        </div>
                            <div class="category-box__content">
                                <div class="title">{{ $product['name'] }}</div>
                                <div class="category-box__meta">
                                    <div class="priceWrapper">
                                        <div class="price">{{ $product['price_label'] }} £{{ number_format($product['price'], 2) }}</div>
                                    </div>
                                    <div class="rating" aria-label="{{ number_format($product['rating'], 1) }} out of 5 stars, {{ number_format($product['reviews']) }} reviews">
                                        @include('demo.partials.feefo-stars', [
                                            'rating' => $product['rating'],
                                            'reviews' => $product['reviews'],
                                        ])
                                    </div>
                                </div>
                            </div>
                            <div class="category-box__cta{{ $isOutOfStock ? ' category-box__cta--oos' : '' }}">
                                {{ $isOutOfStock ? 'Email when available' : 'Find out more' }}
                            </div>
                        </a>
                        <button
                            type="button"
                            class="category-box__qv"
                            data-qv-open
                            aria-haspopup="dialog"
                            aria-controls="listing-quick-view"
                        >
                            Quick view
                        </button>
                    </article>
                @endforeach
            </div>
            <p class="yg-new-empty" data-new-empty hidden>Nothing in this drop — try All new.</p>
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
            @include('demo.partials.prototype-tools-shared')
        </div>
    </div>
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/demo-prototype-stack.js') }}?v={{ filemtime(public_path('js/demo-prototype-stack.js')) }}" defer></script>
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

        var chips = document.querySelectorAll('[data-new-chip]');
        var cards = document.querySelectorAll('[data-new-card]');
        var empty = document.querySelector('[data-new-empty]');
        var countEl = document.querySelector('[data-new-count]');
        var grid = document.getElementById('yg-new-grid');
        function apply(group) {
            var shown = 0;
            cards.forEach(function (card) {
                var groups = (card.getAttribute('data-new-groups') || '').split(/\s+/);
                var on = group === 'all' || groups.indexOf(group) !== -1;
                card.hidden = !on;
                if (on) shown += 1;
            });
            if (empty) empty.hidden = shown > 0;
            if (countEl) countEl.textContent = shown + ' plant' + (shown === 1 ? '' : 's');
            chips.forEach(function (el) {
                var on = el.getAttribute('data-new-chip') === group;
                if (el.matches('.yg-el-roundel, .yg-new-chip')) {
                    el.classList.toggle('is-on', on);
                    el.setAttribute('aria-pressed', on ? 'true' : 'false');
                }
            });
        }
        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                apply(chip.getAttribute('data-new-chip'));
                if (chip.matches('.yg-el-roundel, .yg-el-banner, .yg-el-spot') && grid) {
                    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    })();
    </script>
@endpush
