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

        <nav class="yg-argos-nav" aria-label="Primary">
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
                                @php
                                    $firstWithKids = null;
                                    foreach ($dept['children'] as $ci => $cat) {
                                        if (! empty($cat['children'])) {
                                            $firstWithKids = $ci;
                                            break;
                                        }
                                    }
                                    if ($firstWithKids === null) {
                                        $firstWithKids = 0;
                                    }
                                @endphp
                                <div
                                    class="yg-argos-mega__body{{ $deptIndex === 0 ? ' is-active' : '' }}"
                                    id="yg-shop-dept-panel-{{ $deptIndex }}"
                                    role="tabpanel"
                                    aria-labelledby="yg-shop-dept-{{ $deptIndex }}"
                                    data-mega-dept-panel="{{ $deptIndex }}"
                                    @if ($deptIndex !== 0) hidden @endif
                                >
                                    <ul class="yg-argos-mega__cats">
                                        <li>
                                            <a
                                                class="yg-argos-mega__cat yg-argos-mega__cat--viewall"
                                                href="{{ $dept['url'] }}"
                                                target="_blank"
                                                rel="noopener"
                                                data-mega-cat
                                                data-mega-cat-id="viewall-{{ $deptIndex }}"
                                            >View All {{ $dept['title'] }}</a>
                                        </li>
                                        @foreach ($dept['children'] as $catIndex => $cat)
                                            <li>
                                                <a
                                                    class="yg-argos-mega__cat{{ ! empty($cat['children']) ? ' has-children' : '' }}{{ $catIndex === $firstWithKids ? ' is-active' : '' }}"
                                                    href="{{ $cat['url'] }}"
                                                    target="_blank"
                                                    rel="noopener"
                                                    data-mega-cat
                                                    data-mega-cat-id="{{ $deptIndex }}-{{ $catIndex }}"
                                                    @if (! empty($cat['children'])) aria-haspopup="true" @endif
                                                >
                                                    <span>{{ $cat['label'] }}</span>
                                                    @if (! empty($cat['children']))
                                                        <span class="yg-argos-mega__cat-chev" aria-hidden="true"></span>
                                                    @endif
                                                </a>
                                            </li>
                                        @endforeach
                                    </ul>

                                    <div class="yg-argos-mega__subs">
                                        <div
                                            class="yg-argos-mega__sub"
                                            data-mega-sub="viewall-{{ $deptIndex }}"
                                            hidden
                                        >
                                            <p class="yg-argos-mega__sub-title">{{ $dept['title'] }}</p>
                                            <a class="yg-argos-mega__sub-link yg-argos-mega__sub-link--viewall" href="{{ $dept['url'] }}" target="_blank" rel="noopener">
                                                Shop all {{ $dept['title'] }}
                                            </a>
                                        </div>
                                        @foreach ($dept['children'] as $catIndex => $cat)
                                            <div
                                                class="yg-argos-mega__sub{{ $catIndex === $firstWithKids ? ' is-active' : '' }}"
                                                data-mega-sub="{{ $deptIndex }}-{{ $catIndex }}"
                                                @if ($catIndex !== $firstWithKids) hidden @endif
                                            >
                                                <p class="yg-argos-mega__sub-title">{{ $cat['label'] }}</p>
                                                @if (! empty($cat['children']))
                                                    <ul class="yg-argos-mega__sub-list">
                                                        @foreach ($cat['children'] as $sub)
                                                            <li>
                                                                <a href="{{ $sub['url'] }}" target="_blank" rel="noopener">{{ $sub['label'] }}</a>
                                                            </li>
                                                        @endforeach
                                                    </ul>
                                                @else
                                                    <a class="yg-argos-mega__sub-link yg-argos-mega__sub-link--viewall" href="{{ $cat['url'] }}" target="_blank" rel="noopener">
                                                        View All {{ $cat['label'] }}
                                                    </a>
                                                @endif
                                            </div>
                                        @endforeach
                                    </div>
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
                                    <a href="{{ $link['url'] }}" target="_blank" rel="noopener">{{ $link['label'] }}</a>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                </div>
            </div>

            <a class="yg-argos-nav__link yg-argos-nav__link--sale" href="{{ $yg }}/sale" target="_blank" rel="noopener">
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
                <span class="demo-header__utility-label">YouGarden TV</span>
            </a>

            <a
                href="{{ $accountLoggedIn ? route('demo.account.club') : route('demo.account.login') }}"
                class="demo-header__utility demo-header__utility--stacked demo-header__utility--club{{ $accountClubMember ? ' is-member' : '' }}"
            >
                <span class="demo-header__utility-icon" aria-hidden="true">
                    <img
                        class="demo-header__utility-img demo-header__utility-img--club"
                        src="{{ asset('images/icons/icon-club-save.png') }}?v={{ filemtime(public_path('images/icons/icon-club-save.png')) }}"
                        alt=""
                        width="88"
                        height="22"
                    >
                </span>
                <span class="demo-header__utility-label">Join Our Club</span>
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
                        <a href="{{ route('demo.account.login') }}" class="demo-header__utility-link">Login</a>
                        <span aria-hidden="true"> | </span>
                        <a href="{{ route('demo.account.register') }}" class="demo-header__utility-link">Register</a>
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
            @foreach ($trending_links ?? [] as $link)
                <a href="{{ $link['url'] }}" class="demo-mobile-nav__link demo-mobile-nav__link--sub" target="_blank" rel="noopener">{{ $link['label'] }}</a>
            @endforeach
            <a href="{{ $yg }}/sale" class="demo-mobile-nav__link demo-mobile-nav__link--sale" target="_blank" rel="noopener">Sale</a>
            <a href="{{ $yg }}/new" class="demo-mobile-nav__link demo-mobile-nav__link--new" target="_blank" rel="noopener">New</a>
            @foreach ($shop_menu as $column)
                <a href="{{ $column['url'] }}" class="demo-mobile-nav__link" target="_blank" rel="noopener">{{ $column['title'] }}</a>
                @foreach ($column['children'] ?? $column['links'] ?? [] as $link)
                    <a href="{{ $link['url'] }}" class="demo-mobile-nav__link demo-mobile-nav__link--sub" target="_blank" rel="noopener">{{ $link['label'] }}</a>
                    @foreach ($link['children'] ?? [] as $sub)
                        <a href="{{ $sub['url'] }}" class="demo-mobile-nav__link demo-mobile-nav__link--sub2" target="_blank" rel="noopener">{{ $sub['label'] }}</a>
                    @endforeach
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
