@php
    $drawerWidth = \App\Services\DemoCart::drawerWidth();
    $showClub = \App\Support\DemoDrawerVariant::showClubBanner();
    $showSpf = \App\Support\DemoDrawerVariant::showRootBoost();
    $showOffer = \App\Support\DemoDrawerVariant::showOfferCode();
    $showReco = (bool) session('demo_show_upsells', false);
    $basketVisual = \App\Services\DemoCart::basketVisual();
    $basketClubDesk = \App\Services\DemoCart::basketClubDesk();
    $basketClubMob = \App\Services\DemoCart::basketClubMob();
    $basketSpfDesk = \App\Services\DemoCart::basketSpfDesk();
    $basketSpfMob = \App\Services\DemoCart::basketSpfMob();
    $onBasketPage = request()->routeIs('demo.basket');
@endphp
<aside class="demo-controls" data-drawer-width aria-label="Prototype controls">
    @if($onBasketPage)
        <section class="demo-controls__section">
            <h3 class="demo-controls__heading">Basket</h3>

            <div class="demo-controls__block">
                <p class="demo-controls__label">Style</p>
                <div class="demo-variant-toggle" role="group" aria-label="Basket visual variant">
                    <button
                        type="button"
                        class="demo-variant-toggle__btn{{ $basketVisual === '1' ? ' is-active' : '' }}"
                        data-basket-visual="1"
                        aria-pressed="{{ $basketVisual === '1' ? 'true' : 'false' }}"
                    >Live</button>
                    <button
                        type="button"
                        class="demo-variant-toggle__btn{{ $basketVisual === '2' ? ' is-active' : '' }}"
                        data-basket-visual="2"
                        aria-pressed="{{ $basketVisual === '2' ? 'true' : 'false' }}"
                    >V2</button>
                </div>
            </div>

            <div class="demo-controls__block">
                <p class="demo-controls__label">Club banner</p>
                <div class="demo-chip-toggles" role="group" aria-label="Club banner visibility">
                    <label class="demo-chip{{ $basketClubDesk ? ' is-on' : '' }}">
                        <input
                            type="checkbox"
                            id="toggle-basket-club-desk"
                            data-option="basket_club_desk"
                            {{ $basketClubDesk ? 'checked' : '' }}
                        >
                        <span>Desktop</span>
                    </label>
                    <label class="demo-chip{{ $basketClubMob ? ' is-on' : '' }}">
                        <input
                            type="checkbox"
                            id="toggle-basket-club-mob"
                            data-option="basket_club_mob"
                            {{ $basketClubMob ? 'checked' : '' }}
                        >
                        <span>Mobile</span>
                    </label>
                </div>
            </div>

            <div class="demo-controls__block">
                <p class="demo-controls__label">Plant Food banner</p>
                <div class="demo-chip-toggles" role="group" aria-label="Superior Plant Food banner visibility">
                    <label class="demo-chip{{ $basketSpfDesk ? ' is-on' : '' }}">
                        <input
                            type="checkbox"
                            id="toggle-basket-spf-desk"
                            data-option="basket_spf_desk"
                            {{ $basketSpfDesk ? 'checked' : '' }}
                        >
                        <span>Desktop</span>
                    </label>
                    <label class="demo-chip{{ $basketSpfMob ? ' is-on' : '' }}">
                        <input
                            type="checkbox"
                            id="toggle-basket-spf-mob"
                            data-option="basket_spf_mob"
                            {{ $basketSpfMob ? 'checked' : '' }}
                        >
                        <span>Mobile</span>
                    </label>
                </div>
            </div>
        </section>
    @endif

    <section class="demo-controls__section">
        <h3 class="demo-controls__heading">Drawer</h3>

        <div class="demo-controls__block">
            <p class="demo-controls__label">Width</p>
            <div class="demo-drawer-width">
                <button type="button" class="demo-drawer-width__btn" data-drawer-width-step="-25" aria-label="Narrower drawer">−</button>
                <span class="demo-drawer-width__value" data-drawer-width-value>{{ $drawerWidth }}px</span>
                <button type="button" class="demo-drawer-width__btn" data-drawer-width-step="25" aria-label="Wider drawer">+</button>
            </div>
        </div>

        <div class="demo-controls__block">
            <p class="demo-controls__label">Show</p>
            <div class="demo-controls__list">
                <label class="demo-toggle">
                    <input
                        type="checkbox"
                        id="toggle-drawer-show-spf"
                        data-option="drawer_show_spf"
                        {{ $showSpf ? 'checked' : '' }}
                    >
                    <span>Plant Food</span>
                </label>
                <label class="demo-toggle">
                    <input
                        type="checkbox"
                        id="toggle-drawer-show-club"
                        data-option="drawer_show_club"
                        {{ $showClub ? 'checked' : '' }}
                    >
                    <span>Club banner</span>
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
                    <span>Recommendations</span>
                </label>
            </div>
        </div>
    </section>
</aside>
