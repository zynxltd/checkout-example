@extends('demo.layout')

@section('title', 'YouGarden TV Live')

@section('body_class', 'demo-tv-live')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-site-footer.css') }}?v={{ filemtime(public_path('css/demo-site-footer.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/tv-live.css') }}?v={{ filemtime(public_path('css/tv-live.css')) }}">
@endpush

@section('content')
<div class="demo-site demo-site--tv-live">
    @include('demo.partials.site-chrome', ['cart' => $cart])

    <main class="tv-shop" id="tv-live-main">
        <section class="tv-shop__cinema" aria-label="Watch the live show">
            <div class="tv-shop__cinema-screen" data-tv-screen>
                <iframe
                    class="tv-shop__cinema-iframe"
                    id="tv-live-iframe"
                    title="YouGarden TV Live stream"
                    src=""
                    data-src="{{ $youtubeEmbed }}"
                    data-channel-url="{{ $youtubeChannelUrl }}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowfullscreen
                ></iframe>
                <div class="tv-shop__cinema-cover" data-tv-video-cover>
                    <button type="button" class="tv-shop__cinema-play" data-tv-load-video>
                        <span class="tv-shop__cinema-play-ring" aria-hidden="true"></span>
                        <span class="tv-shop__cinema-play-label">{{ $schedule['is_live'] ? 'Watch live' : 'Play latest show' }}</span>
                    </button>
                </div>
                <div
                    class="tv-shop__cinema-bar tv-shop__cinema-bar--top"
                    data-tv-schedule
                    data-countdown-target="{{ $schedule['next_iso'] }}"
                    data-status="{{ $schedule['status'] }}"
                >
                    <span class="tv-shop__cinema-brand">YouGarden TV</span>
                    @if($schedule['is_live'])
                    <span class="tv-shop__cinema-tag tv-shop__cinema-tag--live">Live</span>
                    @else
                    <span class="tv-shop__cinema-tag">Thurs 2pm</span>
                    @endif
                    <span class="tv-shop__cinema-countdown">
                        <span data-tv-countdown-label>{{ $schedule['is_live'] ? 'Ends' : 'Starts' }}</span>
                        <strong data-tv-countdown aria-live="polite">--:--</strong>
                    </span>
                    <button type="button" class="tv-shop__cinema-basket" data-open-drawer>
                        Basket · {{ $cart['item_count'] }}
                    </button>
                </div>
                <div class="tv-shop__cinema-bar tv-shop__cinema-bar--bottom">
                    <span class="tv-shop__cinema-offer">Free P&amp;P on show orders</span>
                    <span class="tv-shop__cinema-scroll">Shop today&rsquo;s line-up below ↓</span>
                    <a class="tv-shop__cinema-yt" href="{{ $youtubeChannelUrl }}" target="_blank" rel="noopener noreferrer">YouTube</a>
                </div>
            </div>
        </section>

        <header class="tv-shop__masthead">
            <h1 class="tv-shop__title">{{ $copy['heading'] }}</h1>
            <details class="tv-shop__about">
                <summary>About the show</summary>
                <p class="tv-shop__deck">{{ $copy['intro'] }}</p>
            </details>
        </header>

        <div class="tv-shop__dock" data-tv-dock>
            <div class="tv-shop__dock-inner">
                <label class="tv-shop__search">
                    <span class="tv-shop__search-icon" aria-hidden="true">⌕</span>
                    <input type="search" placeholder="Search today&rsquo;s show" autocomplete="off" data-tv-search>
                </label>
                <div class="tv-shop__chips" role="group" aria-label="Show categories">
                    @foreach($categories as $cat)
                    <button
                        type="button"
                        class="tv-shop__chip{{ $cat['id'] === 'all' ? ' is-active' : '' }}"
                        data-tv-filter="{{ $cat['id'] }}"
                    >{{ $cat['label'] }}</button>
                    @endforeach
                </div>
            </div>
            <p class="tv-shop__dock-meta" data-tv-results>{{ count($lineup) }} items · Tap any card to order</p>
        </div>

        <section class="tv-shop__shelf" aria-label="Tonight's show line-up" id="tv-live-grid">
            @foreach($lineup as $item)
            <article
                class="tv-shop__tile"
                id="tv-{{ $item['line_id'] }}"
                data-tv-card
                data-line-id="{{ $item['line_id'] }}"
                data-category="{{ $item['category'] }}"
                data-search="{{ strtolower($item['name'].' '.$item['category'].' '.($item['deal'] ?? '')) }}"
            >
                @if(!empty($item['deal']))
                <span class="tv-shop__tile-deal">{{ $item['deal'] }}</span>
                @endif
                <div class="tv-shop__tile-media">
                    <img src="{{ asset($item['image']) }}" alt="" width="200" height="200" loading="lazy">
                </div>
                <h3 class="tv-shop__tile-name">{{ $item['name'] }}</h3>
                <div class="tv-shop__tile-foot">
                    <span class="tv-shop__tile-price">£{{ number_format($item['price'], 2) }}</span>
                    <button
                        type="button"
                        class="tv-shop__tile-btn"
                        data-tv-add
                        data-sku="{{ $item['sku'] }}"
                        data-variant="{{ $item['variant'] }}"
                    >Order</button>
                </div>
            </article>
            @endforeach
        </section>

        <p class="tv-shop__empty" data-tv-empty hidden>Nothing matched — try another category or clear your search.</p>

        <div class="tv-shop__sticky-bar" data-tv-sticky hidden>
            <span class="tv-shop__sticky-live">● Live</span>
            <span class="tv-shop__sticky-copy">Shop today&rsquo;s show</span>
            <button type="button" class="tv-shop__sticky-basket" data-open-drawer>
                Basket (<span id="tv-sticky-count">{{ $cart['item_count'] }}</span>)
            </button>
        </div>
    </main>

    @include('demo.partials.site-footer')
</div>

<div id="yg-drawer-mount">
    @include('demo.partials.drawer', ['cart' => $cart])
</div>
@endsection

@push('scripts')
    <script>window.__YG_CART_DRAWER_ENABLED = true;</script>
    <script src="{{ asset('js/yg-drawer-theme.js') }}?v={{ filemtime(public_path('js/yg-drawer-theme.js')) }}" defer></script>
    <script src="{{ asset('js/tv-live.js') }}?v={{ filemtime(public_path('js/tv-live.js')) }}" defer></script>
@endpush
