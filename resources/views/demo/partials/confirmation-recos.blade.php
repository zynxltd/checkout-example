@if(count($recommendations) > 0)
<section class="cr-recos" aria-labelledby="cr-recos-title">
    <div class="cr-recos__head">
        <h2 id="cr-recos-title" class="cr-recos__title">You may also like</h2>
        <p class="cr-recos__lead">Add extras to your next order while your plants are on the way.</p>
    </div>

    <div class="cr-recos__scroller">
        <ul class="cr-recos__list">
            @foreach($recommendations as $product)
            <li class="cr-recos__item">
                <article class="cr-reco-card">
                    <div class="cr-reco-card__media">
                        <img
                            class="cr-reco-card__img"
                            src="{{ asset($product['image']) }}"
                            alt=""
                            width="120"
                            height="120"
                            loading="lazy"
                            draggable="false"
                        >
                    </div>
                    <div class="cr-reco-card__body">
                        <a href="#" class="cr-reco-card__name" data-prototype-link>{{ $product['name'] }}</a>
                        @if(!empty($product['variant']))
                        <p class="cr-reco-card__variant">{{ $product['variant'] }}</p>
                        @endif
                        <p class="cr-reco-card__price">
                            @if(!empty($product['from']))
                            <span class="cr-reco-card__from">FROM</span>
                            @endif
                            <span class="cr-reco-card__amount">£{{ number_format($product['price'], 2) }}</span>
                        </p>
                        <button
                            type="button"
                            class="cr-reco-card__add"
                            data-cr-reco-add="{{ $product['sku'] }}"
                        >
                            Add to basket
                        </button>
                    </div>
                </article>
            </li>
            @endforeach
        </ul>
    </div>

    <p class="cr-recos__note" id="cr-recos-feedback" hidden></p>
</section>
@endif
