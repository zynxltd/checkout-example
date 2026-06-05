@extends('demo.layouts.account-dashboard')

@section('title', 'Delivery information — YouGarden')

@section('account_banner', 'Your account')

@section('account_content')
    <h2 class="demo-account-panel__title">Your Delivery Information</h2>
    <p class="demo-account-panel__meta">Account Number: {{ $user['account_number'] }}</p>

    <div class="demo-account-address-card">
        <p class="demo-account-address-card__badge">Default Address</p>
        <p class="demo-account-address-card__name">{{ $user['display_name'] }}</p>
        <p class="demo-account-address-card__lines">{{ \App\Services\DemoAccount::formattedAddress($user['address']) }}</p>
        <p class="demo-account-address-card__phone">Telephone: {{ $user['phone'] }}</p>
        <div class="demo-account-address-card__actions">
            <button type="button" class="demo-account-btn demo-account-btn--primary">Amend Address</button>
            <button type="button" class="demo-account-btn demo-account-btn--muted">Delete Address</button>
        </div>
    </div>

    <p class="demo-account-note-inline">Please note: new delivery addresses can be added during the checkout process.</p>
@endsection
