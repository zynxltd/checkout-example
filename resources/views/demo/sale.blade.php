@extends('demo.layout')

@section('title', 'Sale — Save up to 58% on garden favourites | YouGarden')

@section('body_class', 'demo-home-argos demo-sale demo-listing')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-reviews-footer.css') }}?v={{ filemtime(public_path('css/demo-pdp-reviews-footer.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/home-argos-preview.css') }}?v={{ filemtime(public_path('css/home-argos-preview.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-listing.css') }}?v={{ filemtime(public_path('css/demo-listing.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/sale-landing.css') }}?v={{ filemtime(public_path('css/sale-landing.css')) }}">
@endpush

@section('content')
<div class="demo-site demo-site--argos-home demo-site--sale" data-sale-page>
    @include('demo.partials.site-chrome-argos', [
        'cart' => $cart,
        'show_trust' => true,
        'search_placeholder' => 'Search sale plants, roses or fruit',
        'shop_menu' => $shop_menu,
        'trending_links' => $trending_links,
    ])

    <div class="yg-argos-page-overlay" data-nav-page-overlay hidden aria-hidden="true"></div>

    <main class="demo-home-argos__main demo-sale__main">
        <h1 class="visually-hidden">Sale — save on garden favourites</h1>

        @include('demo.partials.listing-filters', ['listing' => $listing])

        <section class="yg-sale-products" id="sale-all-deals" aria-labelledby="yg-sale-heading">
            <div class="yg-sale-products__head">
                <h2 id="yg-sale-heading" class="yg-sale-products__title">
                    <span data-sale-heading>All sale items</span>
                </h2>
            </div>
            <div class="yg-sale-products__grid resListingWrapper" data-sale-grid="all">
                @foreach ($all_deals as $deal)
                    @include('demo.partials.sale-product-card', ['deal' => $deal, 'eager' => $loop->index < 4])
                @endforeach
            </div>
            <p class="yg-sale-empty" data-sale-empty hidden>No deals match your filters — try resetting them.</p>
        </section>
    </main>

    @include('demo.partials.site-shell-footer')
    @include('demo.partials.drawer', ['cart' => $cart])
</div>
@endsection

@push('scripts')
<script src="{{ asset('js/yg-argos-nav.js') }}?v={{ filemtime(public_path('js/yg-argos-nav.js')) }}" defer></script>
<script src="{{ asset('js/demo-listing-filters.js') }}?v={{ filemtime(public_path('js/demo-listing-filters.js')) }}" defer></script>
@endpush
