<form method="GET" action="{{ url()->current() }}" data-finder-form class="finder-form">
    <section class="drawer-filter-section">
        <h3 class="drawer-section-title">You can filter by</h3>

        <div class="yg-pf-filter-grid">
            @foreach ([
                ['name' => 'planting_time', 'label' => 'Planting time', 'options' => $planting_times],
                ['name' => 'flowering_time', 'label' => 'Flowering time', 'options' => $flowering_times],
                ['name' => 'fruiting_time', 'label' => 'Fruiting time', 'options' => $fruiting_times],
                ['name' => 'category', 'label' => 'Category', 'options' => $categories],
            ] as $field)
                <label class="yg-pf-filter-field">
                    <span class="yg-pf-filter-label">{{ $field['label'] }}</span>
                    <span class="yg-pf-filter-select-wrap">
                        <select name="{{ $field['name'] }}" aria-label="{{ $field['label'] }}">
                            <option value="">Please select</option>
                            @foreach ($field['options'] as $value => $label)
                                <option value="{{ $value }}" @selected(($filters[$field['name']] ?? '') === $value)>{{ $label }}</option>
                            @endforeach
                        </select>
                        <span class="select-chevron" aria-hidden="true">▾</span>
                    </span>
                </label>
            @endforeach
        </div>
    </section>

    <section class="drawer-filter-section drawer-filter-section--characteristics">
        <h3 class="drawer-section-title">Select plant characteristics</h3>
        <p class="drawer-description">
            Choose as many as apply — we'll show plants that match every characteristic you pick.
        </p>

        @foreach ($groups as $group)
            <div class="characteristic-grid yg-pf-characteristics">
                @foreach ($group['options'] as $option)
                    @php
                        $selectedValues = $filters[$group['key']] ?? [];
                        $isSelected = in_array($option['value'], $selectedValues, true);
                    @endphp

                    <label class="characteristic {{ $isSelected ? 'is-selected' : '' }}">
                        <input type="checkbox" name="features[]" value="{{ $option['value'] }}" @checked($isSelected)>
                        <span class="characteristic-icon">
                            <img src="{{ asset('images/finder/'.$option['icon']) }}" alt="" width="36" height="36">
                        </span>
                        <span class="characteristic-name">{{ $option['label'] }}</span>
                        <span class="characteristic-check" aria-hidden="true"></span>
                    </label>
                @endforeach
            </div>
        @endforeach
    </section>
</form>
