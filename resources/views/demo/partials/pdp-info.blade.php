@php
    $sections = $product['content_sections'] ?? [];
@endphp

@if(count($sections) > 0)
<div class="demo-pdp__below">
    @include('demo.partials.plant-calendar', ['product' => $product])

    <div class="demo-pdp-info" data-pdp-info>
        <h2 class="demo-pdp-info__heading">Product information</h2>

        <nav class="demo-pdp-info__nav" aria-label="Product information sections">
            @foreach($sections as $section)
            <button
                type="button"
                class="demo-pdp-info__chip"
                data-pdp-info-jump="{{ $section['id'] }}"
                aria-controls="pdp-info-{{ $section['id'] }}"
            >{{ $section['title'] }}</button>
            @endforeach
        </nav>

        <div class="demo-pdp-info__cards">
            @foreach($sections as $section)
            @php
                $isOpen = !empty($section['open']);
            @endphp
            <article
                class="demo-pdp-info-card @if($isOpen) is-open @endif"
                id="pdp-info-{{ $section['id'] }}"
                data-pdp-info-card
            >
                <button
                    type="button"
                    class="demo-pdp-info-card__toggle"
                    aria-expanded="{{ $isOpen ? 'true' : 'false' }}"
                    aria-controls="pdp-info-panel-{{ $section['id'] }}"
                >
                    <span class="demo-pdp-info-card__title">{{ $section['title'] }}</span>
                    <span class="demo-pdp-info-card__control" data-pdp-info-label>{{ $isOpen ? 'Hide' : 'Show' }}</span>
                </button>

                <div
                    class="demo-pdp-info-card__panel"
                    id="pdp-info-panel-{{ $section['id'] }}"
                    @unless($isOpen) hidden @endunless
                >
                    @foreach($section['paragraphs'] ?? [] as $paragraph)
                    <p class="demo-pdp-info-card__p">{{ $paragraph }}</p>
                    @endforeach

                    @if(!empty($section['bullets']))
                    <ul class="demo-pdp-info-card__list">
                        @foreach($section['bullets'] as $bullet)
                        <li>{{ $bullet }}</li>
                        @endforeach
                    </ul>
                    @endif

                    @foreach($section['blocks'] ?? [] as $block)
                    @if(!empty($block['heading']))
                    <h3 class="demo-pdp-info-card__h3">{{ $block['heading'] }}</h3>
                    @endif
                    @if(!empty($block['paragraphs']))
                        @foreach($block['paragraphs'] as $paragraph)
                        <p class="demo-pdp-info-card__p">{{ $paragraph }}</p>
                        @endforeach
                    @endif
                    @if(!empty($block['bullets']))
                    <ul class="demo-pdp-info-card__list">
                        @foreach($block['bullets'] as $bullet)
                        <li>{{ $bullet }}</li>
                        @endforeach
                    </ul>
                    @endif
                    @endforeach

                    @if(!empty($section['placeholder']))
                    <p class="demo-pdp-info-card__placeholder">{{ $section['placeholder'] }}</p>
                    @endif
                </div>
            </article>
            @endforeach
        </div>
    </div>
</div>
@endif
