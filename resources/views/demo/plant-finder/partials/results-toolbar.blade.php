@php
    use App\Support\PlantFinderCatalog;
@endphp

<div class="yg-pf-results-bar">
    <div class="yg-pf-results-bar__summary">
        <p class="yg-pf-match-summary">
            <strong>{{ $plants->total() }}</strong>
            {{ Str::plural('item', $plants->total()) }} found matching your chosen criteria
        </p>
        @if ($hasFilters)
            <a class="yg-pf-results-bar__clear" href="{{ route('demo.plant-finder') }}">Clear all filters</a>
        @endif
    </div>

    <div class="yg-pf-results-bar__actions">
        <button
            type="button"
            class="yg-pf-results-bar__filter"
            data-filter-open
            aria-controls="filter-drawer"
            aria-expanded="false"
        >
            Filter plants
        </button>

        <label class="yg-pf-results-bar__sort">
            <span class="visually-hidden">Sort listing</span>
            <select name="sort" data-finder-sort aria-label="Sort plants">
                @foreach (PlantFinderCatalog::sorts() as $value => $label)
                    <option value="{{ $value }}" @selected(($filters['sort'] ?? PlantFinderCatalog::defaultSort()) === $value)>
                        {{ $label }}
                    </option>
                @endforeach
            </select>
            <span class="yg-pf-results-bar__chevron" aria-hidden="true">▾</span>
        </label>
    </div>
</div>
