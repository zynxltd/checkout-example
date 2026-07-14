@extends('demo.layouts.account-dashboard')

@section('title', 'Club membership — YouGarden')

@section('account_banner', 'Your account')

@section('account_content')
    @if (empty($user['club']))
        <div class="demo-account-club-page demo-account-club-page--guest">
            <div class="demo-account-club-guest">
                <img
                    class="demo-account-club-guest__logo"
                    src="{{ asset('images/club/discount-club-logo.png') }}"
                    alt="YouGarden Discount Club"
                    width="220"
                    height="88"
                >
                <h2 class="demo-account-panel__title">Club Membership</h2>
                <p class="demo-account-panel__lead">You are not currently a Discount Club member. Join today to unlock member-only discounts, vouchers and the exclusive Club Magazine.</p>
                <p><a href="{{ route('demo.pdp') }}" class="demo-account-btn demo-account-btn--save">Join the Discount Club</a></p>
            </div>
        </div>
    @else
        @php $club = $user['club']; @endphp

        <div class="demo-account-club-page">
            @include('demo.partials.account-club-benefits', [
                'user' => $user,
                'club_page' => true,
                'compact' => $club_benefits_compact ?? false,
            ])

            <div class="demo-account-club-intro">
                <h2 class="demo-account-club-intro__greeting">Hello {{ $user['display_name'] }}</h2>

                <div class="demo-account-club-dates">
                    <div class="demo-account-club-dates__item">
                        <span class="demo-account-club-dates__label">
                            <span class="demo-account-club-dates__label-full">Membership Start Date</span>
                            <span class="demo-account-club-dates__label-short" aria-hidden="true">Start date</span>
                        </span>
                        <strong>{{ $club['membership_start'] }}</strong>
                    </div>
                    <div class="demo-account-club-dates__item">
                        <span class="demo-account-club-dates__label">
                            <span class="demo-account-club-dates__label-full">Membership End Date</span>
                            <span class="demo-account-club-dates__label-short" aria-hidden="true">End date</span>
                        </span>
                        <strong>{{ $club['membership_end'] }}</strong>
                    </div>
                </div>
            </div>

            <section class="demo-account-club-block">
                <h3 class="demo-account-club-block__title">
                    @include('demo.partials.account-club-star', ['modifier' => 'inline', 'size' => 16])
                    Your £5 Voucher Codes
                </h3>
                <p class="demo-account-club-block__note">Vouchers are applied at checkout under &ldquo;Gift card or voucher&rdquo;.</p>
                <ul class="demo-account-club-vouchers">
                    @foreach ($club['product_vouchers'] as $voucher)
                        @php
                            $voucherApplied = ! empty($voucher['applied'])
                                || \App\Services\DemoCart::voucherCodesMatch(
                                    $voucher['code'] ?? '',
                                    $cart['voucher_code'] ?? ''
                                );
                        @endphp
                        <li class="demo-account-club-vouchers__row">
                            <span class="demo-account-club-vouchers__code">{{ $voucher['code'] }}</span>
                            <span class="demo-account-club-vouchers__action">
                                @if ($voucherApplied)
                                    <span class="demo-account-club-vouchers__applied">APPLIED</span>
                                @else
                                    <a
                                        href="{{ route('demo.checkout', ['voucher' => $voucher['code']]) }}"
                                        class="demo-account-btn demo-account-btn--save demo-account-btn--compact"
                                    >Apply at checkout</a>
                                @endif
                            </span>
                            <span class="demo-account-club-vouchers__expires">expires: {{ $voucher['expires'] }}</span>
                        </li>
                    @endforeach
                </ul>
            </section>

            <section class="demo-account-club-block">
                <h3 class="demo-account-club-block__title">
                    @include('demo.partials.account-club-star', ['modifier' => 'inline', 'size' => 16])
                    Your Postage Vouchers
                </h3>
                <p class="demo-account-club-block__note">Postage vouchers are applied at checkout under &ldquo;Gift card or voucher&rdquo;.</p>
                <ul class="demo-account-club-vouchers">
                    @foreach ($club['postage_vouchers'] as $voucher)
                        @php
                            $voucherApplied = ! empty($voucher['applied'])
                                || \App\Services\DemoCart::voucherCodesMatch(
                                    $voucher['code'] ?? '',
                                    $cart['voucher_code'] ?? ''
                                );
                        @endphp
                        <li class="demo-account-club-vouchers__row">
                            <span class="demo-account-club-vouchers__code">{{ $voucher['code'] }}</span>
                            <span class="demo-account-club-vouchers__action">
                                @if ($voucherApplied)
                                    <span class="demo-account-club-vouchers__applied">APPLIED</span>
                                @else
                                    <a
                                        href="{{ route('demo.checkout', ['voucher' => $voucher['code']]) }}"
                                        class="demo-account-btn demo-account-btn--save demo-account-btn--compact"
                                    >Apply at checkout</a>
                                @endif
                            </span>
                            <span class="demo-account-club-vouchers__expires">expires: {{ $voucher['expires'] }}</span>
                        </li>
                    @endforeach
                </ul>
            </section>

            @include('demo.partials.account-club-magazine', ['user' => $user])
        </div>
    @endif
@endsection