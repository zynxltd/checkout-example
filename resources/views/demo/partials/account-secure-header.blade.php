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

        <button
            type="button"
            class="demo-account-nav-toggle"
            id="account-nav-toggle"
            aria-controls="account-nav"
            aria-expanded="false"
            aria-label="Open account menu"
        >
            <span class="demo-account-nav-toggle__bars" aria-hidden="true"></span>
        </button>
    </div>

    @if (! empty($club_member))
        <div class="demo-account-secure-header__club" role="status">
            <span>Club Membership</span>
        </div>
    @endif
</header>
