@extends('demo.layout')

@section('title', $product['page_title'] . ' — YouGarden')

@section('body_class', 'demo-pdp')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-plant-calendar.css') }}?v={{ filemtime(public_path('css/demo-pdp-plant-calendar.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-content.css') }}?v={{ filemtime(public_path('css/demo-pdp-content.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-reviews-footer.css') }}?v={{ filemtime(public_path('css/demo-pdp-reviews-footer.css')) }}">
@endpush

@section('content')
<div class="demo-site">
    @include('demo.partials.site-chrome', ['cart' => $cart, 'show_trust' => true])

    <nav class="demo-pdp__crumb" aria-label="Breadcrumb">
        @foreach($product['breadcrumb'] as $i => $crumb)
            @if($i > 0)<span class="demo-pdp__crumb-sep">/</span>@endif
            @if($crumb['url'])
            <a href="{{ $crumb['url'] }}">{{ $crumb['label'] }}</a>
            @else
            <span aria-current="page">{{ $crumb['label'] }}</span>
            @endif
        @endforeach
    </nav>

    <main class="demo-pdp__main">
        <div class="demo-pdp__gallery">
            <img
                src="{{ asset($product['image']) }}"
                alt="{{ $product['image_alt'] }}"
                width="900"
                height="1100"
                loading="eager"
            >
        </div>

        <div class="demo-pdp__buy">
            <h1 class="demo-pdp__title">{{ $product['title'] }}</h1>
            <p class="demo-pdp__tagline">{{ $product['tagline'] }}</p>
            <p class="demo-pdp__pack">{{ $product['pack'] }} <span class="demo-pdp__pack-sep">|</span> SKU: {{ $product['sku'] }}</p>

            <div class="demo-pdp__pricing">
                <p class="demo-pdp__price">
                    Just <strong>£{{ number_format($product['price'], 2) }}</strong>
                </p>
                <p class="demo-pdp__rrp">
                    RRP £{{ number_format($product['was_price'], 2) }}
                </p>
                <p class="demo-pdp__save">You Save £{{ number_format($product['save'], 2) }}</p>
            </div>

            <p class="demo-pdp__club-strip">
                Club Member Price: <strong>£{{ number_format($product['club_price'], 2) }}</strong>
            </p>

            <div class="demo-pdp__qty" aria-label="Quantity">
                <button type="button" class="demo-pdp__qty-btn" data-qty-delta="-1" aria-label="Decrease quantity">−</button>
                <span class="demo-pdp__qty-val" id="demo-pdp-qty">1</span>
                <button type="button" class="demo-pdp__qty-btn" data-qty-delta="1" aria-label="Increase quantity">+</button>
            </div>

            <button
                type="button"
                class="demo-pdp__atb"
                id="demo-add-to-basket"
                data-pdp-sku="{{ $product['sku'] }}"
                data-pdp-variant="{{ $product['pack'] }}"
            >Add To Basket</button>

            <button type="button" class="demo-pdp__view-basket" id="demo-view-basket" data-open-drawer>
                View basket ({{ $cart['item_count'] }})
            </button>

            <section class="demo-pdp__also" aria-labelledby="demo-also-title">
                <h2 class="demo-pdp__also-title" id="demo-also-title">Customers Also Bought</h2>
                <div class="demo-pdp__also-card">
                    <p class="demo-pdp__also-name">{{ $product['also_bought']['name'] }} — £{{ number_format($product['also_bought']['price'], 2) }}</p>
                    <p class="demo-pdp__also-sku">Item: {{ $product['also_bought']['sku'] }}</p>
                    <button type="button" class="demo-pdp__also-add" disabled>Add</button>
                </div>
            </section>

            <section class="demo-pdp__features" aria-labelledby="demo-features-title">
                <h2 class="demo-pdp__features-title" id="demo-features-title">Key Features</h2>
                <ul class="demo-pdp__features-grid">
                    @foreach($product['features'] as $feature)
                    <li class="demo-pdp__feature">
                        <span class="demo-pdp__feature-icon demo-pdp__feature-icon--{{ $feature['icon'] }}" aria-hidden="true"></span>
                        <span class="demo-pdp__feature-label">{{ $feature['label'] }}</span>
                    </li>
                    @endforeach
                </ul>
                <p class="demo-pdp__dimensions">{{ $product['dimensions'] }}</p>
            </section>
        </div>
    </main>

    @include('demo.partials.pdp-info', ['product' => $product])

    @include('demo.partials.pdp-reviews-footer', ['product' => $product])

    <div class="demo-prototype-stack" id="demo-prototype-stack">
        <button
            type="button"
            class="demo-prototype-stack__dock"
            data-prototype-dock
            aria-expanded="false"
            aria-controls="demo-prototype-stack-body"
        >
            Prototype tools
        </button>

        <div class="demo-prototype-stack__body" id="demo-prototype-stack-body">
            <div class="demo-prototype-stack__bar">
                <span class="demo-prototype-stack__bar-title">Prototype tools</span>
                <button
                    type="button"
                    class="demo-prototype-stack__minimize"
                    data-prototype-minimize
                    aria-label="Minimise prototype tools"
                >
                    Minimise
                </button>
            </div>

            <div class="demo-prototype-stack__content">
                @include('demo.partials.drawer-theme-customizer')

                <aside class="demo-controls" aria-label="Prototype controls">
                    <h3>Prototype controls</h3>
            <p class="demo-controls__label">VWO-style test switch</p>
            <label class="demo-toggle">
                <input type="checkbox" id="toggle-drawer-mode" {{ $cart['drawer_enabled'] ? 'checked' : '' }}>
                <span>Cart drawer (test)</span>
            </label>
            <p class="demo-controls__hint">Off = full basket page behaviour (alert). On = slide-out drawer.</p>
            <p class="demo-controls__label">Drawer layout</p>
            <label class="demo-toggle">
                <input type="checkbox" id="toggle-compact-v21" data-option="compact_v21" {{ !empty($cart['compact_v21']) ? 'checked' : '' }}>
                <span>Compact view (v2.1)</span>
            </label>
            <p class="demo-controls__hint">On by default. Mobile only when on; desktop stays default V2.</p>
            <label class="demo-toggle">
                <input type="checkbox" id="toggle-summary-v30" data-option="summary_v30" {{ !empty($cart['summary_v30']) ? 'checked' : '' }}>
                <span>Subtotal only (v3.0)</span>
            </label>
            <p class="demo-controls__hint">On by default. Hides order summary; main line reads Subtotal. Works with compact v2.1.</p>
            <p class="demo-controls__label">YG options</p>
            <label class="demo-toggle">
                <input type="checkbox" id="toggle-delivery-bar" data-option="delivery_bar" {{ $cart['show_free_delivery_bar'] ? 'checked' : '' }}>
                <span>Free delivery bar (V2 / GD only)</span>
            </label>
            <label class="demo-toggle">
                <input type="checkbox" id="toggle-upsells" data-option="upsells" {{ $cart['show_upsells'] ? 'checked' : '' }}>
                <span>Recommendations side tab</span>
            </label>
            <label class="demo-toggle">
                <input type="checkbox" id="toggle-apple-pay" data-option="apple_pay" {{ ($cart['show_apple_pay'] ?? true) ? 'checked' : '' }}>
                <span>Apple Pay (express button)</span>
            </label>
            <p class="demo-controls__resize">Resize window: ≤767px mobile · ≥768px desktop — open cart to see slide-out on PDP.</p>
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
    <script src="{{ asset('js/demo-prototype-stack.js') }}?v={{ filemtime(public_path('js/demo-prototype-stack.js')) }}" defer></script>
    <script src="{{ asset('js/demo-pdp-info.js') }}?v={{ filemtime(public_path('js/demo-pdp-info.js')) }}" defer></script>
<script>
document.querySelectorAll('[data-qty-delta]').forEach((btn) => {
    btn.addEventListener('click', () => {
        const el = document.getElementById('demo-pdp-qty');
        if (!el) return;
        const next = Math.max(1, Math.min(99, parseInt(el.textContent, 10) + Number(btn.getAttribute('data-qty-delta')));
        el.textContent = String(next);
    });
});
</script>
@endpush
