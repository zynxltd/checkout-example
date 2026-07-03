@php $club = $user['club'] ?? null; @endphp

@if (! empty($club['benefits']))
    <section
        class="demo-account-club-benefits{{ ! empty($horizontal) ? ' demo-account-club-benefits--horizontal' : '' }}{{ ! empty($club_page) ? ' demo-account-club-benefits--club-page' : '' }}{{ ! empty($compact) ? ' demo-account-club-benefits--compact' : '' }}"
        aria-labelledby="club-benefits-title"
    >
        <div class="demo-account-club-benefits__header">
            @if (! empty($club_page))
                <img
                    class="demo-account-club-benefits__logo"
                    src="{{ asset('images/club/discount-club-logo.png') }}"
                    alt="YouGarden Discount Club"
                    width="180"
                    height="72"
                    loading="eager"
                >
            @endif

            <div>
                <h3 class="demo-account-club-benefits__title" id="club-benefits-title">Your Club Member Benefits</h3>
                <p class="demo-account-club-benefits__subtitle">Exclusive member pricing</p>
            </div>
        </div>

        <div class="demo-account-club-benefits__panel" role="list">
            @foreach ($club['benefits'] as $index => $benefit)
                @php
                    $categories = array_map('trim', explode(',', $benefit['categories']));
                    preg_match('/([\d.]+)/', $benefit['discount'], $rateMatch);
                    $rate = $rateMatch[1] ?? '';
                @endphp
                <article class="demo-account-club-vip-card{{ $index > 0 ? ' demo-account-club-vip-card--secondary' : '' }}" role="listitem">
                    <div class="demo-account-club-vip-card__header">Club VIP</div>
                    <div class="demo-account-club-vip-card__body">
                        <p class="demo-account-club-vip-card__rate" aria-label="{{ $rate }} percent off">
                            <span class="demo-account-club-vip-card__rate-value">{{ $rate }}</span>
                            <span class="demo-account-club-vip-card__rate-suffix">%<small>OFF</small></span>
                        </p>
                        <ul class="demo-account-club-vip-card__categories">
                            @foreach ($categories as $category)
                                <li>{{ $category }}</li>
                            @endforeach
                        </ul>
                    </div>
                </article>
            @endforeach
        </div>

        <p class="demo-account-club-benefits__note">Discounts are automatically applied when logged in</p>
    </section>
@endif
