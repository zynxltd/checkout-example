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

    <div class="yg-argos-page-overlay" data-nav-page-overlay hidden aria-hidden="true"></div>

    <main class="demo-home-argos__main">
        <div class="yg-home-above" data-above-layout="cats-first">
            {{-- Category icon strip --}}
            <section class="yg-cat-strip" aria-label="Shop by category" data-cat-strip data-above-block="cats">
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
            <section class="yg-hero-argos" aria-roledescription="carousel" aria-label="Featured offers" data-hero-carousel data-above-block="hero">
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
        </div>

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
    var ABOVE_KEY = 'yg_argos_above_layout';

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

    function applyAboveLayout(mode) {
        if (mode !== 'hero-first' && mode !== 'cats-first') {
            mode = 'cats-first';
        }
        var wrap = document.querySelector('[data-above-layout]');
        if (wrap) {
            wrap.setAttribute('data-above-layout', mode);
        }
        document.querySelectorAll('[data-above-layout-option]').forEach(function (input) {
            input.checked = input.value === mode;
        });
        try {
            localStorage.setItem(ABOVE_KEY, mode);
        } catch (e) { /* ignore */ }
    }

    function bootPrototypeOptions() {
        var tvSaved = 'menu';
        var aboveSaved = 'cats-first';
        try {
            tvSaved = localStorage.getItem(TV_KEY) || 'menu';
            aboveSaved = localStorage.getItem(ABOVE_KEY) || 'cats-first';
        } catch (e) { /* ignore */ }
        if (tvSaved !== 'header' && tvSaved !== 'float' && tvSaved !== 'menu') {
            tvSaved = 'menu';
        }
        if (aboveSaved !== 'hero-first' && aboveSaved !== 'cats-first') {
            aboveSaved = 'cats-first';
        }
        applyTvPlacement(tvSaved);
        applyAboveLayout(aboveSaved);

        document.querySelectorAll('[data-tv-live-option]').forEach(function (input) {
            input.addEventListener('change', function () {
                if (input.checked) applyTvPlacement(input.value);
            });
        });
        document.querySelectorAll('[data-above-layout-option]').forEach(function (input) {
            input.addEventListener('change', function () {
                if (input.checked) applyAboveLayout(input.value);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootPrototypeOptions);
    } else {
        bootPrototypeOptions();
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

    // Header nav dropdowns (Shop + Trending)
    var navDropdowns = Array.prototype.slice.call(document.querySelectorAll('[data-nav-dropdown]'));
    var pageOverlay = document.querySelector('[data-nav-page-overlay]');

    function syncNavPageOverlay() {
        if (!pageOverlay) return;
        var open = navDropdowns.some(function (item) {
            return item.classList.contains('is-open');
        });
        var top = 0;
        var usp = document.getElementById('usp-wrapper');
        var header = document.querySelector('.demo-header--argos');
        if (usp) {
            top = usp.getBoundingClientRect().bottom;
        } else if (header) {
            top = header.getBoundingClientRect().bottom;
        }
        pageOverlay.style.top = Math.max(0, Math.round(top)) + 'px';
        pageOverlay.classList.toggle('is-active', open);
        pageOverlay.hidden = !open;
        pageOverlay.setAttribute('aria-hidden', open ? 'false' : 'true');
        document.body.classList.toggle('yg-nav-dropdown-open', open);
    }

    function closeAllNavDropdowns(except) {
        navDropdowns.forEach(function (item) {
            if (except && item === except) return;
            var trigger = item.querySelector('.yg-argos-nav__link--btn');
            var panel = item.querySelector('.yg-argos-nav__panel');
            if (!trigger || !panel) return;
            item.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
            panel.hidden = true;
        });
        syncNavPageOverlay();
    }

    navDropdowns.forEach(function (item) {
        var trigger = item.querySelector('.yg-argos-nav__link--btn');
        var panel = item.querySelector('.yg-argos-nav__panel');
        if (!trigger || !panel) return;

        var closeTimer = null;

        function closeDropdown() {
            clearTimeout(closeTimer);
            closeTimer = null;
            item.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
            panel.hidden = true;
            syncNavPageOverlay();
        }

        function openDropdown() {
            clearTimeout(closeTimer);
            closeTimer = null;
            closeAllNavDropdowns(item);
            item.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
            panel.hidden = false;
            syncNavPageOverlay();
        }

        function scheduleClose() {
            clearTimeout(closeTimer);
            closeTimer = setTimeout(closeDropdown, 160);
        }

        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            if (panel.hidden) openDropdown();
            else closeDropdown();
        });
        item.addEventListener('mouseenter', openDropdown);
        item.addEventListener('mouseleave', scheduleClose);
        item.addEventListener('focusin', openDropdown);
        item.addEventListener('focusout', function (e) {
            if (!item.contains(e.relatedTarget)) scheduleClose();
        });
    });

    if (pageOverlay) {
        pageOverlay.addEventListener('click', function () {
            closeAllNavDropdowns();
        });
    }
    window.addEventListener('resize', function () {
        if (document.body.classList.contains('yg-nav-dropdown-open')) syncNavPageOverlay();
    });
    window.addEventListener('scroll', function () {
        if (document.body.classList.contains('yg-nav-dropdown-open')) syncNavPageOverlay();
    }, { passive: true });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('[data-nav-dropdown]')) closeAllNavDropdowns();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeAllNavDropdowns();
    });

    // Shop mega: department tabs + category → subcategory flyout
    var shopPanel = document.getElementById('yg-shop-panel');
    if (shopPanel) {
        var mega = shopPanel.querySelector('[data-shop-mega]');
        if (mega) {
            function activateDept(index) {
                mega.querySelectorAll('[data-mega-dept]').forEach(function (btn) {
                    var on = btn.getAttribute('data-mega-dept') === String(index);
                    btn.classList.toggle('is-active', on);
                    btn.setAttribute('aria-selected', on ? 'true' : 'false');
                });
                mega.querySelectorAll('[data-mega-dept-panel]').forEach(function (panel) {
                    var on = panel.getAttribute('data-mega-dept-panel') === String(index);
                    panel.classList.toggle('is-active', on);
                    panel.hidden = !on;
                });
            }

            function activateCat(panel, catId) {
                panel.querySelectorAll('[data-mega-cat]').forEach(function (cat) {
                    cat.classList.toggle('is-active', cat.getAttribute('data-mega-cat-id') === catId);
                });
                panel.querySelectorAll('[data-mega-sub]').forEach(function (sub) {
                    var on = sub.getAttribute('data-mega-sub') === catId;
                    sub.classList.toggle('is-active', on);
                    sub.hidden = !on;
                });
            }

            mega.querySelectorAll('[data-mega-dept]').forEach(function (btn) {
                btn.addEventListener('mouseenter', function () {
                    activateDept(btn.getAttribute('data-mega-dept'));
                });
                btn.addEventListener('focus', function () {
                    activateDept(btn.getAttribute('data-mega-dept'));
                });
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    activateDept(btn.getAttribute('data-mega-dept'));
                });
            });

            mega.querySelectorAll('[data-mega-dept-panel]').forEach(function (panel) {
                panel.querySelectorAll('[data-mega-cat]').forEach(function (cat) {
                    cat.addEventListener('mouseenter', function () {
                        activateCat(panel, cat.getAttribute('data-mega-cat-id'));
                    });
                    cat.addEventListener('focus', function () {
                        activateCat(panel, cat.getAttribute('data-mega-cat-id'));
                    });
                });
            });
        }
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

    root.addEventListener('mouseenter', function () { if (!paused) stopAuto(); });
    root.addEventListener('mouseleave', function () { if (!paused) startAuto(); });
    root.addEventListener('focusin', function () { if (!paused) stopAuto(); });
    root.addEventListener('focusout', function () { if (!paused) startAuto(); });

    show(0);
    startAuto();
})();
</script>
@endpush
