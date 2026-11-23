# Crazy Egg — PDP Key Features v1 (mobile)

**Files:** `crazyegg-pdp-key-features-v1.css` + `crazyegg-pdp-key-features-v1.js`  
**Example:** https://www.yougarden.com/item-p-630050/complete-300-spring-flowering-bulb-collection  
**Audience:** Mobile (≤1000px). Desktop unchanged.

## Hypothesis

Key Features gets traction on mobile but the infinite carousel is slow to scan and unclear when you’ve looped. Surfacing all icons on the product image (and dropping the mid-page block) should make features easier to read and pull description / bullets higher — lifting add to basket.

## Control vs Variant 1

| | Behaviour |
|--|-----------|
| **Control** | Magento Key Features slick carousel under Add to Basket |
| **Variant 1** | Hide that block; show the same icons as a wrap strip on the product image |

Later variants can try: chips under the title, accordion row, dots-only carousel, etc.

## Crazy Egg setup

1. New test — Matching URL: `yougarden.com/item-*`
2. Audience: **Mobile** (or All — CSS/JS no-ops on desktop)
3. Primary metric: `add_to_cart`
4. Variation Custom CSS → paste `crazyegg-pdp-key-features-v1.css`
5. Variation Custom JS → paste `crazyegg-pdp-key-features-v1.js`
6. Control = no change

## QA

- [ ] Mobile: original Key Features heading + carousel gone
- [ ] Mobile: icons appear on bottom of main product image (all visible, no infinite loop)
- [ ] Mobile: bullet points / description sit higher
- [ ] Desktop: Key Features carousel unchanged
- [ ] PDP with no icons: no overlay, no errors
- [ ] ATC / qty / PayPal still work
