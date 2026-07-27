{{-- Currys-style mobile nav: root category list + drill-down sub-panels --}}
<div class="demo-mobile-nav demo-mobile-nav--currys" id="demo-mobile-nav" hidden>
    <div class="demo-mobile-nav__overlay" id="demo-mobile-nav-overlay" tabindex="-1" aria-hidden="true"></div>
    <aside
        class="demo-mobile-nav__panel"
        id="demo-mobile-nav-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-mobile-nav-title"
    >
        <div class="demo-mobile-nav__stack" data-mobile-nav-stack>
            {{-- Root: Shop by category --}}
            <div class="demo-mobile-nav__view is-active" data-nav-view="root">
                <header class="demo-mobile-nav__head demo-mobile-nav__head--root">
                    <h2 class="demo-mobile-nav__title" id="demo-mobile-nav-title">Shop by category</h2>
                    <button type="button" class="demo-mobile-nav__close" id="demo-mobile-nav-close" aria-label="Close menu">
                        @include('demo.partials.icon', ['name' => 'close'])
                    </button>
                </header>

                <div class="demo-mobile-nav__scroll">
                    <ul class="demo-mobile-nav__list" role="list">
                        @foreach ($shop_menu as $deptIndex => $dept)
                            <li>
                                <button
                                    type="button"
                                    class="demo-mobile-nav__row"
                                    data-nav-open="dept-{{ $deptIndex }}"
                                    aria-label="Browse {{ $dept['title'] }}"
                                >
                                    @if (! empty($dept['image']))
                                        <span class="demo-mobile-nav__icon" aria-hidden="true">
                                            <img src="{{ asset($dept['image']) }}" alt="" width="28" height="28" loading="lazy" decoding="async">
                                        </span>
                                    @endif
                                    <span class="demo-mobile-nav__label">{{ $dept['title'] }}</span>
                                    <span class="demo-mobile-nav__chev" aria-hidden="true"></span>
                                </button>
                            </li>
                        @endforeach
                    </ul>

                    <div class="demo-mobile-nav__divider" role="presentation"></div>

                    <ul class="demo-mobile-nav__list demo-mobile-nav__list--plain" role="list">
                        <li>
                            <a href="{{ route('demo.sale') }}" class="demo-mobile-nav__row demo-mobile-nav__row--link demo-mobile-nav__row--sale">
                                <span class="demo-mobile-nav__label">Deals</span>
                                <span class="demo-mobile-nav__chev" aria-hidden="true"></span>
                            </a>
                        </li>
                        <li>
                            <a href="{{ $yg }}/new" class="demo-mobile-nav__row demo-mobile-nav__row--link" target="_blank" rel="noopener">
                                <span class="demo-mobile-nav__label">New arrivals</span>
                                <span class="demo-mobile-nav__chev" aria-hidden="true"></span>
                            </a>
                        </li>
                        <li>
                            <button type="button" class="demo-mobile-nav__row" data-nav-open="trending" aria-label="Browse trending">
                                <span class="demo-mobile-nav__label">Trending</span>
                                <span class="demo-mobile-nav__chev" aria-hidden="true"></span>
                            </button>
                        </li>
                        <li>
                            <a href="{{ route('demo.tv-live') }}" class="demo-mobile-nav__row demo-mobile-nav__row--link">
                                <span class="demo-mobile-nav__label">YouGarden TV</span>
                                <span class="demo-mobile-nav__chev" aria-hidden="true"></span>
                            </a>
                        </li>
                        <li>
                            <a href="{{ route('demo.plant-finder') }}" class="demo-mobile-nav__row demo-mobile-nav__row--link">
                                <span class="demo-mobile-nav__label">Plant finder</span>
                                <span class="demo-mobile-nav__chev" aria-hidden="true"></span>
                            </a>
                        </li>
                    </ul>

                    <div class="demo-mobile-nav__divider" role="presentation"></div>

                    <ul class="demo-mobile-nav__list demo-mobile-nav__list--footer" role="list">
                        <li>
                            <a href="{{ $yg }}/contact-us" class="demo-mobile-nav__footer-link" target="_blank" rel="noopener">Help &amp; Support</a>
                        </li>
                        <li>
                            <a href="{{ route('demo.standard-delivery') }}" class="demo-mobile-nav__footer-link">Delivery</a>
                        </li>
                        <li>
                            <a href="{{ route('demo.lifetime-guarantee') }}" class="demo-mobile-nav__footer-link">Lifetime guarantee</a>
                        </li>
                    </ul>
                </div>
            </div>

            {{-- Trending sub-panel --}}
            <div class="demo-mobile-nav__view" data-nav-view="trending" hidden>
                <header class="demo-mobile-nav__head demo-mobile-nav__head--sub">
                    <button type="button" class="demo-mobile-nav__back" data-nav-back aria-label="Back to categories">
                        <span class="demo-mobile-nav__back-icon" aria-hidden="true"></span>
                        Back
                    </button>
                    <h2 class="demo-mobile-nav__subtitle">Trending</h2>
                </header>
                <div class="demo-mobile-nav__scroll">
                    <ul class="demo-mobile-nav__list demo-mobile-nav__list--plain" role="list">
                        <li>
                            <a href="{{ $yg }}/garden-plants/popular-garden-plants" class="demo-mobile-nav__row demo-mobile-nav__row--link" target="_blank" rel="noopener">
                                <span class="demo-mobile-nav__label">Popular garden plants</span>
                                <span class="demo-mobile-nav__chev" aria-hidden="true"></span>
                            </a>
                        </li>
                        @foreach ($trending_links ?? [] as $link)
                            <li>
                                <a href="{{ $link['url'] }}" class="demo-mobile-nav__row demo-mobile-nav__row--link" target="_blank" rel="noopener">
                                    <span class="demo-mobile-nav__label">{{ $link['label'] }}</span>
                                    <span class="demo-mobile-nav__chev" aria-hidden="true"></span>
                                </a>
                            </li>
                        @endforeach
                    </ul>
                </div>
            </div>

            {{-- Department + category drill-down panels --}}
            @foreach ($shop_menu as $deptIndex => $dept)
                <div class="demo-mobile-nav__view" data-nav-view="dept-{{ $deptIndex }}" hidden>
                    <header class="demo-mobile-nav__head demo-mobile-nav__head--sub">
                        <button type="button" class="demo-mobile-nav__back" data-nav-back aria-label="Back to categories">
                            <span class="demo-mobile-nav__back-icon" aria-hidden="true"></span>
                            Back
                        </button>
                        <h2 class="demo-mobile-nav__subtitle">{{ $dept['title'] }}</h2>
                    </header>
                    <div class="demo-mobile-nav__scroll">
                        <a href="{{ $dept['url'] }}" class="demo-mobile-nav__view-all" target="_blank" rel="noopener">
                            View all {{ $dept['title'] }}
                        </a>
                        <ul class="demo-mobile-nav__list demo-mobile-nav__list--plain" role="list">
                            @foreach ($dept['children'] ?? [] as $catIndex => $cat)
                                <li>
                                    @if (! empty($cat['children']))
                                        <button
                                            type="button"
                                            class="demo-mobile-nav__row"
                                            data-nav-open="dept-{{ $deptIndex }}-cat-{{ $catIndex }}"
                                            aria-label="Browse {{ $cat['label'] }}"
                                        >
                                            @if (! empty($cat['image']))
                                                <span class="demo-mobile-nav__icon" aria-hidden="true">
                                                    <img src="{{ asset($cat['image']) }}" alt="" width="28" height="28" loading="lazy" decoding="async">
                                                </span>
                                            @endif
                                            <span class="demo-mobile-nav__label">{{ $cat['label'] }}</span>
                                            <span class="demo-mobile-nav__chev" aria-hidden="true"></span>
                                        </button>
                                    @else
                                        <a href="{{ $cat['url'] }}" class="demo-mobile-nav__row demo-mobile-nav__row--link" target="_blank" rel="noopener">
                                            @if (! empty($cat['image']))
                                                <span class="demo-mobile-nav__icon" aria-hidden="true">
                                                    <img src="{{ asset($cat['image']) }}" alt="" width="28" height="28" loading="lazy" decoding="async">
                                                </span>
                                            @endif
                                            <span class="demo-mobile-nav__label">{{ $cat['label'] }}</span>
                                            <span class="demo-mobile-nav__chev" aria-hidden="true"></span>
                                        </a>
                                    @endif
                                </li>
                            @endforeach
                        </ul>
                    </div>
                </div>

                @foreach ($dept['children'] ?? [] as $catIndex => $cat)
                    @if (! empty($cat['children']))
                        <div class="demo-mobile-nav__view" data-nav-view="dept-{{ $deptIndex }}-cat-{{ $catIndex }}" hidden>
                            <header class="demo-mobile-nav__head demo-mobile-nav__head--sub">
                                <button type="button" class="demo-mobile-nav__back" data-nav-back aria-label="Back to {{ $dept['title'] }}">
                                    <span class="demo-mobile-nav__back-icon" aria-hidden="true"></span>
                                    Back
                                </button>
                                <h2 class="demo-mobile-nav__subtitle">{{ $cat['label'] }}</h2>
                            </header>
                            <div class="demo-mobile-nav__scroll">
                                <a href="{{ $cat['url'] }}" class="demo-mobile-nav__view-all" target="_blank" rel="noopener">
                                    View all {{ $cat['label'] }}
                                </a>
                                <ul class="demo-mobile-nav__list demo-mobile-nav__list--plain" role="list">
                                    @foreach ($cat['children'] as $sub)
                                        <li>
                                            <a href="{{ $sub['url'] }}" class="demo-mobile-nav__row demo-mobile-nav__row--link" target="_blank" rel="noopener">
                                                <span class="demo-mobile-nav__label">{{ $sub['label'] }}</span>
                                                <span class="demo-mobile-nav__chev" aria-hidden="true"></span>
                                            </a>
                                        </li>
                                    @endforeach
                                </ul>
                            </div>
                        </div>
                    @endif
                @endforeach
            @endforeach
        </div>
    </aside>
</div>
