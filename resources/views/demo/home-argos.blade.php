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
    ])

    <main class="demo-home-argos__main">
        {{-- Category icon strip --}}
        <section class="yg-cat-strip" aria-label="Shop by category" data-cat-strip>
            <button type="button" class="yg-cat-strip__nav yg-cat-strip__nav--prev" data-cat-prev aria-label="Previous categories" hidden>
                <span class="yg-cat-strip__nav-arrow yg-cat-strip__nav-arrow--prev" aria-hidden="true"></span>
            </button>
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
            <button type="button" class="yg-cat-strip__nav yg-cat-strip__nav--next" data-cat-next aria-label="Show more categories">
                <span class="yg-cat-strip__nav-arrow" aria-hidden="true"></span>
            </button>
        </section>

        {{-- Hero carousel: banner + CTAs change together (Argos pattern)
             Previous lifestyle split banner: images/home-preview/hero-garden-original-backup.jpg --}}
        <section class="yg-hero-argos" aria-roledescription="carousel" aria-label="Featured offers" data-hero-carousel>
            <div class="yg-hero-argos__slides">
                @foreach ($hero_slides as $index => $slide)
                    <div
                        class="yg-hero-argos__slide{{ $index === 0 ? ' is-active' : '' }}"
                        data-hero-slide
                        role="group"
                        aria-roledescription="slide"
                        aria-label="{{ $index + 1 }} of {{ count($hero_slides) }}: {{ $slide['alt'] }}"
                        @if ($index !== 0) hidden @endif
                    >
                        <a
                            href="{{ $slide['url'] }}"
                            class="yg-hero-argos__banner yg-hero-argos__banner--full"
                            target="_blank"
                            rel="noopener"
                        >
                            <img
                                src="{{ asset($slide['image']) }}?v={{ filemtime(public_path($slide['image'])) }}"
                                alt="{{ $slide['alt'] }}"
                                width="1920"
                                height="600"
                                @if ($index !== 0) loading="lazy" @endif
                            >
                        </a>
                        <div class="yg-hero-argos__ctas yg-hero-argos__ctas--{{ $slide['cta_theme'] ?? 'rose' }}" role="navigation" aria-label="{{ $slide['alt'] }} shopping shortcuts">
                            @foreach ($slide['ctas'] as $cta)
                                <a
                                    href="{{ $cta['url'] }}"
                                    class="yg-hero-argos__cta"
                                    target="_blank"
                                    rel="noopener"
                                >{{ $cta['label'] }}</a>
                            @endforeach
                        </div>
                    </div>
                @endforeach
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

        <div class="yg-home-fold-mark" aria-hidden="true">
            <span class="yg-home-fold-mark__line"></span>
            <span class="yg-home-fold-mark__label">Hero section only · rest of page below</span>
            <span class="yg-home-fold-mark__line"></span>
        </div>

        {{-- Below the fold — live yougarden.com homepage modules --}}
        <div class="yg-home-below">
            <section class="yg-home-row4" aria-label="Shop popular categories">
                @foreach ($row4 as $tile)
                    <a href="{{ $tile['url'] }}" class="yg-home-tile" target="_blank" rel="noopener">
                        <img src="{{ asset($tile['image']) }}" alt="" width="600" height="600" loading="lazy">
                        <span class="yg-home-tile__cta">{{ $tile['label'] }} <span aria-hidden="true">›</span></span>
                    </a>
                @endforeach
            </section>

            <section class="yg-home-philosophy" aria-label="Our philosophy">
                <img
                    class="yg-home-strip"
                    src="{{ asset($philosophy_banner) }}"
                    alt=""
                    width="1300"
                    height="200"
                    loading="lazy"
                >
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
                    <span class="yg-home-tile__cta">{{ $featured_grid['featured']['label'] }} <span aria-hidden="true">›</span></span>
                </a>
                <div class="yg-home-featured__grid">
                    @foreach ($featured_grid['tiles'] as $tile)
                        <a href="{{ $tile['url'] }}" class="yg-home-tile" target="_blank" rel="noopener">
                            <img src="{{ asset($tile['image']) }}" alt="" width="450" height="450" loading="lazy">
                            <span class="yg-home-tile__cta">{{ $tile['label'] }} <span aria-hidden="true">›</span></span>
                        </a>
                    @endforeach
                </div>
            </section>

            <section class="yg-home-row4" aria-label="More categories">
                @foreach ($row4_secondary as $tile)
                    <a href="{{ $tile['url'] }}" class="yg-home-tile" target="_blank" rel="noopener">
                        <img src="{{ asset($tile['image']) }}" alt="" width="600" height="600" loading="lazy">
                        <span class="yg-home-tile__cta">{{ $tile['label'] }} <span aria-hidden="true">›</span></span>
                    </a>
                @endforeach
            </section>

            <a
                class="yg-home-banner"
                href="{{ $sale_banner['url'] }}"
                target="_blank"
                rel="noopener"
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

