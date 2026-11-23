# Crazy Egg — Live header → Argos mock-up

**Files:** `crazyegg-header-mockup.css` + `crazyegg-header-mockup.js`  
**Live:** https://www.yougarden.com/ (`#header` → `#desktopTop` / `#desktopNav` / `.mobileNavBar`)  
**Mock-up:** https://checkout-example-production-zffmhy.laravel.cloud/

## Breakpoints (match live Magento)

| Viewport | Treatment |
|----------|-----------|
| **Desktop** `min-width: 1001px` | Mock-up silos + centred pill search + mini-basket hover |
| **Mobile / tablet** `max-width: 1000px` | Pill search under icon row |

## Variation

| Piece | Treatment |
|-------|-----------|
| Desktop search | Pill, centred between logo and silos. Placeholder: *Search plants, trees or outdoor living* |
| YouGarden TV | Green play icon only (utility, not in the green bar) |
| Club | Purple **SAVE 10%** pill (no label) |
| Account | Person icon only |
| Basket | Wheelbarrow icon + count badge + hover mini-basket |
| Magento Club / Welcome / Basket | Hidden (desktop) |
| Green nav | Christmas + YouGarden TV hidden |
| Mobile search | Pill under menu / logo / account / basket |

## Crazy Egg setup

1. Variation Custom CSS → paste `crazyegg-header-mockup.css`
2. Variation Custom JS → paste `crazyegg-header-mockup.js`
3. Control = no change
4. Do **not** also paste `crazyegg-header-hit-areas.*` or `crazyegg-mobile-search-usp.*`

## QA

- [ ] Desktop ≥1001px: four icon-only silos (TV play, SAVE 10%, account, basket + count) + centred search
- [ ] Christmas and YouGarden TV gone from the green bar; NEW + SALE still coloured
- [ ] Resize across 1000px: silos hide / mobile pill shows
- [ ] Mobile/tablet ≤1000px: pill under menu/logo/account/basket
- [ ] Basket hover opens mini-basket with PDP links
