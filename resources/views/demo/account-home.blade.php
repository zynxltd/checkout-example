@extends('demo.layouts.account-dashboard')

@section('title', 'Your account — YouGarden')

@section('account_banner', 'Your account')

@section('account_content')
    <h2 class="demo-account-panel__title">Hello {{ $user['display_name'] }}</h2>
    <p class="demo-account-panel__lead">Welcome to your account. From here you can view a snapshot of your recent activity and update your information when required. Select a link from the menu to view or edit.</p>

    <div class="demo-account-section">
        <h3 class="demo-account-section__head">Contact Information</h3>
        <div class="demo-account-section__body">
            <p>{{ $user['display_name'] }}</p>
            <p><a href="mailto:{{ $user['email'] }}">{{ $user['email'] }}</a></p>
        </div>
    </div>

    <div class="demo-account-section">
        <h3 class="demo-account-section__head">Addresses</h3>
        <div class="demo-account-section__body">
            <div class="demo-account-cols demo-account-cols--2">
                <div>
                    <p><strong>Invoice Address</strong></p>
                    <p>{{ $user['display_name'] }}</p>
                    <p style="white-space: pre-line;">{{ \App\Services\DemoAccount::formattedAddress($user['address']) }}</p>
                    <p>T : {{ $user['phone'] }}</p>
                </div>
                <div>
                    <p><strong>Delivery Address</strong></p>
                    <p>{{ $user['display_name'] }}</p>
                    <p style="white-space: pre-line;">{{ \App\Services\DemoAccount::formattedAddress($user['address']) }}</p>
                </div>
            </div>
        </div>
    </div>
@endsection
