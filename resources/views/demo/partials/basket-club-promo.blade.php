@php
    /** @var string $variant v1|v2|v3 */
    /** @var string $saving e.g. £12.34 */
    /** @var string $clubUrl */
    $assetBase = asset('ce/basket-club');
    $skuAuto = \App\Services\DemoCart::CLUB_SKU_AUTO;
    $skuManual = \App\Services\DemoCart::CLUB_SKU_MANUAL;
@endphp

@if($variant === 'v1')
    <div class="ce-yg-club-promo ce-yg-club-promo--v1" data-ce-yg-club-promo="v1" data-basket-club-promo>
        <div class="ce-yg-club-promo__inner">
            <img class="ce-yg-club-promo__logo" src="{{ $assetBase }}/assets/yg-club-logo-v1.png" alt="YouGarden Discount Club" width="70" height="70">
            <div class="ce-yg-club-promo__lead">
                <div class="ce-yg-club-promo__copy">
                    <p class="ce-yg-club-promo__eyebrow">Join our club &amp;</p>
                    <p class="ce-yg-club-promo__save">Save {{ $saving }}</p>
                    <p class="ce-yg-club-promo__sub">on this order</p>
                    <a class="ce-yg-club-promo__more" href="{{ $clubUrl }}">More Info</a>
                </div>
            </div>
            <div class="ce-yg-club-promo__benefits">
                <div class="ce-yg-club-promo__benefit">
                    <span class="ce-yg-club-promo__benefit-icon" aria-hidden="true"><img src="{{ $assetBase }}/assets/yg-club-icon-plant.png" alt="" width="34" height="48"></span>
                    <span class="ce-yg-club-promo__benefit-label"><strong>15% Off</strong>All Plants and Accessories</span>
                </div>
                <div class="ce-yg-club-promo__benefit">
                    <span class="ce-yg-club-promo__benefit-icon" aria-hidden="true"><img src="{{ $assetBase }}/assets/yg-club-icon-vouchers.png" alt="" width="40" height="33"></span>
                    <span class="ce-yg-club-promo__benefit-label"><strong>£20</strong>In Vouchers</span>
                </div>
                <div class="ce-yg-club-promo__benefit">
                    <span class="ce-yg-club-promo__benefit-icon" aria-hidden="true"><img src="{{ $assetBase }}/assets/yg-club-icon-van.png" alt="" width="42" height="25"></span>
                    <span class="ce-yg-club-promo__benefit-label"><strong>2 x Free</strong>P&amp;P Vouchers<br>(Worth £6.99 Each)</span>
                </div>
            </div>
            <div class="ce-yg-club-promo__choose" role="radiogroup" aria-label="Club membership options">
                <label class="ce-yg-club-promo__opt is-selected">
                    <input type="radio" name="ce-yg-club-v1" value="{{ $skuAuto }}" checked>
                    <span class="ce-yg-club-promo__radio" aria-hidden="true"></span>
                    <span class="ce-yg-club-promo__opt-text">
                        <span class="ce-yg-club-promo__opt-title">Auto Renewal</span>
                        <span class="ce-yg-club-promo__opt-price">Now £10</span>
                        <span class="ce-yg-club-promo__meta">Per Year <span class="ce-yg-club-promo__was">Was £20</span></span>
                    </span>
                </label>
                <label class="ce-yg-club-promo__opt ce-yg-club-promo__opt--one">
                    <input type="radio" name="ce-yg-club-v1" value="{{ $skuManual }}">
                    <span class="ce-yg-club-promo__radio" aria-hidden="true"></span>
                    <span class="ce-yg-club-promo__opt-text">
                        <span class="ce-yg-club-promo__opt-title">One Year</span>
                        <span class="ce-yg-club-promo__opt-row">
                            <span class="ce-yg-club-promo__opt-price">£20</span>
                            <span class="ce-yg-club-promo__meta">No Auto<br>Renew</span>
                        </span>
                    </span>
                </label>
                <button type="button" class="ce-yg-club-promo__atc" data-basket-club-atc>Add to Basket</button>
            </div>
        </div>
    </div>
