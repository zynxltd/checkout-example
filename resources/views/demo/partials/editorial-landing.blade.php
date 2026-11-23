@php
    $chipAttr = $chip_attr;
    $hero = $hero ?? [];
    $roundels = $roundels ?? [];
    $strip = $strip ?? null;
    $campaigns = $campaigns ?? [];
    $depts = $depts ?? [];
    $spotlight = $spotlight ?? null;
@endphp

<nav class="demo-listing__crumb yg-el-crumb" aria-label="Breadcrumb">
    <a href="{{ route('demo.home') }}" class="demo-listing__crumb-link--home">
        <span class="demo-listing__crumb-home" aria-hidden="true">@include('demo.partials.icon', ['name' => 'home', 'width' => 14, 'height' => 14])</span>
        <span class="visually-hidden">Home</span>
    </a>
    <span class="demo-listing__crumb-sep" aria-hidden="true">|</span>
    <span aria-current="page">{{ $crumb }}</span>
</nav>

<section class="yg-el-hero" aria-labelledby="yg-el-hero-title">
    <div class="yg-el-hero__media">
        <img
            src="{{ asset($hero['image']) }}"
            alt=""
            width="1920"
            height="700"
            fetchpriority="high"
        >
    </div>
    <div class="yg-el-hero__inner">
        <div class="yg-el-hero__card">
            <p class="yg-el-hero__kicker">{{ $hero['kicker'] }}</p>
            <h1 id="yg-el-hero-title" class="yg-el-hero__title">{{ $hero['title'] }}</h1>
            <p class="yg-el-hero__lede">{{ $hero['lede'] }}</p>
            <a class="yg-el-cta" href="{{ $hero['cta_href'] }}"><span>{{ $hero['cta'] }}</span><span class="yg-el-cta__icon" aria-hidden="true"></span></a>
        </div>
    </div>
</section>

<nav class="yg-el-roundels" aria-label="{{ $roundel_label }}">
    @foreach ($roundels as $roundel)
        <button
            type="button"
            class="yg-el-roundel{{ $loop->first ? ' is-on' : '' }}"
            {{ $chipAttr }}="{{ $roundel['chip'] }}"
            aria-pressed="{{ $loop->first ? 'true' : 'false' }}"
        >
            <span class="yg-el-roundel__img">
                <img src="{{ asset($roundel['image']) }}" alt="" width="176" height="176">
            </span>
            <span class="yg-el-roundel__label">{{ $roundel['label'] }}</span>
        </button>
    @endforeach
</nav>

@if ($strip)
    <p class="yg-el-strip">{{ $strip }}</p>
@endif
