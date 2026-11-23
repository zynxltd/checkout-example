# Crazy Egg — PDP Key Features · Option 1 (mobile)

**Asana:** Product Pages — Mobile — Display all key features  
**Paste:** `crazyegg-pdp-key-features-option1.js` + `crazyegg-pdp-key-features-option1.css`  
**Example:** https://www.yougarden.com/item-p-300165/duo-fruit-tree--peach-redhaven-and-apricot-early-orange  
**Audience:** Mobile · Matching URL `yougarden.com/item-*`  
**Primary metric:** `add_to_cart`

## Hypothesis

Key Features gets a lot of traction on mobile, but the experience isn’t great — it takes a while to scroll through them all and it isn’t clear when you’re back to the start. Customers clearly care about this info, so making it more accessible should help increase add to cart.

**Option 1:** Remove the mid-page block and pull the icons into the main image gallery. Removing the block also brings the description higher up.

## What changes

| | |
|--|--|
| **Control** | Magento Key Features slick under ATC (infinite loop) |
| **Option 1** | Hide mid-page KF; one **Key Features** slide in the gallery (icons + labels as a grid); thumbs under hero ≤599px |

Icons are **cloned from each PDP’s Magento assets** (correct set per product). Brand SVG library (AI export) lives in `ab-tests/assets/yg-kf-icons/` for design / composite work.

## Sample

| | |
|--|--|
| MDE | 0.8% |
| Confidence | 90% |
| Weeks | 3 |
| Users (pv) | ~30,418 |
| Value £ PA | £39,886 *(Asana)* |

## Crazy Egg setup

1. Matching URL: `yougarden.com/item-*`
2. Audience: **Mobile**
3. Metric: `add_to_cart` (+ Purchase secondary)
4. Variant → Custom JS / CSS = Option 1 files above
5. Control = no change

## QA

- [ ] Mid-page KF gone; description higher
- [ ] Last gallery slide = Key Features grid (this PDP’s icons)
- [ ] Dots / thumbs show start–end clearly
- [ ] Desktop unchanged
- [ ] Size-option / pre-order PDPs still add to basket

## Related variants

Drawer / modal / Feefo-link iterations: `crazyegg-pdp-key-features-v3-variant-5` … `v9` (same problem space).
