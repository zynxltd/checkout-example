@extends('demo.layout')

@section('title', 'YouGarden Homepage — Argos-style layout preview')

@section('body_class', 'demo-home-argos')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-reviews-footer.css') }}?v={{ filemtime(public_path('css/demo-pdp-reviews-footer.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/home-argos-preview.css') }}?v={{ filemtime(public_path('css/home-argos-preview.css')) }}">
@endpush

@section('content')
<div class="demo-site demo-site--argos-home">
    @include('demo.partials.site-chrome-argos', [
        'cart' => $cart,
        'show_trust' => true,
        'search_placeholder' => 'Search plants, trees or outdoor living',
        'shop_menu' => $shop_menu,
        'trending_links' => $trending_links,
    ])

    <main class="demo-home-argos__main">
        <div class="yg-home-above" data-above-layout="hero-first" data-hero-layout="banner">
            {{-- Category icon strip — hidden to match yougarden.com (hero then tiles) --}}
            <section class="yg-cat-strip" aria-label="Shop by category" data-cat-strip data-above-block="cats" hidden>
                <button type="button" class="yg-cat-strip__nav yg-cat-strip__nav--prev" data-cat-prev aria-label="Previous categories" hidden>
                    <span class="yg-cat-strip__nav-arrow yg-cat-strip__nav-arrow--prev" aria-hidden="true"></span>
                </button>
                <div class="yg-cat-strip__viewport" data-cat-viewport>
                    <div class="yg-cat-strip__track" id="yg-cat-track" data-cat-track tabindex="0">
                        @foreach ($categories as $category)
                            <a href="{{ $category['url'] }}" class="yg-cat-strip__item" @if (str_starts_with($category['url'], 'http')) target="_blank" rel="noopener" @endif>
                                @if (! empty($category['sale']))
                                    <span class="yg-cat-strip__thumb yg-cat-strip__thumb--sale" aria-hidden="true">
                                        Sale<br>up to<br>50% off
                                    </span>
                                @else
                                    <span class="yg-cat-strip__thumb">
                                        <img
                                            src="{{ asset($category['image']) }}?v={{ filemtime(public_path($category['image'])) }}"
                                            alt=""
                                            width="208"
                                            height="208"
                                            loading="lazy"
                                        >
                                    </span>
                                @endif
                                <span class="yg-cat-strip__label">{{ $category['label'] }}</span>
                            </a>
                        @endforeach
                    </div>
                </div>
                <button type="button" class="yg-cat-strip__nav yg-cat-strip__nav--next" data-cat-next aria-label="Show more categories">
                    <span class="yg-cat-strip__nav-arrow" aria-hidden="true"></span>
                </button>
            </section>

            {{-- Default: yougarden.com 1920×600 banners. Variant: Argos banner + shortcut CTAs.
                 Previous lifestyle split banner: images/home-preview/hero-garden-original-backup.jpg --}}
            <section class="yg-hero-argos" aria-roledescription="carousel" aria-label="Featured offers" data-hero-carousel data-above-block="hero">
                <div class="yg-hero-argos__slides">
                    <div class="yg-hero-argos__track" data-hero-track>
                    @foreach ($hero_slides as $index => $slide)
                        <div
                            class="yg-hero-argos__slide{{ $index === 0 ? ' is-active' : '' }}"
                            data-hero-slide
                            role="group"
                            aria-roledescription="slide"
                            aria-label="{{ $index + 1 }} of {{ count($hero_slides) }}: {{ $slide['alt'] }}"
                            @if ($index !== 0) aria-hidden="true" @endif
                        >
                            <a
                                href="{{ $slide['url'] }}"
                                class="yg-hero-argos__banner yg-hero-argos__banner--full"
                                target="_blank"
                                rel="noopener"
                                @if ($index !== 0) tabindex="-1" @endif
                            >
                                <img
                                    src="{{ asset($slide['image']) }}?v={{ filemtime(public_path($slide['image'])) }}"
                                    alt="{{ $slide['alt'] }}"
                                    width="1920"
                                    height="600"
                                    sizes="100vw"
                                    @if ($index === 0) fetchpriority="high" @else loading="lazy" @endif
                                >
                            </a>

                            <div class="yg-hero-argos__ctas yg-hero-argos__ctas--{{ $slide['cta_theme'] ?? 'rose' }}" role="navigation" aria-label="{{ $slide['alt'] }} shopping shortcuts">
                                @foreach ($slide['ctas'] as $cta)
                                    <a
                                        href="{{ $cta['url'] }}"
                                        class="yg-hero-argos__cta"
                                        @if (str_starts_with($cta['url'], 'http')) target="_blank" rel="noopener" @endif
                                        @if ($index !== 0) tabindex="-1" @endif
                                    >{{ $cta['label'] }}</a>
                                @endforeach
                            </div>
                        </div>
                    @endforeach
                    </div>
                </div>

                <div class="yg-hero-argos__controls">
                    <div class="yg-hero-argos__controls-nav">
                        <button type="button" class="yg-hero-argos__arrow yg-hero-argos__arrow--prev" data-hero-prev aria-label="Previous slide"></button>
                        <div class="yg-hero-argos__dots" role="tablist" aria-label="Slide picker">
                            @foreach ($hero_slides as $index => $slide)
                                <button
                                    type="button"
                                    class="yg-hero-argos__dot{{ $index === 0 ? ' is-active' : '' }}"
                                    data-hero-dot="{{ $index }}"
                                    aria-label="Go to slide {{ $index + 1 }}: {{ $slide['alt'] }}"
                                    aria-selected="{{ $index === 0 ? 'true' : 'false' }}"
                                ></button>
                            @endforeach
                        </div>
                        <button type="button" class="yg-hero-argos__arrow yg-hero-argos__arrow--next" data-hero-next aria-label="Next slide"></button>
                    </div>
                    <button type="button" class="yg-hero-argos__pause" data-hero-pause aria-pressed="false">
                        <span class="yg-hero-argos__pause-icon" aria-hidden="true" data-hero-pause-icon></span>
                        <span data-hero-pause-label>Pause</span>
                    </button>
                </div>
            </section>
        </div>

        {{-- Below the fold — live yougarden.com homepage modules --}}
        <div class="yg-home-below">
            <section
                class="yg-home-row4 yg-home-row4--carousel yg-home-row4--slider yg-home-row4--circles yg-home-row4--squares yg-home-row4--squares-full yg-home-row4--icon-strip"
                aria-label="Shop popular categories"
                data-row4-cats
                data-row4-variant="squares-8"
            >
                <h2 class="yg-home-row4__title" data-row4-dusk-title>Shop by category</h2>
                <button type="button" class="yg-home-row4__nav yg-home-row4__nav--prev" data-row4-prev aria-label="Previous categories" hidden>
                    <span class="yg-home-row4__nav-arrow yg-home-row4__nav-arrow--prev" aria-hidden="true"></span>
                </button>
                <div class="yg-home-row4__viewport" data-row4-viewport>
                    <div class="yg-home-row4__track" data-row4-track>
                        @foreach ($row4 as $index => $tile)
                            <a
                                href="{{ $tile['url'] }}"
                                class="yg-home-tile"
                                data-row4-tile
                                data-row4-index="{{ $index + 1 }}"
                                target="_blank"
                                rel="noopener"
                            >
                                <img src="{{ asset($tile['image']) }}" alt="" width="600" height="600" loading="lazy">
                                @include('demo.partials.home-tile-cta', ['label' => $tile['label']])
                                <span class="yg-home-tile__caption">{{ $tile['label'] }}</span>
                            </a>
                        @endforeach
                    </div>
                </div>
                <button type="button" class="yg-home-row4__nav yg-home-row4__nav--next" data-row4-next aria-label="Next categories" hidden>
                    <span class="yg-home-row4__nav-arrow" aria-hidden="true"></span>
                </button>
                <div class="yg-pager" data-row4-slider-wrap>
                    <button type="button" class="yg-pager__btn" data-row4-pager-prev aria-label="Previous categories">
                        <span class="yg-pager__chev yg-pager__chev--prev" aria-hidden="true"></span>
                    </button>
                    <div class="yg-pager__dots" data-row4-pager-dots role="tablist" aria-label="Category pages"></div>
                    <button type="button" class="yg-pager__btn" data-row4-pager-next aria-label="Next categories">
                        <span class="yg-pager__chev" aria-hidden="true"></span>
                    </button>
                </div>
            </section>

            @if (! empty($customer_favourites['products']))
                <section class="yg-home-favourites" aria-label="{{ $customer_favourites['headline'] }}" data-favourites-carousel>
                    <div class="yg-home-favourites__headline">
                        <a
                            class="yg-home-favourites__headline-link"
                            href="{{ $customer_favourites['headline_url'] }}"
                            target="_blank"
                            rel="noopener"
                        >
                            <span class="yg-home-favourites__headline-text">{{ $customer_favourites['headline'] }}</span>
                        </a>
                    </div>

                    <div class="yg-home-favourites__carousel yg-home-favourites__carousel--slider">
                        <div class="yg-home-favourites__viewport" data-fav-viewport>
                            <div class="yg-home-favourites__track" data-fav-track>
                                @foreach ($customer_favourites['products'] as $product)
                                    <article class="yg-home-favourites__card">
                                        <div class="yg-home-favourites__image">
                                            <a href="{{ $product['url'] }}" target="_blank" rel="noopener">
                                                <span class="yg-home-favourites__popular">MOST POPULAR</span>
                                                @if (! empty($product['saving']))
                                                    <span class="yg-home-favourites__saving" aria-label="{{ $product['saving'] }}% off">
                                                        <span class="yg-home-favourites__saving-pct">{{ $product['saving'] }}<span class="yg-home-favourites__saving-sym">%</span></span>
                                                        <span class="yg-home-favourites__saving-off">OFF</span>
                                                    </span>
                                                @endif
                                                <img src="{{ $product['image'] }}" alt="{{ $product['name'] }}" width="500" height="500" loading="lazy">
                                            </a>
                                        </div>
                                        <h3 class="yg-home-favourites__name">
                                            <a href="{{ $product['url'] }}" target="_blank" rel="noopener">{{ $product['name'] }}</a>
                                        </h3>
                                        <p class="yg-home-favourites__price">
                                            <a href="{{ $product['url'] }}" target="_blank" rel="noopener">
                                                <span class="yg-home-favourites__price-label">From</span>
                                                <span class="yg-home-favourites__price-amount">{{ $product['price'] }}</span>
                                            </a>
                                        </p>
                                    </article>
                                @endforeach
                            </div>
                        </div>
                    </div>
                </section>
            @endif

        <div class="yg-home-fold-mark" aria-hidden="true">
            <span class="yg-home-fold-mark__line"></span>
            <span class="yg-home-fold-mark__label">Hero section only · rest of page below</span>
            <span class="yg-home-fold-mark__line"></span>
        </div>

            <section class="yg-home-philosophy" aria-labelledby="yg-home-philosophy-title">
                <div class="yg-home-philosophy__intro">
                    <span class="yg-home-philosophy__leaf yg-home-philosophy__leaf--left" aria-hidden="true">
                        <img
                            src="{{ asset('images/home-preview/philosophy-leaf-left.png') }}?v={{ filemtime(public_path('images/home-preview/philosophy-leaf-left.png')) }}"
                            alt=""
                            width="153"
                            height="59"
                        >
                    </span>
                    <div class="yg-home-philosophy__headings">
                        <h2 class="yg-home-philosophy__title" id="yg-home-philosophy-title">Welcome to YouGarden</h2>
                        <p class="yg-home-philosophy__subtitle">Where gardening is for everyone!</p>
                    </div>
                    <span class="yg-home-philosophy__leaf yg-home-philosophy__leaf--right" aria-hidden="true">
                        <img
                            src="{{ asset('images/home-preview/philosophy-leaf-right.png') }}?v={{ filemtime(public_path('images/home-preview/philosophy-leaf-right.png')) }}"
                            alt=""
                            width="152"
                            height="59"
                        >
                    </span>
                </div>
                <div class="yg-home-philosophy__copy">
                    @foreach (preg_split("/\n\n+/", $philosophy_copy) as $para)
                        <p>{{ $para }}</p>
                    @endforeach
                </div>
            </section>

            <a
                class="yg-home-banner"
                href="{{ $catalogue_banner['url'] }}"
                target="_blank"
                rel="noopener"
                aria-label="{{ $catalogue_banner['label'] }}"
            >
                <img
                    src="{{ asset($catalogue_banner['image']) }}"
                    alt="{{ $catalogue_banner['label'] }}"
                    width="1300"
                    height="415"
                    loading="lazy"
                >
            </a>

            <section class="yg-home-featured" aria-label="Featured categories">
                <a
                    href="{{ $featured_grid['featured']['url'] }}"
                    class="yg-home-tile yg-home-tile--feature"
                    target="_blank"
                    rel="noopener"
                >
                    <img
                        src="{{ asset($featured_grid['featured']['image']) }}"
                        alt=""
                        width="900"
                        height="900"
                        loading="lazy"
                    >
                    @include('demo.partials.home-tile-cta', ['label' => $featured_grid['featured']['label']])
                </a>
                <div class="yg-home-featured__grid">
                    @foreach ($featured_grid['tiles'] as $tile)
                        <a href="{{ $tile['url'] }}" class="yg-home-tile" target="_blank" rel="noopener">
                            <img src="{{ asset($tile['image']) }}" alt="" width="450" height="450" loading="lazy">
                            @include('demo.partials.home-tile-cta', ['label' => $tile['label']])
                        </a>
                    @endforeach
                </div>
            </section>

            <section class="yg-home-row4" aria-label="More categories">
                @foreach ($row4_secondary as $tile)
                    <a href="{{ $tile['url'] }}" class="yg-home-tile" target="_blank" rel="noopener">
                        <img src="{{ asset($tile['image']) }}" alt="" width="600" height="600" loading="lazy">
                        @include('demo.partials.home-tile-cta', ['label' => $tile['label']])
                    </a>
                @endforeach
            </section>

            <a
                class="yg-home-banner"
                href="{{ $sale_banner['url'] }}"
                @if (str_starts_with($sale_banner['url'], 'http')) target="_blank" rel="noopener" @endif
                aria-label="{{ $sale_banner['label'] }}"
            >
                <img
                    src="{{ asset($sale_banner['image']) }}"
                    alt="{{ $sale_banner['label'] }}"
                    width="1300"
                    height="200"
                    loading="lazy"
                >
            </a>

            <section class="yg-home-promo-pair" aria-label="From the blog">
                @foreach ($blog_promos as $promo)
                    <a href="{{ $promo['url'] }}" class="yg-home-promo" target="_blank" rel="noopener">
                        <img
                            src="{{ asset($promo['image']) }}"
                            alt="{{ $promo['label'] }}"
                            width="630"
                            height="354"
                            loading="lazy"
                        >
                    </a>
                @endforeach
            </section>

            <a
                class="yg-home-banner"
                href="{{ $club_banner['url'] }}"
                target="_blank"
                rel="noopener"
                aria-label="{{ $club_banner['label'] }}"
            >
                <img
                    src="{{ asset($club_banner['image']) }}"
                    alt="{{ $club_banner['label'] }}"
                    width="1300"
                    height="200"
                    loading="lazy"
                >
            </a>

            <section class="yg-home-promo-pair" aria-label="TV and blog">
                @foreach ($media_promos as $promo)
                    <a
                        href="{{ $promo['url'] }}"
                        class="yg-home-promo"
                        @if (str_starts_with($promo['url'], 'http')) target="_blank" rel="noopener" @endif
                    >
                        <img
                            src="{{ asset($promo['image']) }}"
                            alt="{{ $promo['label'] }}"
                            width="630"
                            height="354"
                            loading="lazy"
                        >
                    </a>
                @endforeach
            </section>
        </div>
    </main>

    @include('demo.partials.site-shell-footer')
