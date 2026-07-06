@php
    /** @var string $prefix billing|delivery */
    $prefix = $prefix ?? 'billing';
    $inputName = $prefix === 'delivery' ? 'delivery_postcode' : 'billing_postcode';
    $autocomplete = $prefix === 'delivery' ? 'shipping postal-code' : 'postal-code';
@endphp
<div
    class="co-postcode-row co-postcode-lookup"
    data-postcode-lookup="{{ $prefix }}"
>
    <span class="co-field__label" id="co-{{ $prefix }}-postcode-label">Postcode</span>
    <div class="co-postcode-row__controls">
        <div class="co-postcode-lookup__field">
            <input
                type="text"
                name="{{ $inputName }}"
                id="co-{{ $prefix }}-postcode"
                class="co-field__input co-postcode-row__input"
                autocomplete="{{ $autocomplete }}"
                value="{{ $postcode ?? '' }}"
                role="combobox"
                aria-expanded="false"
                aria-controls="co-{{ $prefix }}-postcode-list"
                aria-autocomplete="list"
                aria-labelledby="co-{{ $prefix }}-postcode-label"
            >
            <ul
                id="co-{{ $prefix }}-postcode-list"
                class="co-postcode-suggest"
                role="listbox"
                hidden
            ></ul>
        </div>
        <button type="button" class="co-postcode-row__find" id="co-{{ $prefix }}-find">Find address</button>
    </div>
</div>
