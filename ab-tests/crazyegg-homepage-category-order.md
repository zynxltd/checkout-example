# Crazy Egg — Homepage 4-tile vs 8-carousel

## Goal

| Arm | Visible under billboard |
|-----|-------------------------|
| **Control** | CMS **4 large tiles** + FR **Top picks for you** |
| **Variant 1** | CMS **8 Shop By Category** carousel + FR **Shop Bestsellers** |

Crazy Egg can only inject CSS/JS on **Variant 1**, not Control. So Control = whatever the CMS page serves with no CE overrides.

## CMS setup (required for Control)

Both blocks are published and there is no CMS “hidden” toggle. For Control to be correct:

1. **Show** the 4-tile row + Top picks SoftBlock (remove any `display: none` on `.category-landing-row4-wrapper`).
2. **Hide** the 8-up + Bestsellers block on the base page with inline CSS on its wrapper, e.g. on `.category-promotion-wrapper` (or its CMS parent):

```html
style="display: none;"
```

Control visitors never get CE CSS, so this base hide is what keeps the 8-block off Control.

## Crazy Egg Variant 1

| File | Field |
|------|--------|
| `crazyegg-homepage-category-order.js` | Custom JS |
| `crazyegg-homepage-category-order.css` | Custom CSS |

Variant does:

- **Show** `.category-promotion-wrapper` (overrides CMS `display: none`)
- **Hide** 4-tile wrapper + Top picks SoftBlock

## Selectors

```text
Variant show:  .frontpage .category-promotion-wrapper
Control hide:  wrapper containing .category-landing-row4-wrapper
Control hide:  SoftBlock / strip with “Top picks for you”
```

## QA

- [ ] Control (no CE / Control dropdown): only 4 tiles + Top picks — no Shop By Category / Bestsellers
- [ ] Variant 1: only 8-carousel + Shop Bestsellers — no 4 tiles / Top picks
- [ ] Links and FR carousels still work
- [ ] Mobile matches desktop
