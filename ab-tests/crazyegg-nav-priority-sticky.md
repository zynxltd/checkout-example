# Crazy Egg — Nav CRO: priority + sticky

**Files:** `crazyegg-nav-priority-sticky.css` + `crazyegg-nav-priority-sticky.js`  
**Live:** https://www.yougarden.com/

## Hypothesis

Moving **Sale** next to **Christmas / NEW** and keeping the category bar reachable while scrolling improves high-intent findability → conversion.

| Arm | Treatment |
|-----|-----------|
| **Control** | Magento `#desktopNav` as live |
| **Variant** | Reordered priority items + sticky bar (desktop); sticky quick-shop chips (mobile) |

## Desktop order (variant)

`NEW → Christmas → Sale → Garden Plants → Houseplants → Trees and Shrubs → Fruits and Veg → Outdoor Living → TV`

## Crazy Egg setup

1. Custom CSS → `crazyegg-nav-priority-sticky.css`
2. Custom JS → `crazyegg-nav-priority-sticky.js`
3. Do **not** also paste megamenu / gymshark / header-mockup nav variants

## QA

- [ ] Control unchanged
- [ ] Desktop: Sale sits after Christmas; bar sticks on scroll with shadow
- [ ] Desktop: dropdowns still open and link correctly
- [ ] Mobile: Christmas / Sale / NEW / Garden Plants chips sticky under header
- [ ] NEW purple / Christmas red / Sale pink still visible
