{{-- Mobile only — horizontal upsells below basket line items (see yg-cart-drawer.css) --}}
<section class="yg-reco-inline" aria-labelledby="yg-reco-inline-heading">
    <h3 class="yg-reco-inline__heading" id="yg-reco-inline-heading">You may also like</h3>
    <div class="yg-reco-inline__scroller">
        <ul class="yg-reco-inline__list">
            @foreach($upsells as $upsell)
            <li class="yg-reco-inline__item">
                <article class="yg-reco-inline-card">
                    <div class="yg-reco-inline-card__media">
                        <img class="yg-reco-inline-card__img" src="{{ asset($upsell['image']) }}" alt="" width="148" height="148" loading="lazy">
                    </div>
                    <p class="yg-reco-inline-card__name">{{ $upsell['name'] }}</p>
                    <p class="yg-reco-inline-card__price">
                        @if(!empty($upsell['from']))
                        <span class="yg-reco-inline-card__from">FROM</span>
                        @endif
                        <span class="yg-reco-inline-card__amount">£{{ number_format($upsell['price'], 2) }}</span>
                    </p>
                    <button type="button"
                        class="yg-reco-inline-card__add @if(!empty($upsell['in_basket'])) is-added @endif"
                        data-reco-add="{{ $upsell['sku'] ?? '' }}"
                        @if(!empty($upsell['in_basket'])) disabled @endif>
                        {{ !empty($upsell['in_basket']) ? 'Added to basket' : 'Add' }}
                    </button>
                </article>
            </li>
            @endforeach
        </ul>
    </div>
</section>
