{{-- Shared YouGarden header + nav (+ optional trust bar) — matches live yougarden.com --}}
<header class="demo-header">
    <div class="demo-header__inner">
        <button type="button" class="demo-header__menu demo-header__menu--mobile" aria-label="Menu">@include('demo.partials.icon', ['name' => 'menu'])</button>

        <a href="{{ route('demo.pdp') }}" class="demo-header__logo" aria-label="YouGarden home">
            <img
                class="demo-header__logo-img"
                src="{{ asset('images/yougarden-logo.png') }}"
                alt="YouGarden — gardening for everyone"
                width="300"
                height="96"
            >
        </a>

        <div class="demo-header__search" role="search">
            <input type="search" class="demo-header__search-input" placeholder="{{ $search_placeholder ?? 'hanging baskets' }}" aria-label="Search">
            <button type="button" class="demo-header__search-btn" aria-label="Search">@include('demo.partials.icon', ['name' => 'search'])</button>
        </div>

        <div class="demo-header__utilities">
            <a href="#" class="demo-header__utility demo-header__utility--club">
                <span class="demo-header__utility-title">Club Discounts</span>
                <span class="demo-header__utility-sub">Join Now</span>
            </a>
            <div class="demo-header__utility">
                <span class="demo-header__utility-title">Welcome</span>
                <span class="demo-header__utility-sub">
                    <a href="{{ route('demo.account.login') }}" class="demo-header__utility-link">Login</a>
                    <span aria-hidden="true"> | </span>
                    <a href="{{ route('demo.account.register') }}" class="demo-header__utility-link">Register</a>
                </span>
            </div>
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
            <a href="{{ route('demo.account.login') }}" class="demo-header__icon" aria-label="Account">@include('demo.partials.icon', ['name' => 'account'])</a>
            <button type="button" class="demo-header__cart" data-open-drawer aria-label="Open basket">
                @include('demo.partials.icon', ['name' => 'cart'])
                <span class="demo-header__badge" id="header-cart-count">{{ $cart['item_count'] }}</span>
            </button>
        </div>
    </div>
</header>

<nav class="demo-nav" aria-label="Shop categories">
    <div class="demo-nav__track">
        <a href="#" class="demo-nav__new">New</a>
        <a href="{{ route('demo.listing.perennials') }}">Garden Plants</a>
        <a href="#">Houseplants</a>
        <a href="#">Trees and Shrubs</a>
        <a href="#">Fruits and Veg</a>
        <a href="#">Outdoor Living</a>
        <a href="#" class="demo-nav__sale">Sale</a>
        <a href="#">Contact</a>
        <a href="{{ route('demo.tv-live') }}" class="demo-nav__tv">YouGarden <span class="demo-nav__tv-badge">TV</span></a>
    </div>
</nav>

@if ($show_trust ?? false)
<div class="demo-trust" aria-label="Store promises">
    <div class="demo-trust__track">
        <span>Free 30 Day Refund &amp; Replacement</span>
        <span>Affordable Plants Straight to Your Door</span>
        <span>Double Guarantee On Hardy Plants</span>
        <span>10 Years Of Trusted Service Award</span>
    </div>
</div>
@endif
