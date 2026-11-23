# Crazy Egg — Header utilities → mockup silos + mobile search

**Files:** `crazyegg-header-hit-areas.css` + `crazyegg-header-hit-areas.js`  
**Live:** https://www.yougarden.com/ (`#header` → `#desktopTop` / `.mobileNavBar`)  
**Mock-up:** https://checkout-example-production-zffmhy.laravel.cloud/

## Breakpoints (match live Magento)

| Viewport | Treatment |
|----------|-----------|
| **Desktop** `min-width: 1001px` | Stacked silos + centred pill search + mini-basket hover |
| **Mobile / tablet** `max-width: 1000px` | Full-width pill search under icon row (from mobile-search-usp) |

## Variation

| Piece | Treatment |
|-------|-----------|
| Desktop search | Mock-up pill, centred between logo + silos |
| TV / Club / Account / Basket | Stacked silos (desktop only) |
| Basket hover | Mock-up mini-basket dropdown (Magento `#basketWrapper` data) |
| Magento Club / Welcome / Basket | Hidden (desktop) |
| Mobile search | Pill under icons; Luigi icon slot kept; tap opens Luigi |

**Icons:** base64 data-URIs in JS (not fetched from mock-up host).

## Crazy Egg setup

1. Variation Custom CSS → paste `crazyegg-header-hit-areas.css`  
2. Variation Custom JS → paste `crazyegg-header-hit-areas.js`  
3. Control = no change  
4. Do **not** also paste `crazyegg-mobile-search-usp.*` (already merged)

## QA

- [ ] Desktop ≥1001px: four silos + centred search + mini-basket hover  
- [ ] Resize across 1000px: silos hide / mobile pill shows (and reverse)  
- [ ] Mobile/tablet ≤1000px: pill under menu/logo/account/basket  
- [ ] Mobile search focus/tap opens Luigi  
- [ ] Product name + image in mini-basket link to PDP  
- [ ] Fully responsive — no overlap at mid widths  
