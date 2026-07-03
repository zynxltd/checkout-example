@extends('demo.layouts.account-dashboard')

@section('title', 'Amend delivery address — YouGarden')

@section('account_banner', 'Your account')

@section('account_content')
    @php
        $delivery = $user['delivery_addresses'][0] ?? null;
        $lines = $delivery['lines'] ?? [];
        $addressLines = [
            1 => $lines['line1'] ?? '',
            2 => $lines['line2'] ?? '',
            3 => $lines['town'] ?? '',
            4 => '',
            5 => '',
        ];
    @endphp

    <h2 class="demo-account-panel__title">Amend Delivery Address</h2>

    <form class="demo-account-amend-form" action="#" method="post" data-demo-form-loading>
        @csrf
        <div class="demo-account-amend-form__grid">
            <label class="demo-account-amend-form__checkbox">
                <input type="checkbox" name="default_address" {{ ! empty($delivery['is_default']) ? 'checked' : '' }}>
                <span>Default Address?</span>
            </label>

            <label class="demo-account-amend-form__field">
                <span class="demo-account-amend-form__label">Address Line 1*</span>
                <input type="text" name="address_line_1" value="{{ $addressLines[1] }}">
            </label>

            <label class="demo-account-amend-form__field">
                <span class="demo-account-amend-form__label">Delivery Name*</span>
                <input type="text" name="delivery_name" value="{{ $delivery['name'] ?? $user['display_name'] }}">
            </label>

            <label class="demo-account-amend-form__field">
                <span class="demo-account-amend-form__label">Address Line 2*</span>
                <input type="text" name="address_line_2" value="{{ $addressLines[2] }}">
            </label>

            <label class="demo-account-amend-form__field">
                <span class="demo-account-amend-form__label">Delivery Business Name</span>
                <input type="text" name="delivery_business" value="{{ $delivery['business_name'] ?? '' }}">
            </label>

            <label class="demo-account-amend-form__field">
                <span class="demo-account-amend-form__label">Address Line 3*</span>
                <input type="text" name="address_line_3" value="{{ $addressLines[3] }}">
            </label>

            <label class="demo-account-amend-form__field">
                <span class="demo-account-amend-form__label">Telephone Number*</span>
                <input type="text" name="telephone" value="{{ $delivery['phone'] ?? $user['phone'] }}">
            </label>

            <label class="demo-account-amend-form__field">
                <span class="demo-account-amend-form__label">Address Line 4*</span>
                <input type="text" name="address_line_4" value="{{ $addressLines[4] }}">
            </label>

            <div class="demo-account-amend-form__spacer" aria-hidden="true"></div>

            <label class="demo-account-amend-form__field">
                <span class="demo-account-amend-form__label">Address Line 5*</span>
                <input type="text" name="address_line_5" value="{{ $addressLines[5] }}">
            </label>

            <div class="demo-account-amend-form__spacer" aria-hidden="true"></div>

            <div class="demo-account-amend-form__postcode">
                <label class="demo-account-amend-form__field">
                    <span class="demo-account-amend-form__label">Post Code*</span>
                    <input type="text" name="postcode" value="{{ $lines['postcode'] ?? '' }}">
                </label>
                <button type="button" class="demo-account-btn demo-account-btn--purple demo-account-amend-form__find">Find Address</button>
            </div>

            <div class="demo-account-amend-form__spacer" aria-hidden="true"></div>

            <div class="demo-account-amend-form__country">
                <span class="demo-account-amend-form__label">Country</span>
                <p>{{ strtoupper($lines['country'] ?? 'UNITED KINGDOM') }}</p>
            </div>
        </div>

        <div class="demo-account-amend-form__actions">
            <a href="{{ route('demo.account.delivery') }}" class="demo-account-btn demo-account-btn--muted">&laquo; Go Back</a>
            <button type="submit" class="demo-account-btn demo-account-btn--save">Save Address</button>
        </div>
    </form>
@endsection
