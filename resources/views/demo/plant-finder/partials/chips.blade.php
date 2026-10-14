@if ($chips)
    <ul class="yg-pf-chips" aria-label="Active filters">
        @foreach ($chips as $chip)
            <li>
                <a href="{{ $chip['url'] }}">
                    <span>{{ $chip['label'] }}</span>
                    <span class="chip-remove" aria-hidden="true">×</span>
                    <span class="visually-hidden">Remove {{ $chip['label'] }}</span>
                </a>
            </li>
        @endforeach
    </ul>
@endif
