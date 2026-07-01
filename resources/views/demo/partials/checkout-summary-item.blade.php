<li class="co-summary-item @if(!empty($item['is_club'])) co-summary-item--club @endif" data-sku="{{ $item['sku'] }}">
    <div class="co-summary-item__thumb">
        <img src="{{ asset($item['image']) }}" alt="" width="64" height="64" loading="lazy">
        <span class="co-summary-item__qty" aria-label="Quantity: {{ $item['qty'] }}">{{ $item['qty'] }}</span>
    </div>
    <div class="co-summary-item__info">
        <p class="co-summary-item__name">{{ $item['name'] }}</p>
        @if(!empty($item['variant']))
        <p class="co-summary-item__variant">{{ $item['variant'] }}</p>
        @endif
    </div>
    <div class="co-summary-item__end">
        <p class="co-summary-item__price">£{{ number_format($item['line_total'], 2) }}</p>
        @if($allowRemove ?? true)
        <button
            type="button"
            class="co-summary-item__remove"
            data-co-remove="{{ $item['sku'] }}"
            aria-label="Remove {{ $item['name'] }}"
        >
            @include('demo.partials.icon', ['name' => 'trash', 'width' => 16, 'height' => 16])
            <span class="co-summary-item__remove-label">Remove</span>
        </button>
        @endif
    </div>
</li>
