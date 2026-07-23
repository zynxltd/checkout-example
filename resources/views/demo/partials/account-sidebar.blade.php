@php
    $nav = [
        'home' => ['label' => 'Account Home', 'route' => 'demo.account.home', 'icon' => 'home'],
        'orders' => ['label' => 'Orders', 'route' => 'demo.account.orders', 'icon' => 'orders'],
        'information' => ['label' => 'Account Information', 'route' => 'demo.account.information', 'icon' => 'info'],
        'delivery' => ['label' => 'Delivery Information', 'route' => 'demo.account.delivery', 'icon' => 'delivery'],
    ];

    if (! empty($club_member)) {
        $nav['club'] = ['label' => 'Club Membership', 'route' => 'demo.account.club', 'icon' => 'club'];
    } else {
        $nav['club'] = ['label' => 'Join the Club', 'route' => 'demo.account.club', 'icon' => 'club', 'join' => true];
    }
@endphp

<div class="demo-account-nav-overlay" id="account-nav-overlay" hidden></div>

<aside class="demo-account-nav" id="account-nav" aria-label="Account navigation">
    <div class="demo-account-nav__drawer-head">
        <p class="demo-account-nav__drawer-title">Account menu</p>
        <button
            type="button"
            class="demo-account-nav__close"
            id="account-nav-close"
            aria-label="Close account menu"
        >
            <span aria-hidden="true">&times;</span>
        </button>
    </div>

    <nav class="demo-account-nav__list">
        @foreach ($nav as $key => $item)
            <a
                href="{{ route($item['route']) }}"
                class="demo-account-nav__item{{ ($active ?? '') === $key ? ' is-active' : '' }}{{ ! empty($item['join']) ? ' demo-account-nav__item--join' : '' }}"
                @if(($active ?? '') === $key) aria-current="page" @endif
            >
                <span class="demo-account-nav__icon demo-account-nav__icon--{{ $item['icon'] }}" aria-hidden="true"></span>
                <span class="demo-account-nav__label">{{ $item['label'] }}</span>
            </a>
        @endforeach
    </nav>

    <div class="demo-account-nav__actions">
        <a href="{{ route('demo.home') }}" class="demo-account-nav__btn demo-account-nav__btn--secondary">&laquo; Continue Shopping</a>
        <form method="post" action="{{ route('demo.account.logout') }}" data-demo-form-loading>
            @csrf
            <button type="submit" class="demo-account-nav__btn demo-account-nav__btn--logout">Log Out</button>
        </form>
    </div>
</aside>
