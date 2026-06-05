@php
    $feefo = $product['feefo'] ?? null;
    $footer = $product['footer'] ?? null;
@endphp

<div class="yg-pdp-bottom">
@if($feefo)
<section class="yg-pdp-reviews" id="pdp-feefo-reviews" aria-label="Customer reviews">
    <div class="yg-pdp-reviews__inner">
        <div class="yg-pdp-reviews__summary">
            <p class="yg-pdp-reviews__label">Average Customer Rating:</p>
            <div class="yg-pdp-reviews__score-row">
                <span class="yg-pdp-reviews__stars" aria-label="{{ $feefo['rating'] }} out of {{ $feefo['max_rating'] }} stars">
                    @for($i = 1; $i <= 5; $i++)
                    <span class="yg-pdp-reviews__star @if($i <= floor($feefo['rating'])) is-full @elseif($i - $feefo['rating'] < 1) is-half @endif" aria-hidden="true">★</span>
                    @endfor
                </span>
                <span class="yg-pdp-reviews__value">{{ number_format($feefo['rating'], 1) }}/{{ $feefo['max_rating'] }}</span>
                <span class="yg-pdp-reviews__feefo" aria-label="Feefo">feefo</span>
            </div>
            <p class="yg-pdp-reviews__meta">
                Independent Service Rating based on {{ number_format($feefo['review_count']) }} verified reviews.
                <a href="#pdp-feefo-reviews" class="yg-pdp-reviews__link">Read all reviews</a>
            </p>
        </div>

        <div class="yg-pdp-reviews__cards">
            @foreach($feefo['reviews'] as $review)
            <article class="yg-pdp-review-card">
                <div class="yg-pdp-review-card__stars" aria-label="{{ $review['rating'] }} out of 5 stars">
                    @for($i = 1; $i <= 5; $i++)
                    <span class="yg-pdp-reviews__star @if($i <= $review['rating']) is-full @endif" aria-hidden="true">★</span>
                    @endfor
                </div>
                <h3 class="yg-pdp-review-card__title">{{ $review['title'] }}</h3>
                <p class="yg-pdp-review-card__text">{{ $review['text'] }}</p>
                <p class="yg-pdp-review-card__by">{{ $review['author'] }} — {{ $review['date'] }}</p>
            </article>
            @endforeach
        </div>
    </div>
</section>
@endif

@if($feefo || $footer)
<div class="yg-pdp-wave" aria-hidden="true">
    <svg viewBox="0 0 1440 110" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,54 C280,98 520,10 760,52 C1000,96 1240,8 1440,50 L1440,110 L0,110 Z" fill="currentColor"/>
    </svg>
</div>
@endif

@if($footer)
<footer class="yg-pdp-footer" id="demo-pdp-footer">
    <div class="yg-pdp-footer__inner">
        <div class="yg-pdp-footer__grid">
            @foreach($footer['columns'] as $column)
            <div class="yg-pdp-footer__col">
                <h2 class="yg-pdp-footer__title">{{ $column['title'] }}</h2>
                <ul class="yg-pdp-footer__links">
                    @foreach($column['links'] as $link)
                    <li><a href="{{ $link['url'] }}">{{ $link['label'] }}</a></li>
                    @endforeach
                </ul>
            </div>
            @endforeach

            <div class="yg-pdp-footer__col yg-pdp-footer__col--social">
                <h2 class="yg-pdp-footer__title">Follow us on socials</h2>
                <ul class="yg-pdp-footer__socials">
                    <li>
                        <a href="#" class="yg-pdp-footer__social" aria-label="Instagram">
                            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="yg-pdp-footer__social" aria-label="Facebook">
                            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M13 22v-8h3l1-4h-3V8.5c0-1 .3-1.5 1.6-1.5H17V3.1C16.4 3 15.2 3 14 3c-2.8 0-4.7 1.7-4.7 4.8V10H6v4h3.3v8H13z"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="yg-pdp-footer__social" aria-label="TikTok">
                            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M16.5 3c.6 2.8 2.4 4.5 5 5v3.5c-1.8 0-3.4-.6-4.7-1.6v6.6a6.5 6.5 0 1 1-6.3-6.7V14a3 3 0 1 0 2.2 2.9V3h3.8z"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="yg-pdp-footer__social" aria-label="YouTube">
                            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C17.8 5 12 5 12 5s-5.8 0-7.7.3a2.7 2.7 0 0 0-1.9 1.9C2 9.1 2 12 2 12s0 2.9.4 4.8a2.7 2.7 0 0 0 1.9 1.9C6.2 19 12 19 12 19s5.8 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9C22 14.9 22 12 22 12s0-2.9-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z"/></svg>
                        </a>
                    </li>
                </ul>

                <h2 class="yg-pdp-footer__title yg-pdp-footer__title--payments">All major payments accepted</h2>
                <div class="yg-pdp-footer__payments" aria-label="Payment methods">
                    <span class="yg-pdp-footer__pay"><img src="{{ asset('images/payments/card-visa.svg') }}" alt="Visa" width="38" height="24"></span>
                    <span class="yg-pdp-footer__pay"><img src="{{ asset('images/payments/card-amex.svg') }}" alt="American Express" width="38" height="24"></span>
                    <span class="yg-pdp-footer__pay"><img src="{{ asset('images/payments/card-mastercard.svg') }}" alt="Mastercard" width="38" height="24"></span>
                    <span class="yg-pdp-footer__pay"><img src="{{ asset('images/payments/logo-paypal.svg') }}" alt="PayPal" width="38" height="24"></span>
                    <span class="yg-pdp-footer__pay"><img src="{{ asset('images/payments/card-apple-pay.svg') }}" alt="Apple Pay" width="38" height="24"></span>
                </div>
            </div>
        </div>

        <div class="yg-pdp-footer__legal">
            @foreach((array) $footer['legal'] as $line)
            <p>{{ $line }}</p>
            @endforeach
        </div>
    </div>
</footer>
@endif
</div>
