@extends('demo.layout')

@section('title', $finder['title'] . ' — YouGarden')

@section('body_class', 'demo-plant-finder demo-page-enhanced')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/demo-shared-enhanced.css') }}?v={{ filemtime(public_path('css/demo-shared-enhanced.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-reviews-footer.css') }}?v={{ filemtime(public_path('css/demo-pdp-reviews-footer.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-plant-finder.css') }}?v={{ filemtime(public_path('css/demo-plant-finder.css')) }}">
@endpush

@section('content')
<div class="demo-site">
    @include('demo.partials.site-chrome', ['cart' => $cart, 'show_trust' => true])

    <main class="demo-pf-main">
        <nav class="demo-pf__crumb demo-yg-animate" aria-label="Breadcrumb">
            @foreach ($finder['breadcrumb'] as $i => $crumb)
                @if ($i > 0)<span class="demo-pf__crumb-sep">/</span>@endif
                @if ($crumb['url'])
                    <a href="{{ $crumb['url'] }}">{{ $crumb['label'] }}</a>
                @else
                    <span aria-current="page">{{ $crumb['label'] }}</span>
                @endif
            @endforeach
        </nav>

        <header class="demo-pf-hero demo-yg-animate" data-delay="1">
            <p class="demo-pf-hero__eyebrow">Find your perfect plant</p>
            <h1 class="demo-pf-hero__title">{{ $finder['title'] }}</h1>
            <p class="demo-pf-hero__intro">{{ $finder['intro'] }}</p>
        </header>

        <section class="demo-pf-quiz demo-yg-animate" data-delay="2" id="demo-pf-quiz" aria-label="Plant finder questions" data-quiz-steps='@json($finder['quiz'])'>
            <div class="demo-pf-quiz__head">
                <div class="demo-pf-quiz__progress" aria-hidden="true">
                    @foreach ($finder['quiz'] as $i => $step)
                        <span class="demo-pf-quiz__dot{{ $i === 0 ? ' is-active' : '' }}" data-quiz-dot="{{ $i }}"></span>
                    @endforeach
                </div>
                <p class="demo-pf-quiz__step-label" id="demo-pf-quiz-step-label">Step 1 of {{ count($finder['quiz']) }}</p>
            </div>

            @foreach ($finder['quiz'] as $i => $step)
                <div class="demo-pf-quiz__panel{{ $i === 0 ? ' is-active' : '' }}" data-quiz-panel="{{ $i }}" @if($i > 0) hidden @endif>
                    <h2 class="demo-pf-quiz__question" id="demo-pf-quiz-q-{{ $i }}">{{ $step['question'] }}</h2>
                    <p class="demo-pf-quiz__hint">{{ $step['hint'] }}</p>

                    <div class="demo-pf-quiz__options" role="radiogroup" aria-labelledby="demo-pf-quiz-q-{{ $i }}">
                        @foreach ($step['options'] as $option)
                            <button
                                type="button"
                                class="demo-pf-quiz__option"
                                data-quiz-step="{{ $step['id'] }}"
                                data-quiz-option="{{ $option['id'] }}"
                                data-quiz-filters='@json($option['filters'])'
                            >
                                <span class="demo-pf-quiz__option-label">{{ $option['label'] }}</span>
                                <span class="demo-pf-quiz__option-desc">{{ $option['desc'] }}</span>
                            </button>
                        @endforeach
                    </div>
                </div>
            @endforeach

            <div class="demo-pf-quiz__nav">
                <button type="button" class="demo-pf-quiz__back" id="demo-pf-quiz-back" hidden>Back</button>
                <button type="button" class="demo-pf-quiz__skip" id="demo-pf-quiz-skip">Skip questions</button>
                <button type="button" class="demo-pf-quiz__results" id="demo-pf-quiz-results" hidden>See my plants</button>
            </div>

            <div class="demo-pf-quiz__summary" id="demo-pf-quiz-summary" hidden>
                <p class="demo-pf-quiz__summary-title">Your personalised results are ready</p>
                <p class="demo-pf-quiz__summary-text" id="demo-pf-quiz-summary-text">We matched plants to your answers. Tweak filters anytime on the left.</p>
                <button type="button" class="demo-pf-quiz__summary-restart" id="demo-pf-quiz-restart">Start again</button>
            </div>
        </section>

        <div class="demo-pf-layout demo-yg-animate" data-delay="3" id="demo-pf-results-section">
            <aside class="demo-pf-filters" id="demo-pf-filters" aria-label="Plant finder filters">
                <div class="demo-pf-filters__overlay" id="demo-pf-filters-overlay" tabindex="-1" aria-hidden="true"></div>

                <div class="demo-pf-filters__panel" id="demo-pf-filters-panel" role="dialog" aria-modal="true" aria-labelledby="demo-pf-filters-title">
                    <header class="demo-pf-filters__head">
                        <h2 class="demo-pf-filters__title" id="demo-pf-filters-title">Refine your search</h2>
                        <button type="button" class="demo-pf-filters__close" id="demo-pf-filters-close" aria-label="Close filters">
                            @include('demo.partials.icon', ['name' => 'close'])
                        </button>
                    </header>

                    <form class="demo-pf-filters__form" id="demo-pf-filters-form">
                        <fieldset class="demo-pf-filters__group">
                            <legend class="demo-pf-filters__legend">When to plant</legend>
                            <label class="demo-pf-filters__field">
                                <span class="demo-pf-filters__label">Planting time</span>
                                <span class="demo-pf-filters__select-wrap">
                                    <select class="demo-pf-filters__select" name="planting" data-pf-filter="planting">
                                        <option value="">Any month</option>
                                        @foreach ($finder['months'] as $value => $label)
                                            <option value="{{ $value }}">{{ $label }}</option>
                                        @endforeach
                                    </select>
                                    <span class="demo-pf-filters__chevron" aria-hidden="true">▾</span>
                                </span>
                            </label>
                        </fieldset>

                        <fieldset class="demo-pf-filters__group">
                            <legend class="demo-pf-filters__legend">Seasonal interest</legend>
                            <label class="demo-pf-filters__field">
                                <span class="demo-pf-filters__label">Flowering time</span>
                                <span class="demo-pf-filters__select-wrap">
                                    <select class="demo-pf-filters__select" name="flowering" data-pf-filter="flowering">
                                        <option value="">Any month</option>
                                        @foreach ($finder['months'] as $value => $label)
                                            <option value="{{ $value }}">{{ $label }}</option>
                                        @endforeach
                                    </select>
                                    <span class="demo-pf-filters__chevron" aria-hidden="true">▾</span>
                                </span>
                            </label>
                            <label class="demo-pf-filters__field">
                                <span class="demo-pf-filters__label">Fruiting time</span>
                                <span class="demo-pf-filters__select-wrap">
                                    <select class="demo-pf-filters__select" name="fruiting" data-pf-filter="fruiting">
                                        <option value="">Any month</option>
                                        @foreach ($finder['months'] as $value => $label)
                                            <option value="{{ $value }}">{{ $label }}</option>
                                        @endforeach
                                    </select>
                                    <span class="demo-pf-filters__chevron" aria-hidden="true">▾</span>
                                </span>
                            </label>
                        </fieldset>

                        <fieldset class="demo-pf-filters__group">
                            <legend class="demo-pf-filters__legend">Category</legend>
                            <label class="demo-pf-filters__field">
                                <span class="demo-pf-filters__label">Category</span>
                                <span class="demo-pf-filters__select-wrap">
                                    <select class="demo-pf-filters__select" name="category" data-pf-filter="category">
                                        @foreach ($finder['categories'] as $value => $label)
                                            <option value="{{ $value }}">{{ $label }}</option>
                                        @endforeach
                                    </select>
                                    <span class="demo-pf-filters__chevron" aria-hidden="true">▾</span>
                                </span>
                            </label>
                        </fieldset>

                        <fieldset class="demo-pf-filters__group">
                            <legend class="demo-pf-filters__legend">Plant characteristics</legend>
                            <div class="demo-pf-traits">
                                @foreach ($finder['characteristics'] as $trait)
                                    <label class="demo-pf-trait">
                                        <input type="checkbox" name="traits[]" value="{{ $trait['id'] }}" data-pf-trait="{{ $trait['id'] }}">
                                        <span class="demo-pf-trait__pill">{{ $trait['label'] }}</span>
                                    </label>
                                @endforeach
                            </div>
                        </fieldset>

                        <div class="demo-pf-filters__actions">
                            <button type="reset" class="demo-pf-filters__reset" id="demo-pf-filters-reset">Clear all filters</button>
                            <button type="button" class="demo-pf-filters__apply" id="demo-pf-filters-apply">Show results</button>
                        </div>
                    </form>
                </div>
            </aside>

            <section class="demo-pf-results" aria-label="Plant finder results">
                <div class="demo-pf-results__toolbar">
                    <button type="button" class="demo-pf-results__open-filters" id="demo-pf-filters-open" aria-expanded="false" aria-controls="demo-pf-filters-panel">
                        Refine search
                    </button>
                    <p class="demo-pf-results__count" id="demo-pf-results-count" aria-live="polite">
                        <span id="demo-pf-results-count-num">{{ count($finder['products']) }}</span> plants match
                    </p>
                    <label class="demo-pf-results__sort">
                        <span class="demo-pf-results__sort-label">Sort</span>
                        <span class="demo-pf-filters__select-wrap">
                            <select class="demo-pf-filters__select demo-pf-filters__select--sort" name="sort" id="demo-pf-sort">
                                @foreach ($finder['sort_options'] as $option)
                                    <option value="{{ $option['value'] }}">{{ $option['label'] }}</option>
                                @endforeach
                            </select>
                            <span class="demo-pf-filters__chevron" aria-hidden="true">▾</span>
                        </span>
                    </label>
                </div>

                <div class="demo-pf-active" id="demo-pf-active" hidden>
                    <p class="demo-pf-active__label">Your selections</p>
                    <ul class="demo-pf-active__list" id="demo-pf-active-list"></ul>
                </div>

                <div class="demo-pf-empty" id="demo-pf-empty" hidden>
                    <p class="demo-pf-empty__title">No plants match your filters</p>
                    <p class="demo-pf-empty__text">Try removing a filter or answering the questions again with broader choices.</p>
                    <button type="button" class="demo-pf-empty__reset" id="demo-pf-empty-reset">Clear all filters</button>
                </div>

                <div class="demo-pf-grid" id="demo-pf-grid">
                    @foreach ($finder['products'] as $product)
                        @php
                            $topTraits = array_slice($product['traits'], 0, 3);
                        @endphp
                        <article
                            class="demo-pf-card"
                            data-pf-card
                            data-name="{{ $product['name'] }}"
                            data-price="{{ $product['price'] }}"
                            data-category="{{ $product['category'] }}"
                            data-planting="{{ implode(',', $product['planting']) }}"
                            data-flowering="{{ implode(',', $product['flowering']) }}"
                            data-fruiting="{{ implode(',', $product['fruiting']) }}"
                            data-traits="{{ implode(' ', $product['traits']) }}"
                        >
                            <a href="{{ $product['url'] }}" class="demo-pf-card__media">
                                <img
                                    src="{{ asset($product['image']) }}"
                                    alt="{{ $product['name'] }}"
                                    width="500"
                                    height="500"
                                    loading="lazy"
                                >
                                <span class="demo-pf-card__overlay">View plant</span>
                                @if ($product['discount'] > 0)
                                    <span class="demo-pf-card__badge demo-pf-card__badge--sale">{{ $product['discount'] }}% off</span>
                                @endif
                                @if (in_array('easy', $product['traits'], true))
                                    <span class="demo-pf-card__badge demo-pf-card__badge--easy">Easy grow</span>
                                @endif
                            </a>

                            <div class="demo-pf-card__body">
                                <span class="demo-pf-card__category">{{ $product['category_label'] }}</span>
                                <h3 class="demo-pf-card__title">
                                    <a href="{{ $product['url'] }}">{{ $product['name'] }}</a>
                                </h3>

                                @if (! empty($topTraits))
                                    <ul class="demo-pf-card__traits" aria-label="Key characteristics">
                                        @foreach ($topTraits as $traitId)
                                            <li>{{ $finder['trait_labels'][$traitId] ?? $traitId }}</li>
                                        @endforeach
                                    </ul>
                                @endif

                                <div class="demo-pf-card__meta">
                                    <div class="demo-pf-card__rating" aria-label="{{ number_format($product['rating'], 1) }} out of 5 stars, {{ number_format($product['reviews']) }} reviews">
                                        @include('demo.partials.feefo-stars', [
                                            'rating' => $product['rating'],
                                            'reviews' => $product['reviews'],
                                        ])
                                    </div>
                                    <div class="demo-pf-card__price-block">
                                        @if ($product['was_price'])
                                            <span class="demo-pf-card__was">Was £{{ number_format($product['was_price'], 2) }}</span>
                                        @endif
                                        <span class="demo-pf-card__price">
                                            {{ $product['price_label'] }} <strong>£{{ number_format($product['price'], 2) }}</strong>
                                        </span>
                                    </div>
                                </div>

                                <a href="{{ $product['url'] }}" class="demo-pf-card__cta">Find out more</a>
                            </div>
                        </article>
                    @endforeach
                </div>
            </section>
        </div>
    </main>

    @include('demo.partials.site-shell-footer')
</div>

<div id="yg-drawer-mount">
    @include('demo.partials.drawer', ['cart' => $cart])
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/yg-drawer-theme.js') }}?v={{ filemtime(public_path('js/yg-drawer-theme.js')) }}" defer></script>
    <script src="{{ asset('js/demo-shared-enhanced.js') }}?v={{ filemtime(public_path('js/demo-shared-enhanced.js')) }}" defer></script>
    <script src="{{ asset('js/demo-plant-finder.js') }}?v={{ filemtime(public_path('js/demo-plant-finder.js')) }}" defer></script>
@endpush
