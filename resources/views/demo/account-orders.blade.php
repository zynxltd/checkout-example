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
                            @if (! empty($order['tracking_url']))
                                <a href="{{ $order['tracking_url'] }}">Track</a>
                            @else
                                —
                            @endif
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="demo-account-table__empty">You have no orders to display yet.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
@endsection
