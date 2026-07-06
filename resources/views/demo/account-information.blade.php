@extends('demo.layouts.account-dashboard')

@section('title', 'Account information — YouGarden')

@section('account_banner', 'Your account information')

@section('account_content')
    @if (session('status'))
        <p class="demo-account-flash" role="status">{{ session('status') }}</p>
    @endif

    <div class="demo-account-info-grid">
        <dl class="demo-account-dl demo-account-dl--info">
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
        </dl>

        <div class="demo-account-info-address">
            <h3 class="demo-account-info-address__label">Primary Mailing Address</h3>
            <p class="demo-account-info-address__value">{{ \App\Services\DemoAccount::formattedMailingAddress($user) }}</p>
        </div>
    </div>

    @if (! empty($user['communication_preferences']))
        <div class="demo-account-section" style="margin-top: 28px;">
            <h3 class="demo-account-section__head">These are your current communication preferences:</h3>
            <ul class="demo-account-prefs demo-account-section__body">
                @foreach ($user['communication_preferences'] as $pref)
                    <li>
                        <span class="demo-account-prefs__tick{{ empty($pref['opted_out']) ? '' : ' demo-account-prefs__tick--off' }}" aria-hidden="true"></span>
                        <span>{{ $pref['read_text'] ?? $pref['text'] ?? $pref['label'] ?? '' }}</span>
                    </li>
                @endforeach
            </ul>
        </div>
    @endif

    <p class="demo-account-info-actions">
        <a href="{{ route('demo.account.information.edit') }}" class="demo-account-btn demo-account-btn--update">Update Account Information</a>
    </p>
@endsection
