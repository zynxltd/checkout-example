{{-- Sale / PLP product card — matches yougarden.com/sale + Quick View --}}
@php
    $isOutOfStock = ! empty($deal['out_of_stock']);
    $categories = $deal['categories'] ?? [];
    $categoryAttr = implode(' ', $categories);
    $qvPayload = \App\Services\DemoCart::quickViewPayload(array_merge($deal, [
        'price' => $deal['price_value'] ?? $deal['price'] ?? 0,
        'oos' => $isOutOfStock,
    ]));
@endphp
<article
    class="category-box{{ ! empty($deal['featured']) ? ' is-featured' : '' }}{{ $isOutOfStock ? ' is-out-of-stock' : '' }}"
    data-sale-product
    data-qv-card
    data-availability="{{ $isOutOfStock ? 'out-of-stock' : 'in-stock' }}"
    data-categories="{{ $categoryAttr }}"
    data-qv-json="{{ json_encode($qvPayload, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE) }}"
>
    <a
        href="{{ $deal['url'] }}"
        class="category-box__hit"
        @if ($isOutOfStock) aria-label="{{ $deal['name'] }} — out of stock" @endif
        @if (str_starts_with($deal['url'], 'http')) target="_blank" rel="noopener" @endif
    >
        <div class="imgWrapper">
            <img
                src="{{ asset($deal['image']) }}?v={{ filemtime(public_path($deal['image'])) }}"
                alt="{{ $deal['name'] }}"
                width="500"
                height="500"
                loading="{{ ! empty($eager) ? 'eager' : 'lazy' }}"
                decoding="async"
            >
        </div>

        @if (! empty($deal['bestseller']))
            <img
                class="overlay"
                src="{{ asset('images/overlays/BESTSELLER.png') }}?v={{ filemtime(public_path('images/overlays/BESTSELLER.png')) }}"
                alt="Bestseller"
                width="180"
                height="50"
                loading="lazy"
                decoding="async"
            >
        @endif

        @if ($isOutOfStock)
            <div class="outOfStock" aria-hidden="true">OUT<br>OF<br>STOCK</div>
        @else
            <div class="savingFlash" aria-hidden="true">{{ $deal['discount'] }}%<br>OFF</div>
        @endif

        <div class="category-box__content">
            <div class="title">{{ $deal['name'] }}</div>

            <div class="category-box__meta">
                <div class="priceWrapper">
                    <div class="price">{{ $deal['price'] }}</div>
                </div>
                @if (! empty($deal['rating']))
                    <div class="rating" aria-label="{{ number_format($deal['rating'], 1) }} out of 5 stars, {{ number_format($deal['reviews'] ?? 0) }} reviews">
                        @include('demo.partials.feefo-stars', [
                            'rating' => $deal['rating'],
                            'reviews' => $deal['reviews'] ?? 0,
                        ])
                    </div>
                @endif
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
