@php $club = $user['club'] ?? null; @endphp

<section class="demo-account-club-block demo-account-club-mag-section" aria-labelledby="club-magazine-title">
    <h3 class="demo-account-club-block__title" id="club-magazine-title">
        @include('demo.partials.account-club-star', ['modifier' => 'inline', 'size' => 16])
        {{ $club['magazine']['headline'] }}
    </h3>

    <div class="demo-account-club-mag">
        <p class="demo-account-club-mag__intro">{{ $club['magazine']['intro'] }}</p>

        <div class="demo-account-club-mag__card">
            <a class="demo-account-club-mag__cover" href="{{ $club['magazine']['url'] }}" target="_blank" rel="noopener" aria-label="Open {{ $club['magazine']['title'] }}">
                <img src="{{ asset($club['magazine']['cover']) }}" alt="{{ $club['magazine']['title'] }} cover" loading="lazy">
            </a>
            <div class="demo-account-club-mag__copy">
                <p class="demo-account-club-mag__series">{{ $club['magazine']['series'] }}</p>
                <p class="demo-account-club-mag__issue">{{ $club['magazine']['issue'] }}</p>
                <h4 class="demo-account-club-mag__title">{{ $club['magazine']['title'] }}</h4>
                <ul class="demo-account-club-mag__teasers">
                    @foreach ($club['magazine']['teasers'] as $teaser)
                        <li>{{ $teaser }}</li>
                    @endforeach
                </ul>
                <a class="demo-account-club-mag__cta" href="{{ $club['magazine']['url'] }}" target="_blank" rel="noopener">Read latest issue <span aria-hidden="true">→</span></a>
            </div>
        </div>
    </div>
</section>
