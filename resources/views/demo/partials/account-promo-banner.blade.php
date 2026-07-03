@if (! empty($promo))
    <aside class="demo-account-promo" aria-label="Account offer">
        <div class="demo-account-promo__copy">
            <p class="demo-account-promo__eyebrow">{{ $promo['eyebrow'] }}</p>
            <h2 class="demo-account-promo__title">{{ $promo['title'] }}</h2>
            <p class="demo-account-promo__body">{{ $promo['body'] }}</p>
        </div>
        <a href="{{ route($promo['cta_route']) }}" class="demo-account-promo__cta">{{ $promo['cta_label'] }} &raquo;</a>
    </aside>
@endif
