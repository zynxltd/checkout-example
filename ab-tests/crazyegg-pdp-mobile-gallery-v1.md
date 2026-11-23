# Crazy Egg — PDP Mobile Gallery v1 (Variant 1)

**Files:** `crazyegg-pdp-mobile-gallery-v1.css` + `crazyegg-pdp-mobile-gallery-v1.js`  
**Example:** https://www.yougarden.com/item-p-630050/complete-300-spring-flowering-bulb-collection  
**Audience:** Mobile (CE). Start here before Key Features variants.

## Idea

Add a real image gallery on mobile PDPs: **thumbnail strip under the hero**. Keep swipe + on-image arrows. Hide dots (thumbs replace them).

## Control vs Variant 1

| | Behaviour |
|--|-----------|
| **Control** | Main image + dots only |
| **Variant 1** | Thumbs under hero (4 visible) + swipe + arrows — **≤599px only** |

## Crazy Egg setup (Variant 1)

1. Matching URL: `yougarden.com/item-*`
2. Audience: **Mobile**
3. Primary metric: `add_to_cart`
4. Custom CSS → `crazyegg-pdp-mobile-gallery-v1.css`
5. Custom JS → `crazyegg-pdp-mobile-gallery-v1.js`
6. Clear any gallery-v2 / key-features code from this variant first
7. Hard-refresh preview after paste

## QA

- [ ] ≤599px: thumbs under main image, 16px left inset on first thumb
- [ ] ≥600px: Magento desktop gallery only (no CE strip)
- [ ] Tap thumb changes main image
- [ ] Active thumb updates when swiping hero
- [ ] Video thumb shows play cue
- [ ] Dots hidden; arrows still work
- [ ] After paste, `data-ce-yg-pdp-gal-v1="10"`
