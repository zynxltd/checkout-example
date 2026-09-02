@extends('demo.layout')

@section('title', 'Sign in — YouGarden')

@section('body_class', 'demo-account demo-account--secured')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-account.css') }}?v={{ filemtime(public_path('css/demo-account.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-account-dashboard.css') }}?v={{ filemtime(public_path('css/demo-account-dashboard.css')) }}">
@endpush

@section('content')
<div class="demo-site demo-site--account-secure">
    @include('demo.partials.account-secure-header', ['club_member' => false])

    <main class="demo-account-main demo-account-main--wide demo-account-main--ready" id="account-main">
        <div class="demo-account-main__content">
        <div class="demo-account-card">
            <nav class="demo-account-card__tabs" aria-label="Account">
                <a href="{{ route('demo.account.login') }}" class="demo-account-card__tab is-active" aria-current="page">Sign in</a>
                <a href="{{ route('demo.account.register') }}" class="demo-account-card__tab">Create account</a>
            </nav>

            <div class="demo-account-card__body">
                <h1 class="demo-account-card__title">Welcome back</h1>
                <p class="demo-account-card__lead">Sign in to track orders, manage delivery details, and access Club offers.</p>

                <div class="demo-account-demo-login">
                    <p class="demo-account-demo-login__title">Demo logins</p>
                    <p class="demo-account-demo-login__creds">
                        <strong>Guest</strong> —
                        <a class="demo-account-demo-login__link" href="{{ route('demo.account.demo-login', ['type' => 'guest']) }}">{{ config('demo.account_email') }} / {{ config('demo.account_password') }}</a>
                    </p>
                    <p class="demo-account-demo-login__creds">
                        <strong>Club member</strong> —
                        <a class="demo-account-demo-login__link" href="{{ route('demo.account.demo-login', ['type' => 'club']) }}">{{ config('demo.club_account_email') }} / {{ config('demo.club_account_password') }}</a>
                    </p>
                </div>

                <form class="demo-account-form" id="account-login-form" action="{{ route('demo.account.login.submit') }}" method="post" data-demo-form-loading>
                    @csrf
                    <div class="demo-account-field">
                        <label class="demo-account-label" for="account-login-email">Login</label>
                        <input
                            class="demo-account-input"
                            type="text"
                            id="account-login-email"
                            name="email"
                            value="{{ old('email', config('demo.account_email')) }}"
                            autocomplete="username"
                            required
                        >
                    </div>

                    <div class="demo-account-field">
                        <label class="demo-account-label" for="account-login-password">Password</label>
                        <input
                            class="demo-account-input"
                            type="password"
                            id="account-login-password"
                            name="password"
                            value="{{ old('password', config('demo.account_password')) }}"
                            autocomplete="current-password"
                            required
                        >
                    </div>

                    <a href="#" class="demo-account-forgot">Forgotten your password?</a>

                    @if ($errors->any())
                        <div class="demo-account-errors" role="alert">
                            <ul>
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <button type="submit" class="demo-account-submit">Sign in</button>
                </form>

                <div class="demo-account-divider" aria-hidden="true">or</div>

                <p class="demo-account-switch">
                    New to YouGarden?
                    <a href="{{ route('demo.account.register') }}">Create an account</a>
                </p>
            </div>
        </div>

        <aside class="demo-account-perks" aria-label="Account benefits">
            <p class="demo-account-perks__title">Why sign in?</p>
            <ul>
                <li>View order history and tracking</li>
                <li>Save delivery addresses for faster checkout</li>
                <li>Access YouGarden Club member pricing</li>
            </ul>
        </aside>

        </div>
    </main>

    @include('demo.partials.account-secure-footer')
</div>

<div class="demo-account-page-spinner" id="demo-account-page-spinner" hidden>
    @include('demo.partials.account-spinner', ['class' => 'demo-spinner--page'])
    <span class="demo-account-page-spinner__label">Loading your account</span>
</div>

<div id="yg-drawer-mount">
    @include('demo.partials.drawer', ['cart' => $cart])
</div>
@endsection

@push('scripts')
    <script>
        window.__YG_ACCOUNT_LOGIN_DEBUG = {
            ...@json($loginDebug ?? []),
            errors: @json($errors->all()),
        };
    </script>
    <script src="{{ asset('js/demo-account-login-debug.js') }}?v={{ filemtime(public_path('js/demo-account-login-debug.js')) }}" defer></script>
    <script src="{{ asset('js/yg-drawer-theme.js') }}?v={{ filemtime(public_path('js/yg-drawer-theme.js')) }}" defer></script>
    <script src="{{ asset('js/demo-account-loading.js') }}?v={{ filemtime(public_path('js/demo-account-loading.js')) }}" defer></script>
@endpush
