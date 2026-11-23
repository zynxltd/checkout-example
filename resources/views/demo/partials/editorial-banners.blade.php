@php
    $chipAttr = $chip_attr;
    $campaigns = $campaigns ?? [];
    $depts = $depts ?? [];
    $spotlight = $spotlight ?? null;
@endphp

@if ($campaigns !== [])
    <section class="yg-el-campaigns" aria-label="Featured collections">
        @foreach ($campaigns as $banner)
            <a
                class="yg-el-banner"
                href="{{ $banner['href'] }}"
                @if (! empty($banner['chip'])) {{ $chipAttr }}="{{ $banner['chip'] }}" @endif
            >
                <img src="{{ asset($banner['image']) }}" alt="" width="900" height="560" loading="{{ $loop->first ? 'eager' : 'lazy' }}">
                <div class="yg-el-banner__copy">
                    @if (! empty($banner['kicker']))
                        <p class="yg-el-banner__kicker">{{ $banner['kicker'] }}</p>
                    @endif
                    <h2>{{ $banner['title'] }}</h2>
                    <span class="yg-el-banner__shop">Shop now</span>
                </div>
            </a>
        @endforeach
    </section>
@endif

@if ($depts !== [])
    <section class="yg-el-depts" aria-label="Shop by department">
        @foreach ($depts as $banner)
            <a
                class="yg-el-banner"
                href="{{ $banner['href'] }}"
                @if (! empty($banner['chip'])) {{ $chipAttr }}="{{ $banner['chip'] }}" @endif
            >
                <img src="{{ asset($banner['image']) }}" alt="" width="640" height="400" loading="lazy">
                <div class="yg-el-banner__copy">
                    <h3>{{ $banner['title'] }}</h3>
                    <span class="yg-el-banner__shop">Shop now</span>
                </div>
            </a>
        @endforeach
    </section>
@endif

@if ($spotlight)
    <a
        class="yg-el-spot"
        href="{{ $spotlight['href'] }}"
        @if (! empty($spotlight['chip'])) {{ $chipAttr }}="{{ $spotlight['chip'] }}" @endif
    >
        <img src="{{ asset($spotlight['image']) }}" alt="" width="1200" height="360" loading="lazy">
        <div class="yg-el-spot__copy">
            @if (! empty($spotlight['kicker']))
                <p class="yg-el-banner__kicker">{{ $spotlight['kicker'] }}</p>
            @endif
            <h2>{{ $spotlight['title'] }}</h2>
            <span class="yg-el-cta"><span>{{ $spotlight['cta'] }}</span><span class="yg-el-cta__icon" aria-hidden="true"></span></span>
        </div>
    </a>
@endif
