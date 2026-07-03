@extends('demo.layouts.account-dashboard')

@section('title', 'Your account — YouGarden')

@section('account_banner', 'Your account')

@section('account_content')
    <h2 class="demo-account-panel__title">Hello {{ $user['display_name'] }}</h2>
    <p class="demo-account-panel__lead">Welcome to your account. From here you can view a snapshot of your recent activity and update your information when required. Select a link from the menu on the left to view or edit.</p>

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
                    @if (! empty($user['business_name']))
                        <p>{{ $user['business_name'] }}</p>
                    @endif
                    <p style="white-space: pre-line;">{{ \App\Services\DemoAccount::formattedAddress($user['invoice_address']) }}</p>
                    <p>T : {{ $user['phone'] }}</p>
                </div>
                <div>
                    <p><strong>Delivery Address</strong></p>
                    @php $delivery = $user['delivery_addresses'][0] ?? null; @endphp
                    @if ($delivery)
                        <p>{{ $delivery['name'] }}</p>
                        @if (! empty($delivery['business_name']))
                            <p>{{ $delivery['business_name'] }}</p>
                        @endif
                        <p style="white-space: pre-line;">{{ \App\Services\DemoAccount::formattedDeliveryAddress($delivery) }}</p>
                    @endif
                </div>
            </div>
        </div>
    </div>
@endsection
