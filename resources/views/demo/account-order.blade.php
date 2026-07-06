@extends('demo.layouts.account-dashboard')

@section('title', 'Order '.$order['id'].' — YouGarden')

@section('account_banner', 'Your account')

@section('account_content')
    @php
        $billing = \App\Services\DemoAccount::orderBillingAddress($order, $user);
        $delivery = \App\Services\DemoAccount::orderDeliveryAddress($order, $user);
        $subtotal = $order['subtotal'] ?? collect($order['items'] ?? [])->sum(fn ($item) => ($item['price'] ?? 0) * ($item['qty'] ?? 0));
    @endphp

    <div class="demo-account-order-addresses">
        <div class="demo-account-order-address">
            <h3 class="demo-account-order-address__title">Billing Address</h3>
            <p class="demo-account-order-address__body">{{ \App\Services\DemoAccount::formattedOrderAddress($billing) }}</p>
        </div>
        <div class="demo-account-order-address">
            <h3 class="demo-account-order-address__title">Delivery Address</h3>
            <p class="demo-account-order-address__body">{{ \App\Services\DemoAccount::formattedOrderAddress($delivery) }}</p>
        </div>
    </div>

    <div class="demo-account-section">
        <div class="demo-account-section__body demo-account-order-items">
            <table class="demo-account-table demo-account-table--order">
                <thead>
                    <tr>
                        <th scope="col">Order</th>
                        <th scope="col">Qty</th>
                        <th scope="col" class="demo-account-table__total-col">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($order['items'] ?? [] as $item)
                        <tr>
                            <td>
                                <div class="demo-account-order-product">
                                    @if (! empty($item['image']))
                                        <img
                                            class="demo-account-order-product__image"
                                            src="{{ asset($item['image']) }}"
                                            alt=""
                                            width="72"
                                            height="72"
                                            loading="lazy"
                                        >
                                    @endif
                                    <div class="demo-account-order-product__copy">
                                        <p class="demo-account-order-product__name">{{ $item['name'] }}</p>
                                        @if (! empty($item['product_number']))
                                            <p class="demo-account-order-product__sku">Product Number: {{ $item['product_number'] }}</p>
                                        @endif
                                    </div>
                                </div>
                            </td>
                            <td>{{ $item['qty'] }}</td>
                            <td class="demo-account-table__total-col">£{{ number_format($item['price'] * $item['qty'], 2) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="demo-account-order-summary">
                <table class="demo-account-order-summary__table">
                    <tbody>
                        <tr>
                            <th scope="row">Sub Total</th>
                            <td>£{{ number_format($subtotal, 2) }}</td>
                        </tr>
                        <tr>
                            <th scope="row">Delivery Cost</th>
                            <td>£{{ number_format($order['delivery'] ?? 0, 2) }}</td>
                        </tr>
                        <tr class="demo-account-order-summary__total">
                            <th scope="row">Order Total</th>
                            <td>£{{ number_format($order['value'], 2) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    @if (! empty($order['tracking']))
        <div class="demo-account-order-track-cta">
            <a
                href="{{ \App\Services\DemoAccount::orderTrackingUrl($order) }}"
                class="demo-account-btn demo-account-btn--track"
                @if (! empty($order['tracking_url'])) target="_blank" rel="noopener" @endif
            >Track Order</a>
        </div>
    @endif

    <p class="demo-account-order-back">
        <a href="{{ route('demo.account.orders') }}" class="demo-account-btn demo-account-btn--muted">&laquo; Back to Order History</a>
    </p>
@endsection
