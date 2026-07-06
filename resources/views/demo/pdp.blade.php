@extends('demo.layout')

@section('title', $product['page_title'] . ' — YouGarden')

@section('body_class', 'demo-pdp demo-pdp--yg')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-yg.css') }}?v={{ filemtime(public_path('css/demo-pdp-yg.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-content.css') }}?v={{ filemtime(public_path('css/demo-pdp-content.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-reviews-footer.css') }}?v={{ filemtime(public_path('css/demo-pdp-reviews-footer.css')) }}">
@endpush

@section('content')
@php
    $defaultVariant = collect($product['variants'])->firstWhere('default', true) ?? $product['variants'][0];
    $minPrice = collect($product['variants'])->min('price');
@endphp

<div class="demo-site">
    @include('demo.partials.site-chrome', [
        'cart' => $cart,
        'show_trust' => true,
        'search_placeholder' => 'Lavender',
    ])

    <div class="demo-pdp-main">
        <nav class="demo-pdp__crumb" aria-label="Breadcrumb">
            @foreach($product['breadcrumb'] as $i => $crumb)
                @if($i > 0)<span class="demo-pdp__crumb-sep" aria-hidden="true">›</span>@endif
                @if($crumb['url'])
                <a href="{{ $crumb['url'] }}">
                    @if(!empty($crumb['icon']))
                    <span class="demo-pdp__crumb-home" aria-hidden="true">⌂</span>
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

        <div class="demo-pdp-hero-grid">
            <div class="demo-pdp-gallery-wrap">
                @include('demo.partials.pdp-gallery', ['product' => $product])
            </div>

            <div class="demo-pdp-buy" data-pdp-buy-panel>
                <h1 class="demo-pdp__title">{{ $product['title'] }}</h1>
                <p class="demo-pdp__tagline">{{ $product['tagline'] }}</p>

                <a href="#" class="demo-pdp__size-guide" data-prototype-link>
                    <span class="demo-pdp__size-guide-icon" aria-hidden="true">📏</span>
                    Size guide
                </a>

                <div class="demo-pdp__rating-row">
                    @include('demo.partials.feefo-stars', [
                        'rating' => $product['rating'],
                        'reviews' => $product['reviews'],
                    ])
                    <a href="#pdp-feefo-reviews" class="demo-pdp__read-reviews">Read reviews</a>
                </div>

                <div class="demo-pdp-pricing" data-pdp-pricing>
                    <p class="demo-pdp__price">
                        From Just <strong data-pdp-price>£{{ number_format($minPrice, 2) }}</strong>
                    </p>
                </div>

                <div class="demo-pdp-options" data-pdp-variants>
                    <label class="visually-hidden" for="pdp-variant-select">Choose available options</label>
                    <select id="pdp-variant-select" class="demo-pdp__variant-select" data-pdp-variant-select>
                        <option value="">Choose Available Options</option>
                        @foreach ($product['variants'] as $variant)
                            <option
                                value="{{ $variant['id'] }}"
                                data-variant-sku="{{ $variant['sku'] }}"
                                data-variant-label="{{ $variant['label'] }}"
                                data-variant-price="{{ $variant['price'] }}"
                                data-variant-was="{{ $variant['was_price'] ?? '' }}"
                                @selected(! empty($variant['default']))
                            >{{ $variant['label'] }} — £{{ number_format($variant['price'], 2) }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="demo-pdp-purchase">
                    <div class="demo-pdp__qty" aria-label="Quantity">
                        <button type="button" class="demo-pdp__qty-btn" data-qty-delta="-1" aria-label="Decrease quantity">−</button>
                        <span class="demo-pdp__qty-val" id="demo-pdp-qty">1</span>
                        <button type="button" class="demo-pdp__qty-btn" data-qty-delta="1" aria-label="Increase quantity">+</button>
                    </div>
                    <button
                        type="button"
                        class="demo-pdp__atb"
                        id="demo-add-to-basket"
                        data-pdp-sku="{{ $defaultVariant['sku'] }}"
                        data-pdp-variant="{{ $defaultVariant['label'] }}"
                    >Add to basket</button>
                </div>

                <p class="demo-pdp-pay-later">
                    Pay in 3 interest-free payments of <strong data-pdp-pay-in-3>£{{ number_format($defaultVariant['price'] / 3, 2) }}</strong> with <strong>PayPal</strong>.
                    <a href="#" data-prototype-link>Learn more</a>
                </p>

                <section class="demo-pdp-features" aria-labelledby="demo-pdp-features-title">
                    <h2 class="demo-pdp-features__title" id="demo-pdp-features-title">Key Features</h2>
                    <div class="demo-pdp-features__track" data-carousel-track="features">
                        @foreach ($product['features'] as $feature)
                            <div class="demo-pdp-features__item">
                                <span class="demo-pdp-features__icon demo-pdp-features__icon--{{ $feature['icon'] }}" aria-hidden="true"></span>
                                <span class="demo-pdp-features__label">{{ $feature['label'] }}</span>
                            </div>
                        @endforeach
                    </div>
                </section>

                <p class="demo-pdp__intro">{{ $product['description_excerpt'] }}</p>
            </div>
        </div>
    </div>

    <div class="demo-pdp-below-wrap">
        @include('demo.partials.pdp-interactive-sections', ['product' => $product])
        @include('demo.partials.pdp-info', ['product' => $product])
    </div>

    @include('demo.partials.pdp-reviews-footer', ['product' => $product])

    <div class="demo-pdp-sticky" id="demo-pdp-sticky" aria-hidden="true" hidden>
        <div class="demo-pdp-sticky__inner">
            <img src="{{ asset($product['image']) }}" alt="" class="demo-pdp-sticky__thumb" width="48" height="48">
            <div class="demo-pdp-sticky__info">
                <p class="demo-pdp-sticky__name">{{ $product['title'] }}</p>
                <p class="demo-pdp-sticky__price" data-sticky-price>£{{ number_format($defaultVariant['price'], 2) }}</p>
            </div>
            <button type="button" class="demo-pdp-sticky__atb" data-sticky-atb>Add to basket</button>
        </div>
    </div>

    <div class="demo-prototype-stack" id="demo-prototype-stack">
        <button type="button" class="demo-prototype-stack__dock" data-prototype-dock aria-expanded="false" aria-controls="demo-prototype-stack-body">Prototype tools</button>
        <div class="demo-prototype-stack__body" id="demo-prototype-stack-body">
            <div class="demo-prototype-stack__bar">
                <span class="demo-prototype-stack__bar-title">Prototype tools</span>
                <button type="button" class="demo-prototype-stack__minimize" data-prototype-minimize aria-label="Minimise prototype tools">Minimise</button>
            </div>
            <div class="demo-prototype-stack__content">
                @include('demo.partials.drawer-theme-customizer')
                <aside class="demo-controls" aria-label="Prototype controls">
                    <h3>Prototype controls</h3>
                    <p class="demo-controls__label">VWO-style test switch</p>
                    <label class="demo-toggle"><input type="checkbox" id="toggle-drawer-mode" {{ $cart['drawer_enabled'] ? 'checked' : '' }}><span>Cart drawer (test)</span></label>
                    <p class="demo-controls__hint">Off = full basket page behaviour (alert). On = slide-out drawer.</p>
                    <p class="demo-controls__label">Drawer layout</p>
                    <label class="demo-toggle"><input type="checkbox" id="toggle-compact-v21" data-option="compact_v21" {{ !empty($cart['compact_v21']) ? 'checked' : '' }}><span>Compact view (v2.1)</span></label>
                    <label class="demo-toggle"><input type="checkbox" id="toggle-summary-v30" data-option="summary_v30" {{ !empty($cart['summary_v30']) ? 'checked' : '' }}><span>Subtotal only (v3.0)</span></label>
                    <label class="demo-toggle"><input type="checkbox" id="toggle-feedback-v40" data-option="feedback_v40" {{ !empty($cart['feedback_v40']) ? 'checked' : '' }}><span>Version 4</span></label>
                    <p class="demo-controls__hint">v4.0: returning-basket note, checkout UX (login, billing, opt-ins), confirmation tweaks.</p>
                    <p class="demo-controls__label">YG options</p>
                    <label class="demo-toggle"><input type="checkbox" id="toggle-delivery-bar" data-option="delivery_bar" {{ $cart['show_free_delivery_bar'] ? 'checked' : '' }}><span>Free delivery bar (V2 / GD only)</span></label>
                    <label class="demo-toggle"><input type="checkbox" id="toggle-upsells" data-option="upsells" {{ $cart['show_upsells'] ? 'checked' : '' }}><span>Recommendations side tab</span></label>
                    <label class="demo-toggle"><input type="checkbox" id="toggle-apple-pay" data-option="apple_pay" {{ ($cart['show_apple_pay'] ?? true) ? 'checked' : '' }}><span>Apple Pay (express button)</span></label>
                    <p class="demo-controls__label">Payment methods</p>
                    <label class="demo-toggle"><input type="checkbox" id="toggle-clearpay" data-option="clearpay" {{ ($cart['show_clearpay'] ?? false) ? 'checked' : '' }}><span>Clearpay</span></label>
                    <label class="demo-toggle"><input type="checkbox" id="toggle-klarna" data-option="klarna" {{ ($cart['show_klarna'] ?? false) ? 'checked' : '' }}><span>Klarna</span></label>
                    <p class="demo-controls__hint">BNPL options in checkout payment stack (prototype only).</p>
                </aside>
            </div>
        </div>
    </div>
</div>

<div id="yg-drawer-mount">
    @include('demo.partials.drawer', ['cart' => $cart])
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/yg-drawer-theme.js') }}?v={{ filemtime(public_path('js/yg-drawer-theme.js')) }}" defer></script>
    <script src="{{ asset('js/demo-pdp-enhanced.js') }}?v={{ filemtime(public_path('js/demo-pdp-enhanced.js')) }}" defer></script>
    <script src="{{ asset('js/demo-prototype-stack.js') }}?v={{ filemtime(public_path('js/demo-prototype-stack.js')) }}" defer></script>
    <script src="{{ asset('js/demo-pdp-info.js') }}?v={{ filemtime(public_path('js/demo-pdp-info.js')) }}" defer></script>
    <script>
        document.querySelectorAll('[data-prototype-link]').forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Prototype link — not wired in this demo.');
            });
        });
    </script>
@endpush
