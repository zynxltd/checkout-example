{{-- Shared YouGarden header + nav (+ optional trust bar) — matches live yougarden.com --}}
@php
    use App\Services\DemoAccount;

    $accountLoggedIn = DemoAccount::isLoggedIn();
    $accountClubMember = $accountLoggedIn && DemoAccount::isClubMember();
    $accountFirstName = $accountLoggedIn ? (DemoAccount::user()['first_name'] ?? '') : '';
@endphp
<header class="demo-header">
    <div class="demo-header__inner">
        <button
            type="button"
            class="demo-header__menu demo-header__menu--mobile"
            id="demo-mobile-nav-open"
            aria-label="Menu"
            aria-expanded="false"
            aria-controls="demo-mobile-nav"
        >@include('demo.partials.icon', ['name' => 'menu'])</button>

        <a href="{{ route('demo.home') }}" class="demo-header__logo" aria-label="YouGarden home">
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
            <a
                href="{{ $accountLoggedIn ? route('demo.account.club') : route('demo.account.login') }}"
                class="demo-header__utility demo-header__utility--club{{ $accountClubMember ? ' is-member' : '' }}"
            >
                @include('demo.partials.account-club-save', ['modifier' => 'header'])
                <span class="demo-header__utility-copy">
                    <span class="demo-header__utility-title">Club Discounts</span>
                    @unless ($accountClubMember)
                        <span class="demo-header__utility-sub">Join Now</span>
                    @endunless
                </span>
            </a>
            <div class="demo-header__utility demo-header__utility--account">
                <span class="demo-header__utility-icon" aria-hidden="true">@include('demo.partials.icon', ['name' => 'account', 'width' => 28, 'height' => 28])</span>
                <span class="demo-header__utility-copy">
                    @if ($accountLoggedIn)
                        <span class="demo-header__utility-title">Welcome, {{ $accountFirstName }}</span>
                        <span class="demo-header__utility-sub">
                            <a href="{{ route('demo.account.home') }}" class="demo-header__utility-link">My Account</a>
                            <span aria-hidden="true"> | </span>
                            <form method="post" action="{{ route('demo.account.logout') }}" class="demo-header__logout-form">
                                @csrf
                                <button type="submit" class="demo-header__utility-link demo-header__utility-link--button">Log out</button>
                            </form>
                        </span>
                    @else
                        <span class="demo-header__utility-title">Welcome</span>
                        <span class="demo-header__utility-sub">
                            <a href="{{ route('demo.account.login') }}" class="demo-header__utility-link">Login</a>
                            <span aria-hidden="true"> | </span>
                            <a href="{{ route('demo.account.register') }}" class="demo-header__utility-link">Register</a>
                        </span>
                    @endif
                </span>
            </div>
            <button type="button" class="demo-header__basket" data-open-drawer aria-label="Open your basket">
                <span class="demo-header__basket-icon" aria-hidden="true">
                    <img
                        class="demo-header__basket-img"
                        src="{{ asset('images/icons/icon-wheelbarrow.svg') }}?v={{ filemtime(public_path('images/icons/icon-wheelbarrow.svg')) }}"
                        alt=""
                        width="48"
                        height="40"
                    >
                </span>
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
            <a href="{{ $accountLoggedIn ? route('demo.account.home') : route('demo.account.login') }}" class="demo-header__icon" aria-label="{{ $accountLoggedIn ? 'My account' : 'Account login' }}">@include('demo.partials.icon', ['name' => 'account'])</a>
            <button type="button" class="demo-header__cart" data-open-drawer aria-label="Open basket">
                @include('demo.partials.icon', ['name' => 'wheelbarrow', 'width' => 28, 'height' => 24])
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

<div class="demo-mobile-nav" id="demo-mobile-nav" hidden>
    <div class="demo-mobile-nav__overlay" id="demo-mobile-nav-overlay" tabindex="-1" aria-hidden="true"></div>
    <aside
        class="demo-mobile-nav__panel"
        id="demo-mobile-nav-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-mobile-nav-title"
    >
        <header class="demo-mobile-nav__head">
            <h2 class="demo-mobile-nav__title" id="demo-mobile-nav-title">Menu</h2>
            <button type="button" class="demo-mobile-nav__close" id="demo-mobile-nav-close" aria-label="Close menu">
                @include('demo.partials.icon', ['name' => 'close'])
            </button>
        </header>
        <nav class="demo-mobile-nav__links" aria-label="Shop categories">
            <a href="#" class="demo-mobile-nav__link demo-mobile-nav__link--new">New</a>
            <a href="{{ route('demo.listing.perennials') }}" class="demo-mobile-nav__link">Garden Plants</a>
            <a href="#" class="demo-mobile-nav__link">Houseplants</a>
            <a href="#" class="demo-mobile-nav__link">Trees and Shrubs</a>
            <a href="#" class="demo-mobile-nav__link">Fruits and Veg</a>
            <a href="#" class="demo-mobile-nav__link">Outdoor Living</a>
            <a href="#" class="demo-mobile-nav__link demo-mobile-nav__link--sale">Sale</a>
            <a href="#" class="demo-mobile-nav__link">Contact</a>
            <a href="{{ route('demo.tv-live') }}" class="demo-mobile-nav__link demo-mobile-nav__link--tv">YouGarden TV</a>
        </nav>
    </aside>
</div>

@if ($show_trust ?? false)
<div class="usp-wrapper" id="usp-wrapper" aria-label="Store promises">
    <div class="usp-inner-wrapper">
        <div class="usp-carousel" id="usp-carousel">
            <div class="usp-track" id="usp-track">
                <div class="usp-box">
                    <div class="usp-text">
                        <img src="{{ asset('images/usp_bar/icon_1_YG.png') }}?v={{ filemtime(public_path('images/usp_bar/icon_1_YG.png')) }}" class="usp-icon" height="26" width="26" alt="">
                        Free 30 Day Refund &amp; Replacement
                    </div>
                </div>
                <div class="usp-box">
                    <div class="usp-text">
                        <img src="{{ asset('images/usp_bar/icon_2_YG.png') }}?v={{ filemtime(public_path('images/usp_bar/icon_2_YG.png')) }}" class="usp-icon" height="26" width="26" alt="">
                        Affordable Plants Straight to Your Door
                    </div>
                </div>
                <div class="usp-box">
                    <div class="usp-text">
                        <img src="{{ asset('images/usp_bar/icon_3_YG.png') }}?v={{ filemtime(public_path('images/usp_bar/icon_3_YG.png')) }}" class="usp-icon" height="26" width="26" alt="">
                        Double Guarantee On Hardy Plants
                    </div>
                </div>
                <div class="usp-box usp-box--right">
                    <div class="usp-text">
                        <img src="{{ asset('images/usp_bar/icon_4_YG.png') }}?v={{ filemtime(public_path('images/usp_bar/icon_4_YG.png')) }}" class="usp-icon usp-icon--feefo" height="26" width="78" alt="feefo">
                        10 Years Of Trusted Service Award
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endif
