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
    @include('demo.partials.site-chrome', ['cart' => $cart])

    <main class="demo-listing-main">
        <nav class="demo-listing__crumb" aria-label="Breadcrumb">
            @foreach ($listing['breadcrumb'] as $i => $crumb)
                @if ($i > 0)<span class="demo-listing__crumb-sep">/</span>@endif
                @if ($crumb['url'])
                    <a href="{{ $crumb['url'] }}">{{ $crumb['label'] }}</a>
                @else
                    <span aria-current="page">{{ $crumb['label'] }}</span>
                @endif
            @endforeach
        </nav>

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
                @endphp
                <a
                    href="{{ $product['url'] }}"
                    class="category-box{{ ! empty($product['featured']) ? ' is-featured' : '' }}{{ $isOutOfStock ? ' is-out-of-stock' : '' }}"
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
            @endforeach
        </div>
    </main>

    @include('demo.partials.site-shell-footer')

    <button type="button" class="demo-listing-back-top" id="demo-listing-back-top" aria-label="Back to top">↑</button>
</div>

<div id="yg-drawer-mount">
    @include('demo.partials.drawer', ['cart' => $cart])
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/yg-drawer-theme.js') }}?v={{ filemtime(public_path('js/yg-drawer-theme.js')) }}" defer></script>
    <script src="{{ asset('js/demo-listing-filters.js') }}?v={{ filemtime(public_path('js/demo-listing-filters.js')) }}" defer></script>
    <script>
    (function () {
        var btn = document.getElementById('demo-listing-back-top');
        if (! btn) return;
        window.addEventListener('scroll', function () {
            btn.classList.toggle('is-visible', window.scrollY > 400);
        }, { passive: true });
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    })();
    </script>
@endpush
