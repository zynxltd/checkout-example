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
                'horizontal' => true,
                'club_page' => true,
            ])

            <div class="demo-account-club-intro">
                <h2 class="demo-account-club-intro__greeting">Hello {{ $user['display_name'] }}</h2>

                <div class="demo-account-club-dates">
                    <div class="demo-account-club-dates__item">
                        <span class="demo-account-club-dates__label">Membership Start Date</span>
                        <strong>{{ $club['membership_start'] }}</strong>
                    </div>
                    <div class="demo-account-club-dates__item">
                        <span class="demo-account-club-dates__label">Membership End Date</span>
                        <strong>{{ $club['membership_end'] }}</strong>
                    </div>
                </div>
            </div>

            <section class="demo-account-club-block">
                <h3 class="demo-account-club-block__title">
                    @include('demo.partials.account-club-star', ['modifier' => 'inline', 'size' => 16])
                    Your £5 Voucher Codes
                </h3>
                <ul class="demo-account-club-vouchers">
                    @foreach ($club['product_vouchers'] as $voucher)
                        <li class="demo-account-club-vouchers__row">
                            <span class="demo-account-club-vouchers__code">{{ $voucher['code'] }}</span>
                            <span class="demo-account-club-vouchers__action">
                                @if (! empty($voucher['applied']))
                                    <span class="demo-account-club-vouchers__applied">APPLIED</span>
                                @else
                                    <button type="button" class="demo-account-btn demo-account-btn--save demo-account-btn--compact" data-demo-async>Apply Voucher</button>
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
                <ul class="demo-account-club-vouchers">
                    @foreach ($club['postage_vouchers'] as $voucher)
                        <li class="demo-account-club-vouchers__row">
                            <span class="demo-account-club-vouchers__code">{{ $voucher['code'] }}</span>
                            <span class="demo-account-club-vouchers__action">
                                @if (! empty($voucher['applied']))
                                    <span class="demo-account-club-vouchers__applied">APPLIED</span>
                                @else
                                    <button type="button" class="demo-account-btn demo-account-btn--save demo-account-btn--compact" data-demo-async>Apply Voucher</button>
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
