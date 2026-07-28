{{-- Homepage header v1 (Argos) — shared across all storefront pages --}}
@include('demo.partials.site-chrome-argos', [
    'cart' => $cart,
    'show_trust' => $show_trust ?? false,
    'search_placeholder' => $search_placeholder ?? 'Search plants, trees or outdoor living',
    'shop_menu' => $shop_menu ?? null,
    'trending_links' => $trending_links ?? null,
])
