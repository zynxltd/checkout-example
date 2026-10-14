@php
    $drawerWidth = \App\Services\DemoCart::drawerWidth();
    $recoVariant = \App\Services\DemoCart::recoVariant();
@endphp
<aside class="demo-controls" data-drawer-width aria-label="Cart drawer width">
    <h3>Cart drawer</h3>
    <p class="demo-controls__label">Desktop width</p>
    <div class="demo-drawer-width">
        <button type="button" class="demo-drawer-width__btn" data-drawer-width-step="-25" aria-label="Narrower drawer">−</button>
        <span class="demo-drawer-width__value" data-drawer-width-value>{{ $drawerWidth }}px</span>
        <button type="button" class="demo-drawer-width__btn" data-drawer-width-step="25" aria-label="Wider drawer">+</button>
    </div>
    <p class="demo-controls__hint">Steps of 25px, from 400px to 900px. Desktop only.</p>
    <p class="demo-controls__label">Recommendations</p>
    <div class="demo-reco-variant" data-reco-variant-switch>
        <button type="button" class="demo-reco-variant__btn @if($recoVariant === 'rows') is-active @endif" data-reco-variant="rows" aria-pressed="{{ $recoVariant === 'rows' ? 'true' : 'false' }}">Variant 1</button>
        <button type="button" class="demo-reco-variant__btn @if($recoVariant === 'tiles') is-active @endif" data-reco-variant="tiles" aria-pressed="{{ $recoVariant === 'tiles' ? 'true' : 'false' }}">Variant 2</button>
    </div>
    <p class="demo-controls__hint">Variant 1 is the row layout. Variant 2 is stacked tiles.</p>
</aside>
