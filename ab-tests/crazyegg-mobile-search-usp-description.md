# Mobile search bar — match mock-up placement

**Audience:** Mobile only (`max-width: 1000px`).

**Mock-up:** [Argos header preview](https://checkout-example-production-zffmhy.laravel.cloud/) — pill search is the **second header row** (under menu/logo/account/basket), **above** the cream USP strip.

---

## Control

Live mobile: search icon (Luigi `#ltw-app[data-luma*=mobilesearch]`) in the header; USP carousel in `#usp-wrapper`.

## Variation

1. **Custom CSS** → `crazyegg-mobile-search-usp.css`
2. **Custom JS** → `crazyegg-mobile-search-usp.js`

What it does:

- Hides Luigi search only (keeps icon-sized slot — do **not** target bare `#mobileSearch`, login reuses that id)
- Injects pill search into `#header` **below** floated `.mobileNavBar` (`clear: both` so it doesn’t cover logo)
- Leaves `#usp-wrapper` visible (matches mock-up)
- Focus / tap / Enter opens Luigi via the hidden mobilesearch control

## Look

- White pill, `border-radius: 999px`, `#c5bdb5` border
- Placeholder: `Search plants, trees or outdoor living`
- Magnifying glass on the right (forest green)
- Soft green-tinted shadow; forest focus ring
