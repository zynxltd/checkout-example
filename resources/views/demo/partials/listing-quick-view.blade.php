{{-- Listing Quick View — CRO-focused modal with gallery, variants, trust --}}
<div
    class="yg-qv"
    id="listing-quick-view"
    hidden
    aria-hidden="true"
>
    <div class="yg-qv__overlay" data-qv-close tabindex="-1" aria-hidden="true"></div>
    <div
        class="yg-qv__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="yg-qv-title"
        data-qv-dialog
    >
        <button type="button" class="yg-qv__close" data-qv-close aria-label="Close quick view">
            <span aria-hidden="true">×</span>
        </button>

        <div class="yg-qv__grid">
            <div class="yg-qv__gallery">
                <div class="yg-qv__media">
                    <img src="" alt="" width="720" height="720" data-qv-img>
                    <span class="yg-qv__badge" data-qv-badge hidden></span>
                    <button type="button" class="yg-qv__nav yg-qv__nav--prev" data-qv-gallery-prev aria-label="Previous image">‹</button>
                    <button type="button" class="yg-qv__nav yg-qv__nav--next" data-qv-gallery-next aria-label="Next image">›</button>
                </div>
                <div class="yg-qv__thumbs" data-qv-thumbs role="tablist" aria-label="Product images"></div>
            </div>

            <div class="yg-qv__info">
                <div class="yg-qv__signals">
                    <p class="yg-qv__views" data-qv-views hidden></p>
                    <p class="yg-qv__stock" data-qv-stock hidden></p>
                </div>

                <p class="yg-qv__sku" data-qv-sku-label></p>
                <h2 class="yg-qv__title" id="yg-qv-title" data-qv-title></h2>

                <div class="yg-qv__rating" data-qv-rating></div>

                <div class="yg-qv__price-block">
                    <div class="yg-qv__price-row">
                        <span class="yg-qv__price" data-qv-price></span>
                        <span class="yg-qv__was" data-qv-was hidden></span>
                        <span class="yg-qv__save" data-qv-save hidden></span>
                    </div>
                    <p class="yg-qv__club" data-qv-club hidden></p>
                </div>

                <p class="yg-qv__blurb" data-qv-blurb></p>
                <p class="yg-qv__desc" data-qv-desc></p>

                <div class="yg-qv__features" data-qv-features hidden></div>

                <fieldset class="yg-qv__variants" data-qv-variants-wrap hidden>
                    <legend class="yg-qv__variants-label">Choose option</legend>
                    <div class="yg-qv__variants-list" data-qv-variants role="radiogroup" aria-label="Product options"></div>
                </fieldset>

                <ul class="yg-qv__trust" data-qv-trust hidden></ul>

                <div class="yg-qv__buy" data-qv-actions>
                    <div class="yg-qv__qty" data-qv-qty-wrap>
                        <button type="button" class="yg-qv__qty-btn" data-qv-qty-delta="-1" aria-label="Decrease quantity">−</button>
                        <span class="yg-qv__qty-val" data-qv-qty>1</span>
                        <button type="button" class="yg-qv__qty-btn" data-qv-qty-delta="1" aria-label="Increase quantity">+</button>
                    </div>
                    <button type="button" class="yg-qv__add" data-qv-add>
                        Add to basket
                    </button>
                </div>

                <p class="yg-qv__oos" data-qv-oos-msg hidden>Currently out of stock — join the waitlist on the full product page.</p>

                <div class="yg-qv__foot">
                    <a href="#" class="yg-qv__pdp" data-qv-pdp>View full product details</a>
                    <p class="yg-qv__reassure">Secure checkout · 30-day plant guarantee</p>
                </div>
            </div>
        </div>
    </div>
</div>
