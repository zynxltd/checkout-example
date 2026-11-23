# Crazy Egg — PDP thumbs under hero

**Files:** `crazyegg-pdp-thumbs-v1.css` + `crazyegg-pdp-thumbs-v1.js`  
**Example:** https://www.yougarden.com/item-p-630050/complete-300-spring-flowering-bulb-collection

## What it does

- Thumbnail strip **under** the main image (4 visible, scroll for more)
- 6px inset before first / after last thumb (same as gap between thumbs)
- Tap thumb → change main image; swipe hero still works; dots hidden
- **≤599px only** — desktop Magento gallery unchanged

## Crazy Egg setup

1. Clear old gallery-v1 / key-features CSS+JS from the variant
2. Custom CSS → paste `crazyegg-pdp-thumbs-v1.css`
3. Custom JS → paste `crazyegg-pdp-thumbs-v1.js`
4. Audience: Mobile
5. Hard-refresh preview

## Check

- Mobile: thumbs under hero, space on the left of the first thumb
- Desktop (≥600px): no CE strip
- `data-ce-yg-thumbs="3"` on `<html>` — if tooltip still shows 16px, old CSS/JS is still loaded
