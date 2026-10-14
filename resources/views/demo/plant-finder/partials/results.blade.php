@if ($plants->isEmpty())
    @include('demo.plant-finder.partials.results-toolbar')

    <div class="yg-pf-empty">
        <h2>No plants match those filters</h2>
        <p>Try removing a characteristic or clearing one of the time or category filters.</p>
        <a class="yg-pf-empty__btn" href="{{ route('demo.plant-finder') }}">Clear all filters</a>
    </div>
@else
    @include('demo.plant-finder.partials.results-toolbar')

    <div class="resListingWrapper demo-listing__grid yg-pf-grid">
        @foreach ($plants as $plant)
            @php
                $imageUrl = str_starts_with((string) $plant->image, 'http')
                    ? $plant->image
                    : asset($plant->image);
                $shopUrl = str_starts_with((string) $plant->shop_url, 'http')
                    ? $plant->shop_url
                    : url($plant->shop_url ?? route('demo.pdp'));
                $discount = (int) ($plant->discount ?? 0);
                $rating = (float) ($plant->rating ?? 4.5);
                $reviews = (int) ($plant->reviews ?? 0);
                $priceLabel = (string) ($plant->price_label ?? 'From');
            @endphp

            <article class="category-box">
                <a href="{{ $shopUrl }}" class="category-box__hit">
                    <div class="imgWrapper">
                        <img
                            src="{{ $imageUrl }}"
                            alt="{{ $plant->name }}"
                            width="500"
                            height="500"
                            loading="lazy"
                        >
                    </div>

                    @if ($discount > 0)
                        <div class="savingFlash" aria-hidden="true">{{ $discount }}%<br>OFF</div>
                    @endif

                    <div class="category-box__content">
                        <div class="title">{{ $plant->name }}</div>

                        <div class="category-box__meta">
                            <div class="priceWrapper">
                                <div class="price">{{ $priceLabel }} {{ Number::currency((float) $plant->price, 'GBP') }}</div>
                            </div>
                            @if ($reviews > 0)
                                <div class="rating" aria-label="{{ number_format($rating, 1) }} out of 5 stars, {{ number_format($reviews) }} reviews">
                                    @include('demo.partials.feefo-stars', [
                                        'rating' => $rating,
                                        'reviews' => $reviews,
                                    ])
                                </div>
                            @endif
                        </div>
                    </div>

                    <div class="category-box__cta">Find out more</div>
                </a>
            </article>
        @endforeach
    </div>

    @if ($plants->hasPages())
        <nav class="finder-pagination yg-pf-pagination" aria-label="Plant finder pages">
            {{ $plants->links('vendor.pagination.plant-finder') }}
        </nav>
    @endif
@endif
