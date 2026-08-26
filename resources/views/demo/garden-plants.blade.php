@extends('demo.layout')

@section('title', $hub['title'] . ' | Outdoor Plants for Sale UK — YouGarden')

@section('body_class', 'demo-listing demo-garden-plants')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-reviews-footer.css') }}?v={{ filemtime(public_path('css/demo-pdp-reviews-footer.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-listing.css') }}?v={{ filemtime(public_path('css/demo-listing.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-garden-plants.css') }}?v={{ filemtime(public_path('css/demo-garden-plants.css')) }}">
@endpush

@section('content')
<div class="demo-site">
    @include('demo.partials.site-chrome', ['cart' => $cart, 'show_trust' => true])

    <main class="demo-listing-main demo-garden-plants__main">
        <nav class="demo-listing__crumb" aria-label="Breadcrumb">
            @foreach ($hub['breadcrumb'] as $i => $crumb)
                @if ($i > 0)<span class="demo-listing__crumb-sep" aria-hidden="true">|</span>@endif
                @if ($crumb['url'])
                    <a href="{{ $crumb['url'] }}"@if (! empty($crumb['icon'])) class="demo-listing__crumb-link--home"@endif>
                        @if (! empty($crumb['icon']))
                            <span class="demo-listing__crumb-home" aria-hidden="true">@include('demo.partials.icon', ['name' => 'home', 'width' => 14, 'height' => 14])</span>
                            <span class="visually-hidden">{{ $crumb['label'] }}</span>
                        @else
                            {{ $crumb['label'] }}
                        @endif
                    </a>
                @else
                    <span aria-current="page">{{ $crumb['label'] }}</span>
                @endif
            @endforeach
        </nav>

        <header class="demo-listing-seo-intro" data-seo-intro>
            <h1 class="demo-listing-seo-intro__title">{{ $hub['title'] }}</h1>
            @if (! empty($hub['subtitle']))
                <h2 class="demo-listing-seo-intro__subtitle">{{ $hub['subtitle'] }}</h2>
            @endif

            @if (! empty($hub['seo_intro']))
                <div class="demo-listing-seo-intro__copy" id="listing-seo-intro" data-collapsed="true">
                    <div class="demo-listing-seo-intro__body">
                        @foreach ($hub['seo_intro'] as $paragraph)
                            <p>{{ $paragraph }}</p>
                        @endforeach
                    </div>
                    <button
                        type="button"
                        class="demo-listing-seo-intro__toggle"
                        id="listing-seo-intro-toggle"
                        aria-expanded="false"
                        aria-controls="listing-seo-intro"
                    >Read more</button>
                </div>
            @endif
        </header>

        <section class="demo-garden-plants__tiles" aria-label="Garden plant categories">
            @foreach ($hub['tiles'] as $tile)
                <a
                    class="demo-garden-plants__tile"
                    href="{{ $tile['url'] }}"
                    @if (str_starts_with($tile['url'], 'http')) target="_blank" rel="noopener noreferrer" @endif
                >
                    <img
                        src="{{ asset($tile['image']) }}"
                        alt=""
                        width="500"
                        height="500"
                        loading="{{ $loop->index < 3 ? 'eager' : 'lazy' }}"
                    >
                    <span class="demo-garden-plants__tile-cta">
                        {{ $tile['label'] }}<span aria-hidden="true"> ›</span>
                    </span>
                </a>
            @endforeach
        </section>

        @if (! empty($hub['faqs']))
            <section class="demo-garden-plants__faq" aria-labelledby="garden-plants-faq-heading">
                <h2 class="demo-garden-plants__faq-title" id="garden-plants-faq-heading">
                    {{ $hub['title'] }}
                    <span class="demo-garden-plants__faq-sub">Frequently Asked Questions</span>
                </h2>

                <div class="demo-garden-plants__faq-list">
                    @foreach ($hub['faqs'] as $i => $faq)
                        <details class="demo-garden-plants__faq-item"@if ($i === 0) open @endif>
                            <summary class="demo-garden-plants__faq-q">
                                <span class="demo-garden-plants__faq-mark" aria-hidden="true">?</span>
                                {{ $faq['question'] }}
                            </summary>
                            <div class="demo-garden-plants__faq-a">
                                <p>{{ $faq['answer'] }}</p>
                            </div>
                        </details>
                    @endforeach
                </div>
            </section>
        @endif
    </main>

    @include('demo.partials.site-shell-footer')
