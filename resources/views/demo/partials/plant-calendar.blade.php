@php
    $cal = $product['plant_calendar'] ?? null;
    if (! $cal) {
        return;
    }
    $months = $cal['months'];
    $monthCount = count($months);
    $currentMonth = (int) date('n') - 1;

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

<section class="yg-plant-cal" aria-labelledby="yg-plant-cal-title">
    <h2 class="yg-plant-cal__title" id="yg-plant-cal-title">{{ $cal['title'] }}</h2>

    <div
        class="yg-plant-cal__matrix"
        style="--yg-cal-cols: {{ $monthCount }};"
        role="table"
        aria-label="Planting, flowering and fruiting months"
    >
        <div class="yg-plant-cal__head" role="row">
            <span class="yg-plant-cal__corner" role="columnheader" aria-hidden="true"></span>
            <div class="yg-plant-cal__cells yg-plant-cal__cells--head" role="row">
                @foreach($months as $i => $label)
                <span
                    class="yg-plant-cal__colhead @if($i === $currentMonth) yg-plant-cal__colhead--now @endif"
                    role="columnheader"
                >{{ $label }}</span>
                @endforeach
            </div>
        </div>

        @foreach($cal['seasons'] as $season)
        <div class="yg-plant-cal__season" role="row">
            <span class="yg-plant-cal__rowhead yg-plant-cal__rowhead--{{ $season['id'] }}" role="rowheader">
                <span class="yg-plant-cal__swatch yg-plant-cal__swatch--{{ $season['id'] }}" aria-hidden="true"></span>
                <span class="yg-plant-cal__rowhead-text">{{ $season['label'] }}</span>
            </span>
            <div class="yg-plant-cal__cells" role="group" aria-label="{{ $season['label'] }}">
                @for($m = 0; $m < $monthCount; $m++)
                @php $on = $isActive($m, $season['ranges']); @endphp
                <span
                    class="yg-plant-cal__cell yg-plant-cal__cell--{{ $season['id'] }} @if($on) is-active @endif @if($m === $currentMonth) is-now-col @endif"
                    @if($on) title="{{ $months[$m] }}" @endif
                ></span>
                @endfor
            </div>
            <span class="yg-plant-cal__sr">
                {{ $season['label'] }}:
                @foreach($season['ranges'] as $range)
                    {{ $months[$range['from']] }}–{{ $months[$range['to']] }}@if(!$loop->last), @endif
                @endforeach
            </span>
        </div>
        @endforeach
    </div>
</section>