</div>

<div id="yg-drawer-mount">
    @include('demo.partials.drawer', ['cart' => $cart])
</div>

<div class="demo-prototype-stack" id="demo-home-prototype-stack">
    <button type="button" class="demo-prototype-stack__dock" data-prototype-dock aria-expanded="false" aria-controls="demo-home-prototype-stack-body">Prototype tools</button>
    <div class="demo-prototype-stack__body" id="demo-home-prototype-stack-body">
        <div class="demo-prototype-stack__bar">
            <span class="demo-prototype-stack__bar-title">Prototype tools</span>
            <button type="button" class="demo-prototype-stack__minimize" data-prototype-minimize aria-label="Minimise prototype tools">Minimise</button>
        </div>
        <div class="demo-prototype-stack__content">
            <aside class="demo-controls" aria-label="Homepage category card variants">
                <h3>Category cards</h3>
                <p class="demo-controls__hint">Full-width square strip (Variant 7). Choice is saved in this browser.</p>
                <p class="demo-controls__label">Desktop cards visible</p>
                <label class="demo-controls__field">
                    <span>Category cards</span>
                    <input type="number" min="4" max="10" step="1" value="8" data-row4-visible-input aria-label="Desktop category cards visible">
                </label>
                <p class="demo-controls__hint">Sets how many category cards show on desktop before the carousel scrolls. Mobile stays 2×2.</p>
                <p class="demo-controls__label">Customer favourites width</p>
                <label class="demo-toggle">
                    <input type="radio" name="home-favourites-width" value="contained" data-favourites-width-option checked>
                    <span>Content width</span>
                </label>
                <label class="demo-toggle">
                    <input type="radio" name="home-favourites-width" value="full" data-favourites-width-option>
                    <span>Full width</span>
                </label>
                <p class="demo-controls__hint">Full width matches the category strip. Choice is saved in this browser.</p>
                <p class="demo-controls__label">Customer favourites — desktop cards</p>
                <label class="demo-controls__field">
                    <span>Products visible</span>
                    <input type="number" min="4" max="10" step="1" value="6" data-favourites-visible-input aria-label="Customer favourites desktop products visible">
                </label>
                <p class="demo-controls__hint">Min products shown before carousel scrolls. Mobile stays 2-up. Saved in this browser.</p>
                <label class="demo-toggle">
                    <input type="checkbox" data-favourites-bg-option>
                    <span>Stone background on carousel strip</span>
                </label>
                <p class="demo-controls__hint">YG stone (#F2E7D8) full-width band behind headline and products. Choice is saved in this browser.</p>
            </aside>
        </div>
    </div>
</div>

@endsection

@push('scripts')
<script src="{{ asset('js/demo-prototype-stack.js') }}?v={{ filemtime(public_path('js/demo-prototype-stack.js')) }}" defer></script>
<script>
(function () {
    var strip = document.querySelector('[data-cat-strip]');
    var viewport = strip && strip.querySelector('[data-cat-viewport]');
    var catTrack = strip && strip.querySelector('[data-cat-track]');
    var catNext = strip && strip.querySelector('[data-cat-next]');
    var catPrev = strip && strip.querySelector('[data-cat-prev]');

    if (strip && viewport && catTrack && catNext && catPrev) {
        var offset = 0;

        function step() {
            var item = catTrack.querySelector('.yg-cat-strip__item');
            var width = item ? item.getBoundingClientRect().width + 14 : 240;
            return Math.max(width * 3, Math.floor(viewport.clientWidth * 0.7));
        }

        function maxOffset() {
            return Math.max(0, catTrack.scrollWidth - viewport.clientWidth);
        }

        function applyOffset(animate) {
            catTrack.style.transition = animate === false ? 'none' : '';
            catTrack.style.transform = 'translate3d(' + (-offset) + 'px, 0, 0)';
            updateNav();
        }

        function moveBy(delta, animate) {
            offset = Math.max(0, Math.min(maxOffset(), offset + delta));
            applyOffset(animate !== false);
        }

        function updateNav() {
            var max = maxOffset();
            var hasOverflow = max > 4;
            var atStart = offset <= 4;
            var atEnd = offset >= max - 4;

            strip.classList.toggle('is-at-start', atStart || !hasOverflow);
            strip.classList.toggle('is-at-end', atEnd || !hasOverflow);

            if (!hasOverflow) {
                catPrev.hidden = true;
                catNext.hidden = true;
                return;
            }

            catPrev.hidden = atStart;
            catNext.hidden = atEnd;
            catPrev.disabled = atStart;
            catNext.disabled = atEnd;
        }

        catNext.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            moveBy(step(), true);
        });
        catPrev.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            moveBy(-step(), true);
        });
        window.addEventListener('resize', function () {
            offset = Math.max(0, Math.min(maxOffset(), offset));
            applyOffset(false);
        });
        updateNav();

        var drag = {
            active: false,
            moved: false,
            pointerId: null,
            startX: 0,
            startOffset: 0,
        };
        var DRAG_THRESHOLD = 8;
        var ignoreClickUntil = 0;

        // After a swipe/drag, block the synthetic click that would open a category link
        catTrack.addEventListener(
            'click',
            function (e) {
                if (Date.now() < ignoreClickUntil) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            },
            true
        );

        viewport.addEventListener('pointerdown', function (e) {
            if (e.button != null && e.button !== 0) return;
            // Don't start a strip-drag from the arrow buttons
            if (e.target.closest && e.target.closest('.yg-cat-strip__nav')) return;
            drag.active = true;
            drag.moved = false;
            drag.pointerId = e.pointerId;
            drag.startX = e.clientX;
            drag.startOffset = offset;
            try {
                viewport.setPointerCapture(e.pointerId);
            } catch (err) { /* ignore */ }
        });

        viewport.addEventListener('pointermove', function (e) {
            if (!drag.active || e.pointerId !== drag.pointerId) return;
            var dx = e.clientX - drag.startX;
            if (!drag.moved && Math.abs(dx) >= DRAG_THRESHOLD) {
                drag.moved = true;
                viewport.classList.add('is-dragging');
            }
            if (!drag.moved) return;
            e.preventDefault();
            offset = Math.max(0, Math.min(maxOffset(), drag.startOffset - dx));
            applyOffset(false);
        });

        function endDrag(e) {
            if (!drag.active) return;
            if (e && drag.pointerId != null && e.pointerId !== drag.pointerId) return;
            var wasMoved = drag.moved;
            drag.active = false;
            drag.pointerId = null;
            viewport.classList.remove('is-dragging');
            catTrack.style.transition = '';
            if (wasMoved) {
                // Cover delayed synthetic clicks on touch + mouse
                ignoreClickUntil = Date.now() + 450;
            }
            drag.moved = false;
            updateNav();
        }

        viewport.addEventListener('pointerup', endDrag);
        viewport.addEventListener('pointercancel', endDrag);
        viewport.addEventListener('lostpointercapture', endDrag);

        catTrack.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                moveBy(step(), true);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                moveBy(-step(), true);
            }
        });
    }

    var root = document.querySelector('[data-hero-carousel]');
    if (!root) return;

    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
    var heroTrack = root.querySelector('[data-hero-track]');
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    var prevBtn = root.querySelector('[data-hero-prev]');
    var nextBtn = root.querySelector('[data-hero-next]');
    var pauseBtn = root.querySelector('[data-hero-pause]');
    var pauseLabel = root.querySelector('[data-hero-pause-label]');
    var index = 0;
    var paused = false;
    var timer = null;
    var INTERVAL = 5000;

    function show(i) {
        index = (i + slides.length) % slides.length;
        if (heroTrack) {
            heroTrack.style.transform = 'translateX(-' + (index * 100) + '%)';
        }
        slides.forEach(function (slide, n) {
            var on = n === index;
            slide.classList.toggle('is-active', on);
            slide.setAttribute('aria-hidden', on ? 'false' : 'true');
            slide.querySelectorAll('a').forEach(function (link) {
                if (on) {
                    link.removeAttribute('tabindex');
                } else {
                    link.setAttribute('tabindex', '-1');
                }
            });
        });
        dots.forEach(function (dot, n) {
            var on = n === index;
            dot.classList.toggle('is-active', on);
            dot.setAttribute('aria-selected', on ? 'true' : 'false');
        });
    }

    function stopAuto() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    }

    function startAuto() {
        stopAuto();
        if (paused) return;
        timer = setTimeout(function () {
            show(index + 1);
            startAuto();
        }, INTERVAL);
    }

    function setPaused(nextPaused) {
        paused = nextPaused;
        if (pauseBtn) pauseBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
        if (pauseLabel) pauseLabel.textContent = paused ? 'Play' : 'Pause';
        if (paused) {
            stopAuto();
        } else {
            startAuto();
        }
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { show(index - 1); if (!paused) startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(index + 1); if (!paused) startAuto(); });
    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            show(parseInt(dot.getAttribute('data-hero-dot'), 10) || 0);
            if (!paused) startAuto();
        });
    });
    if (pauseBtn) {
        pauseBtn.addEventListener('click', function () {
            setPaused(!paused);
        });
    }

    var slidesViewport = root.querySelector('.yg-hero-argos__slides');
    var heroDrag = {
        active: false,
        moved: false,
        pointerId: null,
        startX: 0,
    };
    var HERO_SWIPE_THRESHOLD = 28;
    var heroIgnoreClickUntil = 0;

    if (slidesViewport) {
        slidesViewport.addEventListener(
            'click',
            function (e) {
                if (Date.now() < heroIgnoreClickUntil) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            },
            true
        );

        slidesViewport.addEventListener('pointerdown', function (e) {
            if (e.button != null && e.button !== 0) return;
            if (e.target.closest && e.target.closest('.yg-hero-argos__controls')) return;
            heroDrag.active = true;
            heroDrag.moved = false;
            heroDrag.pointerId = e.pointerId;
            heroDrag.startX = e.clientX;
            try {
                slidesViewport.setPointerCapture(e.pointerId);
            } catch (err) { /* ignore */ }
        });

        slidesViewport.addEventListener('pointermove', function (e) {
            if (!heroDrag.active || e.pointerId !== heroDrag.pointerId) return;
            var dx = e.clientX - heroDrag.startX;
            if (!heroDrag.moved && Math.abs(dx) >= HERO_SWIPE_THRESHOLD) {
                heroDrag.moved = true;
                slidesViewport.classList.add('is-dragging');
            }
            if (heroDrag.moved) {
                e.preventDefault();
            }
        });

        function endHeroDrag(e) {
            if (!heroDrag.active) return;
            if (e && heroDrag.pointerId != null && e.pointerId !== heroDrag.pointerId) return;
            var dx = e && e.clientX != null ? e.clientX - heroDrag.startX : 0;
            var wasMoved = heroDrag.moved;
            heroDrag.active = false;
            heroDrag.pointerId = null;
            slidesViewport.classList.remove('is-dragging');
            if (wasMoved) {
                heroIgnoreClickUntil = Date.now() + 450;
                if (dx <= -HERO_SWIPE_THRESHOLD) {
                    show(index + 1);
                    if (!paused) startAuto();
                } else if (dx >= HERO_SWIPE_THRESHOLD) {
                    show(index - 1);
                    if (!paused) startAuto();
                }
            }
            heroDrag.moved = false;
        }

        slidesViewport.addEventListener('pointerup', endHeroDrag);
        slidesViewport.addEventListener('pointercancel', endHeroDrag);
        slidesViewport.addEventListener('lostpointercapture', endHeroDrag);
    }

    root.addEventListener('mouseenter', function () { if (!paused) stopAuto(); });
    root.addEventListener('mouseleave', function () { if (!paused) startAuto(); });
    root.addEventListener('focusin', function () { if (!paused) stopAuto(); });
    root.addEventListener('focusout', function () { if (!paused) startAuto(); });

    show(0);
    startAuto();
})();

