@extends('demo.layout')

@section('title', 'YouGarden TV Live')

@section('body_class', 'demo-tv-live')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-reviews-footer.css') }}?v={{ filemtime(public_path('css/demo-pdp-reviews-footer.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-listing.css') }}?v={{ filemtime(public_path('css/demo-listing.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/tv-live.css') }}?v={{ filemtime(public_path('css/tv-live.css')) }}">
@endpush

@section('content')
<div class="demo-site demo-site--tv-live">
    @include('demo.partials.site-chrome', [
        'cart' => $cart,
        'show_trust' => true,
        'search_placeholder' => 'Search show plants…',
    ])

    <main class="tv-live" id="tv-live-main">
        <nav class="tv-live__crumb" aria-label="Breadcrumb">
            <a href="{{ route('demo.home') }}">Home</a>
            <span class="tv-live__crumb-sep" aria-hidden="true">›</span>
            <span aria-current="page">YouGarden TV Live</span>
        </nav>

        <header class="tv-live__intro">
            <div
                class="tv-live__status"
                data-tv-schedule
                data-countdown-target="{{ $schedule['next_iso'] }}"
                data-status="{{ $schedule['status'] }}"
            >
                @if ($schedule['is_live'])
                    <span class="tv-live__badge tv-live__badge--live">
                        <span class="tv-live__badge-dot" aria-hidden="true"></span>
                        Live now
                    </span>
                @else
                    <span class="tv-live__badge">Next show</span>
                @endif
                <span class="tv-live__status-copy">{{ $schedule['show_day_label'] }}</span>
                <span class="tv-live__countdown">
                    <span data-tv-countdown-label>{{ $schedule['is_live'] ? 'Ends in' : 'Starts in' }}</span>
                    <strong data-tv-countdown aria-live="polite">--:--</strong>
                </span>
            </div>

            <h1 class="tv-live__title">{{ $copy['heading'] }}</h1>
            <p class="tv-live__deck">{{ $copy['intro'] }}</p>

            <ul class="tv-live__perks" aria-label="Show benefits">
                @foreach ($copy['perks'] as $perk)
                    <li>{{ $perk }}</li>
                @endforeach
            </ul>
        </header>

        <section class="tv-live__watch" aria-label="Watch the live show">
            <div class="tv-live__player" data-tv-screen>
                <iframe
                    class="tv-live__iframe"
                    id="tv-live-iframe"
                    title="YouGarden TV Live stream"
                    src=""
                    data-src="{{ $youtubeEmbed }}"
                    data-channel-url="{{ $youtubeChannelUrl }}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowfullscreen
                ></iframe>

                <div class="tv-live__cover" data-tv-video-cover style="--tv-poster: url('{{ $youtubePoster }}')">
                    <button type="button" class="tv-live__play" data-tv-load-video>
                        <span class="tv-live__play-icon" aria-hidden="true"></span>
                        <span class="tv-live__play-label">
                            {{ $schedule['is_live'] ? 'Watch live' : 'Play latest show' }}
                        </span>
                    </button>
                    <p class="tv-live__cover-hint">Free to watch · Shop the line-up below while you watch</p>
                </div>
            </div>

            <div class="tv-live__watch-meta">
                <a class="tv-live__yt" href="{{ $youtubeChannelUrl }}" target="_blank" rel="noopener noreferrer">
                    Open YouTube channel
                </a>
                <p class="tv-live__watch-note">Free P&amp;P on show orders while the broadcast is live.</p>
            </div>
        </section>

        <div class="tv-live__toolbar" data-tv-dock>
            <div class="tv-live__toolbar-row">
                <h2 class="tv-live__shelf-title">Today’s show line-up</h2>
                <label class="tv-live__search">
                    <span class="visually-hidden">Search today’s show</span>
                    <input type="search" placeholder="Search today’s show" autocomplete="off" data-tv-search>
                </label>
            </div>
            <div class="tv-live__chips" role="group" aria-label="Filter by category">
                @foreach ($categories as $cat)
                    <button
                        type="button"
                        class="tv-live__chip{{ $cat['id'] === 'all' ? ' is-active' : '' }}"
                        data-tv-filter="{{ $cat['id'] }}"
                    >{{ $cat['label'] }}</button>
                @endforeach
            </div>
            <p class="tv-live__results" data-tv-results>{{ count($lineup) }} items · Add any product straight to your basket</p>
        </div>

        <section class="tv-live__shelf resListingWrapper" aria-label="Today’s show line-up" id="tv-live-grid">
            @foreach ($lineup as $item)
                @php
                    $qvPayload = \App\Services\DemoCart::quickViewPayload([
                        'sku' => $item['sku'],
                        'name' => $item['name'],
                        'image' => $item['image'],
                        'price' => $item['price'],
                        'price_label' => 'Just',
                        'was_price' => $item['was_price'] ?? null,
                        'variant' => $item['variant'],
                        'url' => route('demo.pdp'),
                        'rating' => 4.6,
                        'reviews' => 120,
                        'discount' => 0,
                        'blurb' => ! empty($item['deal']) ? ('Show deal: '.$item['deal']) : 'Featured on YouGarden TV Live.',
                        'description' => $item['name'].' — available while the live show is on. Order now and watch along for expert tips.',
                        'features' => [
                            ['label' => $item['category_label']],
                            ['label' => 'Show exclusive'],
                            ['label' => 'Easy To Grow'],
                        ],
                    ]);
                @endphp
                <article
                    class="tv-live__card category-box{{ ! empty($item['on_air']) ? ' is-on-air' : '' }}"
                    id="tv-{{ $item['line_id'] }}"
                    data-tv-card
                    data-qv-card
                    data-line-id="{{ $item['line_id'] }}"
                    data-category="{{ $item['category'] }}"
                    data-search="{{ strtolower($item['name'].' '.$item['category'].' '.($item['deal'] ?? '')) }}"
                    data-qv-json="{{ json_encode($qvPayload, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE) }}"
                >
                    @if (! empty($item['deal']))
                        <span class="tv-live__deal">{{ $item['deal'] }}</span>
                    @endif

                    <div class="tv-live__card-media imgWrapper">
                        <img
                            src="{{ asset($item['image']) }}"
                            alt=""
                            width="500"
                            height="500"
                            loading="lazy"
                            decoding="async"
                        >
                    </div>

                    <button
                        type="button"
                        class="category-box__qv"
                        data-qv-open
                        aria-haspopup="dialog"
                        aria-controls="listing-quick-view"
                    >Quick view</button>

                    <div class="tv-live__card-body">
                        <p class="tv-live__card-cat">{{ $item['category_label'] }}</p>
                        <h3 class="tv-live__card-name title">{{ $item['name'] }}</h3>
                        <p class="tv-live__card-price price">£{{ number_format($item['price'], 2) }}</p>
                    </div>

                    <button
                        type="button"
                        class="tv-live__add"
                        data-tv-add
                        data-sku="{{ $item['sku'] }}"
                        data-variant="{{ $item['variant'] }}"
                    >Add to basket</button>
                </article>
            @endforeach
        </section>

        <p class="tv-live__empty" data-tv-empty hidden>Nothing matched — try another category or clear your search.</p>
    </main>

    <div class="tv-live__sticky" data-tv-sticky hidden>
        <span class="tv-live__sticky-live{{ $schedule['is_live'] ? ' is-live' : '' }}">
            {{ $schedule['is_live'] ? '● Live' : 'YouGarden TV' }}
        </span>
        <span class="tv-live__sticky-copy">Shop today’s show</span>
        <button type="button" class="tv-live__sticky-basket" data-open-drawer>
            Basket (<span id="tv-sticky-count">{{ $cart['item_count'] }}</span>)
        </button>
    </div>

    @include('demo.partials.site-shell-footer')
</div>

<div id="yg-drawer-mount">
    @include('demo.partials.drawer', ['cart' => $cart])
</div>

@include('demo.partials.listing-quick-view')
@endsection

@push('scripts')
    <script>window.__YG_CART_DRAWER_ENABLED = true;</script>
    <script src="{{ asset('js/yg-drawer-theme.js') }}?v={{ filemtime(public_path('js/yg-drawer-theme.js')) }}" defer></script>
    <script src="{{ asset('js/tv-live.js') }}?v={{ filemtime(public_path('js/tv-live.js')) }}" defer></script>
    <script src="{{ asset('js/demo-listing-quick-view.js') }}?v={{ filemtime(public_path('js/demo-listing-quick-view.js')) }}" defer></script>
@endpush
