@extends('demo.layouts.account-dashboard')

@section('title', 'Order '.$order['id'].' — YouGarden')

@section('account_banner', 'Your account')

@section('account_content')
    <p class="demo-account-back">
        <a href="{{ route('demo.account.orders') }}">&laquo; Back to orders</a>
    </p>

    <h2 class="demo-account-panel__title">Order {{ $order['id'] }}</h2>
    <p class="demo-account-panel__meta">
        Placed {{ $order['date'] }} · {{ $order['status'] }}
    </p>

    @if (! empty($order['tracking']))
        <div class="demo-account-order-track-cta">
            <p>Tracking number: <strong>{{ $order['tracking'] }}</strong></p>
            <a href="{{ route('demo.account.order.track', ['orderId' => $order['id']]) }}" class="demo-account-btn demo-account-btn--save">Track Order</a>
        </div>
    @endif

    <div class="demo-account-section">
        <h3 class="demo-account-section__head">Order items</h3>
        <div class="demo-account-section__body demo-account-order-items">
            <table class="demo-account-table">
                <thead>
                    <tr>
                        <th scope="col">Product</th>
                        <th scope="col">Qty</th>
                        <th scope="col">Price</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($order['items'] ?? [] as $item)
                        <tr>
                            <td>{{ $item['name'] }}</td>
                            <td>{{ $item['qty'] }}</td>
                            <td>£{{ number_format($item['price'] * $item['qty'], 2) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
            <p class="demo-account-order-total">
                <span>Delivery</span>
                <strong>£{{ number_format($order['delivery'] ?? 0, 2) }}</strong>
            </p>
            <p class="demo-account-order-total demo-account-order-total--grand">
                <span>Order total</span>
                <strong>£{{ number_format($order['value'], 2) }}</strong>
            </p>
        </div>
    </div>
@endsection
