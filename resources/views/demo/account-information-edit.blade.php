@extends('demo.layouts.account-dashboard')

@section('title', 'Update account information — YouGarden')

@section('account_banner', 'Update your account information')

@section('account_content')
    <form class="demo-account-edit-form" action="{{ route('demo.account.information.submit') }}" method="post" data-demo-form-loading>
        @csrf

        <div class="demo-account-edit-form__grid">
            <label class="demo-account-edit-form__field">
                <span class="demo-account-edit-form__label">Title*</span>
                <select name="title">
                    @foreach (['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'] as $title)
                        <option value="{{ $title }}" @selected(($user['title'] ?? '') === $title)>{{ strtoupper($title) }}</option>
                    @endforeach
                </select>
            </label>

            <label class="demo-account-edit-form__field">
                <span class="demo-account-edit-form__label">First Name*</span>
                <input type="text" name="first_name" value="{{ $user['first_name'] }}" required>
            </label>

            <label class="demo-account-edit-form__field">
                <span class="demo-account-edit-form__label">Initial</span>
                <input type="text" name="initial" value="{{ $user['initial'] ?? '' }}" maxlength="1">
            </label>

            <label class="demo-account-edit-form__field">
                <span class="demo-account-edit-form__label">Surname*</span>
                <input type="text" name="last_name" value="{{ $user['last_name'] }}" required>
            </label>

            <label class="demo-account-edit-form__field">
                <span class="demo-account-edit-form__label">Business</span>
                <input type="text" name="business_name" value="{{ $user['business_name'] }}">
            </label>

            <label class="demo-account-edit-form__field">
                <span class="demo-account-edit-form__label">Email Address*</span>
                <input type="email" name="email" value="{{ $user['email'] }}" required>
            </label>

            <label class="demo-account-edit-form__field">
                <span class="demo-account-edit-form__label">Confirm Email Address*</span>
                <input type="email" name="email_confirmation" value="{{ $user['email'] }}" required>
            </label>

            <label class="demo-account-edit-form__field">
                <span class="demo-account-edit-form__label">Telephone*</span>
                <input type="text" name="phone" value="{{ $user['phone'] }}" required>
            </label>

            <label class="demo-account-edit-form__field">
                <span class="demo-account-edit-form__label">Date of Birth</span>
                <input type="date" name="date_of_birth" value="{{ $user['date_of_birth_iso'] ?? '' }}">
            </label>
        </div>

        <div class="demo-account-edit-form__address">
            <p class="demo-account-edit-form__address-lines">{{ \App\Services\DemoAccount::formattedMailingAddress($user) }}</p>
            <button type="button" class="demo-account-btn demo-account-btn--purple">Change Details</button>
        </div>

        <div class="demo-account-edit-form__password">
            <p class="demo-account-edit-form__password-lead">If you wish to change your password please enter your existing password first:</p>
            <div class="demo-account-edit-form__password-row">
                <label class="demo-account-edit-form__field demo-account-edit-form__field--grow">
                    <span class="demo-account-edit-form__label">Existing Password</span>
                    <input type="password" name="existing_password" autocomplete="current-password">
                </label>
                <a href="#" class="demo-account-edit-form__forgot">Forgot Password</a>
            </div>
            <div class="demo-account-edit-form__grid demo-account-edit-form__grid--2">
                <label class="demo-account-edit-form__field">
                    <span class="demo-account-edit-form__label">New Password</span>
                    <input type="password" name="password" autocomplete="new-password">
                </label>
                <label class="demo-account-edit-form__field">
                    <span class="demo-account-edit-form__label">Confirm New Password</span>
                    <input type="password" name="password_confirmation" autocomplete="new-password">
                </label>
            </div>
        </div>

        <fieldset class="demo-account-edit-form__prefs">
            <legend class="demo-account-edit-form__prefs-legend">Please tick the boxes below to tell us how you would like to hear from us:</legend>
            @foreach ($user['communication_preferences'] as $index => $pref)
                @php
                    $label = is_array($pref) ? ($pref['label'] ?? '') : $pref;
                    $optedIn = is_array($pref) ? ($pref['opted_in'] ?? true) : true;
                @endphp
                <label class="demo-account-edit-form__checkbox">
                    <input type="checkbox" name="communication_preferences[]" value="{{ $index }}" {{ $optedIn ? 'checked' : '' }}>
                    <span>Consent to receive {{ strtolower($label) }}.</span>
                </label>
            @endforeach
            <label class="demo-account-edit-form__checkbox">
                <input type="checkbox" name="communication_preferences[]" value="partners">
                <span>Consent to receive offers from carefully selected partners.</span>
            </label>
        </fieldset>

        <p class="demo-account-edit-form__actions">
            <a href="{{ route('demo.account.information') }}" class="demo-account-btn demo-account-btn--muted">&laquo; Go Back</a>
            <button type="submit" class="demo-account-btn demo-account-btn--save">Submit Form</button>
        </p>
    </form>
@endsection