(function () {
    var ROW4_VARIANT = 'squares-8';
    var ROW4_VISIBLE_KEY = 'yg-home-row4-visible-v1';
    var ROW4_V8_VISIBLE_KEY = 'yg-home-row4-squares-8-visible-v1';
    var FAV_VISIBLE_KEY = 'yg-home-favourites-visible-v1';
    var root = document.querySelector('[data-row4-cats]');
    if (!root) return;

    var viewport = root.querySelector('[data-row4-viewport]');
    var track = root.querySelector('[data-row4-track]');
    var prevBtn = root.querySelector('[data-row4-prev]');
    var nextBtn = root.querySelector('[data-row4-next]');
    var sliderWrap = root.querySelector('[data-row4-slider-wrap]');
    var pagerPrev = root.querySelector('[data-row4-pager-prev]');
    var pagerNext = root.querySelector('[data-row4-pager-next]');
    var pagerDots = root.querySelector('[data-row4-pager-dots]');
    var duskTitle = root.querySelector('[data-row4-dusk-title]');
    var duskPrev = root.querySelector('[data-row4-dusk-prev]');
    var duskNext = root.querySelector('[data-row4-dusk-next]');
    var offset = 0;

    function currentVariant() {
        return ROW4_VARIANT;
    }

    function isCarouselVariant(variant) {
        return variant === 'carousel' || variant === '4' || variant === '5' || variant === '5-round' || variant === 'squares-full' || variant === 'squares-8' || variant === 'wide' || variant === 'circles' || variant === 'squares';
    }

    function usesSlider(variant) {
        return variant === '4' || variant === '5' || variant === '5-round' || variant === 'squares-full' || variant === 'squares-8' || variant === 'carousel' || variant === 'wide' || variant === 'circles' || variant === 'squares';
    }

    function usesDuskLook(variant) {
        return variant === 'wide' || variant === 'carousel';
    }

    function usesPillLook(variant) {
        return variant === '4' || variant === '5';
    }

    function usesIconStripLook(variant) {
        return variant === 'circles' || variant === 'squares' || variant === 'squares-full' || variant === 'squares-8' || variant === '5-round';
    }

    function usesCirclesLook(variant) {
        return variant === 'circles' || variant === '5-round';
    }

    function usesSquaresLook(variant) {
        return variant === 'squares' || variant === 'squares-full' || variant === 'squares-8';
    }

    function usesSquaresFullLook(variant) {
        return variant === 'squares-full' || variant === 'squares-8';
    }

    function usesDuskArrows(variant) {
        return false;
    }

    function step() {
        var tile = root.querySelector('[data-row4-tile]:not([hidden])');
        if (!tile) tile = root.querySelector('[data-row4-tile]');
        if (!tile || !viewport) return 240;
        var gap = 14;
        if (track) {
            var styles = window.getComputedStyle(track);
            gap = parseFloat(styles.columnGap || styles.gap) || 14;
        }
        return tile.getBoundingClientRect().width + gap;
    }

    function pageStride() {
        var s = step();
        if (!viewport || s <= 0) return s;
        // Advance N full cards: N × (tile + gap). Using viewport width (N×tile + (N−1)×gap)
        // undershoots by one gap and leaves a sliver of the previous card.
        var steps = Math.max(1, Math.round(viewport.clientWidth / s));
        return s * steps;
    }

    function maxOffset() {
        if (!track || !viewport) return 0;
        var max = Math.max(0, track.scrollWidth - viewport.clientWidth);
        var s = step();
        if (s <= 0) return max;
        // Snap max to a whole number of card steps so last page aligns
        return Math.max(0, Math.round(max / s) * s);
    }

    function pageCount() {
        var max = maxOffset();
        var stride = pageStride();
        if (max <= 0 || stride <= 0) return 1;
        return Math.floor(max / stride + 0.001) + 1;
    }

    function currentPage() {
        var stride = pageStride();
        var pages = pageCount();
        if (stride <= 0 || pages <= 1) return 0;
        return Math.min(pages - 1, Math.round(offset / stride));
    }

    function snapToNearest() {
        // Icon strip + pill carousels page by visible columns (2×2 on mobile, 7/4/5-up on desktop)
        if (usesSlider(currentVariant())) {
            var stride = pageStride();
            if (stride <= 0) return;
            offset = Math.round(offset / stride) * stride;
            offset = Math.min(maxOffset(), Math.max(0, offset));
            return;
        }
        var s2 = step();
        if (s2 <= 0) return;
        offset = Math.round(offset / s2) * s2;
        offset = Math.min(maxOffset(), Math.max(0, offset));
    }

    function syncPager() {
        if (!pagerDots) return;
        var pages = pageCount();
        var active = currentPage();
        var max = maxOffset();

        if (pagerPrev) pagerPrev.disabled = max <= 0;
        if (pagerNext) pagerNext.disabled = max <= 0;

        while (pagerDots.children.length > pages) {
            pagerDots.removeChild(pagerDots.lastChild);
        }
        while (pagerDots.children.length < pages) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'yg-pager__dot';
            btn.setAttribute('role', 'tab');
            btn.addEventListener('click', function (index) {
                return function () {
                    offset = Math.min(maxOffset(), Math.max(0, index * pageStride()));
                    applyOffset(true);
                };
            }(pagerDots.children.length));
            pagerDots.appendChild(btn);
        }

        Array.prototype.forEach.call(pagerDots.children, function (dot, i) {
            var isActive = i === active;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
            dot.setAttribute('aria-label', 'Page ' + (i + 1) + ' of ' + pages);
        });
    }

    function applyOffset(animate) {
        if (!track) return;
        track.style.transition = animate === false
            ? 'none'
            : 'transform 0.9s cubic-bezier(0.33, 0.1, 0.25, 1)';
        track.style.transform = 'translate3d(' + (-offset) + 'px, 0, 0)';
        updateCarouselNav();
        syncPager();
    }

    function arrowMode() {
        return document.body.getAttribute('data-carousel-arrows') || 'bottom';
    }

    function usesSideArrows() {
        var mode = arrowMode();
        return mode === 'sides' || mode === 'sides-only';
    }

    function positionSideNav() {
        if (!prevBtn || !nextBtn || !viewport || !root) return;
        if (!usesSideArrows() || root.hidden) {
            prevBtn.style.top = '';
            nextBtn.style.top = '';
            return;
        }
        var rootRect = root.getBoundingClientRect();
        var vpRect = viewport.getBoundingClientRect();
        var mid = (vpRect.top - rootRect.top) + (vpRect.height / 2);
        prevBtn.style.top = mid + 'px';
        nextBtn.style.top = mid + 'px';
    }

    function updateCarouselNav() {
        var variant = currentVariant();
        var isCarousel = isCarouselVariant(variant);
        var isIconStrip = usesIconStripLook(variant);
        var showSlider = usesSlider(variant) && isCarousel;
        var showDusk = usesDuskLook(variant) && isCarousel;
        var showDuskArrows = usesDuskArrows(variant) && isCarousel;
        var showSides = usesSideArrows() && isCarousel && showSlider;
        var hidePager = arrowMode() === 'sides-only';
        // Icon strips on small screens: bottom pager only (side arrows crowd the strip)
        if (isIconStrip && window.matchMedia && window.matchMedia('(max-width: 960px)').matches) {
            showSides = false;
            hidePager = false;
        }

        if (prevBtn) prevBtn.hidden = !isCarousel || ((showSlider || showDusk) && !showSides);
        if (nextBtn) nextBtn.hidden = !isCarousel || ((showSlider || showDusk) && !showSides);
        if (sliderWrap) sliderWrap.hidden = !showSlider || hidePager;
        if (duskTitle) duskTitle.hidden = !isCarousel;
        if (duskPrev) duskPrev.hidden = !showDuskArrows;
        if (duskNext) duskNext.hidden = !showDuskArrows;
        root.classList.toggle('yg-home-row4--dusk-arrows', showDuskArrows);
        root.classList.toggle('yg-home-row4--side-arrows', showSides);

        if (!isCarousel) {
            offset = 0;
            if (track) {
                track.style.transition = 'none';
                track.style.transform = '';
            }
            return;
        }

        var max = maxOffset();
        if (prevBtn && nextBtn && (!showSlider || showSides) && !showDusk) {
            prevBtn.disabled = max <= 0;
            nextBtn.disabled = max <= 0;
            prevBtn.setAttribute('aria-disabled', offset <= 0 ? 'true' : 'false');
        }
        if (duskPrev) duskPrev.disabled = max <= 0;
        if (duskNext) duskNext.disabled = max <= 0;
        root.classList.toggle('is-at-start', offset <= 0);
        root.classList.toggle('is-at-end', offset >= max - 1);
        positionSideNav();
    }

    function setVariant(variant) {
        variant = ROW4_VARIANT;

        root.setAttribute('data-row4-variant', variant);
        root.classList.remove('yg-home-row4--four', 'yg-home-row4--five', 'yg-home-row4--eight', 'yg-home-row4--pill', 'yg-home-row4--wide');
        root.classList.add('yg-home-row4--carousel', 'yg-home-row4--slider', 'yg-home-row4--circles', 'yg-home-row4--squares', 'yg-home-row4--squares-full', 'yg-home-row4--icon-strip');
        document.body.classList.add('yg-home-variant-circles');

        var below = root.closest('.yg-home-below');
        if (below) below.classList.remove('is-wide-band');
        document.body.classList.remove('yg-home-wide-band');

        root.querySelectorAll('[data-row4-tile]').forEach(function (tile) {
            tile.hidden = false;
        });

        offset = 0;
        applyOffset(false);
        window.requestAnimationFrame(function () {
            updateCarouselNav();
            syncPager();
            window.dispatchEvent(new Event('resize'));
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            if (usesSideArrows() && usesSlider(currentVariant()) && !usesIconStripLook(currentVariant())) {
                nudgePage(-1);
                return;
            }
            var max = maxOffset();
            if (max <= 0) return;
            if (offset <= 0) {
                offset = max;
                applyOffset(true);
                return;
            }
            offset = Math.max(0, offset - step());
            applyOffset(true);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            if (usesSideArrows() && usesSlider(currentVariant()) && !usesIconStripLook(currentVariant())) {
                nudgePage(1);
                return;
            }
            var max = maxOffset();
            if (max <= 0) return;
            if (offset >= max - 1) {
                offset = 0;
                applyOffset(true);
                return;
            }
            offset = Math.min(max, offset + step());
            applyOffset(true);
        });
    }

    function duskStep(dir) {
        var max = maxOffset();
        if (max <= 0) return;
        if (dir < 0) {
            if (offset <= 0) offset = max;
            else offset = Math.max(0, offset - step());
        } else if (offset >= max - 1) {
            offset = 0;
        } else {
            offset = Math.min(max, offset + step());
        }
        applyOffset(true);
    }

    if (duskPrev) duskPrev.addEventListener('click', function () { duskStep(-1); });
    if (duskNext) duskNext.addEventListener('click', function () { duskStep(1); });

    function nudgePage(dir) {
        var max = maxOffset();
        var pages = pageCount();
        if (max <= 0 || pages <= 1) return;
        var next = currentPage() + dir;
        if (next < 0) next = pages - 1;
        if (next >= pages) next = 0;
        offset = Math.min(max, Math.max(0, next * pageStride()));
        applyOffset(true);
    }

    if (pagerPrev) pagerPrev.addEventListener('click', function () { nudgePage(-1); });
    if (pagerNext) pagerNext.addEventListener('click', function () { nudgePage(1); });

    window.addEventListener('resize', function () {
        var variant = currentVariant();
        if (!isCarouselVariant(variant)) return;
        snapToNearest();
        offset = Math.min(offset, maxOffset());
        applyOffset(false);
        positionSideNav();
    });

    var FAV_WIDTH_KEY = 'yg-home-favourites-width-v1';
    var FAV_BG_KEY = 'yg-home-favourites-bg-v1';
    var favWidthOptions = Array.prototype.slice.call(document.querySelectorAll('[data-favourites-width-option]'));
    var favBgOption = document.querySelector('[data-favourites-bg-option]');

    document.body.setAttribute('data-carousel-arrows', 'bottom');

    function setFavouritesBg(enabled) {
        if (enabled) {
            document.body.setAttribute('data-favourites-bg', 'stone');
        } else {
            document.body.removeAttribute('data-favourites-bg');
        }
        if (favBgOption) favBgOption.checked = !!enabled;
        try {
            localStorage.setItem(FAV_BG_KEY, enabled ? 'stone' : '');
        } catch (err) { /* ignore */ }
    }

    if (favBgOption) {
        favBgOption.addEventListener('change', function () {
            setFavouritesBg(favBgOption.checked);
        });
    }

    var savedFavBg = '';
    try {
        savedFavBg = localStorage.getItem(FAV_BG_KEY) || '';
    } catch (err) { /* ignore */ }
    setFavouritesBg(savedFavBg === 'stone');

    function setFavouritesWidth(value) {
        var allowed = { full: true, contained: true };
        if (!allowed[value]) value = 'contained';
        document.body.setAttribute('data-favourites-width', value);
        favWidthOptions.forEach(function (input) {
            input.checked = input.value === value;
        });
        try {
            localStorage.setItem(FAV_WIDTH_KEY, value);
        } catch (err) { /* ignore */ }
        window.dispatchEvent(new Event('resize'));
    }

    favWidthOptions.forEach(function (input) {
        input.addEventListener('change', function () {
            if (input.checked) setFavouritesWidth(input.value);
        });
    });

    var savedFavWidth = 'contained';
    try {
        savedFavWidth = localStorage.getItem(FAV_WIDTH_KEY) || 'contained';
    } catch (err) { /* ignore */ }
    if (savedFavWidth !== 'full' && savedFavWidth !== 'contained') savedFavWidth = 'contained';
    setFavouritesWidth(savedFavWidth);

    var row4VisibleInput = document.querySelector('[data-row4-visible-input]');
    var favVisibleInput = document.querySelector('[data-favourites-visible-input]');
    var favCarousel = document.querySelector('[data-favourites-carousel]');
    var row4VisibleCount = 8;
    var favVisibleCount = 6;

    function isDesktopCarousel() {
        return !window.matchMedia || !window.matchMedia('(max-width: 960px)').matches;
    }

    function cardWidthExpr(count, gap) {
        return 'calc((100cqw - ' + ((count - 1) * gap) + 'px) / ' + count + ' - 1px)';
    }

    function parseVisibleInput(value, min, max) {
        if (value === '' || value == null) return null;
        var n = parseInt(String(value).trim(), 10);
        if (isNaN(n) || n < min || n > max) return null;
        return n;
    }

    function clampCount(value, fallback, min, max) {
        var parsed = parseVisibleInput(value, min, max);
        return parsed == null ? fallback : parsed;
    }

    function applyRow4CardWidths(count) {
        row4VisibleCount = count;
        document.documentElement.style.setProperty('--yg-row4-squares-8-visible', String(count));
        if (viewport) viewport.style.setProperty('--yg-row4-squares-8-visible', String(count));
        var width = isDesktopCarousel() ? cardWidthExpr(count, 10) : '';
        root.querySelectorAll('[data-row4-tile]').forEach(function (tile) {
            tile.style.flexBasis = width;
            tile.style.width = width;
            tile.style.maxWidth = width;
        });
        offset = Math.min(offset, maxOffset());
        applyOffset(false);
        syncPager();
    }

    function favouritesGap() {
        return document.body.getAttribute('data-favourites-width') === 'full' ? 10 : 14;
    }

    function applyFavouritesCardWidths(count) {
        favVisibleCount = count;
        document.documentElement.style.setProperty('--yg-fav-visible', String(count));
        var favViewport = favCarousel && favCarousel.querySelector('[data-fav-viewport]');
        if (favViewport) favViewport.style.setProperty('--yg-fav-visible', String(count));
        if (!favCarousel) return;
        var width = isDesktopCarousel() ? cardWidthExpr(count, favouritesGap()) : '';
        favCarousel.querySelectorAll('.yg-home-favourites__card').forEach(function (card) {
            card.style.flexBasis = width;
            card.style.width = width;
            card.style.maxWidth = width;
        });
    }

    function setRow4Visible(value, syncInput) {
        var count = parseVisibleInput(value, 4, 10);
        if (count == null) return;
        applyRow4CardWidths(count);
        if (syncInput !== false && row4VisibleInput) row4VisibleInput.value = count;
        try {
            localStorage.setItem(ROW4_VISIBLE_KEY, String(count));
        } catch (err) { /* ignore */ }
        window.dispatchEvent(new Event('resize'));
    }

    function setFavouritesVisible(value, syncInput) {
        var count = parseVisibleInput(value, 4, 10);
        if (count == null) return;
        applyFavouritesCardWidths(count);
        if (syncInput !== false && favVisibleInput) favVisibleInput.value = count;
        try {
            localStorage.setItem(FAV_VISIBLE_KEY, String(count));
        } catch (err) { /* ignore */ }
        window.dispatchEvent(new Event('resize'));
    }

    function bindVisibleInput(input, applyFn, normalizeFn) {
        if (!input) return;
        input.addEventListener('input', function () {
            applyFn(input.value, false);
        });
        input.addEventListener('change', function () {
            normalizeFn(input.value);
        });
    }

    bindVisibleInput(row4VisibleInput, setRow4Visible, function (value) {
        setRow4Visible(clampCount(value, 8, 4, 10));
    });

    bindVisibleInput(favVisibleInput, setFavouritesVisible, function (value) {
        setFavouritesVisible(clampCount(value, 6, 4, 10));
    });

    var savedRow4Visible = '8';
    try {
        savedRow4Visible = localStorage.getItem(ROW4_VISIBLE_KEY) || localStorage.getItem(ROW4_V8_VISIBLE_KEY) || '8';
    } catch (err) { /* ignore */ }
    setRow4Visible(clampCount(savedRow4Visible, 8, 4, 10));

    var savedFavVisible = '6';
    try {
        savedFavVisible = localStorage.getItem(FAV_VISIBLE_KEY) || '6';
    } catch (err) { /* ignore */ }
    setFavouritesVisible(clampCount(savedFavVisible, 6, 4, 10));

    var origSetFavouritesWidth = setFavouritesWidth;
    setFavouritesWidth = function (value) {
        origSetFavouritesWidth(value);
        applyFavouritesCardWidths(favVisibleCount);
    };

    window.addEventListener('resize', function () {
        applyRow4CardWidths(row4VisibleCount);
        applyFavouritesCardWidths(favVisibleCount);
    });

    setVariant(ROW4_VARIANT);
})();

