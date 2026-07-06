@extends('demo.layouts.account-dashboard')

@section('title', 'Update account information — YouGarden')

@section('account_banner', 'Update your account information')

@section('account_content')
    @php
        $invoice = $user['invoice_address'] ?? [];
    @endphp

    @if ($errors->any())
        <div class="demo-account-flash demo-account-flash--error" role="alert">
            <ul class="demo-account-flash__list">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

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
            <p class="demo-account-edit-form__address-lines" id="invoice-address-display">{{ \App\Services\DemoAccount::formattedMailingAddress($user) }}</p>
            <button type="button" class="demo-account-btn demo-account-btn--purple" data-invoice-address-toggle aria-expanded="false" aria-controls="invoice-address-fields">Change Details</button>
        </div>

        <div class="demo-account-edit-form__invoice-fields" id="invoice-address-fields" hidden>
            <input type="hidden" name="invoice_address_open" value="0" data-invoice-address-open>
            <div
                class="demo-account-postcode-lookup"
                id="invoice-postcode-lookup"
                data-postcode-lookup
                data-postcode-fields='{"postcode":"invoice_postcode","line1":"invoice_line_1","line2":"invoice_line_2","town":"invoice_town"}'
            >
                <label class="demo-account-edit-form__field demo-account-postcode-lookup__field">
                    <span class="demo-account-edit-form__label">Postcode*</span>
                    <input
                        type="text"
                        name="invoice_postcode"
                        id="invoice_postcode"
                        data-postcode-input
                        value="{{ old('invoice_postcode', $invoice['postcode'] ?? '') }}"
                        autocomplete="postal-code"
                    >
                </label>
                <button type="button" class="demo-account-btn demo-account-btn--purple" data-postcode-find>Find Address</button>
                <ul class="demo-postcode-suggest" data-postcode-suggest hidden role="listbox" aria-label="Address suggestions"></ul>
            </div>
            <div class="demo-account-edit-form__grid demo-account-edit-form__grid--2">
                <label class="demo-account-edit-form__field">
                    <span class="demo-account-edit-form__label">Address Line 1*</span>
                    <input type="text" name="invoice_line_1" id="invoice_line_1" value="{{ old('invoice_line_1', $invoice['line1'] ?? '') }}">
                </label>
                <label class="demo-account-edit-form__field">
                    <span class="demo-account-edit-form__label">Address Line 2</span>
                    <input type="text" name="invoice_line_2" id="invoice_line_2" value="{{ old('invoice_line_2', $invoice['line2'] ?? '') }}">
                </label>
                <label class="demo-account-edit-form__field">
                    <span class="demo-account-edit-form__label">Town*</span>
                    <input type="text" name="invoice_town" id="invoice_town" value="{{ old('invoice_town', $invoice['town'] ?? '') }}">
                </label>
            </div>
            <p class="demo-account-edit-form__invoice-note">Country: {{ strtoupper($invoice['country'] ?? 'UNITED KINGDOM') }}</p>
        </div>

        <div class="demo-account-edit-form__password">
            <p class="demo-account-edit-form__password-lead">If you wish to change your password please enter your existing password first:</p>
            <div class="demo-account-edit-form__grid demo-account-edit-form__grid--2 demo-account-edit-form__password-existing">
                <label class="demo-account-edit-form__field">
                    <span class="demo-account-edit-form__label">Existing Password</span>
                    <input type="password" name="existing_password" autocomplete="current-password">
                </label>
                <div class="demo-account-edit-form__forgot-cell">
                    <a href="#" class="demo-account-edit-form__forgot">Forgot Password</a>
                </div>
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
            @foreach ($user['communication_preferences'] as $pref)
                <label class="demo-account-edit-form__checkbox">
                    <input
                        type="checkbox"
                        name="communication_opt_out[]"
                        value="{{ $pref['id'] }}"
                        {{ ! empty($pref['opted_out']) ? 'checked' : '' }}
                    >
                    <span>{{ $pref['text'] }}</span>
                </label>
            @endforeach
        </fieldset>

        <p class="demo-account-edit-form__actions">
            <a href="{{ route('demo.account.information') }}" class="demo-account-btn demo-account-btn--muted">&laquo; Go Back</a>
            <button type="submit" class="demo-account-btn demo-account-btn--save">Submit Form</button>
        </p>
    </form>
@endsection
