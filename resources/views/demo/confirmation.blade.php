@extends('demo.layout')

@section('title', 'Thank you — YouGarden')

@section('body_class', 'demo-confirmation-page' . (\App\Support\DemoDrawerVariant::isV40Active() ? ' cr--v-4-0' : ''))

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-checkout.css') }}?v={{ filemtime(public_path('css/yg-checkout.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/yg-confirmation.css') }}?v={{ filemtime(public_path('css/yg-confirmation.css')) }}">
@endpush

@section('content')
@php
    $addr = $order['shipping_address'];
    $v40 = \App\Support\DemoDrawerVariant::isV40Active();
    $placedAt = $order['placed_at'] instanceof \DateTimeInterface
        ? $order['placed_at']
        : \Illuminate\Support\Carbon::parse($order['placed_at']);
@endphp

<div class="cr">
    <header class="co-header">
        <a href="{{ route('demo.pdp') }}" class="co-header__logo" aria-label="YouGarden home">
            <img src="{{ asset('images/yougarden-logo.png') }}" alt="YouGarden" width="180" height="48">
        </a>
        <a href="{{ route('demo.pdp') }}" class="co-header__cart" aria-label="Return to shop">
            @include('demo.partials.icon', ['name' => 'cart', 'width' => 24, 'height' => 24])
        </a>
    </header>

    <div class="cr-layout">
        <main class="cr-main">
            <div class="cr-status" role="status">
                <span class="cr-status__icon" aria-hidden="true">
                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                        <circle cx="25" cy="25" r="24" stroke="currentColor" stroke-width="2"/>
                        <path d="M14 25.5 21.5 33 36 17" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
                <h1 class="cr-status__title">Thank you, {{ $order['first_name'] }}!</h1>
            </div>

            <div class="cr-order-meta">
                <p class="cr-order-meta__number">Order {{ $order['number'] }}</p>
                @unless($v40)
                <p class="cr-order-meta__confirm">Confirmation {{ $order['confirmation'] }}</p>
                @endunless
            </div>

            <p class="cr-email-notice">
                You&rsquo;ll receive a confirmation email at
                <strong>{{ $order['email'] }}</strong>
            </p>

            <section class="cr-next" aria-label="Next steps">
                <div class="cr-next__card">
                    <h2 class="cr-next__title">What happens next</h2>
                    <ol class="cr-steps">
                        <li class="cr-steps__item">
                            <span class="cr-steps__dot" aria-hidden="true"></span>
                            <div class="cr-steps__body">
                                <p class="cr-steps__label">Order received</p>
                                <p class="cr-steps__meta">We&rsquo;re getting your items ready.</p>
                            </div>
                        </li>
                        <li class="cr-steps__item">
                            <span class="cr-steps__dot" aria-hidden="true"></span>
                            <div class="cr-steps__body">
                                <p class="cr-steps__label">Dispatched</p>
                                <p class="cr-steps__meta">We&rsquo;ll email you when it ships.</p>
                            </div>
                        </li>
                        <li class="cr-steps__item">
                            <span class="cr-steps__dot" aria-hidden="true"></span>
                            <div class="cr-steps__body">
                                <p class="cr-steps__label">Delivered</p>
                                <p class="cr-steps__meta">Delivered to {{ $addr['postcode'] }}.</p>
                            </div>
                        </li>
                    </ol>
                </div>

                <div class="cr-next__card cr-next__card--help">
                    <h2 class="cr-next__title">Need help?</h2>
                    <p class="cr-next__text">
                        For questions about your order, quote
                        <strong>{{ $order['number'] }}</strong>.
                    </p>
                    <div class="cr-mini-actions">
                        <a href="#" class="cr-mini-actions__link" data-prototype-link>Contact support</a>
                        <a href="#" class="cr-mini-actions__link" data-prototype-link>Print receipt</a>
                    </div>
                </div>
            </section>

            <div class="cr-track-card" role="region" aria-label="Delivery location map preview">
                <div class="cr-track-card__map">
                    @php
                        // Use a postcode-level query with an explicit zoom so the embed reliably centers
                        // and shows the marker (full street addresses can sometimes render too zoomed-out).
                        $mapQuery = trim(implode(', ', array_filter([
                            $addr['postcode'] ?? null,
                            $addr['city'] ?? null,
                            $addr['country'] ?? null,
                        ])));
                        $mapSrc = 'https://www.google.com/maps?q=' . urlencode($mapQuery) . '&z=15&output=embed';
                    @endphp
                    <iframe
                        class="cr-map-embed"
                        title="Delivery area map"
                        src="{{ $mapSrc }}"
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        allowfullscreen
                    ></iframe>
                    <p class="cr-map-placeholder__label">
                        <span class="cr-map-placeholder__city">{{ $addr['city'] }}</span>
                        <span class="cr-map-placeholder__postcode">{{ $addr['postcode'] }}</span>
                    </p>
                </div>
                <p class="cr-track-card__hint">Your order is confirmed — we&rsquo;ll email you when it ships.</p>
            </div>

            @include('demo.partials.confirmation-recos', ['recommendations' => $recommendations ?? []])

            <section class="cr-details" aria-labelledby="cr-details-title">
                <h2 id="cr-details-title" class="cr-details__title">Order details</h2>

                <div class="cr-details__grid">
                    <div class="cr-details__block">
                        <h3 class="cr-details__label">Contact information</h3>
                        <p>{{ $order['email'] }}</p>
                    </div>

                    <div class="cr-details__block">
                        <h3 class="cr-details__label">Shipping address</h3>
                        <p>
                            {{ $addr['name'] }}<br>
                            {{ $addr['line1'] }}<br>
                            @if($addr['line2'])
                            {{ $addr['line2'] }}<br>
                            @endif
                            {{ $addr['city'] }}<br>
                            {{ $addr['postcode'] }}<br>
                            {{ $addr['country'] }}
                        </p>
                    </div>

                    <div class="cr-details__block">
                        <h3 class="cr-details__label">Shipping method</h3>
                        <p>{{ $order['shipping_method'] }}</p>
                    </div>

                    <div class="cr-details__block">
                        <h3 class="cr-details__label">Payment</h3>
                        <p>{{ $order['payment_summary'] }}</p>
                        <p class="cr-details__muted">£{{ number_format($order['total'], 2) }} · {{ $placedAt->format('j M Y') }}</p>
                    </div>
                </div>
            </section>

            @if($v40)
            <section class="cr-create-account" aria-labelledby="cr-create-account-title">
                <h2 id="cr-create-account-title" class="cr-create-account__title">Save your details for next time</h2>
                <p class="cr-create-account__lead">Create a free YouGarden account to track orders, save addresses, and get your birthday treat.</p>
                <form class="cr-create-account__form" action="#" method="post" data-prototype-form>
                    <div class="cr-create-account__row">
                        <label class="cr-create-account__field">
                            <span class="cr-create-account__label">Password</span>
                            <input type="password" name="password" class="cr-create-account__input" autocomplete="new-password" placeholder=" ">
                        </label>
                        <label class="cr-create-account__field">
                            <span class="cr-create-account__label">Confirm password</span>
                            <input type="password" name="password_confirmation" class="cr-create-account__input" autocomplete="new-password" placeholder=" ">
                        </label>
                    </div>
                    <button type="submit" class="cr-btn cr-btn--secondary">Create an account</button>
                </form>
            </section>
            @endif

            <div class="cr-actions">
                <a href="{{ route('demo.pdp') }}" class="cr-btn cr-btn--primary">Continue shopping</a>
                @unless($v40)
                <a href="#" class="cr-btn cr-btn--secondary" data-prototype-link>View order status</a>
                @endunless
            </div>

            <p class="cr-prototype-note">Prototype receipt — basket cleared for demo. Add items again to run another checkout.</p>
        </main>

        <aside class="cr-summary" aria-label="Order summary">
            <h2 class="cr-summary__title">Order summary</h2>

            <ul class="co-summary__items">
                @foreach($order['items'] as $item)
                <li class="co-summary-item">
                    <div class="co-summary-item__thumb">
                        <img src="{{ asset($item['image']) }}" alt="" width="64" height="64" loading="lazy">
                        <span class="co-summary-item__qty" aria-label="Quantity: {{ $item['qty'] }}">{{ $item['qty'] }}</span>
                    </div>
                    <div class="co-summary-item__info">
                        <p class="co-summary-item__name">{{ $item['name'] }}</p>
                        @if(!empty($item['variant']))
                        <p class="co-summary-item__variant">{{ $item['variant'] }}</p>
                        @endif
                    </div>
                    <p class="co-summary-item__price">£{{ number_format($item['line_total'], 2) }}</p>
                </li>
                @endforeach
            </ul>

            <dl class="co-summary__totals">
                <div class="co-summary__row">
                    <dt>Subtotal</dt>
                    <dd>£{{ number_format($order['subtotal'], 2) }}</dd>
                </div>
                @if($order['your_savings'] > 0)
                <div class="co-summary__row co-summary__row--save">
                    <dt>Savings</dt>
                    <dd>−£{{ number_format($order['your_savings'], 2) }}</dd>
                </div>
                @endif
                @if($order['code_discount'] > 0)
                <div class="co-summary__row co-summary__row--promo">
                    <dt>Discounts</dt>
                    <dd>−£{{ number_format($order['code_discount'], 2) }}</dd>
                </div>
                @endif
                <div class="co-summary__row">
                    <dt>Delivery</dt>
                    <dd>£{{ number_format($order['delivery'], 2) }}</dd>
                </div>
                <div class="co-summary__row co-summary__row--total">
                    <dt>Total</dt>
                    <dd>
                        <span class="co-summary__currency">GBP</span>
                        £{{ number_format($order['total'], 2) }}
                    </dd>
                </div>
            </dl>
            <p class="co-summary__tax">Including £{{ number_format($order['tax_estimate'], 2) }} in taxes</p>

            @if($order['offer_code'] || $order['voucher_code'])
            <div class="cr-summary__codes">
                @if($order['offer_code'])
                <p>Offer <strong>{{ $order['offer_code'] }}</strong> applied</p>
                @endif
                @if($order['voucher_code'])
                <p>
                    Voucher
                    @if(strcasecmp((string) $order['voucher_code'], 'voucher') === 0)
                        <strong>£{{ number_format($order['voucher_discount'], 2) }} OFF</strong>
                    @else
                        <strong>{{ $order['voucher_code'] }} - £{{ number_format($order['voucher_discount'], 2) }} OFF</strong>
                    @endif
                    applied
                </p>
                @endif
            </div>
            @endif
        </aside>
    </div>