(function () {
    // Section headlines toggle hidden from tools — keep centered default.
    document.body.setAttribute('data-home-headline-align', 'center');
    try {
        localStorage.setItem('yg-home-headline-align-v4', 'center');
    } catch (err) { /* ignore */ }
})();

(function () {
    // Header promo hidden from tools for now — keep slot off.
    var root = document.querySelector('[data-header-promo]');
    if (!root) return;
    root.hidden = true;
    var offer = root.querySelector('[data-header-promo-offer]');
    if (offer) offer.hidden = true;
    document.body.setAttribute('data-header-promo', 'off');
    try {
        localStorage.setItem('yg-home-header-promo-v3', 'off');
    } catch (err) { /* ignore */ }
})();

(function () {
    var root = document.querySelector('[data-favourites-carousel]');
    if (!root) return;

    var viewport = root.querySelector('[data-fav-viewport]');
    var track = root.querySelector('[data-fav-track]');
    var offset = 0;
    var timer = null;
    var INTERVAL = 5200;
    var EASE = 'transform 0.9s cubic-bezier(0.33, 0.1, 0.25, 1)';
    var animating = false;

    function stepSize() {
        var card = root.querySelector('.yg-home-favourites__card');
        if (!card || !viewport) return 240;
        var styles = window.getComputedStyle(track);
        var gap = parseFloat(styles.columnGap || styles.gap) || 14;
        return card.getBoundingClientRect().width + gap;
    }

    function maxOffset() {
        if (!track || !viewport) return 0;
        var max = Math.max(0, track.scrollWidth - viewport.clientWidth);
        var step = stepSize();
        if (step <= 0) return max;
        return Math.round(max / step) * step;
    }

    function snapToNearest() {
        var step = stepSize();
        if (step <= 0) return;
        var max = maxOffset();
        offset = Math.round(offset / step) * step;
        offset = Math.min(max, Math.max(0, offset));
    }

    function apply(animate) {
        if (!track) return;
        track.style.transition = animate === false ? 'none' : EASE;
        track.style.transform = 'translate3d(' + (-offset) + 'px, 0, 0)';
    }

    function stopAuto() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    function startAuto() {
        stopAuto();
        if (maxOffset() <= 1) return;
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        timer = setInterval(function () {
            if (animating || document.hidden) return;
            advance(true);
        }, INTERVAL);
    }

    function softResetToStart() {
        animating = true;
        offset = 0;
        apply(false);
        window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () {
                animating = false;
                apply(true);
            });
        });
    }

    function advance(fromAuto) {
        var max = maxOffset();
        var step = stepSize();
        if (max <= 1) return;

        var next = offset + step;
        if (next >= max - 1) {
            if (fromAuto) {
                offset = max;
                apply(true);
                animating = true;
                window.setTimeout(softResetToStart, 920);
                return;
            }
            offset = 0;
        } else {
            offset = next;
        }
        apply(true);
    }

    var startX = 0;
    var startOffset = 0;
    var dragging = false;

    if (viewport) {
        viewport.addEventListener('pointerdown', function (e) {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            dragging = true;
            animating = false;
            stopAuto();
            startX = e.clientX;
            startOffset = offset;
            track.style.transition = 'none';
            try { viewport.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        });
        viewport.addEventListener('pointermove', function (e) {
            if (!dragging) return;
            offset = Math.min(maxOffset(), Math.max(0, startOffset - (e.clientX - startX)));
            apply(false);
        });
        function endDrag() {
            if (!dragging) return;
            dragging = false;
            snapToNearest();
            apply(true);
            startAuto();
        }
        viewport.addEventListener('pointerup', endDrag);
        viewport.addEventListener('pointercancel', endDrag);
    }

    root.addEventListener('mouseenter', stopAuto);
    root.addEventListener('mouseleave', startAuto);
    root.addEventListener('focusin', stopAuto);
    root.addEventListener('focusout', function (e) {
        if (!root.contains(e.relatedTarget)) startAuto();
    });

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) stopAuto();
        else startAuto();
    });

    apply(false);
    startAuto();

    window.addEventListener('resize', function () {
        snapToNearest();
        offset = Math.min(offset, maxOffset());
        apply(false);
        startAuto();
    });
})();
</script>
@endpush
