{{-- Live-style PDP below: plant calendar accordion, content tabs, handpicked --}}
@php
    $cal = $product['plant_calendar'] ?? null;
    $sections = $product['content_sections'] ?? [];
    $handpicked = $product['handpicked'] ?? [];
    $months = $cal['months'] ?? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $monthCount = count($months);

    $isActive = static function (int $monthIndex, array $ranges): bool {
        foreach ($ranges as $range) {
            $from = (int) $range['from'];
            $to = (int) $range['to'];
            if ($monthIndex >= $from && $monthIndex <= $to) {
                return true;
            }
        }

        return false;
    };
@endphp

<div class="product-tabs-wrapper demo-live-tabs" data-live-tabs>
    @if ($cal)
        <div
            class="tab-heading active"
            id="calendar"
            role="button"
            tabindex="0"
            data-live-tab="calendar"
            aria-expanded="true"
            aria-controls="tab-content-calendar"
        >
            Plant Calendar
            <span class="arrow" aria-hidden="true">⌃</span>
        </div>
        <div class="tab-content active" id="tab-content-calendar" data-live-tab-panel="calendar">
            <div class="blooming-wrapper">
                <div class="table-key">
                    <div class="row plant"><span class="swatch" aria-hidden="true"></span> Planting Time</div>
                    <div class="row flower"><span class="swatch" aria-hidden="true"></span> Flowering Time</div>
                </div>

                <table class="blooming-table" aria-label="Plant calendar">
                    <thead>
                        <tr>
                            @foreach ($months as $label)
                                <th>{{ $label }}</th>
                            @endforeach
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($cal['seasons'] as $season)
                            <tr class="blooming-row blooming-row--{{ $season['id'] }}">
                                @for ($m = 0; $m < $monthCount; $m++)
                                    @php $on = $isActive($m, $season['ranges']); @endphp
                                    <td class="{{ $on ? ($season['id'] === 'flowering' ? 'shade-flower' : 'shade-plant') : '' }}">
                                        @if ($on)<span class="bar" aria-hidden="true"></span>@endif
                                    </td>
                                @endfor
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    @endif

    @foreach ($sections as $section)
        @php $isOpen = ! empty($section['open']); @endphp
        <div
            class="tab-heading{{ $isOpen ? ' active' : '' }}"
            id="{{ $section['id'] }}"
            role="button"
            tabindex="0"
            data-live-tab="{{ $section['id'] }}"
            aria-expanded="{{ $isOpen ? 'true' : 'false' }}"
            aria-controls="tab-content-{{ $section['id'] }}"
        >
            {{ $section['title'] }}
            <span class="arrow" aria-hidden="true">{{ $isOpen ? '⌃' : '⌄' }}</span>
        </div>
        <div
            class="tab-content{{ $isOpen ? ' active' : '' }}"
            id="tab-content-{{ $section['id'] }}"
            data-live-tab-panel="{{ $section['id'] }}"
            @unless ($isOpen) hidden @endunless
        >
            @foreach ($section['paragraphs'] ?? [] as $paragraph)
                <p>{{ $paragraph }}</p>
            @endforeach

            @if (! empty($section['bullets']))
                <ul>
                    @foreach ($section['bullets'] as $bullet)
                        <li>{{ $bullet }}</li>
                    @endforeach
                </ul>
            @endif

            @foreach ($section['blocks'] ?? [] as $block)
                @if (! empty($block['heading']))
                    <h3>{{ $block['heading'] }}</h3>
                @endif
                @foreach ($block['paragraphs'] ?? [] as $paragraph)
                    <p>{{ $paragraph }}</p>
                @endforeach
                @if (! empty($block['bullets']))
                    <ul>
                        @foreach ($block['bullets'] as $bullet)
                            <li>{{ $bullet }}</li>
                        @endforeach
                    </ul>
                @endif
            @endforeach
        </div>
    @endforeach
</div>

@if (count($handpicked) > 0)
    <section class="offer-sect-3 demo-handpicked" aria-labelledby="handpicked-heading">
        <h2 class="handpicked-heading" id="handpicked-heading">Handpicked for your garden</h2>
        <div class="offer-carousel" id="offer-carousel">
            @foreach ($handpicked as $item)
                <a class="offer-box" href="{{ $item['url'] ?? '#' }}">
                    <div class="image-wrapper">
                        @if (! empty($item['badge']))
                            <span class="offer-badge-off">{{ $item['badge'] }}</span>
                        @endif
                        <img
                            src="{{ str_starts_with($item['image'], 'http') ? $item['image'] : asset($item['image']) }}"
                            alt="{{ $item['name'] }}"
                            width="280"
                            height="280"
                            loading="lazy"
                        >
                    </div>
                    <div class="item-title">{{ $item['name'] }}</div>
                </a>
            @endforeach
        </div>
    </section>
@endif
