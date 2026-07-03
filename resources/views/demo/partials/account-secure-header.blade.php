<header class="demo-account-secure-header" role="banner">
    <div class="demo-account-secure-header__brand">
        <a href="{{ route('demo.pdp') }}" class="demo-account-secure-header__logo" aria-label="YouGarden home">
            <img
                src="{{ asset('images/yougarden-logo.png') }}"
                alt="YouGarden — gardening for everyone"
                width="300"
                height="96"
            >
        </a>
    </div>

    @if (! empty($club_member))
        <div class="demo-account-secure-header__club" role="status">
            <span>Club Membership</span>
        </div>
    @endif
</header>
