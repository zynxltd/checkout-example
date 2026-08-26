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

        <header class="demo-listing-seo-intro">
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
@endsection

@push('scripts')
    <script src="{{ asset('js/yg-drawer-theme.js') }}?v={{ filemtime(public_path('js/yg-drawer-theme.js')) }}" defer></script>
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
    })();
    </script>
@endpush
