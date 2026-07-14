@extends('demo.layouts.account-dashboard')

@section('title', 'Your orders — YouGarden')

@section('account_banner', 'Your account')

@section('account_content')
    <h2 class="demo-account-panel__title">View my orders</h2>

    @php
        $ordersPage = $ordersPage ?? [
            'items' => $user['orders'] ?? [],
            'current_page' => 1,
            'last_page' => 1,
            'per_page' => 5,
            'total' => count($user['orders'] ?? []),
            'from' => count($user['orders'] ?? []) ? 1 : 0,
            'to' => count($user['orders'] ?? []),
        ];
    @endphp

    <div class="demo-account-table-wrap">
        <table class="demo-account-table demo-account-table--orders">
            <thead>
                <tr>
                    <th scope="col">Order ID</th>
                    <th scope="col">Date</th>
                    <th scope="col">Order value</th>
                    <th scope="col">Order status</th>
                    <th scope="col">Tracking</th>
                    <th scope="col" class="demo-account-table__action-col"><span class="visually-hidden">Actions</span></th>
                </tr>
            </thead>
            <tbody>
                @forelse ($ordersPage['items'] as $order)
                    <tr>
                        <td data-label="Order ID">
                            <span class="demo-account-orders__id">{{ $order['id'] }}</span>
                        </td>
                        <td data-label="Date">{{ $order['date'] }}</td>
                        <td data-label="Order value">£{{ number_format($order['value'], 2) }}</td>
                        <td data-label="Order status">
                            <span class="demo-account-orders__status">{{ $order['status'] }}</span>
                        </td>
                        <td data-label="Tracking" class="demo-account-table__tracking-col">
                            @if (! empty($order['tracking']))
                                <a
                                    href="{{ \App\Services\DemoAccount::orderTrackingUrl($order) }}"
                                    class="demo-account-btn demo-account-btn--track"
                                    @if (! empty($order['tracking_url'])) target="_blank" rel="noopener" @endif
                                >Track Order</a>
                            @else
                                <span class="demo-account-orders__na">—</span>
                            @endif
                        </td>
                        <td class="demo-account-table__action-col" data-label="">
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

    @if ($ordersPage['last_page'] > 1)
        <nav class="demo-account-pagination" aria-label="Orders pagination">
            <p class="demo-account-pagination__summary">
                Showing {{ $ordersPage['from'] }}–{{ $ordersPage['to'] }} of {{ $ordersPage['total'] }} orders
            </p>
            <ul class="demo-account-pagination__list">
                <li>
                    @if ($ordersPage['current_page'] > 1)
                        <a
                            class="demo-account-pagination__btn"
                            href="{{ route('demo.account.orders', ['page' => $ordersPage['current_page'] - 1]) }}"
                            rel="prev"
                        >&laquo; Previous</a>
                    @else
                        <span class="demo-account-pagination__btn is-disabled" aria-disabled="true">&laquo; Previous</span>
                    @endif
                </li>
                @for ($page = 1; $page <= $ordersPage['last_page']; $page++)
                    <li>
                        @if ($page === $ordersPage['current_page'])
                            <span class="demo-account-pagination__page is-current" aria-current="page">{{ $page }}</span>
                        @else
                            <a
                                class="demo-account-pagination__page"
                                href="{{ route('demo.account.orders', ['page' => $page]) }}"
                            >{{ $page }}</a>
                        @endif
                    </li>
                @endfor
                <li>
                    @if ($ordersPage['current_page'] < $ordersPage['last_page'])
                        <a
                            class="demo-account-pagination__btn"
                            href="{{ route('demo.account.orders', ['page' => $ordersPage['current_page'] + 1]) }}"
                            rel="next"
                        >Next &raquo;</a>
                    @else
                        <span class="demo-account-pagination__btn is-disabled" aria-disabled="true">Next &raquo;</span>
                    @endif
                </li>
            </ul>
        </nav>
    @endif
@endsection
