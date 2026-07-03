@extends('demo.layout')

@section('title', 'Create account — YouGarden')

@section('body_class', 'demo-account demo-account--secured')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-account.css') }}?v={{ filemtime(public_path('css/demo-account.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-account-dashboard.css') }}?v={{ filemtime(public_path('css/demo-account-dashboard.css')) }}">
@endpush

@section('content')
<div class="demo-site demo-site--account-secure">
    @include('demo.partials.account-secure-header', ['club_member' => false])

    <main class="demo-account-main demo-account-main--wide demo-account-main--loading" id="account-main" aria-busy="true">
        @include('demo.partials.account-login-skeleton')

        <div class="demo-account-main__content">
        <div class="demo-account-card">
            <nav class="demo-account-card__tabs" aria-label="Account">
                <a href="{{ route('demo.account.login') }}" class="demo-account-card__tab">Sign in</a>
                <a href="{{ route('demo.account.register') }}" class="demo-account-card__tab is-active" aria-current="page">Create account</a>
            </nav>

            <div class="demo-account-card__body">
                <h1 class="demo-account-card__title">Create your account</h1>
                <p class="demo-account-card__lead">Join YouGarden to track orders, save addresses, and enjoy gardening for everyone.</p>

                <div class="demo-account-demo-login">
                    <p class="demo-account-demo-login__title">Demo profile</p>
                    <p class="demo-account-demo-login__creds">Form is pre-filled with the demo customer (MR John Smith, 12 Guest Lane). Submit loads the same account dashboard.</p>
                </div>

                <form class="demo-account-form" action="{{ route('demo.account.register.submit') }}" method="post" data-demo-form-loading>
                    @csrf

                    <fieldset class="demo-account-fieldset">
                        <legend class="demo-account-fieldset__legend">Your details</legend>
                        <div class="demo-account-row demo-account-row--title-name">
                            <div class="demo-account-field demo-account-field--half">
                                <label class="demo-account-label" for="account-register-title">Title</label>
                                <select class="demo-account-select" id="account-register-title" name="title" required>
                                    <option value="">—</option>
                                    @foreach (['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'] as $title)
                                        <option value="{{ $title }}" @selected(old('title', $defaults['title']) === $title)>{{ $title }}</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="demo-account-field demo-account-field--half">
                                <label class="demo-account-label" for="account-register-first">First name</label>
                                <input class="demo-account-input" type="text" id="account-register-first" name="first_name" value="{{ old('first_name', $defaults['first_name']) }}" autocomplete="given-name" required>
                            </div>
                            <div class="demo-account-field demo-account-field--half">
                                <label class="demo-account-label" for="account-register-last">Last name</label>
                                <input class="demo-account-input" type="text" id="account-register-last" name="last_name" value="{{ old('last_name', $defaults['last_name']) }}" autocomplete="family-name" required>
                            </div>
                        </div>

                        <div class="demo-account-field">
                            <label class="demo-account-label" for="account-register-email">Email address</label>
                            <input class="demo-account-input" type="email" id="account-register-email" name="email" value="{{ old('email', $defaults['email']) }}" autocomplete="email" placeholder="you@example.com" required>
                        </div>

                        <div class="demo-account-row demo-account-row--2">
                            <div class="demo-account-field demo-account-field--half">
                                <label class="demo-account-label" for="account-register-password">Password</label>
                                <input class="demo-account-input" type="password" id="account-register-password" name="password" value="demo1234" autocomplete="new-password" minlength="8" required>
                            </div>
                            <div class="demo-account-field demo-account-field--half">
                                <label class="demo-account-label" for="account-register-password-confirm">Confirm password</label>
                                <input class="demo-account-input" type="password" id="account-register-password-confirm" name="password_confirmation" value="demo1234" autocomplete="new-password" minlength="8" required>
                            </div>
                        </div>

                        <div class="demo-account-field">
                            <label class="demo-account-label" for="account-register-phone">Telephone</label>
                            <input class="demo-account-input" type="tel" id="account-register-phone" name="phone" value="{{ old('phone', $defaults['phone']) }}" autocomplete="tel" required>
                        </div>
                    </fieldset>

                    <fieldset class="demo-account-fieldset">
                        <legend class="demo-account-fieldset__legend">Your address</legend>
                        <div class="demo-account-field">
                            <label class="demo-account-label" for="account-register-line1">Address line 1</label>
                            <input class="demo-account-input" type="text" id="account-register-line1" name="address_line1" value="{{ old('address_line1', $defaults['address_line1']) }}" autocomplete="address-line1" required>
                        </div>
                        <div class="demo-account-field">
                            <label class="demo-account-label" for="account-register-line2">Address line 2</label>
                            <input class="demo-account-input" type="text" id="account-register-line2" name="address_line2" value="{{ old('address_line2', $defaults['address_line2']) }}" autocomplete="address-line2">
                        </div>
                        <div class="demo-account-row demo-account-row--2">
                            <div class="demo-account-field demo-account-field--half">
                                <label class="demo-account-label" for="account-register-town">Town / city</label>
                                <input class="demo-account-input" type="text" id="account-register-town" name="town" value="{{ old('town', $defaults['town']) }}" autocomplete="address-level2" required>
                            </div>
                            <div class="demo-account-field demo-account-field--half">
                                <label class="demo-account-label" for="account-register-postcode">Postcode</label>
                                <input class="demo-account-input" type="text" id="account-register-postcode" name="postcode" value="{{ old('postcode', $defaults['postcode']) }}" autocomplete="postal-code" required>
                            </div>
                        </div>
                        <div class="demo-account-field">
                            <label class="demo-account-label" for="account-register-country">Country</label>
                            <select class="demo-account-select" id="account-register-country" name="country" required>
                                <option value="United Kingdom" @selected(old('country', $defaults['country']) === 'United Kingdom')>United Kingdom</option>
                                <option value="Republic of Ireland" @selected(old('country', $defaults['country']) === 'Republic of Ireland')>Republic of Ireland</option>
                            </select>
                        </div>
                    </fieldset>

                    <label class="demo-account-check">
                        <input type="checkbox" name="marketing" value="1" @checked(old('marketing', true))>
                        <span>Yes, I&rsquo;d like to receive gardening tips, offers and inspiration by email.</span>
                    </label>

                    <label class="demo-account-check">
                        <input type="checkbox" name="terms" value="1" @checked(old('terms', true)) required>
                        <span>I agree to the <a href="#">Terms &amp; Conditions</a> and <a href="#">Privacy Policy</a>.</span>
                    </label>

                    @if ($errors->any())
                        <div class="demo-account-errors" role="alert">
                            <ul>
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <button type="submit" class="demo-account-submit">Create account</button>
                </form>

                <div class="demo-account-divider" aria-hidden="true">or</div>

                <p class="demo-account-switch">
                    Already have an account?
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
    <span class="demo-account-page-spinner__label">Loading your account</span>
</div>

<div id="yg-drawer-mount">
    @include('demo.partials.drawer', ['cart' => $cart])
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/yg-drawer-theme.js') }}?v={{ filemtime(public_path('js/yg-drawer-theme.js')) }}" defer></script>
    <script src="{{ asset('js/demo-account-loading.js') }}?v={{ filemtime(public_path('js/demo-account-loading.js')) }}" defer></script>
@endpush
