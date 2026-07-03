@extends('demo.layouts.account-dashboard')

@section('title', 'Track order '.$order['id'].' — YouGarden')

@section('account_banner', 'Your account')

@section('account_content')
    <p class="demo-account-back">
        <a href="{{ route('demo.account.order', ['orderId' => $order['id']]) }}">&laquo; Back to order</a>
    </p>

    <h2 class="demo-account-panel__title">Track your order</h2>
    <p class="demo-account-panel__meta">Order {{ $order['id'] }} · {{ $order['carrier'] ?? 'Courier' }}</p>

    <div class="demo-account-section">
        <h3 class="demo-account-section__head">Tracking details</h3>
        <div class="demo-account-section__body">
            <p><strong>Tracking number:</strong> {{ $order['tracking'] }}</p>
            <p><strong>Status:</strong> {{ $order['status'] }}</p>
        </div>
    </div>

    <ol class="demo-account-track-steps">
        @foreach ($order['tracking_steps'] ?? [] as $step)
            <li class="demo-account-track-steps__item{{ ! empty($step['complete']) ? ' is-complete' : '' }}">
                <span class="demo-account-track-steps__dot" aria-hidden="true"></span>
                <div>
                    <strong>{{ $step['label'] }}</strong>
                    <span>{{ $step['date'] }}</span>
                </div>
            </li>
        @endforeach
    </ol>
@endsection
