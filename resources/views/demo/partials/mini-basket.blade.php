{{-- YouGarden-style mini basket preview (hover over Your Basket) --}}
@php
    $miniItems = $cart['items'] ?? [];
    $miniCount = (int) ($cart['item_count'] ?? 0);
    $miniTotal = (float) ($cart['basket_total'] ?? 0);
    $miniEmpty = $miniCount < 1 || empty($miniItems);
@endphp
<div class="yg-mini-basket" data-mini-basket>
    <button
        type="button"
        class="demo-header__basket demo-header__basket--end"
        data-mini-basket-trigger
        data-open-drawer
        aria-label="Your basket, {{ $miniCount }} item(s)"
        aria-haspopup="true"
        aria-expanded="false"
        aria-controls="yg-mini-basket-panel"
    >
        <span class="demo-header__basket-icon" aria-hidden="true">
            <img
                class="demo-header__basket-img"
                src="{{ asset('images/icons/icon-wheelbarrow.png') }}?v={{ filemtime(public_path('images/icons/icon-wheelbarrow.png')) }}"
                alt=""
                width="48"
                height="42"
            >
        </span>
        <span class="demo-header__basket-text">
            <span class="demo-header__utility-title">Your Basket</span>
            <span class="demo-header__utility-sub">
                <span id="topbar-cart-count">{{ $miniCount }}</span> item(s)
                £<span id="topbar-cart-total">{{ number_format($miniTotal, 2) }}</span>
            </span>
        </span>
    </button>

    <div
        class="yg-mini-basket__panel"
        id="yg-mini-basket-panel"
        data-mini-basket-panel
        hidden
        role="region"
        aria-label="Basket preview"
    >
        <span class="yg-mini-basket__caret" aria-hidden="true"></span>
        <div class="yg-mini-basket__card">
            <div class="yg-mini-basket__scroll" data-mini-basket-scroll>
                @if ($miniEmpty)
                    <p class="yg-mini-basket__empty" data-mini-basket-empty>Your basket is empty</p>
                @else
                    <ul class="yg-mini-basket__list" data-mini-basket-list>
                        @foreach ($miniItems as $item)
                            <li class="yg-mini-basket__item" data-sku="{{ $item['sku'] }}">
                                <img
                                    class="yg-mini-basket__img"
                                    src="{{ asset($item['image']) }}"
                                    alt=""
                                    width="56"
                                    height="56"
                                    loading="lazy"
                                >
                                <div class="yg-mini-basket__meta">
                                    <p class="yg-mini-basket__name">{{ $item['name'] }}</p>
                                    <p class="yg-mini-basket__sku">Product No. {{ $item['sku'] }}</p>
                                </div>
                                <div class="yg-mini-basket__pricing">
                                    <span class="yg-mini-basket__price">£{{ number_format($item['unit_price'] ?? $item['price'], 2) }}</span>
                                    <span class="yg-mini-basket__qty">QTY: {{ $item['qty'] }}</span>
                                </div>
                            </li>
                        @endforeach
                    </ul>
                @endif
            </div>
            <div class="yg-mini-basket__foot">
                <span class="yg-mini-basket__total">
                    Total: £<span data-mini-basket-total>{{ number_format($miniTotal, 2) }}</span>
                </span>
                <button type="button" class="yg-mini-basket__cta" data-open-drawer data-mini-basket-cta>
                    View Basket »
                </button>
            </div>
        </div>
    </div>
</div>
