@php
    $drawerWidth = \App\Services\DemoCart::drawerWidth();
    $showClub = \App\Support\DemoDrawerVariant::showClubBanner();
    $showSpf = \App\Support\DemoDrawerVariant::showRootBoost();
    $showOffer = \App\Support\DemoDrawerVariant::showOfferCode();
    $showReco = (bool) session('demo_show_upsells', false);
    $showWelcomeBack = (bool) session('demo_show_welcome_back', false);
    $basketVisual = \App\Services\DemoCart::basketVisual();
    $onBasketPage = request()->routeIs('demo.basket');
@endphp
<aside class="demo-controls" data-drawer-width aria-label="Cart drawer width">
    @if($onBasketPage)
        <h3>Basket page</h3>
        <p class="demo-controls__label">Visual variant</p>
        <div class="demo-variant-toggle" role="group" aria-label="Basket visual variant">
            <button
                type="button"
                class="demo-variant-toggle__btn{{ $basketVisual === '1' ? ' is-active' : '' }}"
                data-basket-visual="1"
                aria-pressed="{{ $basketVisual === '1' ? 'true' : 'false' }}"
            >Variant 1</button>
            <button
                type="button"
                class="demo-variant-toggle__btn{{ $basketVisual === '2' ? ' is-active' : '' }}"
                data-basket-visual="2"
                aria-pressed="{{ $basketVisual === '2' ? 'true' : 'false' }}"
            >Variant 2</button>
        </div>
        <p class="demo-controls__hint">V1 = live basket. V2 = drawer-aligned styling. Club promo is V3.</p>
    @endif
    <h3>Cart drawer</h3>
    <p class="demo-controls__label">Desktop width</p>
    <div class="demo-drawer-width">
        <button type="button" class="demo-drawer-width__btn" data-drawer-width-step="-25" aria-label="Narrower drawer">−</button>
        <span class="demo-drawer-width__value" data-drawer-width-value>{{ $drawerWidth }}px</span>
        <button type="button" class="demo-drawer-width__btn" data-drawer-width-step="25" aria-label="Wider drawer">+</button>
    </div>
    <p class="demo-controls__hint">Steps of 25px, from 400px to 900px. Desktop only.</p>
    <p class="demo-controls__label">Upsells</p>
    <label class="demo-toggle">
        <input
            type="checkbox"
            id="toggle-drawer-show-spf"
            data-option="drawer_show_spf"
            {{ $showSpf ? 'checked' : '' }}
        >
        <span>Superior Plant Food banner</span>
    </label>
    <label class="demo-toggle">
        <input
            type="checkbox"
            id="toggle-drawer-show-club"
            data-option="drawer_show_club"
            {{ $showClub ? 'checked' : '' }}
        >
        <span>Club banner (drawer)</span>
    </label>
    <label class="demo-toggle">
        <input
            type="checkbox"
            id="toggle-drawer-show-offer"
            data-option="drawer_show_offer"
            {{ $showOffer ? 'checked' : '' }}
        >
        <span>Offer code</span>
    </label>
    <label class="demo-toggle">
        <input
            type="checkbox"
            id="toggle-drawer-show-reco"
            data-option="upsells"
            {{ $showReco ? 'checked' : '' }}
        >
        <span>Recommendations tab</span>
    </label>
    <label class="demo-toggle">
        <input
            type="checkbox"
            id="toggle-drawer-show-welcome"
            data-option="welcome_back"
            {{ $showWelcomeBack ? 'checked' : '' }}
        >
        <span>Welcome back</span>
    </label>
</aside>
