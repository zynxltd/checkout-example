@php
    $boost = $cart['root_boost'] ?? null;
    $inBasket = !empty($boost['in_basket']);
    $logo = asset('ce/basket-club/assets/yg-blooming-fast-logo-72.png');
@endphp
@if($boost && ! $inBasket)
<div class="yg-spf" data-root-boost id="yg-drawer-spf">
    <div class="yg-spf__inner">
        <div class="yg-spf__brand">
            <img
                class="yg-spf__logo"
                src="{{ $logo }}"
                alt="Blooming Fast"
                width="32"
                height="32"
                loading="lazy"
            >
            <p class="yg-spf__title">Superior <strong>Plant&nbsp;Food</strong> Plus</p>
        </div>
        <p class="yg-spf__msg">Treat your plants before we send them.</p>
        <button
            type="button"
            class="yg-spf__cta"
            data-root-boost-add="{{ $boost['sku'] }}"
            aria-label="Add Superior Plant Food Plus for £1"
        >
            <span class="yg-spf__plus" aria-hidden="true">+</span>
            <span class="yg-spf__cta-copy">
                <span class="yg-spf__cta-line">Add</span>
                <span class="yg-spf__cta-price"> for £1</span>
            </span>
        </button>
    </div>
</div>
@endif