</div>

<div id="yg-drawer-mount">
    @include('demo.partials.drawer', ['cart' => $cart])
</div>

<div class="demo-prototype-stack" id="demo-garden-plants-prototype-stack">
    <button type="button" class="demo-prototype-stack__dock" data-prototype-dock aria-expanded="false" aria-controls="demo-garden-plants-prototype-stack-body">Prototype tools</button>
    <div class="demo-prototype-stack__body" id="demo-garden-plants-prototype-stack-body">
        <div class="demo-prototype-stack__bar">
            <span class="demo-prototype-stack__bar-title">Prototype tools</span>
            <button type="button" class="demo-prototype-stack__minimize" data-prototype-minimize aria-label="Minimise prototype tools">Minimise</button>
        </div>
        <div class="demo-prototype-stack__content">
            <aside class="demo-controls" aria-label="SEO content block colours">
                <h3>SEO content block</h3>
                <p class="demo-controls__hint">Toggle colours for the Garden Plants intro. Saved in this browser.</p>
                <label class="demo-toggle">
                    <input type="checkbox" id="toggle-seo-hide-stone" data-seo-option="hide-stone">
                    <span>Hide stone card background</span>
                </label>
                <p class="demo-controls__hint">Removes the cream card shell so the intro sits on the white page.</p>
                <label class="demo-toggle">
                    <input type="checkbox" id="toggle-seo-green-header" data-seo-option="green-header">
                    <span>YG green for header</span>
                </label>
                <p class="demo-controls__hint">Uses forest green (#264f1c) for the main title (and subtitle).</p>
            </aside>
        </div>
    </div>
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/yg-drawer-theme.js') }}?v={{ filemtime(public_path('js/yg-drawer-theme.js')) }}" defer></script>
    <script src="{{ asset('js/demo-prototype-stack.js') }}?v={{ filemtime(public_path('js/demo-prototype-stack.js')) }}" defer></script>
    <script>
    (function () {
        var intro = document.getElementById('listing-seo-intro');
        var toggle = document.getElementById('listing-seo-intro-toggle');
        if (intro && toggle) {
            toggle.addEventListener('click', function () {
                var collapsed = intro.getAttribute('data-collapsed') !== 'false';
                intro.setAttribute('data-collapsed', collapsed ? 'false' : 'true');
                toggle.setAttribute('aria-expanded', collapsed ? 'true' : 'false');
                toggle.textContent = collapsed ? 'Read less' : 'Read more';
            });
        }

        var seo = document.querySelector('[data-seo-intro]');
        if (!seo) return;

        var KEY = 'yg-garden-plants-seo';
        var hideStone = document.getElementById('toggle-seo-hide-stone');
        var greenHeader = document.getElementById('toggle-seo-green-header');

        function apply() {
            seo.classList.toggle('is-no-stone', !!(hideStone && hideStone.checked));
            seo.classList.toggle('is-green-header', !!(greenHeader && greenHeader.checked));
            try {
                localStorage.setItem(KEY, JSON.stringify({
                    hideStone: !!(hideStone && hideStone.checked),
                    greenHeader: !!(greenHeader && greenHeader.checked),
                }));
            } catch (e) { /* ignore */ }
        }

        try {
            var saved = JSON.parse(localStorage.getItem(KEY) || '{}');
            if (hideStone) hideStone.checked = !!saved.hideStone;
            if (greenHeader) greenHeader.checked = !!saved.greenHeader;
        } catch (e) { /* ignore */ }

        if (hideStone) hideStone.addEventListener('change', apply);
        if (greenHeader) greenHeader.addEventListener('change', apply);
        apply();
    })();
    </script>
@endpush
