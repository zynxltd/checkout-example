@extends('demo.layout')

@section('body_class', 'demo-account demo-account--dashboard')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-reviews-footer.css') }}?v={{ filemtime(public_path('css/demo-pdp-reviews-footer.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-account.css') }}?v={{ filemtime(public_path('css/demo-account.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-account-dashboard.css') }}?v={{ filemtime(public_path('css/demo-account-dashboard.css')) }}">
@endpush

@section('content')
<div class="demo-site">
    @include('demo.partials.site-chrome', ['cart' => $cart])

    <div class="demo-account-banner">
        <h1 class="demo-account-banner__title">@yield('account_banner', 'Your account')</h1>
    </div>

    <div class="demo-account-dash">
        @include('demo.partials.account-sidebar', ['active' => $active ?? 'home', 'user' => $user])

        <main class="demo-account-dash__main" id="account-dashboard-main">
            @yield('account_content')
        </main>
    </div>

    @include('demo.partials.site-shell-footer')
</div>

<div id="yg-drawer-mount">
    @include('demo.partials.drawer', ['cart' => $cart])
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/yg-drawer-theme.js') }}?v={{ filemtime(public_path('js/yg-drawer-theme.js')) }}" defer></script>
@endpush
