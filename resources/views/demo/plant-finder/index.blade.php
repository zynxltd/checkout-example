@extends('demo.layout')

@section('title', 'Plant Finder — YouGarden')

@section('body_class', 'demo-plant-finder demo-listing yg-header-argos')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-listing.css') }}?v={{ filemtime(public_path('css/demo-listing.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-reviews-footer.css') }}?v={{ filemtime(public_path('css/demo-pdp-reviews-footer.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-plant-finder.css') }}?v={{ filemtime(public_path('css/demo-plant-finder.css')) }}">
@endpush

@section('content')
<div class="demo-site demo-site--plant-finder">
    @include('demo.partials.site-chrome-argos', [
        'cart' => $cart,
        'show_trust' => true,
        'search_placeholder' => 'Search plants, trees or outdoor living',
    ])

    <div class="yg-plant-finder" data-finder>
        <header class="yg-pf-hero">
            <div class="yg-pf-hero__inner">
                <nav class="yg-pf-hero__crumb" aria-label="Breadcrumb">
                    <a href="{{ route('demo.home') }}">Home</a>
                    <span class="yg-pf-hero__crumb-sep">/</span>
                    <span aria-current="page">Plant Finder</span>
                </nav>
                <h1 class="yg-pf-hero__title">Plant Finder</h1>
                <p class="yg-pf-hero__intro">
                    Use the filters to find plants that suit your garden — by planting, flowering or fruiting time, category and characteristics.
                </p>
            </div>
        </header>

        <div class="yg-pf-page">
            <div data-finder-chips class="yg-pf-chips-wrap">
                @include('demo.plant-finder.partials.chips')
            </div>

            <main class="plant-finder-results" data-finder-results>
                @include('demo.plant-finder.partials.results')
            </main>
        </div>

        <button
            type="button"
            class="finder-customise-tab"
            data-filter-open
            aria-controls="filter-drawer"
            aria-expanded="false"
            aria-label="Filter plants"
        >
            <span aria-hidden="true">☰</span>
        </button>

        <div class="finder-drawer-overlay" data-filter-overlay aria-hidden="true"></div>

        <aside
            id="filter-drawer"
            class="finder-drawer"
            data-filter-drawer
            aria-hidden="true"
            aria-labelledby="filter-drawer-title"
            role="dialog"
            aria-modal="true"
        >
            <div class="finder-drawer-header">
                <div>
                    <span class="finder-label">Refine your search</span>
                    <h2 id="filter-drawer-title">Filter plants</h2>
                </div>
                <button type="button" class="finder-drawer-close" data-filter-close aria-label="Close filters">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </button>
            </div>

            <div class="finder-drawer-body">
                @include('demo.plant-finder.partials.drawer-form')
            </div>

            <div class="finder-drawer-footer" data-finder-drawer-footer>
                @include('demo.plant-finder.partials.drawer-footer')
            </div>
        </aside>
    </div>
</div>

<script src="{{ asset('js/demo-plant-finder.js') }}?v={{ filemtime(public_path('js/demo-plant-finder.js')) }}" defer></script>
@endsection
