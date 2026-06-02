{{-- Order summary — mobile toggle + line items (shown while .co--loading) --}}
<div class="co-sk co-sk--toggle" aria-hidden="true">
    <div class="co-sk__bone co-sk__bone--toggle-label"></div>
    <div class="co-sk__bone co-sk__bone--toggle-total"></div>
</div>

<div class="co-sk co-sk--summary" aria-hidden="true">
    <ul class="co-sk__items">
        @for ($i = 0; $i < 3; $i++)
        <li class="co-sk__item">
            <div class="co-sk__bone co-sk__bone--thumb"></div>
            <div class="co-sk__item-lines">
                <div class="co-sk__bone co-sk__bone--line"></div>
                <div class="co-sk__bone co-sk__bone--line co-sk__bone--line-sm"></div>
            </div>
            <div class="co-sk__bone co-sk__bone--price"></div>
        </li>
        @endfor
    </ul>
    <div class="co-sk__bone co-sk__bone--voucher"></div>
    <div class="co-sk__totals">
        <div class="co-sk__total-row">
            <div class="co-sk__bone co-sk__bone--total-label"></div>
            <div class="co-sk__bone co-sk__bone--total-val"></div>
        </div>
        <div class="co-sk__total-row">
            <div class="co-sk__bone co-sk__bone--total-label"></div>
            <div class="co-sk__bone co-sk__bone--total-val"></div>
        </div>
        <div class="co-sk__total-row co-sk__total-row--grand">
            <div class="co-sk__bone co-sk__bone--total-label co-sk__bone--wide"></div>
            <div class="co-sk__bone co-sk__bone--total-val co-sk__bone--total-val-lg"></div>
        </div>
    </div>
</div>
