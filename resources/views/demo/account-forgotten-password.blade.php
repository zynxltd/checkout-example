@extends('demo.layout')

@section('title', 'Forgotten password — YouGarden')

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
                <a href="{{ route('demo.account.login') }}" class="demo-account-card__tab">Sign in</a>
                <a href="{{ route('demo.account.register') }}" class="demo-account-card__tab">Create account</a>
            </nav>

            <div class="demo-account-card__body">
                <h1 class="demo-account-card__title">Forgotten your password?</h1>
                <p class="demo-account-card__lead">Enter the email address for your YouGarden account and we&rsquo;ll send you a link to reset your password.</p>

                <div class="demo-account-demo-login">
                    <p class="demo-account-demo-login__title">Demo reset</p>
                    <p class="demo-account-demo-login__creds">This prototype does not send email. Submit any address to see the confirmation message, then return to sign in with the demo credentials.</p>
                </div>

                @if (session('status'))
                    <div class="demo-account-status" role="status">
                        {{ session('status') }}
                    </div>
                @endif

                <form class="demo-account-form" action="{{ route('demo.account.forgotten-password.submit') }}" method="post" data-demo-form-loading>
                    @csrf

                    <div class="demo-account-field">
                        <label class="demo-account-label" for="account-forgot-email">Email address</label>
                        <input
                            class="demo-account-input"
                            type="email"
                            id="account-forgot-email"
                            name="email"
                            value="{{ old('email', config('demo.account_email')) }}"
                            autocomplete="email"
                            required
                        >
                    </div>

                    @if ($errors->any())
                        <div class="demo-account-errors" role="alert">
                            <ul>
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <button type="submit" class="demo-account-submit">Send reset link</button>
                </form>

                <div class="demo-account-divider" aria-hidden="true">or</div>

                <p class="demo-account-switch">
                    Remembered your password?
                    <a href="{{ route('demo.account.login') }}">Sign in</a>
                </p>
            </div>
        </div>

        </div>
    </main>

    @include('demo.partials.account-secure-footer')
</div>

<div class="demo-account-page-spinner" id="demo-account-page-spinner" hidden>
    @include('demo.partials.account-spinner', ['class' => 'demo-spinner--page'])
    <span class="demo-account-page-spinner__label">Sending reset link</span>
</div>

<div id="yg-drawer-mount">
    @include('demo.partials.drawer', ['cart' => $cart])
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/yg-drawer-theme.js') }}?v={{ filemtime(public_path('js/yg-drawer-theme.js')) }}" defer></script>
    <script src="{{ asset('js/demo-account-loading.js') }}?v={{ filemtime(public_path('js/demo-account-loading.js')) }}" defer></script>
@endpush
