@extends('demo.layouts.account-dashboard')

@section('title', 'Delivery information — YouGarden')

@section('account_banner', 'Your account')

@section('account_content')
    @if (session('status'))
        <p class="demo-account-flash" role="status">{{ session('status') }}</p>
    @endif

    @if ($errors->has('delivery'))
        <p class="demo-account-flash demo-account-flash--error" role="alert">{{ $errors->first('delivery') }}</p>
    @endif

    <h2 class="demo-account-panel__title">Your Delivery Information</h2>
    <p class="demo-account-panel__meta">Account Number: {{ $user['account_number'] }}</p>

    <div class="demo-account-address-grid">
        @foreach ($user['delivery_addresses'] as $address)
            <div class="demo-account-address-card">
                <div class="demo-account-address-card__body">
                    <div class="demo-account-address-card__badge-slot">
                        @if (! empty($address['is_default']))
                            <p class="demo-account-address-card__badge">Default Address</p>
                        @endif
                    </div>
                    <p class="demo-account-address-card__name">{{ $address['name'] }}</p>
                    <p class="demo-account-address-card__business">{{ $address['business_name'] ?? '' }}</p>
                    <p class="demo-account-address-card__lines">{{ \App\Services\DemoAccount::formattedDeliveryAddress($address) }}</p>
                    <p class="demo-account-address-card__phone">Telephone: {{ $address['phone'] }}</p>
                </div>
                <div class="demo-account-address-card__actions">
                    <a href="{{ route('demo.account.delivery.amend', ['address' => $address['id']]) }}" class="demo-account-btn demo-account-btn--primary">Amend Address</a>
                    <form
                        method="post"
                        action="{{ route('demo.account.delivery.delete') }}"
                        class="demo-account-address-card__delete"
                        data-demo-delete-address
                    >
                        @csrf
                        <input type="hidden" name="address_id" value="{{ $address['id'] }}">
                        <button type="submit" class="demo-account-btn demo-account-btn--muted">Delete Address</button>
                    </form>
                </div>
            </div>
        @endforeach
    </div>

    <p class="demo-account-note-inline">Note: If you would like to create a new delivery address this functionality is available when you place your next order.</p>
@endsection
