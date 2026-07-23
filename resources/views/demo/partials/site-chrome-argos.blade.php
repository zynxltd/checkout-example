{{-- Argos-style header chrome for homepage layout preview — YouGarden colours + categories --}}
@php
    use App\Services\DemoAccount;

    $accountLoggedIn = DemoAccount::isLoggedIn();
    $accountClubMember = $accountLoggedIn && DemoAccount::isClubMember();
    $accountFirstName = $accountLoggedIn ? (DemoAccount::user()['first_name'] ?? '') : '';
    $yg = 'https://www.yougarden.com';
@endphp
<header class="demo-header demo-header--argos" role="banner">
    <div class="demo-header__inner demo-header__inner--argos">
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

        <nav class="yg-argos-nav" aria-label="Primary">
            <div class="yg-argos-nav__item yg-argos-nav__item--shop" data-shop-dropdown>
                <button
                    type="button"
                    class="yg-argos-nav__link yg-argos-nav__link--btn"
                    id="yg-shop-trigger"
                    aria-expanded="false"
                    aria-controls="yg-shop-panel"
                    aria-haspopup="true"
                >
                    Shop
                    <span class="yg-argos-nav__chev" aria-hidden="true"></span>
                </button>
                <div class="yg-argos-nav__panel" id="yg-shop-panel" hidden>
                    <div class="yg-argos-nav__panel-inner">
                        @foreach ($shop_menu as $column)
                            <div class="yg-argos-nav__col">
                                <a
                                    class="yg-argos-nav__col-title"
                                    href="{{ $column['url'] }}"
                                    @if (str_starts_with($column['url'], 'http')) target="_blank" rel="noopener" @endif
                                >{{ $column['title'] }}</a>
                                @if (! empty($column['links']))
                                    <ul class="yg-argos-nav__list">
                                        @foreach ($column['links'] as $link)
                                            <li>
                                                <a
                                                    href="{{ $link['url'] }}"
                                                    @if (str_starts_with($link['url'], 'http')) target="_blank" rel="noopener" @endif
                                                >{{ $link['label'] }}</a>
                                            </li>
                                        @endforeach
                                    </ul>
                                @endif
                            </div>
                        @endforeach
                    </div>
                    <div class="yg-argos-nav__panel-foot">
                        <a href="{{ $yg }}/sale" target="_blank" rel="noopener" class="yg-argos-nav__sale-link">Shop the Sale</a>
                        <a href="{{ $yg }}/new" target="_blank" rel="noopener">New arrivals</a>
                        <a href="{{ route('demo.tv-live') }}">YouGarden TV</a>
                    </div>
                </div>
            </div>

            <a class="yg-argos-nav__link" href="{{ $yg }}/garden-plants/popular-garden-plants" target="_blank" rel="noopener">
                Trending
                <span class="yg-argos-nav__chev" aria-hidden="true"></span>
            </a>

            <a class="yg-argos-nav__link yg-argos-nav__link--sale" href="{{ $yg }}/sale" target="_blank" rel="noopener">
                Shop the Sale
            </a>

            <a
                class="yg-argos-nav__live"
                href="{{ route('demo.tv-live') }}"
                data-tv-live-placement="header"
                hidden
                aria-hidden="true"
                aria-label="YouGarden TV — Live now"
            >
                <span class="yg-argos-nav__live-dot" aria-hidden="true"></span>
                Live now
            </a>
        </nav>

        <div class="demo-header__search" role="search">
            <input type="search" class="demo-header__search-input" placeholder="{{ $search_placeholder ?? 'Search plants, trees or outdoor living' }}" aria-label="Search">
            <button type="button" class="demo-header__search-btn" aria-label="Search">@include('demo.partials.icon', ['name' => 'search'])</button>
        </div>

        <div class="demo-header__utilities">
            <a
                href="{{ $accountLoggedIn ? route('demo.account.club') : route('demo.account.login') }}"
                class="demo-header__utility demo-header__utility--club{{ $accountClubMember ? ' is-member' : '' }}"
            >
                @include('demo.partials.account-club-star', ['modifier' => 'header', 'size' => 28])
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
                        src="{{ asset('images/icons/icon-wheelbarrow.png') }}?v={{ filemtime(public_path('images/icons/icon-wheelbarrow.png')) }}"
                        alt=""
                        width="55"
                        height="48"
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
                @include('demo.partials.icon', ['name' => 'cart'])
                <span class="demo-header__badge" id="header-cart-count">{{ $cart['item_count'] }}</span>
            </button>
        </div>
    </div>
</header>

{{-- No green mega-nav strip — Argos pattern keeps primary links in the header --}}

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
            <h2 class="demo-mobile-nav__title" id="demo-mobile-nav-title">Shop</h2>
            <button type="button" class="demo-mobile-nav__close" id="demo-mobile-nav-close" aria-label="Close menu">
                @include('demo.partials.icon', ['name' => 'close'])
            </button>
        </header>
        <nav class="demo-mobile-nav__links" aria-label="Shop categories">
            <a href="{{ $yg }}/garden-plants/popular-garden-plants" class="demo-mobile-nav__link" target="_blank" rel="noopener">Trending</a>
            <a href="{{ $yg }}/sale" class="demo-mobile-nav__link demo-mobile-nav__link--sale" target="_blank" rel="noopener">Sale</a>
            <a href="{{ $yg }}/new" class="demo-mobile-nav__link demo-mobile-nav__link--new" target="_blank" rel="noopener">New</a>
            @foreach ($shop_menu as $column)
                <a href="{{ $column['url'] }}" class="demo-mobile-nav__link" target="_blank" rel="noopener">{{ $column['title'] }}</a>
                @foreach ($column['links'] ?? [] as $link)
                    <a href="{{ $link['url'] }}" class="demo-mobile-nav__link demo-mobile-nav__link--sub" target="_blank" rel="noopener">{{ $link['label'] }}</a>
                @endforeach
            @endforeach
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
