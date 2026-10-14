@php
    $showBreakdown = !empty($cart['show_breakdown']);
    $slotClass = $slotClass ?? '';
    $rowClass = $rowClass ?? '';
@endphp
@if($showBreakdown)
<details class="yg-subtotal-breakdown {{ $slotClass }}" open>
    <summary class="yg-totals__row yg-totals__row--total">
        <span>{{ $totalRowLabel }}</span>
        <span class="yg-subtotal-breakdown__amount">
            £{{ number_format($cart['basket_total'], 2) }}
            <span class="yg-subtotal-breakdown__chev" aria-hidden="true">▾</span>
        </span>
    </summary>
    <div class="yg-subtotal-breakdown__panel">
        <div class="yg-totals__row"><span>Delivery Cost</span><span>£{{ number_format($cart['delivery'], 2) }}</span></div>
        <div class="yg-totals__row yg-totals__row--save"><span>Total Saving</span><span>£{{ number_format($cart['your_savings'] ?? 0, 2) }}</span></div>
        <div class="yg-totals__row yg-subtotal-breakdown__order"><span>Order Total</span><span>£{{ number_format($cart['total'], 2) }}</span></div>
    </div>
</details>
@else
<div class="yg-totals__row yg-totals__row--total {{ $rowClass }}"><span>{{ $totalRowLabel }}</span><span>£{{ number_format($cart['basket_total'], 2) }}</span></div>
@endif