@include('demo.partials.home-argos-prototype-tools')
@endsection

@push('scripts')
<script src="{{ asset('js/demo-prototype-stack.js') }}?v={{ filemtime(public_path('js/demo-prototype-stack.js')) }}" defer></script>
<script>
(function () {
    var TV_KEY = 'yg_argos_tv_live_placement';

    function applyTvPlacement(mode) {
        document.querySelectorAll('[data-tv-live-placement]').forEach(function (el) {
            var match = el.getAttribute('data-tv-live-placement') === mode;
            if (match) {
                el.removeAttribute('hidden');
                el.setAttribute('aria-hidden', 'false');
            } else {
                el.setAttribute('hidden', '');
                el.setAttribute('aria-hidden', 'true');
            }
        });
        document.querySelectorAll('[data-tv-live-option]').forEach(function (input) {
            input.checked = input.value === mode;
        });
        try {
            localStorage.setItem(TV_KEY, mode);
        } catch (e) { /* ignore */ }
    }

    function bootTvPlacement() {
        var saved = 'menu';
        try {
            saved = localStorage.getItem(TV_KEY) || 'menu';
        } catch (e) { /* ignore */ }
        if (saved !== 'header' && saved !== 'float' && saved !== 'menu') {
            saved = 'menu';
        }
        applyTvPlacement(saved);
        document.querySelectorAll('[data-tv-live-option]').forEach(function (input) {
            input.addEventListener('change', function () {
                if (input.checked) applyTvPlacement(input.value);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootTvPlacement);
    } else {
        bootTvPlacement();
    }
})();
</script>
<script>
(function () {
    var strip = document.querySelector('[data-cat-strip]');
    var track = strip && strip.querySelector('[data-cat-track]');
    var next = strip && strip.querySelector('[data-cat-next]');
    var prev = strip && strip.querySelector('[data-cat-prev]');

    if (strip && track && next && prev) {
        function step() {
            // Scroll by ~3–4 tiles
            var item = track.querySelector('.yg-cat-strip__item');
            var width = item ? item.getBoundingClientRect().width + 14 : 240;
            return Math.max(width * 3, Math.floor(track.clientWidth * 0.7));
        }

        function updateNav() {
            var max = track.scrollWidth - track.clientWidth;
            var hasOverflow = max > 4;
            var atStart = track.scrollLeft <= 4;
            var atEnd = track.scrollLeft >= max - 4;

            strip.classList.toggle('is-at-start', atStart || !hasOverflow);
            strip.classList.toggle('is-at-end', atEnd || !hasOverflow);

            if (!hasOverflow) {
                prev.hidden = true;
                next.hidden = true;
                return;
            }

            prev.hidden = atStart;
            next.hidden = atEnd;
            prev.disabled = atStart;
            next.disabled = atEnd;
        }

        next.addEventListener('click', function () {
            track.scrollBy({ left: step(), behavior: 'smooth' });
        });
        prev.addEventListener('click', function () {
            track.scrollBy({ left: -step(), behavior: 'smooth' });
        });
        track.addEventListener('scroll', updateNav, { passive: true });
        window.addEventListener('resize', updateNav);
        updateNav();
    }

    // Shop dropdown (Argos-style)
    var shopItem = document.querySelector('[data-shop-dropdown]');
    var shopTrigger = document.getElementById('yg-shop-trigger');
    var shopPanel = document.getElementById('yg-shop-panel');
    if (shopItem && shopTrigger && shopPanel) {
        function closeShop() {
            shopItem.classList.remove('is-open');
            shopTrigger.setAttribute('aria-expanded', 'false');
            shopPanel.hidden = true;
        }
        function openShop() {
            shopItem.classList.add('is-open');
            shopTrigger.setAttribute('aria-expanded', 'true');
            shopPanel.hidden = false;
        }
        shopTrigger.addEventListener('click', function (e) {
            e.stopPropagation();
            if (shopPanel.hidden) openShop();
            else closeShop();
        });
        shopItem.addEventListener('mouseenter', openShop);
        shopItem.addEventListener('mouseleave', closeShop);
        document.addEventListener('click', function (e) {
            if (!shopItem.contains(e.target)) closeShop();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeShop();
        });
    }

    var root = document.querySelector('[data-hero-carousel]');
    if (!root) return;

    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    var prevBtn = root.querySelector('[data-hero-prev]');
    var nextBtn = root.querySelector('[data-hero-next]');
    var pauseBtn = root.querySelector('[data-hero-pause]');
    var pauseLabel = root.querySelector('[data-hero-pause-label]');
    var index = 0;
    var paused = false;
    var timer = null;
    var HERO_INTERVAL_KEY = 'yg_argos_hero_interval';
    var INTERVAL = 5000;

    function readHeroInterval() {
        try {
            var saved = parseInt(localStorage.getItem(HERO_INTERVAL_KEY) || '5000', 10);
            if ([4000, 5000, 6000, 8000, 10000].indexOf(saved) !== -1) return saved;
        } catch (e) { /* ignore */ }
        return 5000;
    }

    function applyHeroInterval(ms) {
        INTERVAL = ms;
        document.querySelectorAll('[data-hero-interval-option]').forEach(function (input) {
            input.checked = parseInt(input.value, 10) === ms;
        });
        try {
            localStorage.setItem(HERO_INTERVAL_KEY, String(ms));
        } catch (e) { /* ignore */ }
        if (!paused) startAuto();
    }

    INTERVAL = readHeroInterval();
    document.querySelectorAll('[data-hero-interval-option]').forEach(function (input) {
        input.checked = parseInt(input.value, 10) === INTERVAL;
        input.addEventListener('change', function () {
            if (input.checked) applyHeroInterval(parseInt(input.value, 10) || 5000);
        });
    });

    function show(i) {
        index = (i + slides.length) % slides.length;
        slides.forEach(function (slide, n) {
            var on = n === index;
            slide.classList.toggle('is-active', on);
            if (on) {
                slide.removeAttribute('hidden');
            } else {
                slide.setAttribute('hidden', '');
            }
        });
        dots.forEach(function (dot, n) {
            var on = n === index;
            dot.classList.toggle('is-active', on);
            dot.setAttribute('aria-selected', on ? 'true' : 'false');
        });
    }

    function stopAuto() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    function startAuto() {
        stopAuto();
        if (paused) return;
        timer = setInterval(function () {
            show(index + 1);
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

    root.addEventListener('mouseenter', function () { if (!paused) stopAuto(); });
    root.addEventListener('mouseleave', function () { if (!paused) startAuto(); });
    root.addEventListener('focusin', function () { if (!paused) stopAuto(); });
    root.addEventListener('focusout', function () { if (!paused) startAuto(); });

    show(0);
    startAuto();
})();
</script>
@endpush
