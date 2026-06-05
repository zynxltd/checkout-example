{{-- Feefo-style star row for PLP cards (matches VWO .feefo-rating-stars markup) --}}
@php
    $rating = (float) ($rating ?? 0);
    $reviews = (int) ($reviews ?? 0);
@endphp
<div class="feefo-product-stars-widget">
    <div class="summary-rating">
        <div class="feefo-rating-stars" aria-hidden="true">
            @for ($i = 1; $i <= 5; $i++)
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" focusable="false">
                    <path fill="{{ $i <= floor($rating + 0.25) ? '#f5b301' : '#e8e4df' }}" d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.9l-4.94 2.8.94-5.5-4-3.9 5.53-.8L10 1.5z"/>
                </svg>
            @endfor
        </div>
        @if ($reviews > 0)
            <span class="reviews-count">({{ number_format($reviews) }})</span>
        @endif
    </div>
</div>
