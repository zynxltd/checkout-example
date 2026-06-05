@extends('demo.layouts.account-dashboard')

@section('title', 'Account information — YouGarden')

@section('account_banner', 'Your account information')

@section('account_content')
    <dl class="demo-account-dl">
        <div class="demo-account-dl__row">
            <dt>Account Number</dt>
            <dd>{{ $user['account_number'] }}</dd>
        </div>
        <div class="demo-account-dl__row">
            <dt>Name</dt>
            <dd>{{ $user['display_name'] }}</dd>
        </div>
        <div class="demo-account-dl__row">
            <dt>Business Name</dt>
            <dd>{{ $user['business_name'] ?: '—' }}</dd>
        </div>
        <div class="demo-account-dl__row">
            <dt>Telephone</dt>
            <dd>{{ $user['phone'] }}</dd>
        </div>
        <div class="demo-account-dl__row">
            <dt>Email Address</dt>
            <dd><a href="mailto:{{ $user['email'] }}">{{ $user['email'] }}</a></dd>
        </div>
        <div class="demo-account-dl__row">
            <dt>Date Of Birth</dt>
            <dd>{{ $user['date_of_birth'] ?: '—' }}</dd>
        </div>
        <div class="demo-account-dl__row">
            <dt>Primary Mailing Address</dt>
            <dd>{{ \App\Services\DemoAccount::formattedAddress($user['address']) }}</dd>
        </div>
    </dl>

    @if (! empty($user['communication_preferences']))
        <div class="demo-account-section" style="margin-top: 28px;">
            <h3 class="demo-account-section__head">These are your current communication preferences:</h3>
            <ul class="demo-account-prefs demo-account-section__body">
                @foreach ($user['communication_preferences'] as $pref)
                    <li>
                        <span class="demo-account-prefs__tick" aria-hidden="true"></span>
                        <span>Consent to receive {{ strtolower($pref) }}.</span>
                    </li>
                @endforeach
            </ul>
        </div>
    @endif
@endsection
