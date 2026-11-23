@extends('demo.layout')

@section('title', 'Bring it home — Christmas trees, wreaths and gifts | YouGarden')

@section('body_class', 'demo-listing demo-xmas')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-reviews-footer.css') }}?v={{ filemtime(public_path('css/demo-pdp-reviews-footer.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-listing.css') }}?v={{ filemtime(public_path('css/demo-listing.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/editorial-landing.css') }}?v={{ filemtime(public_path('css/editorial-landing.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/christmas.css') }}?v={{ filemtime(public_path('css/christmas.css')) }}">
@endpush

@section('content')
<div class="demo-site demo-site--xmas" data-xmas-page>
    @include('demo.partials.site-chrome', [
        'cart' => $cart,
        'show_trust' => true,
        'search_placeholder' => 'Search Christmas trees, wreaths or gifts',
        'shop_menu' => $shop_menu,
        'trending_links' => $trending_links,
    ])

    @include('demo.partials.editorial-landing', [
        'crumb' => 'Christmas',
        'chip_attr' => 'data-xmas-chip',
        'hero' => $hero,
        'roundels' => $roundels,
        'roundel_label' => 'Shop Christmas',
        'strip' => $strip,
    ])

    <main class="demo-listing-main demo-xmas__main">
        @include('demo.partials.editorial-banners', [
            'chip_attr' => 'data-xmas-chip',
            'campaigns' => $campaigns,
            'depts' => $depts,
            'spotlight' => $spotlight,
        ])


        <nav class="yg-xmas-chips" aria-label="Christmas collections">
            <button type="button" class="yg-xmas-chip is-on" data-xmas-chip="all" aria-pressed="true">All Christmas</button>
            <button type="button" class="yg-xmas-chip" data-xmas-chip="trees" aria-pressed="false">Trees</button>
            <button type="button" class="yg-xmas-chip" data-xmas-chip="wreaths" aria-pressed="false">Wreaths</button>
            <button type="button" class="yg-xmas-chip" data-xmas-chip="indoor" aria-pressed="false">Indoor kits</button>
            <button type="button" class="yg-xmas-chip" data-xmas-chip="gifts" aria-pressed="false">Gifts</button>
            <button type="button" class="yg-xmas-chip" data-xmas-chip="lights" aria-pressed="false">Lights</button>
        </nav>

        <section class="yg-xmas-grid" id="yg-xmas-grid" aria-labelledby="yg-xmas-grid-heading">
            <div class="yg-xmas-grid__head">
                <h2 id="yg-xmas-grid-heading">Shop Christmas</h2>
                <p data-xmas-count>{{ $count }} pieces</p>
            </div>

            <div class="resListingWrapper demo-listing__grid yg-xmas-grid__cards">
                @foreach ($items as $product)
                    @php
                        $isOutOfStock = ! empty($product['out_of_stock']);
                        $qvPayload = \App\Services\DemoCart::quickViewPayload($product);
                        $groups = implode(' ', $product['groups'] ?? []);
                    @endphp
                    <article
                        class="category-box yg-xmas-card{{ $isOutOfStock ? ' is-out-of-stock' : '' }}"
                        data-qv-card
                        data-xmas-card
                        data-xmas-groups="{{ $groups }}"
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
                                <span class="yg-xmas-flag">Gift</span>
                                <span class="yg-xmas-when">{{ $product['tag'] }}</span>
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
            <p class="yg-xmas-empty" data-xmas-empty hidden>Nothing in this shop — try All Christmas.</p>
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

        var chips = document.querySelectorAll('[data-xmas-chip]');
        var cards = document.querySelectorAll('[data-xmas-card]');
        var empty = document.querySelector('[data-xmas-empty]');
        var countEl = document.querySelector('[data-xmas-count]');
        var grid = document.getElementById('yg-xmas-grid');
        function apply(group) {
            var shown = 0;
            cards.forEach(function (card) {
                var groups = (card.getAttribute('data-xmas-groups') || '').split(/\s+/);
                var on = group === 'all' || groups.indexOf(group) !== -1;
                card.hidden = !on;
                if (on) shown += 1;
            });
            if (empty) empty.hidden = shown > 0;
            if (countEl) countEl.textContent = shown + ' piece' + (shown === 1 ? '' : 's');
            chips.forEach(function (el) {
                var on = el.getAttribute('data-xmas-chip') === group;
                if (el.matches('.yg-el-roundel, .yg-xmas-chip')) {
                    el.classList.toggle('is-on', on);
                    el.setAttribute('aria-pressed', on ? 'true' : 'false');
                }
            });
        }
        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                apply(chip.getAttribute('data-xmas-chip'));
                if (chip.matches('.yg-el-roundel, .yg-el-banner, .yg-el-spot') && grid) {
                    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    })();
    </script>
@endpush
