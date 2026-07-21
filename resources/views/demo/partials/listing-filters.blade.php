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
        <header class="yg-drawer__header demo-listing-filters__head">
            <div class="yg-drawer__heading">
                <h2 class="yg-drawer__title" id="listing-filters-title">Filters &amp; Sort</h2>
            </div>
            <button type="button" class="yg-drawer__close" id="listing-filters-close" aria-label="Close filters">
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

                <label class="demo-listing-filters__field demo-listing-filters__field--sort">
                    <span class="demo-listing-filters__label">Sort by</span>
                    <span class="demo-listing-filters__select-wrap">
                        <select class="demo-listing-filters__select" name="sort" id="listing-sort">
                            @foreach ($listing['sort_options'] as $option)
                                <option value="{{ $option['value'] }}" @selected($option['value'] === 'popularity')>{{ $option['label'] }}</option>
                            @endforeach
                        </select>
                        <span class="demo-listing-filters__chevron" aria-hidden="true">▾</span>
                    </span>
                </label>
            </div>

            <div class="demo-listing-filters__actions">
                <button type="reset" class="demo-listing-filters__reset" id="listing-filters-reset">Reset filters</button>
                <button type="button" class="demo-listing-filters__apply" id="listing-filters-apply">Apply filters</button>
            </div>
        </form>
    </aside>
</div>
