@php
    $clubUrl = route('demo.club');
@endphp
<div class="yg-club-panel">
    <div class="yg-club-panel__brand">
        <img
            class="yg-club-panel__logo"
            src="{{ asset('images/club/discount-club-logo.png') }}"
            alt="YouGarden Discount Club"
            width="220"
            height="88"
            loading="eager"
        >
    </div>

    <header class="yg-club-panel__hero">
        <h2 class="yg-club-panel__headline">Now With More Exclusive Benefits!</h2>
        <p class="yg-club-panel__intro">Join the thousands of happy YouGarden Discount Club Members&hellip; Start saving today &amp; for the lifetime of your membership!</p>
        <p class="yg-club-panel__order-save">Save <strong>£{{ number_format($cart['club_savings'], 2) }}</strong> on this order when you join.</p>
    </header>

    <div class="yg-club-panel__offers">
        <article class="yg-club-offer yg-club-offer--auto">
            <h3 class="yg-club-offer__title">Auto Renewal Yearly Subscription</h3>
            <p class="yg-club-offer__desc">12-month club membership. Renewed automatically to ensure you get continued access to leading offers &amp; savings. Plus, the membership price you pay will never go up!</p>
            <p class="yg-club-offer__pricing">
                <span class="yg-club-offer__was">WAS £{{ number_format($cart['club_was_price'], 0) }}</span>
                <span class="yg-club-offer__now">Now £{{ number_format($cart['club_price'], 0) }} Per Year</span>
            </p>
            <button type="button" class="yg-club-offer__btn yg-club-offer__btn--pink" data-club-add data-club-sku="{{ \App\Services\DemoCart::CLUB_SKU_AUTO }}">Add to basket</button>
        </article>

        <article class="yg-club-offer yg-club-offer--manual">
            <h3 class="yg-club-offer__title">One Year Membership</h3>
            <p class="yg-club-offer__desc">12-month club membership. Renew your membership manually each year to continue getting great garden benefits.</p>
            <p class="yg-club-offer__pricing yg-club-offer__pricing--single">
                <span class="yg-club-offer__now yg-club-offer__now--purple">£{{ number_format($cart['club_manual_price'], 0) }} Per Year</span>
            </p>
            <button type="button" class="yg-club-offer__btn yg-club-offer__btn--purple" data-club-add data-club-sku="{{ \App\Services\DemoCart::CLUB_SKU_MANUAL }}">Add to basket</button>
        </article>
    </div>

    <section class="yg-club-panel__benefits" aria-labelledby="yg-club-benefits-title">
        <h3 class="yg-club-panel__benefits-title" id="yg-club-benefits-title">Club Benefits &amp; Features</h3>
        <p class="yg-club-panel__benefits-intro">YouGarden&rsquo;s leading gardener loyalty scheme just got better with bigger discounts all year round, more vouchers to spend and fantastic content &amp; advice.</p>

        <ul class="yg-club-benefits">
            <li class="yg-club-benefit">
                <img class="yg-club-benefit__icon" src="{{ asset('images/club/benefit-plants.png') }}" alt="" width="56" height="56" loading="lazy">
                <h4 class="yg-club-benefit__title">15% off all Plants &amp; Accessories</h4>
                <p class="yg-club-benefit__text">We&rsquo;ll automatically take an additional <strong>15% off</strong> every plant and accessory order you make whilst logged into your account.</p>
            </li>
            <li class="yg-club-benefit">
                <img class="yg-club-benefit__icon" src="{{ asset('images/club/benefit-machinery.png') }}" alt="" width="56" height="56" loading="lazy">
                <h4 class="yg-club-benefit__title">7.5% off Outdoor Living &amp; Machinery</h4>
                <p class="yg-club-benefit__text">You&rsquo;ll also get <strong>7.5% off</strong> every garden machinery order you make, helping you save on <strong>EVERY</strong> single product you buy from YouGarden.com!</p>
            </li>
            <li class="yg-club-benefit">
                <img class="yg-club-benefit__icon" src="{{ asset('images/club/benefit-vouchers.png') }}" alt="" width="56" height="56" loading="lazy">
                <h4 class="yg-club-benefit__title">£20 in Product Vouchers + 2 x Free P&amp;P Vouchers Worth £6.99 each</h4>
                <p class="yg-club-benefit__text">We&rsquo;ll send you a Club Pack with <strong>4 x £5.00 vouchers</strong> + <strong>2 x Free P&amp;P Vouchers</strong> (worth £6.99 each). That&rsquo;s an amazing <strong class="yg-club-benefit__value">£33.98 of value!</strong></p>
            </li>
            <li class="yg-club-benefit">
                <img class="yg-club-benefit__icon" src="{{ asset('images/club/benefit-offers.png') }}" alt="" width="56" height="56" loading="lazy">
                <h4 class="yg-club-benefit__title">Exclusive Offers and Expert Gardening Knowledge</h4>
                <p class="yg-club-benefit__text">Priority access to brand-new exclusive products at our very best prices, plus insider knowledge and gardening inspiration by email.</p>
            </li>
        </ul>
    </section>

    <footer class="yg-club-panel__footer">
        <a href="{{ $clubUrl }}" class="yg-club-panel__details" target="_blank" rel="noopener">View full membership details</a>
    </footer>
</div>
