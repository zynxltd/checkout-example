@extends('demo.layout')

@section('title', $product['page_title'] . ' — YouGarden')

@section('body_class', 'demo-pdp')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
@endpush

@section('content')
<div class="demo-site">
    <header class="demo-header">
        <div class="demo-header__inner">
            <button type="button" class="demo-header__menu demo-header__menu--mobile" aria-label="Menu">@include('demo.partials.icon', ['name' => 'menu'])</button>

            <a href="/" class="demo-header__logo" aria-label="YouGarden home">
                <img
                    class="demo-header__logo-img"
                    src="{{ asset('images/yougarden-logo.png') }}"
                    alt="YouGarden — gardening for everyone"
                    width="300"
                    height="96"
                >
            </a>

            <div class="demo-header__search" role="search">
                <input type="search" class="demo-header__search-input" placeholder="Search" aria-label="Search">
                <button type="button" class="demo-header__search-btn" aria-label="Search">@include('demo.partials.icon', ['name' => 'search'])</button>
            </div>

            <div class="demo-header__utilities">
                <a href="#" class="demo-header__utility">
                    <span class="demo-header__utility-title">Club Discounts</span>
                    <span class="demo-header__utility-sub">Join Now</span>
                </a>
                <a href="#" class="demo-header__utility">
                    <span class="demo-header__utility-title">Welcome</span>
                    <span class="demo-header__utility-sub">Login | Register</span>
                </a>
                <button type="button" class="demo-header__basket" data-open-drawer aria-label="Open your basket">
                    <span class="demo-header__basket-icon" aria-hidden="true">@include('demo.partials.icon', ['name' => 'wheelbarrow', 'width' => 40, 'height' => 40])</span>
                    <span class="demo-header__basket-text">
                        <span class="demo-header__utility-title">Your Basket</span>
                        <span class="demo-header__utility-sub">
                            <span id="topbar-cart-count">{{ $cart['item_count'] }}</span> item(s)
                            £{{ number_format($cart['basket_total'], 2) }}
                        </span>
                    </span>
                </button>
            </div>

            <div class="demo-header__actions">
                <button type="button" class="demo-header__icon" aria-label="Account">@include('demo.partials.icon', ['name' => 'account'])</button>
                <button type="button" class="demo-header__cart" id="demo-open-cart" data-open-drawer aria-label="Open basket">
                    @include('demo.partials.icon', ['name' => 'cart'])
                    <span class="demo-header__badge" id="header-cart-count">{{ $cart['item_count'] }}</span>
                </button>
            </div>
        </div>
    </header>

    <nav class="demo-nav" aria-label="Shop categories">
        <div class="demo-nav__track">
            <a href="#">Garden Plants</a>
            <a href="#">Garden Bulbs</a>
            <a href="#">Bedding Plants</a>
            <a href="#">Perennial Plants</a>
            <a href="#">Roses</a>
            <a href="#">Trees and Shrubs</a>
            <a href="#">Fruits and Veg</a>
            <a href="#" class="demo-nav__sale">SALE</a>
        </div>
    </nav>

    <div class="demo-trust" aria-label="Store promises">
        <div class="demo-trust__track">
            <span>Free 30 Day Refund &amp; Replacement</span>
            <span>Affordable Plants Straight to Your Door</span>
            <span>Double Guarantee On Hardy Plants</span>
            <span>10 Years Of Trusted Service Award</span>
        </div>
    </div>

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

    <section class="demo-pdp__desc" aria-labelledby="demo-desc-title">
        <h2 class="demo-pdp__desc-title" id="demo-desc-title">Description</h2>
        <p class="demo-pdp__desc-lead">{{ $product['description_lead'] }}</p>
        <p class="demo-pdp__desc-more">This compact lilac tree is neatly trained with a single straight stem and a lollipop-style head that bursts into flower with masses of delicate, pale purple blooms from May.</p>
    </section>

    <div class="demo-prototype-stack">
        @include('demo.partials.drawer-theme-customizer')

        <aside class="demo-controls" aria-label="Prototype controls">
            <h3>Prototype controls</h3>
            <p class="demo-controls__label">VWO-style test switch</p>
            <label class="demo-toggle">
                <input type="checkbox" id="toggle-drawer-mode" {{ $cart['drawer_enabled'] ? 'checked' : '' }}>
                <span>Cart drawer (test)</span>
            </label>
            <p class="demo-controls__hint">Off = full basket page behaviour (alert). On = slide-out drawer.</p>
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

<div id="yg-drawer-mount">
    @include('demo.partials.drawer', ['cart' => $cart])
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/yg-drawer-theme.js') }}?v={{ filemtime(public_path('js/yg-drawer-theme.js')) }}" defer></script>
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
