@extends('demo.layout')

@section('title', 'Sign in — YouGarden')

@section('body_class', 'demo-account')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-reviews-footer.css') }}?v={{ filemtime(public_path('css/demo-pdp-reviews-footer.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-account.css') }}?v={{ filemtime(public_path('css/demo-account.css')) }}">
@endpush

@section('content')
<div class="demo-site">
    @include('demo.partials.site-chrome', ['cart' => $cart])

    <main class="demo-account-main" id="account-main">
        <div class="demo-account-card">
            <nav class="demo-account-card__tabs" aria-label="Account">
                <a href="{{ route('demo.account.login') }}" class="demo-account-card__tab is-active" aria-current="page">Sign in</a>
                <a href="{{ route('demo.account.register') }}" class="demo-account-card__tab">Create account</a>
            </nav>

            <div class="demo-account-card__body">
                <h1 class="demo-account-card__title">Welcome back</h1>
                <p class="demo-account-card__lead">Sign in to track orders, manage delivery details, and access Club offers.</p>

                <div class="demo-account-demo-login">
                    <p class="demo-account-demo-login__title">Demo login</p>
                    <p class="demo-account-demo-login__creds">
                        <strong>Email:</strong> {{ config('demo.account_email') }}<br>
                        <strong>Password:</strong> {{ config('demo.account_password') }}<br>
                        <strong>Account:</strong> MR John Smith, 12 Guest Lane, Manchester M1 4GH
                    </p>
                </div>

                <form class="demo-account-form" action="{{ route('demo.account.login.submit') }}" method="post">
                    @csrf
                    <div class="demo-account-field">
                        <label class="demo-account-label" for="account-login-email">Email address</label>
                        <input
                            class="demo-account-input"
                            type="email"
                            id="account-login-email"
                            name="email"
                            value="{{ old('email', config('demo.account_email')) }}"
                            autocomplete="username"
                            placeholder="you@example.com"
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
                            value="demo"
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

    </main>

    @include('demo.partials.site-shell-footer')
</div>

<div id="yg-drawer-mount">
    @include('demo.partials.drawer', ['cart' => $cart])
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/yg-drawer-theme.js') }}?v={{ filemtime(public_path('js/yg-drawer-theme.js')) }}" defer></script>
@endpush
