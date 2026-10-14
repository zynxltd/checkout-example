@extends('demo.layout')

@section('title', $product['page_title'] . ' — YouGarden')

@section('body_class', 'demo-pdp demo-pdp--yg-live')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-live-pdp.css') }}?v={{ filemtime(public_path('css/yg-live-pdp.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-plant-calendar.css') }}?v={{ filemtime(public_path('css/demo-pdp-plant-calendar.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-content.css') }}?v={{ filemtime(public_path('css/demo-pdp-content.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-reviews-footer.css') }}?v={{ filemtime(public_path('css/demo-pdp-reviews-footer.css')) }}">
@endpush

@section('content')
@php
    $defaultVariant = collect($product['variants'])->first(fn ($v) => ! empty($v['default']) && empty($v['out_of_stock']))
        ?? collect($product['variants'])->first(fn ($v) => empty($v['out_of_stock']))
        ?? $product['variants'][0];
    $clubLogo = asset('images/club/discount-club-logo.png');
@endphp

<div class="demo-site">
    @include('demo.partials.site-chrome', [
        'cart' => $cart,
        'show_trust' => true,
        'search_placeholder' => 'Allium',
    ])

    <div class="product-top-wrapper">
        <div class="centralWrapper">
            <div class="images-wrapper">
                <div class="main-image-wrapper" id="main-image-wrapper">
                    @if (! empty($product['popular_views']))
                        <div class="demo-live-popular" aria-label="Popular product">
                            <span class="demo-live-popular__label">Popular!</span>
                            <span class="demo-live-popular__count">{{ number_format($product['popular_views']) }} Recently viewed</span>
                        </div>
                    @endif
                    <div class="carousel-video-wrapper" id="carousel-video-wrapper"></div>
                    <div class="main-image-carousel slick-initialized" id="main-image-carousel" data-live-main-carousel>
                        <div class="live-pdp-main-track" data-live-main-track>
                            @foreach ($product['gallery'] as $i => $slide)
                                @if (($slide['type'] ?? '') === 'video')
                                    <div class="video{{ $i === 0 ? ' is-active' : '' }}" data-live-main-slide="{{ $i }}" data-live-video>
                                        <div class="play-icon"><div class="arrow"></div></div>
                                        <img src="{{ $slide['image'] }}" alt="{{ $slide['alt'] }}" loading="{{ $i === 0 ? 'eager' : 'lazy' }}" width="640" height="360">
                                    </div>
                                @else
                                    <div class="{{ $i === 0 ? 'is-active' : '' }}" data-live-main-slide="{{ $i }}">
                                        <img
                                            src="{{ $slide['image'] }}"
                                            alt="{{ $slide['alt'] }}"
                                            title="{{ $product['title'] }}"
                                            class="mainImg"
                                            width="500"
                                            height="500"
                                            loading="{{ $i === 0 ? 'eager' : 'lazy' }}"
                                            @if ($i === 0) fetchpriority="high" @endif
                                        >
                                    </div>
                                @endif
                            @endforeach
                        </div>
                        <button type="button" class="previous-button" data-live-main-prev aria-label="Previous image">
                            <span>‹</span>
                        </button>
                        <button type="button" class="next-button" data-live-main-next aria-label="Next image">
                            <span>›</span>
                        </button>
                        <ul class="slick-dots" data-live-main-dots role="tablist">
                            @foreach ($product['gallery'] as $i => $slide)
                                <li class="{{ $i === 0 ? 'slick-active' : '' }}">
                                    <button type="button" data-live-main-dot="{{ $i }}">{{ $i + 1 }}</button>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                </div>

                <div class="opt-image-wrapper">
                    <div class="opt-image-carousel slick-initialized" id="opt-image-carousel" data-live-thumb-carousel>
                        <div class="live-pdp-thumb-track" data-live-thumb-track>
                            @foreach ($product['gallery'] as $i => $slide)
                                @if (($slide['type'] ?? '') === 'video')
                                    <button type="button" class="video{{ $i === 0 ? ' is-active' : '' }}" data-live-thumb="{{ $i }}" aria-label="Show video">
                                        <div class="play-icon"><div class="arrow"></div></div>
                                        <img src="{{ $slide['thumb'] ?? $slide['image'] }}" alt="{{ $slide['alt'] }}" width="127" height="71" loading="lazy">
                                    </button>
                                @else
                                    <button type="button" class="{{ $i === 0 ? 'is-active' : '' }}" data-live-thumb="{{ $i }}" aria-label="Show image {{ $i + 1 }}">
                                        <img
                                            src="{{ $slide['thumb'] ?? $slide['image'] }}"
                                            alt="{{ $slide['alt'] }}"
                                            title="{{ $product['title'] }}"
                                            width="127"
                                            height="127"
                                            loading="lazy"
                                        >
                                    </button>
                                @endif
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>

            <div class="product-right-wrapper">
                <div class="product-heading-wrapper">
                    <h1>{{ $product['title'] }}</h1>
                    <div class="sub-head">{{ $product['tagline'] }}</div>
                </div>

                <div class="feefo-rating" id="feefo-rating">
                    @include('demo.partials.feefo-stars', [
                        'rating' => $product['rating'],
                        'reviews' => $product['reviews'],
                    ])
                    <div class="read" data-scroll-to-reviews>Read reviews</div>
                </div>

                <div class="price-wrapper" id="main-from-price" data-live-from-price hidden>
                    <div class="left">
                        <div class="price">From Just <span class="price-text" data-live-from-amount>£{{ number_format($defaultVariant['price'], 2) }}</span></div>
                    </div>
                </div>

                <div class="buy-wrapper">
                    <div class="options-wrapper" id="style-options" data-live-options>
                        <button type="button" class="style-options-head" id="style-options-head" data-live-options-toggle>
                            <span data-live-options-label>{{ $defaultVariant['label'] }} - SKU {{ $defaultVariant['display_sku'] ?? $defaultVariant['sku'] }}</span>
                            <div class="icon" aria-hidden="true">▾</div>
                        </button>
                        <div class="style-options-drop-box" id="style-options-drop-box" data-live-options-box hidden>
                            @foreach ($product['variants'] as $variant)
                                @php
                                    $isOos = ! empty($variant['out_of_stock']);
                                    $isDefault = ($variant['id'] ?? '') === ($defaultVariant['id'] ?? '');
                                @endphp
                                <div
                                    class="option-row{{ $isOos ? ' discont' : '' }}{{ $isDefault ? ' active' : '' }}"
                                    id="option-row-{{ $variant['id'] }}"
                                    @if (! $isOos)
                                        role="button"
                                        tabindex="0"
                                        data-live-option
                                        data-variant-id="{{ $variant['id'] }}"
                                        data-variant-sku="{{ $variant['sku'] }}"
                                        data-variant-label="{{ $variant['label'] }}"
                                        data-variant-price="{{ $variant['price'] }}"
                                        data-variant-was="{{ $variant['was_price'] ?? '' }}"
                                        data-variant-club="{{ $variant['club_price'] ?? round($variant['price'] * 0.85, 2) }}"
                                        data-variant-display-sku="{{ $variant['display_sku'] ?? $variant['sku'] }}"
                                    @endif
                                >
                                    <div class="icon-wrapper">
                                        @unless ($isOos)
                                            <div class="check"><div class="inner"></div></div>
                                        @endunless
                                    </div>
                                    <div class="text-wrapper">
                                        <div class="title">
                                            {{ $variant['label'] }}
                                            <span class="sku">- SKU {{ $variant['display_sku'] ?? $variant['sku'] }}</span>
                                            @if ($isOos)
                                                <span><span class="dash"> - </span> Out of Stock</span>
                                            @endif
                                        </div>
                                        <div class="price">
                                            @if (! empty($variant['was_price']))
                                                Just: <span>£{{ number_format($variant['price'], 2) }}</span>
                                                &nbsp;&nbsp;<span class="rrp">RRP £{{ number_format($variant['was_price'], 2) }}</span>
                                                &nbsp;&nbsp;
                                                <span class="saving">You Save - <span>£{{ number_format($variant['was_price'] - $variant['price'], 2) }}</span></span>
                                            @else
                                                ONLY: <span>£{{ number_format($variant['price'], 2) }}</span>
                                            @endif
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>

                    <div class="price-wrapper" id="selected-item-price-wrapper" data-live-selected-price>
                        <div class="left">
                            <div class="pno-wrapper" id="selected-item-pno-title" data-live-selected-title>
                                {{ $defaultVariant['label'] }} | SKU: {{ $defaultVariant['display_sku'] ?? $defaultVariant['sku'] }}
                            </div>
                            <div class="price" id="selected-item-price" data-live-selected-amount>
                                Just <span class="price-text">£{{ number_format($defaultVariant['price'], 2) }}</span>
                            </div>
                        </div>
                        <div class="right">
                            <div class="rrp" id="selected-item-rrp" data-live-selected-rrp></div>
                            <div class="saving" id="selected-item-saving" data-live-selected-saving></div>
                        </div>
                    </div>

                    <div
                        class="club-price-wrapper active"
                        id="club-price-wrapper"
                        data-live-club-price
                        role="button"
                        tabindex="0"
                        aria-label="Club member price"
                    >
                        <div class="club-price">
                            Club Member Price: <span data-live-club-amount>£{{ number_format($defaultVariant['club_price'] ?? round($defaultVariant['price'] * 0.85, 2), 2) }}</span>
                        </div>
                        <img src="{{ $clubLogo }}" alt="YouGarden Discount Club" width="240" height="48">
                    </div>

                    <div class="qtyBlock">
                        <div class="qtyWrapper">
                            <button type="button" class="qtyMinus" data-live-qty-delta="-1" aria-label="Decrease quantity">−</button>
                            <div class="qtyBox">
                                <label for="Qty-PA021" class="hide">Quantity</label>
                                <input
                                    aria-label="Qty"
                                    type="text"
                                    class="updateQty-input"
                                    id="Qty-PA021"
                                    name="Qty"
                                    value="1"
                                    data-live-qty-input
                                >
                                <span class="visually-hidden" id="demo-pdp-qty" data-live-qty-mirror>1</span>
                            </div>
                            <button type="button" class="qtyPlus" data-live-qty-delta="1" aria-label="Increase quantity">+</button>
                        </div>
                    </div>

                    <div id="buy-button-wrapper">
                        <button
                            type="button"
                            class="buy-button"
                            id="demo-add-to-basket"
                            data-pdp-sku="{{ $defaultVariant['sku'] }}"
                            data-pdp-variant="{{ $defaultVariant['label'] }}"
                        >ADD TO BASKET</button>
                    </div>
                </div>

                <div class="pp-wrapper">
                    <div class="inner">
                        <p class="demo-pdp-pay-later-live">
                            Pay in 30 days with <strong>PayPal</strong>. Credit subject to status.
                            <a href="#" data-prototype-link>Learn more</a>
                        </p>
                    </div>
                </div>

                <h2 class="icons-heading">Key Features</h2>
                <div class="icons-wrapper">
                    <div class="product-features-carousel" id="product-features-carousel" data-live-features>
                        <button type="button" class="previous-button" data-live-features-prev aria-label="Previous features">‹</button>
                        <div class="live-pdp-features-track" data-live-features-track>
                            @foreach ($product['features'] as $feature)
                                <div class="icon">
                                    @if (! empty($feature['img']))
                                        <img src="{{ $feature['img'] }}" alt="{{ $feature['label'] }}" width="100" height="100" loading="lazy">
                                    @endif
                                    <div class="icon-desc">{!! ($feature['html'] ?? e($feature['label'])) !!}</div>
                                </div>
                            @endforeach
                        </div>
                        <button type="button" class="next-button" data-live-features-next aria-label="Next features">›</button>
                    </div>
                </div>

                @if (! empty($product['bullet_points']))
                    <div class="points">
                        <ul>
                            @foreach ($product['bullet_points'] as $point)
                                <li>{{ $point }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif
            </div>
        </div>
    </div>

    <div class="demo-pdp-below-wrap">
        @include('demo.partials.pdp-live-below', ['product' => $product])
    </div>

    @include('demo.partials.pdp-reviews-footer', ['product' => $product])

    <div class="demo-prototype-stack" id="demo-prototype-stack">
        <button type="button" class="demo-prototype-stack__dock" data-prototype-dock aria-expanded="false" aria-controls="demo-prototype-stack-body">Prototype tools</button>
        <div class="demo-prototype-stack__body" id="demo-prototype-stack-body">
            <div class="demo-prototype-stack__bar">
                <span class="demo-prototype-stack__bar-title">Prototype tools</span>
                <button type="button" class="demo-prototype-stack__minimize" data-prototype-minimize aria-label="Minimise prototype tools">Minimise</button>
            </div>
            <div class="demo-prototype-stack__content">
                @include('demo.partials.prototype-tools-shared')
            </div>
        </div>
    </div>
</div>

<div id="yg-drawer-mount">
    @include('demo.partials.drawer', ['cart' => $cart])
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/yg-live-pdp.js') }}?v={{ filemtime(public_path('js/yg-live-pdp.js')) }}" defer></script>
    <script src="{{ asset('js/demo-prototype-stack.js') }}?v={{ filemtime(public_path('js/demo-prototype-stack.js')) }}" defer></script>
    <script>
        document.querySelectorAll('[data-prototype-link]').forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
            });
        });
    </script>
@endpush
