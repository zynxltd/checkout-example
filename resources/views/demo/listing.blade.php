@extends('demo.layout')

@section('title', $listing['title'] . ' — YouGarden')

@section('body_class', 'demo-listing')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-reviews-footer.css') }}?v={{ filemtime(public_path('css/demo-pdp-reviews-footer.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-listing.css') }}?v={{ filemtime(public_path('css/demo-listing.css')) }}">
@endpush

@section('content')
<div class="demo-site">
    @include('demo.partials.site-chrome', ['cart' => $cart, 'show_trust' => true])

    <main class="demo-listing-main">
        <nav class="demo-listing__crumb" aria-label="Breadcrumb">
            @foreach ($listing['breadcrumb'] as $i => $crumb)
                @if ($i > 0)<span class="demo-listing__crumb-sep" aria-hidden="true">|</span>@endif
                @if ($crumb['url'])
                    <a href="{{ $crumb['url'] }}"@if (! empty($crumb['icon'])) class="demo-listing__crumb-link--home"@endif>
                        @if (! empty($crumb['icon']))
                            <span class="demo-listing__crumb-home" aria-hidden="true">@include('demo.partials.icon', ['name' => 'home', 'width' => 14, 'height' => 14])</span>
                            <span class="visually-hidden">{{ $crumb['label'] }}</span>
                        @else
                            {{ $crumb['label'] }}
                        @endif
                    </a>
                @else
                    <span aria-current="page">{{ $crumb['label'] }}</span>
                @endif
            @endforeach
        </nav>

        <header class="demo-listing-seo-intro">
            <h1 class="demo-listing-seo-intro__title">{{ $listing['title'] }}</h1>
            @if (! empty($listing['subtitle']))
                <h2 class="demo-listing-seo-intro__subtitle">{{ $listing['subtitle'] }}</h2>
            @endif

            @if (! empty($listing['seo_intro']))
                <div class="demo-listing-seo-intro__copy" id="listing-seo-intro" data-collapsed="true">
                    <div class="demo-listing-seo-intro__body">
                        @foreach ($listing['seo_intro'] as $paragraph)
                            <p>{{ $paragraph }}</p>
                        @endforeach
                    </div>
                    <button
                        type="button"
                        class="demo-listing-seo-intro__toggle"
                        id="listing-seo-intro-toggle"
                        aria-expanded="false"
                        aria-controls="listing-seo-intro"
                    >Read more</button>
                </div>
            @endif
        </header>

        @include('demo.partials.listing-filters', ['listing' => $listing])

        @if (! empty($listing['seo_categories']))
            <nav class="demo-listing-seo" aria-label="Related categories">
                <ul class="demo-listing-seo__list">
                    @foreach ($listing['seo_categories'] as $category)
                        <li class="demo-listing-seo__item">
                            <a class="demo-listing-seo__link" href="{{ $category['url'] }}">{{ $category['label'] }}</a>
                        </li>
                    @endforeach
                </ul>
            </nav>
        @endif

        <div class="resListingWrapper demo-listing__grid">
            @foreach ($listing['products'] as $product)
                @php
                    $isOutOfStock = ! empty($product['out_of_stock']);
                    $qvPayload = \App\Services\DemoCart::quickViewPayload($product);
                @endphp
                <article
                    class="category-box{{ ! empty($product['featured']) ? ' is-featured' : '' }}{{ $isOutOfStock ? ' is-out-of-stock' : '' }}"
                    data-qv-card
                    data-availability="{{ $isOutOfStock ? 'out-of-stock' : 'in-stock' }}"
                    data-qv-json="{{ json_encode($qvPayload, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE) }}"
                >
                    <a
                        href="{{ $product['url'] }}"
                        class="category-box__hit"
                        @if ($isOutOfStock) aria-label="{{ $product['name'] }} — out of stock" @endif
                    >
                        <div class="imgWrapper">
                            <img
                                src="{{ asset($product['image']) }}"
                                alt="{{ $product['name'] }}"
                                width="500"
                                height="500"
                                loading="lazy"
                            >
                        </div>

                        @if ($isOutOfStock)
                            <div class="outOfStock" aria-hidden="true">OUT<br>OF<br>STOCK</div>
                        @else
                            <div class="savingFlash" aria-hidden="true">{{ $product['discount'] }}%<br>OFF</div>
                        @endif

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
                                    @if (! empty($product['featured']))
                                        <div class="demo-listing-card__tooltip" role="tooltip">
                                            <p class="demo-listing-card__tooltip-title">{{ number_format($product['rating'], 1) }}/5 Stars</p>
                                            @php
                                                $bars = [5 => 62, 4 => 18, 3 => 8, 2 => 6, 1 => 6];
                                            @endphp
                                            @foreach ($bars as $star => $pct)
                                                <div class="demo-listing-card__tooltip-row">
                                                    <span>{{ $star }}</span>
                                                    <div class="demo-listing-card__tooltip-bar"><span style="width: {{ $pct }}%"></span></div>
                                                    <span>{{ $pct }}%</span>
                                                </div>
                                            @endforeach
                                        </div>
                                    @endif
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
