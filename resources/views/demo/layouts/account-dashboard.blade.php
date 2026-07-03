@extends('demo.layout')

@section('body_class', 'demo-account demo-account--dashboard demo-account--secured')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-account.css') }}?v={{ filemtime(public_path('css/demo-account.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-account-dashboard.css') }}?v={{ filemtime(public_path('css/demo-account-dashboard.css')) }}">
@endpush

@section('content')
<div class="demo-site demo-site--account-secure">
    @include('demo.partials.account-secure-header', [
        'club_member' => $club_member ?? (! empty($user['club'])),
    ])

    <div class="demo-account-dash demo-account-dash--loading" id="account-dash-root" aria-busy="true">
        @include('demo.partials.account-dashboard-skeleton')

        <div class="demo-account-dash__content">
            @include('demo.partials.account-sidebar', [
                'active' => $active ?? 'home',
                'user' => $user,
                'club_member' => $club_member ?? false,
            ])

            <main class="demo-account-dash__main" id="account-dashboard-main">
                <h1 class="demo-account-page-title">@yield('account_banner', 'Your account')</h1>
                @if (($active ?? '') === 'home')
                    @include('demo.partials.account-promo-banner', ['promo' => $promo ?? null])
                @endif
                @yield('account_content')
            </main>
        </div>
    </div>

    @include('demo.partials.account-secure-footer')
</div>

@include('demo.partials.account-prototype-tools', ['club_member' => $club_member ?? false])

<div class="demo-account-page-spinner" id="demo-account-page-spinner" hidden>
    @include('demo.partials.account-spinner', ['class' => 'demo-spinner--page'])
    <span class="demo-account-page-spinner__label">Loading your account</span>
</div>

<div id="yg-drawer-mount">
    @include('demo.partials.drawer', ['cart' => $cart])
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/yg-drawer-theme.js') }}?v={{ filemtime(public_path('js/yg-drawer-theme.js')) }}" defer></script>
    <script src="{{ asset('js/demo-prototype-stack.js') }}?v={{ filemtime(public_path('js/demo-prototype-stack.js')) }}" defer></script>
    <script src="{{ asset('js/demo-account-loading.js') }}?v={{ filemtime(public_path('js/demo-account-loading.js')) }}" defer></script>
@endpush
