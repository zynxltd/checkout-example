@extends('demo.layouts.account-dashboard')

@section('title', 'Amend delivery address — YouGarden')

@section('account_banner', 'Your account')

@section('account_content')
    @php
        $lines = $delivery['lines'] ?? [];
        $addressLines = [
            1 => $lines['line1'] ?? '',
            2 => $lines['line2'] ?? '',
            3 => $lines['town'] ?? '',
            4 => $lines['line4'] ?? '',
            5 => $lines['line5'] ?? '',
        ];
    @endphp

    <h2 class="demo-account-panel__title">Amend Delivery Address</h2>

    <form class="demo-account-amend-form" action="{{ route('demo.account.delivery.amend.submit') }}" method="post" data-demo-form-loading>
        @csrf
        <input type="hidden" name="address_id" value="{{ $delivery['id'] }}">

        <div class="demo-account-amend-form__grid">
            <div class="demo-account-amend-form__row demo-account-amend-form__row--checkbox">
                <label class="demo-account-amend-form__checkbox">
                    <input type="checkbox" name="default_address" value="1" {{ ! empty($delivery['is_default']) ? 'checked' : '' }}>
                    <span>Default Address?</span>
                </label>
            </div>

            <div class="demo-account-amend-form__row">
                <label class="demo-account-amend-form__field">
                    <span class="demo-account-amend-form__label">Delivery Name*</span>
                    <input type="text" name="delivery_name" value="{{ old('delivery_name', $delivery['name'] ?? $user['display_name']) }}" required>
                </label>

                <label class="demo-account-amend-form__field">
                    <span class="demo-account-amend-form__label">Address Line 1*</span>
                    <input type="text" name="address_line_1" value="{{ old('address_line_1', $addressLines[1]) }}" required>
                </label>
            </div>

            <div class="demo-account-amend-form__row">
                <label class="demo-account-amend-form__field">
                    <span class="demo-account-amend-form__label">Delivery Business Name</span>
                    <input type="text" name="delivery_business" value="{{ old('delivery_business', $delivery['business_name'] ?? '') }}">
                </label>

                <label class="demo-account-amend-form__field">
                    <span class="demo-account-amend-form__label">Address Line 2*</span>
                    <input type="text" name="address_line_2" value="{{ old('address_line_2', $addressLines[2]) }}">
                </label>
            </div>

            <div class="demo-account-amend-form__row">
                <label class="demo-account-amend-form__field">
                    <span class="demo-account-amend-form__label">Telephone Number*</span>
                    <input type="text" name="telephone" value="{{ old('telephone', $delivery['phone'] ?? $user['phone']) }}" required>
                </label>

                <label class="demo-account-amend-form__field">
                    <span class="demo-account-amend-form__label">Address Line 3*</span>
                    <input type="text" name="address_line_3" value="{{ old('address_line_3', $addressLines[3]) }}" required>
                </label>
            </div>

            <div class="demo-account-amend-form__row">
                <label class="demo-account-amend-form__field">
                    <span class="demo-account-amend-form__label">Address Line 5*</span>
                    <input type="text" name="address_line_5" value="{{ old('address_line_5', $addressLines[5]) }}">
                </label>

                <label class="demo-account-amend-form__field">
                    <span class="demo-account-amend-form__label">Address Line 4*</span>
                    <input type="text" name="address_line_4" value="{{ old('address_line_4', $addressLines[4]) }}">
                </label>
            </div>

            <div class="demo-account-amend-form__row">
                <div class="demo-account-amend-form__row-spacer" aria-hidden="true"></div>

                <div
                    class="demo-account-amend-form__postcode demo-account-postcode-lookup"
                    id="delivery-postcode-lookup"
                    data-postcode-lookup
                    data-postcode-fields='{"postcode":"postcode","line1":"address_line_1","line2":"address_line_2","town":"address_line_3"}'
                >
                    <label class="demo-account-amend-form__field">
                        <span class="demo-account-amend-form__label">Post Code*</span>
                        <div class="demo-account-amend-form__postcode-input-wrap">
                            <input
                                type="text"
                                name="postcode"
                                id="delivery_postcode"
                                data-postcode-input
                                value="{{ old('postcode', $lines['postcode'] ?? '') }}"
                                required
                            >
                            <ul class="demo-postcode-suggest" data-postcode-suggest hidden role="listbox" aria-label="Address suggestions"></ul>
                        </div>
                    </label>
                    <button type="button" class="demo-account-btn demo-account-btn--purple demo-account-amend-form__find" data-postcode-find>Find Address</button>
                </div>
            </div>
        </div>

        <div class="demo-account-amend-form__actions">
            <a href="{{ route('demo.account.delivery') }}" class="demo-account-btn demo-account-btn--muted">&laquo; Go Back</a>
            <button type="submit" class="demo-account-btn demo-account-btn--save">Save Address</button>
        </div>
    </form>
@endsection