</div>
@endsection

@push('scripts')
    <script>
        document.querySelectorAll('[data-prototype-link]').forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Prototype link — not wired in this demo.');
            });
        });

        document.querySelectorAll('[data-prototype-form]').forEach((form) => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Prototype: account creation would complete here using the email from your order.');
            });
        });

        (function bindConfirmationRecos() {
            const csrf = document.querySelector('meta[name="csrf-token"]')?.content || '';
            const addUrl = window.YG_DEMO_ROUTES?.add;
            const pdpUrl = @json(route('demo.pdp'));
            const feedback = document.getElementById('cr-recos-feedback');
            const scroller = document.querySelector('.cr-recos__scroller');

            if (!addUrl) {
                return;
            }

            // Pointer drag-scroll on carousel (works from images, cards, and empty track).
            if (scroller) {
                let activePointerId = null;
                let startX = 0;
                let scrollLeft = 0;
                let didDrag = false;

                const isInteractiveTarget = (target) =>
                    target.closest('[data-cr-reco-add], [data-prototype-link]');

                scroller.addEventListener('dragstart', (e) => {
                    if (e.target.closest('.cr-reco-card__img')) {
                        e.preventDefault();
                    }
                });

                scroller.addEventListener('pointerdown', (e) => {
                    if (e.pointerType !== 'mouse' || e.button !== 0) {
                        return;
                    }
                    if (isInteractiveTarget(e.target)) {
                        return;
                    }

                    activePointerId = e.pointerId;
                    startX = e.clientX;
                    scrollLeft = scroller.scrollLeft;
                    didDrag = false;
                    scroller.classList.add('is-dragging');
                    scroller.setPointerCapture(e.pointerId);
                });

                scroller.addEventListener('pointermove', (e) => {
                    if (activePointerId !== e.pointerId) {
                        return;
                    }

                    const delta = e.clientX - startX;
                    if (Math.abs(delta) > 4) {
                        didDrag = true;
                    }
                    if (!didDrag) {
                        return;
                    }

                    e.preventDefault();
                    scroller.scrollLeft = scrollLeft - delta;
                });

                const endDrag = (e) => {
                    if (activePointerId !== e.pointerId) {
                        return;
                    }

                    activePointerId = null;
                    scroller.classList.remove('is-dragging');
                    if (scroller.hasPointerCapture(e.pointerId)) {
                        scroller.releasePointerCapture(e.pointerId);
                    }
                };

                scroller.addEventListener('pointerup', endDrag);
                scroller.addEventListener('pointercancel', endDrag);

                scroller.addEventListener(
                    'click',
                    (e) => {
                        if (didDrag) {
                            e.preventDefault();
                            e.stopPropagation();
                            didDrag = false;
                        }
                    },
                    true,
                );
            }

            document.querySelectorAll('[data-cr-reco-add]').forEach((btn) => {
                btn.addEventListener('click', async () => {
                    if (btn.disabled || btn.classList.contains('is-added')) {
                        return;
                    }

                    const sku = btn.getAttribute('data-cr-reco-add');
                    if (!sku) {
                        return;
                    }

                    btn.disabled = true;
                    btn.textContent = 'Adding…';

                    try {
                        const res = await fetch(addUrl, {
                            method: 'POST',
                            credentials: 'same-origin',
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json',
                                'X-CSRF-TOKEN': csrf,
                                'X-Requested-With': 'XMLHttpRequest',
                            },
                            body: JSON.stringify({ sku, qty: 1 }),
                        });
                        const data = await res.json();

                        if (!res.ok) {
                            btn.disabled = false;
                            btn.textContent = 'Add to basket';
                            alert(data.error || 'Could not add to basket.');
                            return;
                        }

                        btn.classList.add('is-added');
                        btn.textContent = 'Added';

                        if (feedback) {
                            feedback.hidden = false;
                            feedback.innerHTML =
                                'Added to your basket. <a href="' +
                                pdpUrl +
                                '">View basket</a> to checkout when you\'re ready.';
                        }
                    } catch {
                        btn.disabled = false;
                        btn.textContent = 'Add to basket';
                        alert('Could not add to basket.');
                    }
                });
            });
        })();
    </script>
@endpush
