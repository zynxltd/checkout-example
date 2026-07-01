@extends('demo.layout')

@section('title', 'About YouGarden — Our Philosophy')

@section('body_class', 'demo-about-us')

@push('head')
    <link rel="stylesheet" href="{{ asset('css/yg-drawer-theme.css') }}?v={{ filemtime(public_path('css/yg-drawer-theme.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-pdp-reviews-footer.css') }}?v={{ filemtime(public_path('css/demo-pdp-reviews-footer.css')) }}">
    <link rel="stylesheet" href="{{ asset('css/demo-about-us.css') }}?v={{ filemtime(public_path('css/demo-about-us.css')) }}">
@endpush

@section('content')
<div class="demo-site">
    @include('demo.partials.site-chrome', ['cart' => $cart, 'show_trust' => true])

    <main class="demo-about-us-main">
        <nav class="demo-about-us__crumb" aria-label="Breadcrumb">
            <a href="{{ route('demo.pdp') }}">Home</a>
            <span class="demo-about-us__crumb-sep">/</span>
            <span aria-current="page">About Us</span>
        </nav>

        <h1 class="demo-about-us__title">About YouGarden</h1>

        <p class="demo-about-us__lead">
            At YouGarden, our philosophy is simple: gardening is for everyone. Whether you have a full garden, a balcony, or a sunny patio, we help you catch the growing bug &mdash; and even grow your own freshest fruit and vegetables.
        </p>

        <p class="demo-about-us__lead">
            We speak in plain English, simplify the jargon, and give you down-to-earth advice on what to grow and how. With affordable plants delivered straight to your door, a double guarantee on hardy plants, and over a decade of trusted service, buying plants online has never been easier.
        </p>

        <section class="demo-about-us__section" aria-labelledby="about-philosophy">
            <h2 class="demo-about-us__section-title" id="about-philosophy">Our Philosophy &mdash; &ldquo;Gardening for Everyone&rdquo;</h2>
            <p class="demo-about-us__highlight">
                We firmly believe that Gardening is for everyone! That&rsquo;s right; you do not even need a garden to get growing.
            </p>
            <p>
                Sometimes gardening can be a confusing maze of Latin names and strange words and can be confusing or off-putting &mdash; we simplify all and remove all the jargon and give you down to earth advice on what to grow &mdash; and how!
            </p>
            <p>
                We will show you how to get success from our products through our videos and care instructions. We have only chosen plants that are easy to grow and will give successful results with a minimum of experience. From the thousands of plants available, we have picked those that really work and perform. We have done the sifting and choosing for you, to bring you the best.
            </p>
        </section>

        <section class="demo-about-us__section" aria-labelledby="about-nursery">
            <h2 class="demo-about-us__section-title" id="about-nursery">Our Nursery</h2>
            <p>
                We&rsquo;re lucky enough to have our very own nursery over here in rural Lincolnshire, spanning across 11 acres, fully owned, with a brand-new purpose-built packhouse part funded by the European Agricultural Fund for Rural Development.
            </p>
            <p>
                Having our own nursery means we are constantly in close contact with our plants and we even grow some of our own, or pot on smaller plants to give them time to establish before becoming available to buy. This means we can guarantee your plants will thrive because we&rsquo;ve grown them ourselves! We also source product locally, nationally and internationally to ensure we give our customers the best range, highest quality and greatest value for money.
            </p>
            <p>
                We have a highly experienced, talented and busy team over at the nursery who are busy packing and preparing orders. They&rsquo;ll stamp your package with courier instructions to take care when handling and send it on its way to you in nursery fresh condition.
            </p>
        </section>

        <section class="demo-about-us__collections" aria-labelledby="about-collections">
            <h2 class="demo-about-us__collections-title" id="about-collections">Explore our collections</h2>
            <div class="demo-about-us__grid">
                @foreach ($collections as $collection)
                    <a href="{{ $collection['url'] }}" class="demo-about-us__card">
                        <div class="demo-about-us__card-image">
                            <img
                                src="{{ asset($collection['image']) }}"
                                alt="{{ $collection['title'] }}"
                                width="400"
                                height="400"
                                loading="lazy"
                            >
                        </div>
                        <div class="demo-about-us__card-body">
                            <h3 class="demo-about-us__card-title">{{ $collection['title'] }}</h3>
                            <span class="demo-about-us__card-cta">Shop now</span>
                        </div>
                    </a>
                @endforeach
            </div>
        </section>

        <section class="demo-about-us__funded" aria-labelledby="about-funded">
            <p class="demo-about-us__funded-title" id="about-funded">Funded by</p>
            <div class="demo-about-us__funded-logos">
                <img src="https://s3.us-east-1.amazonaws.com/YouGarden/eu%20logo.jpg" alt="European Agricultural Fund for Rural Development" width="260" height="96">
                <img src="https://s3.us-east-1.amazonaws.com/YouGarden/leader_logo.jpg" alt="LEADER programme" width="108" height="96">
                <img src="https://s3.us-east-1.amazonaws.com/YouGarden/washfense_logo.jpg" alt="Washfense" width="215" height="96">
            </div>
        </section>
    </main>

    @include('demo.partials.site-shell-footer')
</div>

<div id="yg-drawer-mount">
    @include('demo.partials.drawer', ['cart' => $cart])
</div>
@endsection

@push('scripts')
    <script src="{{ asset('js/yg-drawer-theme.js') }}?v={{ filemtime(public_path('js/yg-drawer-theme.js')) }}" defer></script>
@endpush
