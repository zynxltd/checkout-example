# Crazy Egg — PDP Key Features v2 (mobile)

**Files:** `crazyegg-pdp-key-features-v2.css` + `crazyegg-pdp-key-features-v2.js`  
**Example:** https://www.yougarden.com/item-p-630050/complete-300-spring-flowering-bulb-collection  
**Audience:** Mobile (≤1000px). Desktop unchanged.

## Hypothesis

Same as v1: Key Features gets traction but the infinite carousel is hard to scan. Showing every icon in a static grid (no swipe loop, no image overlay) should improve comprehension without covering the hero image.

## Control vs variants

| | Behaviour |
|--|-----------|
| **Control** | Magento Key Features slick carousel (large, infinite loop) |
| **v1** | Hide block; overlay icons on product image |
| **v2** | Keep under ATC; **1-row** smaller equal icons, swipe rail (no wrap, no infinite loop) |

## Crazy Egg setup

1. Matching URL: `yougarden.com/item-*`
2. Audience: **Mobile**
3. Primary metric: `add_to_cart`
4. Variation Custom CSS → `crazyegg-pdp-key-features-v2.css`
5. Variation Custom JS → `crazyegg-pdp-key-features-v2.js`

## QA

- [ ] Mobile: Magento slick + arrows gone
- [ ] Mobile: one horizontal row of smaller equal icons (32px)
- [ ] Mobile: swipe works; does not wrap to 2 rows; no infinite loop
- [ ] Mobile: product image clean (no overlay)
- [ ] Desktop: unchanged
- [ ] ATC still works
