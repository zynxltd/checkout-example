@php
    $hasOffer = !empty($cart['offer_code']);
    $showClub = ! $cart['club_member'] && ! $cart['club_in_cart'] && ($cart['club_savings'] ?? 0) > 0;
    $showClubSavings = ($cart['club_member'] || $cart['club_in_cart']) && ($cart['club_member_savings'] ?? 0) > 0;
    $offerDiscount = (float) ($cart['offer_discount'] ?? 0);
    $showReco = $cart['show_upsells'] ?? true;
    $isEmpty = !empty($cart['is_empty']);
@endphp

<div class="yg-drawer yg-drawer--v2 @if(!empty($drawerVariant21)) yg-drawer--v-2-1 @if($showClubSavings || !empty($cart['club_in_cart'])) yg-drawer--v-2-1-club @endif @endif @if($cart['wide_drawer']) yg-drawer--wide @endif @if(!$cart['show_free_delivery_bar']) yg-drawer--no-delivery @endif @if(!$showReco) yg-drawer--no-reco @endif @if($isEmpty) yg-drawer--empty @endif" id="yg-cart-drawer" role="dialog" aria-modal="true" aria-labelledby="yg-drawer-title" hidden>
    <div class="yg-drawer__overlay" data-drawer-close></div>

    @if($showClub)
    <aside class="yg-extend yg-extend--club" id="yg-club-panel" hidden aria-label="YG Discount Club membership">
        <button type="button" class="yg-extend__close" data-extend-close aria-label="Close">@include('demo.partials.icon', ['name' => 'close'])</button>
        @include('demo.partials.club-panel', ['cart' => $cart])
    </aside>
    @endif

    <div class="yg-drawer__stage" id="yg-drawer-stage">
        @if($showReco)
        <aside class="yg-extend yg-extend--reco" id="yg-reco-panel" hidden aria-label="Recommendations">
            <button type="button" class="yg-extend__close" data-extend-close aria-label="Close recommendations">@include('demo.partials.icon', ['name' => 'close'])</button>
            <div class="yg-extend__body-reco">
                <div class="yg-extend__inner yg-extend__inner--reco">
                    <h2 class="yg-reco-panel__title">You may also like</h2>
                    <ul class="yg-reco-panel__list">
                        @foreach($cart['upsells'] as $upsell)
                        <li class="yg-reco-card">
                            <div class="yg-reco-card__media">
                                <img class="yg-reco-card__img" src="{{ asset($upsell['image']) }}" alt="" width="120" height="120" loading="lazy">
                            </div>
                            <p class="yg-reco-card__name">{{ $upsell['name'] }}</p>
                            <p class="yg-reco-card__price">
                                @if(!empty($upsell['from']))
                                <span class="yg-reco-card__from">FROM</span>
                                @endif
                                <span class="yg-reco-card__amount">£{{ number_format($upsell['price'], 2) }}</span>
                            </p>
                            <button type="button"
                                class="yg-reco-card__add @if(!empty($upsell['in_basket'])) is-added @endif"
                                data-reco-add="{{ $upsell['sku'] ?? '' }}"
                                @if(!empty($upsell['in_basket'])) disabled @endif>
                                {{ !empty($upsell['in_basket']) ? 'Added to basket' : 'Add' }}
                            </button>
                        </li>
                        @endforeach
                    </ul>
                </div>
            </div>
            <footer class="yg-reco-sheet__footer">
                <button type="button" class="yg-reco-sheet__checkout" data-reco-checkout>Continue to checkout</button>
                <button type="button" class="yg-reco-sheet__dismiss" data-extend-close>
                    <span class="yg-reco-sheet__dismiss--mobile">No thanks</span>
                    <span class="yg-reco-sheet__dismiss--desktop">Hide recommendations</span>
                </button>
            </footer>
        </aside>
        @endif

        <div class="yg-drawer__panel-slot">
            @if($showReco)
            <div class="yg-drawer__rail" aria-label="Recommendations">
                <button type="button" class="yg-side-tab yg-side-tab--reco" data-extend-open="reco" aria-expanded="false">
                    <span class="yg-side-tab__icon" aria-hidden="true">›</span>
                    <span class="yg-side-tab__label">Recommendations</span>
                </button>
            </div>
            @endif

            <div class="yg-drawer__panel">
            <header class="yg-drawer__header">
                <div class="yg-drawer__heading">
                    <h2 class="yg-drawer__title" id="yg-drawer-title">Your Basket</h2>
                    <span class="yg-drawer__count" aria-label="{{ $cart['item_count'] }} items">{{ $cart['item_count'] }}</span>
                </div>
                <button type="button" class="yg-drawer__close" data-drawer-close aria-label="Close basket">@include('demo.partials.icon', ['name' => 'close'])</button>
            </header>

            <div class="yg-drawer__body">
                @if($cart['show_free_delivery_bar'])
                <div
                    class="yg-delivery-bar @if($cart['gift_qualified']) yg-delivery-bar--qualified @endif"
                    role="status"
                    aria-live="polite"
                    style="--yg-delivery-milestone: {{ $cart['gift_milestone_percent'] }}%;"
                >
                    <div class="yg-delivery-bar__inner">
                        <p class="yg-delivery-bar__msg">
                            @if($cart['gift_qualified'])
                            You&rsquo;ve unlocked <strong>free delivery</strong>!
                            @else
                            You&rsquo;re <strong>£{{ number_format($cart['gift_spend_more'], 2) }}</strong> away from free delivery
                            @endif
                        </p>
                        <div class="yg-delivery-bar__track" aria-hidden="true">
                            <div class="yg-delivery-bar__fill" style="width: {{ $cart['gift_progress_percent'] }}%"></div>
                            <span class="yg-delivery-bar__milestone" aria-hidden="true"></span>
                        </div>
                        <div class="yg-delivery-bar__labels" aria-hidden="true">
                            <span>£0</span>
                            <span class="yg-delivery-bar__label-milestone">£{{ number_format($cart['gift_progress_milestone'], 0) }}</span>
                            <span>£{{ number_format($cart['gift_progress_max'], 0) }}</span>
                        </div>
                    </div>
                </div>
                @endif

                @if($isEmpty)
                <div class="yg-drawer__empty">
                    <p class="yg-drawer__empty-msg">Your basket is empty</p>
                </div>
                @else
                <ul class="yg-drawer__items">
                    @foreach($cart['items'] as $item)
                    <li class="yg-item @if(!empty($item['is_club'])) yg-item--club @endif" data-sku="{{ $item['sku'] }}">
                        <img class="yg-item__img" src="{{ asset($item['image']) }}" alt="" width="88" height="88" loading="lazy">
                        <div class="yg-item__main">
                            <p class="yg-item__sku">Product No. {{ $item['sku'] }}</p>
                            <p class="yg-item__name">{{ $item['name'] }}</p>
                            @if(!empty($item['variant']))
                            <p class="yg-item__variant">{{ $item['variant'] }}</p>
                            @endif
                            <div class="yg-item__foot">
                                <div class="yg-item__controls">
                                    <div class="yg-qty">
                                        <button type="button" class="yg-qty__btn" data-qty-minus="{{ $item['sku'] }}" aria-label="Decrease quantity" @if(!empty($item['is_club'])) hidden @endif>@include('demo.partials.icon', ['name' => 'minus'])</button>
                                        <input
                                            type="number"
                                            class="yg-qty__input"
                                            data-qty-input="{{ $item['sku'] }}"
                                            value="{{ $item['qty'] }}"
                                            min="0"
                                            max="999"
                                            inputmode="numeric"
                                            aria-label="Quantity for {{ $item['name'] }}"
                                            @if(!empty($item['is_club'])) readonly tabindex="-1" @endif
                                        >
                                        <button type="button" class="yg-qty__btn" data-qty-plus="{{ $item['sku'] }}" aria-label="Increase quantity" @if(!empty($item['is_club'])) hidden @endif>@include('demo.partials.icon', ['name' => 'plus'])</button>
                                    </div>
                                    <button type="button" class="yg-item__remove" data-remove="{{ $item['sku'] }}" aria-label="Remove item">
                                        {{-- Delete icon: Flaticon / bqlqn — https://www.flaticon.com/free-icons/delete --}}
                                        @include('demo.partials.icon', ['name' => 'trash'])
                                    </button>
                                </div>
                                <div class="yg-item__price">
                                    @if($item['was_price'])
                                    <span class="yg-item__was">£{{ number_format($item['was_price'], 2) }}</span>
                                    @endif
                                    <span class="yg-item__now">£{{ number_format($item['price'], 2) }}</span>
                                    @if(!empty($item['club_saving']) && $item['club_saving'] > 0)
                                    <span class="yg-item__club-saving">
                                        @if(!empty($item['is_club']))
                                        Saving: £{{ number_format($item['club_saving'], 2) }}
                                        @else
                                        Club Saving £{{ number_format($item['club_saving'], 2) }}
                                        @endif
                                    </span>
                                    @endif
                                </div>
                            </div>
                        </div>
                    </li>
                    @endforeach
                </ul>

                @if($showReco)
                @include('demo.partials.reco-inline', ['upsells' => $cart['upsells']])
                @endif
                @endif
            </div>

            <div class="yg-drawer__summary">
                @if($showClub)
                <div class="yg-club-bar">
                    <p class="yg-club-bar__lead">
                        <span class="yg-club-bar__lead-line">Join the</span>
                        <span class="yg-club-bar__lead-line">Club &amp;</span>
                    </p>
                    <p class="yg-club-bar__save">Save £{{ number_format($cart['club_savings'], 2) }}!</p>
                    <button type="button" class="yg-club-bar__btn" data-extend-open="club">More Info</button>
                </div>
                @endif
                <div class="yg-drawer__summary-inner">
                @include('demo.partials.codes', [
                    'cart' => $cart,
                    'hasOffer' => $hasOffer,
                ])

                <div class="yg-totals">
                    <div class="yg-totals__mobile-breakdown">
                        <details class="yg-breakdown" aria-label="Order breakdown">
                            <summary class="yg-breakdown__summary">
                                <span class="yg-breakdown__label">Order summary</span>
                                <span class="yg-breakdown__meta">
                                    <span class="yg-breakdown__toggle">View</span>
                                    <span class="yg-breakdown__chev" aria-hidden="true">▾</span>
                                </span>
                            </summary>
                            <div class="yg-breakdown__content">
                                <div class="yg-totals__row"><span>Subtotal</span><span>£{{ number_format($cart['subtotal'], 2) }}</span></div>
                                @if($cart['your_savings'] > 0)
                                <div class="yg-totals__row yg-totals__row--save"><span>Your Savings</span><span>£{{ number_format($cart['your_savings'], 2) }}</span></div>
                                @endif
                                @if($hasOffer)
                                    @if($offerDiscount > 0)
                                    <div class="yg-totals__row yg-totals__row--promo"><span>Offer discount</span><span>−£{{ number_format($offerDiscount, 2) }}</span></div>
                                    @endif
                                @endif
                            </div>
                        </details>
                    </div>

                    @if(empty($drawerVariant21))
                    <div class="yg-totals__row yg-totals__row--total"><span>Total</span><span>£{{ number_format($cart['basket_total'], 2) }}</span></div>
                    @else
                    <div class="yg-totals__row yg-totals__row--total yg-totals__row--total-desktop"><span>Total</span><span>£{{ number_format($cart['basket_total'], 2) }}</span></div>
                    @endif
                </div>
                </div>
                @if($showClubSavings && !empty($drawerVariant21))
                <div class="yg-club-savings-strip" role="status" aria-label="Club member savings">
                    <span class="yg-club-savings-strip__label">Club saving</span>
                    <span class="yg-club-savings-strip__amount">£{{ number_format($cart['club_member_savings'], 2) }}</span>
                </div>
                <div class="yg-club-savings-banner yg-club-savings-banner--v21-desktop" role="status" aria-label="Club member savings">
                    <div class="yg-club-savings-banner__head">
                        <p class="yg-club-savings-banner__label">Your Club Member Saving Is:</p>
                    </div>
                    <div class="yg-club-savings-banner__body">
                        <p class="yg-club-savings-banner__amount">£{{ number_format($cart['club_member_savings'], 2) }}</p>
                    </div>
                </div>
                @elseif($showClubSavings)
                <div class="yg-club-savings-banner" role="status" aria-label="Club member savings">
                    <div class="yg-club-savings-banner__head">
                        <p class="yg-club-savings-banner__label">Your Club Member Saving Is:</p>
                    </div>
                    <div class="yg-club-savings-banner__body">
                        <p class="yg-club-savings-banner__amount">£{{ number_format($cart['club_member_savings'], 2) }}</p>
                    </div>
                </div>
                @endif
                @if(!empty($drawerVariant21))
                <div class="yg-drawer__summary-total yg-drawer__summary-total--v21-mobile @if($showClubSavings) yg-drawer__summary-total--after-club @endif">
                    <div class="yg-totals__row yg-totals__row--total"><span>Total</span><span>£{{ number_format($cart['basket_total'], 2) }}</span></div>
                </div>
                @endif
            </div>

            <footer class="yg-drawer__footer">
                <button type="button" class="yg-checkout">
                    @include('demo.partials.icon', ['name' => 'wheelbarrow', 'class' => 'yg-checkout__icon', 'width' => 34, 'height' => 34])
                    <span class="yg-checkout__label yg-checkout__label--mobile">Checkout</span>
                    <span class="yg-checkout__label yg-checkout__label--desktop">Proceed to Checkout</span>
                </button>
            </footer>
            </div>
        </div>
    </div>
</div>