@elseif($variant === 'v2')
    <div class="ce-yg-club-promo ce-yg-club-promo--v2" data-ce-yg-club-promo="v2" data-basket-club-promo>
        <div class="ce-yg-club-promo__inner">
            <div class="ce-yg-club-promo__left">
                <img class="ce-yg-club-promo__logo" src="{{ $assetBase }}/assets/yg-club-logo-icon-96.png" alt="YouGarden Discount Club" width="96" height="85">
                <p class="ce-yg-club-promo__title">Join our club &amp; <span class="ce-yg-club-promo__save">Save {{ $saving }}</span> on this order</p>
                <a class="ce-yg-club-promo__find" href="{{ $clubUrl }}">More Info Here</a>
            </div>
            <div class="ce-yg-club-promo__right">
                <p class="ce-yg-club-promo__sub">Sign Up Today for 15% Off All Plants &amp; Accessories, £20 in Product Vouchers, Free P&amp;P Vouchers &amp; More!</p>
                <div class="ce-yg-club-promo__actions">
                    <button type="button" class="ce-yg-club-promo__pill" data-basket-club-add="{{ $skuAuto }}">
                        <span>Auto Renewal <strong>Now £10</strong> Per Year <span class="ce-yg-club-promo__was">Was £20</span></span>
                        <svg class="ce-yg-club-promo__plus" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#7cb342"/><path d="M12 7v10M7 12h10" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>
                    </button>
                    <button type="button" class="ce-yg-club-promo__pill" data-basket-club-add="{{ $skuManual }}">
                        <span>12 Month Membership <strong>£20</strong> (No Auto Renewal)</span>
                        <svg class="ce-yg-club-promo__plus" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#7cb342"/><path d="M12 7v10M7 12h10" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
@else
    <div id="ygbc3-root" data-layout="desk" data-basket-club-promo data-ce-yg-club-promo="v3">
        <div id="ygbc3-top">
            <span id="ygbc3-logo-wrap">
                <img id="ygbc3-logo" src="{{ $assetBase }}/assets/yg-club-logo-v3.png" alt="YouGarden Discount Club" width="160" height="119">
            </span>
            <div id="ygbc3-banner">
                <div id="ygbc3-copy">
                    <p id="ygbc3-title">Join the YouGarden Club &amp; <span id="ygbc3-save">Save {{ $saving }}</span> on this order</p>
                    <p id="ygbc3-benefits">
                        <span>15% off all Plants &amp; Accessories</span>
                        <span class="ygbc3-sep" aria-hidden="true"></span>
                        <span>£20 in Product Vouchers</span>
                        <span class="ygbc3-sep" aria-hidden="true"></span>
                        <span>2 x Free P&amp;P Vouchers</span>
                    </p>
                </div>
            </div>
        </div>
        <div id="ygbc3-body" role="radiogroup" aria-label="Club membership options">
            <label id="ygbc3-opt-auto" class="ygbc3-is-selected">
                <input type="radio" name="ygbc3-plan" value="{{ $skuAuto }}" checked>
                <span class="ygbc3-radio" aria-hidden="true"></span>
                <span class="ygbc3-opt-text">
                    <span class="ygbc3-opt-main">£10 / Year Auto-Renew</span>
                    <span class="ygbc3-opt-meta">Per Year <span class="ygbc3-was">Was £20</span></span>
                </span>
            </label>
            <label id="ygbc3-opt-one">
                <input type="radio" name="ygbc3-plan" value="{{ $skuManual }}">
                <span class="ygbc3-radio" aria-hidden="true"></span>
                <span class="ygbc3-opt-text">
                    <span class="ygbc3-opt-main">£20 One-Off</span>
                    <span class="ygbc3-opt-meta">12 months | No Renewal</span>
                </span>
            </label>
            <div id="ygbc3-cta">
                <button type="button" id="ygbc3-atc" data-basket-club-atc>Add to Basket</button>
                <a id="ygbc3-more" href="{{ $clubUrl }}">More Info</a>
            </div>
        </div>
    </div>
@endif
