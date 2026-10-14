<div class="drawer-result-summary">
    <strong>{{ $plants->total() }}</strong>
        <span>{{ Str::plural('item', $plants->total()) }} found</span>
</div>

@if ($hasFilters)
    <a href="{{ route('demo.plant-finder') }}" class="drawer-clear">Clear all</a>
@endif

<button type="button" class="drawer-done" data-filter-close>
    <span>View results</span>
    <span aria-hidden="true">→</span>
</button>
