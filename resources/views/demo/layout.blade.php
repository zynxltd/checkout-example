<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'YouGarden — Cart Drawer V2 Prototype')</title>
    @if ($kit = config('demo.adobe_fonts_kit'))
    <link rel="stylesheet" href="https://use.typekit.net/{{ $kit }}.css">
    @endif
    <link rel="stylesheet" href="{{ asset('css/yg-fonts.css') }}">
    <link rel="stylesheet" href="{{ asset('css/demo-site.css') }}?v={{ filemtime(public_path('css/demo-site.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/yg-cart-drawer.css') }}?v={{ filemtime(public_path('css/yg-cart-drawer.css')) }}">
    @stack('head')
</head>
<body class="@yield('body_class')" @yield('body_attrs')>
    @yield('content')
    <script>
        window.__YG_CART_DRAWER_ENABLED = @json((bool) session('demo_drawer_enabled', true));
        window.YG_DEMO_ROUTES = {
            checkout: @json(route('demo.checkout')),
            checkoutComplete: @json(route('demo.checkout.complete')),
            checkoutVoucher: @json(route('demo.checkout.voucher')),
            checkoutVoucherRemove: @json(route('demo.checkout.voucher.remove')),
            checkoutConfirmation: @json(route('demo.checkout.confirmation')),
            fragment: @json(url('/cart/fragment')),
            add: @json(url('/cart/add')),
            qty: @json(url('/cart/qty')),
            remove: @json(url('/cart/remove')),
            code: @json(url('/cart/code')),
            removeCode: @json(url('/cart/code')),
            club: @json(url('/cart/club')),
            toggleDrawer: @json(url('/cart/toggle-drawer')),
            toggleOption: @json(url('/cart/toggle-option')),
        };
    </script>
    <script src="{{ asset('js/yg-cart-drawer.js') }}" defer></script>
    <script src="{{ asset('js/demo-search-suggest.js') }}?v={{ filemtime(public_path('js/demo-search-suggest.js')) }}" defer></script>
    <script src="{{ asset('js/demo-usp.js') }}?v={{ filemtime(public_path('js/demo-usp.js')) }}" defer></script>
    <script src="{{ asset('js/demo-mobile-nav.js') }}?v={{ filemtime(public_path('js/demo-mobile-nav.js')) }}" defer></script>
    @stack('scripts')
</body>
</html>
