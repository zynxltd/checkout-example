{{-- PLP filter toolbar + slide-out panel (matches yougarden.com perennial filters) --}}
@php
    $productCount = count($listing['products']);
@endphp

<div class="demo-listing-toolbar">
    <button type="button" class="demo-listing-toolbar__open" id="listing-filters-open" aria-expanded="false" aria-controls="listing-filters-panel">
        Open Filters &amp; Sort
    </button>
    <p class="demo-listing-toolbar__count">{{ $productCount }} items</p>
</div>

<div class="demo-listing-filters" id="listing-filters" hidden>
    <div class="demo-listing-filters__overlay" id="listing-filters-overlay" tabindex="-1" aria-hidden="true"></div>

    <aside
        class="demo-listing-filters__panel"
        id="listing-filters-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="listing-filters-title"
    >
        <header class="demo-listing-filters__head">
            <h2 class="demo-listing-filters__title" id="listing-filters-title">Filters &amp; Sort</h2>
            <button type="button" class="demo-listing-filters__close" id="listing-filters-close" aria-label="Close filters">
                @include('demo.partials.icon', ['name' => 'close'])
            </button>
        </header>

        <form class="demo-listing-filters__form" id="listing-filters-form">
            <div class="demo-listing-filters__grid">
                @foreach ($listing['filters'] as $filter)
                    <label class="demo-listing-filters__field">
                        <span class="demo-listing-filters__label">{{ $filter['label'] }}</span>
                        <span class="demo-listing-filters__select-wrap">
                            <select class="demo-listing-filters__select" name="{{ $filter['id'] }}" data-filter="{{ $filter['id'] }}">
                                @foreach ($filter['options'] as $value => $label)
                                    <option value="{{ $value }}">{{ $label }}</option>
                                @endforeach
                            </select>
                            <span class="demo-listing-filters__chevron" aria-hidden="true">▾</span>
                        </span>
                    </label>
                @endforeach
            </div>

            <div class="demo-listing-filters__actions">
                <button type="reset" class="demo-listing-filters__reset" id="listing-filters-reset">Reset filters</button>

                <label class="demo-listing-filters__sort">
                    <span class="demo-listing-filters__sort-label">Sort listing</span>
                    <span class="demo-listing-filters__select-wrap demo-listing-filters__select-wrap--sort">
                        <select class="demo-listing-filters__select demo-listing-filters__select--sort" name="sort" id="listing-sort">
                            @foreach ($listing['sort_options'] as $option)
                                <option value="{{ $option['value'] }}" @selected($option['value'] === 'popularity')>{{ $option['label'] }}</option>
                            @endforeach
                        </select>
                        <span class="demo-listing-filters__chevron" aria-hidden="true">▾</span>
                    </span>
                </label>
            </div>
        </form>
    </aside>
</div>
