@extends('demo.layouts.account-dashboard')

@section('title', 'Your orders — YouGarden')

@section('account_banner', 'Your account')

@section('account_content')
    <h2 class="demo-account-panel__title">View my orders</h2>

    <div class="demo-account-table-wrap">
        <table class="demo-account-table">
            <thead>
                <tr>
                    <th scope="col">Order ID</th>
                    <th scope="col">Date</th>
                    <th scope="col">Order value</th>
                    <th scope="col">Order status</th>
                    <th scope="col">Tracking</th>
                    <th scope="col" class="demo-account-table__action-col"></th>
                </tr>
            </thead>
            <tbody>
                @forelse ($user['orders'] as $order)
                    <tr>
                        <td>{{ $order['id'] }}</td>
                        <td>{{ $order['date'] }}</td>
                        <td>£{{ number_format($order['value'], 2) }}</td>
                        <td>{{ $order['status'] }}</td>
                        <td>
                            @if (! empty($order['tracking']))
                                <span class="demo-account-table__tracking">{{ $order['tracking'] }}</span>
                                <a href="{{ route('demo.account.order.track', ['orderId' => $order['id']]) }}" class="demo-account-btn demo-account-btn--track">Track Order</a>
                            @else
                                —
                            @endif
                        </td>
                        <td class="demo-account-table__action-col">
                            <a href="{{ route('demo.account.order', ['orderId' => $order['id']]) }}" class="demo-account-table__view">View Order &raquo;</a>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" class="demo-account-table__empty">You have no orders to display yet.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
@endsection
