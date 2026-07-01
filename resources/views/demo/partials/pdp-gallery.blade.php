<div class="demo-pdp-gallery demo-pdp-gallery--yg" data-pdp-gallery>
    <div class="demo-pdp-gallery__stage">
        @if (! empty($product['popular_views']))
            <span class="demo-pdp-gallery__popular">
                <span class="demo-pdp-gallery__popular-label">Popular!</span>
                <span class="demo-pdp-gallery__popular-count">{{ number_format($product['popular_views']) }} Recently viewed</span>
            </span>
        @endif

        <button type="button" class="demo-pdp-gallery__nav demo-pdp-gallery__nav--prev" data-gallery-prev aria-label="Previous image">‹</button>
        <button type="button" class="demo-pdp-gallery__nav demo-pdp-gallery__nav--next" data-gallery-next aria-label="Next image">›</button>

        <div class="demo-pdp-gallery__main" data-gallery-main>
            @foreach ($product['gallery'] as $i => $slide)
                @if (($slide['type'] ?? '') === 'video')
                    <div
                        class="demo-pdp-gallery__video{{ $i === 0 ? ' is-active' : '' }}"
                        data-gallery-slide="{{ $i }}"
                        data-gallery-video
                    >
                        <img src="{{ asset($slide['image']) }}" alt="{{ $slide['alt'] }}" class="demo-pdp-gallery__video-poster">
                        <button type="button" class="demo-pdp-gallery__video-play" data-gallery-video-play aria-label="Play product video">
                            <span aria-hidden="true">▶</span>
                        </button>
                    </div>
                @else
                    <img
                        src="{{ asset($slide['image']) }}"
                        alt="{{ $slide['alt'] }}"
                        class="demo-pdp-gallery__slide{{ $i === 0 ? ' is-active' : '' }}"
                        data-gallery-slide="{{ $i }}"
                        width="900"
                        height="900"
                        loading="{{ $i === 0 ? 'eager' : 'lazy' }}"
                    >
                @endif
            @endforeach
        </div>

        <div class="demo-pdp-gallery__dots" data-gallery-dots>
            @foreach ($product['gallery'] as $i => $slide)
                <button
                    type="button"
                    class="demo-pdp-gallery__dot{{ $i === 0 ? ' is-active' : '' }}"
                    data-gallery-dot="{{ $i }}"
                    aria-label="Show slide {{ $i + 1 }}"
                ></button>
            @endforeach
        </div>
    </div>

    <div class="demo-pdp-gallery__thumbs-row">
        <button type="button" class="demo-pdp-gallery__thumb-scroll" data-gallery-thumb-up aria-label="Scroll thumbnails left">‹</button>
        <div class="demo-pdp-gallery__thumbs" data-gallery-thumbs>
            @foreach ($product['gallery'] as $i => $slide)
                <button
                    type="button"
                    class="demo-pdp-gallery__thumb{{ $i === 0 ? ' is-active' : '' }}"
                    data-gallery-thumb="{{ $i }}"
                    data-gallery-type="{{ $slide['type'] ?? 'image' }}"
                    aria-label="View {{ ($slide['type'] ?? '') === 'video' ? 'video' : 'image' }} {{ $i + 1 }}"
                >
                    <img src="{{ asset($slide['image']) }}" alt="" width="72" height="72" loading="lazy">
                    @if (($slide['type'] ?? '') === 'video')
                        <span class="demo-pdp-gallery__thumb-play" aria-hidden="true">▶</span>
                    @endif
                </button>
            @endforeach
        </div>
        <button type="button" class="demo-pdp-gallery__thumb-scroll" data-gallery-thumb-down aria-label="Scroll thumbnails right">›</button>
    </div>
</div>
