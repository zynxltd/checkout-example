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

        <div class="demo-header__brand">
        <a href="{{ route('demo.home') }}" class="demo-header__logo" aria-label="YouGarden home">
            <img
                class="demo-header__logo-img"
                src="{{ asset('images/yougarden-logo.png') }}"
                alt="YouGarden — gardening for everyone"
                width="300"
                height="96"
            >
        </a>

        {{-- Argos: Shop / Trending / Sale beside logo — hidden; green YouGarden category bar is primary --}}
        <nav class="yg-argos-nav" aria-label="Primary" hidden>
            <div class="yg-argos-nav__item yg-argos-nav__item--shop" data-nav-dropdown data-shop-dropdown>
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
                    <div class="yg-argos-nav__panel-card">
                        <div class="yg-argos-mega" data-shop-mega>
                            <div class="yg-argos-mega__depts" role="tablist" aria-label="Shop departments">
                                @foreach ($shop_menu as $deptIndex => $dept)
                                    <button
                                        type="button"
                                        class="yg-argos-mega__dept{{ $deptIndex === 0 ? ' is-active' : '' }}"
                                        role="tab"
                                        id="yg-shop-dept-{{ $deptIndex }}"
                                        aria-selected="{{ $deptIndex === 0 ? 'true' : 'false' }}"
                                        aria-controls="yg-shop-dept-panel-{{ $deptIndex }}"
                                        data-mega-dept="{{ $deptIndex }}"
                                    >{{ $dept['title'] }}</button>
                                @endforeach
                            </div>

                            @foreach ($shop_menu as $deptIndex => $dept)
                                <div
                                    class="yg-argos-mega__body{{ $deptIndex === 0 ? ' is-active' : '' }}"
                                    id="yg-shop-dept-panel-{{ $deptIndex }}"
                                    role="tabpanel"
                                    aria-labelledby="yg-shop-dept-{{ $deptIndex }}"
                                    data-mega-dept-panel="{{ $deptIndex }}"
                                    @if ($deptIndex !== 0) hidden @endif
                                >
                                    <ul class="yg-argos-mega__cats" aria-label="{{ $dept['title'] }} categories">
                                        <li>
                                            <a
                                                class="yg-argos-mega__cat yg-argos-mega__cat--viewall is-active"
                                                href="{{ $dept['url'] }}"
                                                data-mega-cat
                                                data-mega-cat-id="viewall-{{ $deptIndex }}"
                                            >
                                                <span class="yg-argos-mega__cat-label">All {{ $dept['title'] }}</span>
                                            </a>
                                        </li>
                                        @foreach ($dept['children'] as $catIndex => $cat)
                                            <li>
                                                <a
                                                    class="yg-argos-mega__cat{{ ! empty($cat['children']) ? ' has-children' : '' }}"
                                                    href="{{ $cat['url'] }}"
                                                    data-mega-cat
                                                    data-mega-cat-id="{{ $deptIndex }}-{{ $catIndex }}"
                                                    @if (! empty($cat['children'])) aria-haspopup="true" @endif
                                                >
                                                    <span class="yg-argos-mega__cat-label">{{ $cat['label'] }}</span>
                                                    @if (! empty($cat['children']))
                                                        <span class="yg-argos-mega__cat-chev" aria-hidden="true"></span>
                                                    @endif
                                                </a>
                                            </li>
                                        @endforeach
                                    </ul>

                                    <div class="yg-argos-mega__subs">
                                        <div
                                            class="yg-argos-mega__sub yg-argos-mega__sub--overview is-active"
                                            data-mega-sub="viewall-{{ $deptIndex }}"
                                        >
                                            <p class="yg-argos-mega__sub-kicker">Department</p>
                                            <p class="yg-argos-mega__sub-title">{{ $dept['title'] }}</p>
                                            <p class="yg-argos-mega__sub-hint">Pick a category on the left, or shop the full range in one click.</p>
                                            <a class="yg-argos-mega__cta" href="{{ $dept['url'] }}">
                                                Shop all {{ $dept['title'] }}
                                            </a>
                                            <p class="yg-argos-mega__sub-count">{{ count($dept['children']) }} categories</p>
                                        </div>
                                        @foreach ($dept['children'] as $catIndex => $cat)
                                            <div
                                                class="yg-argos-mega__sub"
                                                data-mega-sub="{{ $deptIndex }}-{{ $catIndex }}"
                                                hidden
                                            >
                                                <p class="yg-argos-mega__sub-kicker">Category</p>
                                                <p class="yg-argos-mega__sub-title">{{ $cat['label'] }}</p>
                                                <a class="yg-argos-mega__cta yg-argos-mega__cta--secondary" href="{{ $cat['url'] }}">
                                                    Shop all {{ $cat['label'] }}
                                                </a>
                                                @if (! empty($cat['children']))
                                                    <p class="yg-argos-mega__sub-section">Popular in this category</p>
                                                    <ul class="yg-argos-mega__link-list">
                                                        @foreach ($cat['children'] as $sub)
                                                            <li>
                                                                <a href="{{ $sub['url'] }}">{{ $sub['label'] }}</a>
                                                            </li>
                                                        @endforeach
                                                    </ul>
                                                @endif
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            @endforeach
                        </div>

                        <div class="yg-argos-nav__panel-foot">
                            <a href="{{ route('demo.sale') }}" class="yg-argos-nav__sale-link">Sale</a>
                            <a href="{{ $yg }}/new" target="_blank" rel="noopener">New arrivals</a>
                            <a href="{{ route('demo.tv-live') }}">YouGarden TV</a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="yg-argos-nav__item yg-argos-nav__item--trending" data-nav-dropdown>
                <button
                    type="button"
                    class="yg-argos-nav__link yg-argos-nav__link--btn"
                    id="yg-trending-trigger"
                    aria-expanded="false"
                    aria-controls="yg-trending-panel"
                    aria-haspopup="true"
                >
                    Trending
                    <span class="yg-argos-nav__chev" aria-hidden="true"></span>
                </button>
                <div class="yg-argos-nav__panel yg-argos-nav__panel--compact" id="yg-trending-panel" hidden>
                    <div class="yg-argos-nav__panel-card">
                        <p class="yg-argos-nav__panel-heading">Trending now</p>
                        <ul class="yg-argos-nav__simple-list">
                            @foreach ($trending_links ?? [] as $link)
                                <li>
                                    <a href="{{ $link['url'] }}">{{ $link['label'] }}</a>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                </div>
            </div>

            <a class="yg-argos-nav__link yg-argos-nav__link--sale" href="{{ route('demo.sale') }}">
                Sale
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
        </div>

        <div class="demo-header__search" role="search" data-search-suggest>
            <input
                type="search"
                class="demo-header__search-input"
                placeholder="{{ $search_placeholder ?? 'Search plants, trees or outdoor living' }}"
                aria-label="Search"
                autocomplete="off"
            >
            <button type="button" class="demo-header__search-btn" aria-label="Search">@include('demo.partials.icon', ['name' => 'search'])</button>
            <div
                class="yg-search-suggest"
                id="yg-search-suggest"
                data-search-suggest-panel
                hidden
            >
                <p class="yg-search-suggest__label">Recommended searches</p>
                <ul class="yg-search-suggest__list" data-search-suggest-list role="listbox" aria-label="Recommended searches"></ul>
            </div>
        </div>

        <div class="demo-header__utilities demo-header__utilities--yg-icons">
            <a
                href="{{ route('demo.tv-live') }}"
                class="demo-header__utility demo-header__utility--stacked demo-header__utility--tv"
                aria-label="YouGarden TV"
            >
                <span class="demo-header__utility-icon" aria-hidden="true">
                    <img
                        class="demo-header__utility-img demo-header__utility-img--tv"
                        src="{{ asset('images/icons/icon-tv-play.png') }}?v={{ filemtime(public_path('images/icons/icon-tv-play.png')) }}"
                        alt=""
                        width="28"
                        height="28"
                    >
                </span>
                <span class="demo-header__utility-label">
                    <span class="demo-header__utility-label-full">YouGarden TV</span>
                    <span class="demo-header__utility-label-short">TV</span>
                </span>
            </a>

            <a
                href="{{ $accountLoggedIn ? route('demo.account.club') : route('demo.account.login') }}"
                class="demo-header__utility demo-header__utility--stacked demo-header__utility--club{{ $accountClubMember ? ' is-member' : '' }}"
            >
                <span class="demo-header__utility-icon" aria-hidden="true">
                    <span class="demo-header__club-shine">
                        <img
                            class="demo-header__utility-img demo-header__utility-img--club"
                            src="{{ asset('images/icons/icon-club-save.png') }}?v={{ filemtime(public_path('images/icons/icon-club-save.png')) }}"
                            alt=""
                            width="88"
                            height="22"
                        >
                    </span>
                </span>
                <span class="demo-header__utility-label">
                    <span class="demo-header__utility-label-full">Join Our Club</span>
                    <span class="demo-header__utility-label-short">Club</span>
                </span>
            </a>

            <div class="demo-header__utility demo-header__utility--stacked demo-header__utility--account">
                <span class="demo-header__utility-icon" aria-hidden="true">
                    <img
                        class="demo-header__utility-img demo-header__utility-img--account"
                        src="{{ asset('images/icons/icon-account-flat.png') }}?v={{ filemtime(public_path('images/icons/icon-account-flat.png')) }}"
                        alt=""
                        width="22"
                        height="24"
                    >
                </span>
                <span class="demo-header__utility-label demo-header__utility-label--account">
                    @if ($accountLoggedIn)
                        <a href="{{ route('demo.account.home') }}" class="demo-header__utility-link">{{ $accountFirstName ?: 'Account' }}</a>
                    @else
                        <span class="demo-header__utility-label-full">
                            <a href="{{ route('demo.account.login') }}" class="demo-header__utility-link">Login</a>
                            <span aria-hidden="true"> | </span>
                            <a href="{{ route('demo.account.register') }}" class="demo-header__utility-link">Register</a>
                        </span>
                        <span class="demo-header__utility-label-short">
                            <a href="{{ route('demo.account.login') }}" class="demo-header__utility-link">Account</a>
                        </span>
                    @endif
                </span>
            </div>

            @include('demo.partials.mini-basket', ['cart' => $cart])
        </div>

        <div class="demo-header__actions">
            <a href="{{ $accountLoggedIn ? route('demo.account.home') : route('demo.account.login') }}" class="demo-header__icon" aria-label="{{ $accountLoggedIn ? 'My account' : 'Account login' }}">@include('demo.partials.icon', ['name' => 'account'])</a>
            <button type="button" class="demo-header__cart" data-open-drawer aria-label="Open basket">
                <img
                    class="demo-header__cart-img"
                    src="{{ asset('images/icons/icon-wheelbarrow.png') }}?v={{ filemtime(public_path('images/icons/icon-wheelbarrow.png')) }}"
                    alt=""
                    width="28"
                    height="24"
                >
                <span class="demo-header__badge" id="header-cart-count">{{ $cart['item_count'] }}</span>
            </button>
        </div>
    </div>

    <nav class="demo-nav" aria-label="Shop categories">
        <div class="demo-nav__track">
            <a href="https://www.yougarden.com/new" class="demo-nav__new">New</a>
            <a href="{{ route('demo.listing.garden-plants') }}">Garden Plants</a>
            <a href="https://www.yougarden.com/houseplants">Houseplants</a>
            <a href="https://www.yougarden.com/trees-and-shrubs">Trees and Shrubs</a>
            <a href="https://www.yougarden.com/grow-your-own-fruit-and-veg">Fruits and Veg</a>
            <a href="https://www.yougarden.com/outdoor-living">Outdoor Living</a>
            <a href="{{ route('demo.sale') }}" class="demo-nav__sale">Sale</a>
            <a href="{{ route('demo.tv-live') }}" class="demo-nav__tv" aria-label="YouGarden TV">
                <img
                    class="demo-nav__tv-logo"
                    src="{{ asset('images/icons/YGTV.png') }}?v={{ filemtime(public_path('images/icons/YGTV.png')) }}"
                    alt="YouGarden TV"
                    width="131"
                    height="34"
                >
            </a>
        </div>
    </nav>
</header>

@include('demo.partials.mobile-nav-currys')

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

<div class="yg-argos-page-overlay" data-nav-page-overlay hidden aria-hidden="true"></div>
