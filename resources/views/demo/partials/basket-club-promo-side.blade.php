@php
    /** @var string $variant v1|v2|v3 */
    /** @var string $saving */
    /** @var string $clubUrl */
    $assetBase = asset('ce/basket-club');
@endphp

@if($variant === 'v1')
    <div class="clubSavingWrapper ce-yg-club-side--v1" data-ce-yg-club-side="1">
        <a class="ce-yg-club-side__link" href="{{ $clubUrl }}">
            <img class="ce-yg-club-side__logo" src="{{ $assetBase }}/assets/yg-club-logo-v1-sm.png" alt="" width="40" height="36">
            <span class="ce-yg-club-side__text">Join to Save an Extra <strong>{{ $saving }}</strong></span>
        </a>
    </div>
@elseif($variant === 'v2')
    <div class="clubSavingWrapper ce-yg-club-side--v2" data-ce-yg-club-side="1">
        <a class="ce-yg-club-side__link" href="{{ $clubUrl }}" aria-label="Save more with the YouGarden Discount Club">
            <img class="ce-yg-club-side__logo" src="{{ $assetBase }}/assets/yg-club-logo-primary-140.png" alt="YouGarden Discount Club" width="140" height="36">
            <span class="ce-yg-club-side__save">Save MORE!</span>
        </a>
    </div>
@else
    <div class="clubSavingWrapper" id="ygbc3-side" data-ygbc3-side="5" data-ce-yg-club-side="1">
        <a id="ygbc3-side-link" href="{{ $clubUrl }}" aria-label="Save more with the YouGarden Discount Club">
            <img id="ygbc3-side-logo" src="{{ $assetBase }}/assets/yg-club-logo-v3-side.png" alt="" width="160" height="44">
            <span id="ygbc3-side-save">Save MORE!</span>
        </a>
    </div>
@endif
