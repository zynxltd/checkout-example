{{-- Specs, addons, similar — below-fold CRO blocks --}}

<section class="demo-pdp-specs" aria-labelledby="demo-pdp-specs-title">
    <h2 class="demo-pdp-specs__title" id="demo-pdp-specs-title">About this plant</h2>

    <p class="demo-pdp-specs__intro">{{ $product['description_excerpt'] }}</p>

    <div class="demo-pdp-specs__layout">
        <div class="demo-pdp-specs__key">
            <h3 class="demo-pdp-specs__subtitle">Key features</h3>
            <ul class="demo-pdp-specs__pills">
                @foreach ($product['features'] as $feature)
                    <li>{{ $feature['label'] }}</li>
                @endforeach
            </ul>
        </div>

        <div class="demo-pdp-specs__table-wrap">
            <h3 class="demo-pdp-specs__subtitle">Specifications</h3>
            <dl class="demo-pdp-specs__table">
                @foreach ($product['specs'] as $spec)
                    <div class="demo-pdp-specs__row">
                        <dt>{{ $spec['label'] }}</dt>
                        <dd>{{ $spec['value'] }}</dd>
                    </div>
                @endforeach
            </dl>
        </div>
    </div>

    <div class="demo-pdp-care-tabs" data-care-tabs>
        <div class="demo-pdp-care-tabs__nav" role="tablist">
            @foreach ($product['care_tabs'] as $i => $tab)
                <button
                    type="button"
                    role="tab"
                    class="demo-pdp-care-tabs__tab{{ $i === 0 ? ' is-active' : '' }}"
                    id="care-tab-{{ $tab['id'] }}"
                    aria-selected="{{ $i === 0 ? 'true' : 'false' }}"
                    aria-controls="care-panel-{{ $tab['id'] }}"
                    data-care-tab="{{ $tab['id'] }}"
                >{{ $tab['title'] }}</button>
            @endforeach
        </div>
        @foreach ($product['care_tabs'] as $i => $tab)
            <div
                role="tabpanel"
                class="demo-pdp-care-tabs__panel{{ $i === 0 ? ' is-active' : '' }}"
                id="care-panel-{{ $tab['id'] }}"
                aria-labelledby="care-tab-{{ $tab['id'] }}"
                data-care-panel="{{ $tab['id'] }}"
                @if($i > 0) hidden @endif
            >
                <p>{{ $tab['content'] }}</p>
            </div>
        @endforeach
    </div>
</section>

<section class="demo-pdp__also" aria-labelledby="demo-also-title">
    <h2 class="demo-pdp__also-title" id="demo-also-title">Customers also bought</h2>
    <div class="demo-pdp__also-card">
        @if (! empty($product['also_bought']['image']))
            <img
                src="{{ asset($product['also_bought']['image']) }}"
                alt=""
                class="demo-pdp__also-img"
                width="72"
                height="72"
                loading="lazy"
            >
        @endif
        <div class="demo-pdp__also-copy">
            <p class="demo-pdp__also-name">{{ $product['also_bought']['name'] }}</p>
            <p class="demo-pdp__also-price">£{{ number_format($product['also_bought']['price'], 2) }}</p>
        </div>
        <button type="button" class="demo-pdp__also-add" data-addon-sku="{{ $product['also_bought']['sku'] ?? '' }}">Add</button>
    </div>
</section>

<section class="demo-pdp-addons" aria-labelledby="demo-pdp-addons-title">
    <h2 class="demo-pdp-addons__title" id="demo-pdp-addons-title">Give your plants the best start</h2>
    <div class="demo-pdp-addons__grid">
        @foreach ($product['addons'] as $addon)
            <article class="demo-pdp-addon-card">
                <img src="{{ asset($addon['image']) }}" alt="" class="demo-pdp-addon-card__img" width="120" height="120" loading="lazy">
                <div class="demo-pdp-addon-card__body">
                    <h3 class="demo-pdp-addon-card__name">{{ $addon['name'] }}</h3>
                    <p class="demo-pdp-addon-card__price">£{{ number_format($addon['price'], 2) }}</p>
                    <button type="button" class="demo-pdp-addon-card__add" data-addon-sku="{{ $addon['sku'] }}">Add to basket</button>
                </div>
            </article>
        @endforeach
    </div>
</section>

<section class="demo-pdp-similar" aria-labelledby="demo-pdp-similar-title">
    <div class="demo-pdp-similar__head">
        <h2 class="demo-pdp-similar__title" id="demo-pdp-similar-title">Similar varieties</h2>
        <div class="demo-pdp-similar__nav">
            <button type="button" class="demo-pdp-carousel-btn" data-carousel-prev="similar" aria-label="Scroll similar left">‹</button>
            <button type="button" class="demo-pdp-carousel-btn" data-carousel-next="similar" aria-label="Scroll similar right">›</button>
        </div>
    </div>
    <div class="demo-pdp-similar__track" data-carousel-track="similar">
        @foreach ($product['similar'] as $item)
            <a href="{{ $item['url'] }}" class="demo-pdp-similar-card">
                <div class="demo-pdp-similar-card__img">
                    <img src="{{ asset($item['image']) }}" alt="{{ $item['name'] }}" width="200" height="200" loading="lazy">
                </div>
                <h3 class="demo-pdp-similar-card__name">{{ $item['name'] }}</h3>
                <p class="demo-pdp-similar-card__price">From £{{ number_format($item['price'], 2) }}</p>
            </a>
        @endforeach
    </div>
</section>

<aside class="demo-pdp-promo demo-pdp-promo--inline" aria-label="Plant finder">
    <p class="demo-pdp-promo__text">Not sure which plant is right? <a href="{{ route('demo.plant-finder') }}">Try our Plant Finder</a></p>
</aside>
