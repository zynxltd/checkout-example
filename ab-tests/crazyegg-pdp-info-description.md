# Crazy Egg A/B — PDP product information hub + mobile sticky ATC

**Target URL:** `https://www.yougarden.com/item-s-pa021/allium-purple-sensation` (all `/item-s-*` and `/item-p-*` PDPs)

**Goal:** Replace plain accordion styling with the mock-up “Product information” hub (chips + stone cards), and test a mobile-only sticky add-to-basket bar after scroll.

## Setup in Crazy Egg

1. Create an A/B test on PDP URL pattern (e.g. contains `/item-s-` or `/item-p-`).
2. **Variation → Custom CSS:** paste full contents of `crazyegg-pdp-info.css`.
3. **Variation → Custom JavaScript:** paste full contents of `crazyegg-pdp-info.js`.
4. Control = no injection.

## What the variant does

### Product information hub
- Finds existing accordion sections (Description, Top Tips, Care Information, etc.).
- Builds a new hub with:
  - Centred **Product information** heading (Gelica-style)
  - Pill **chip nav** (Description, Top Tips, …)
  - **Stone cards** with Show/Hide toggles (open card = white with border)
- Hides original accordion rows visually (content is copied into new cards).

### Mobile sticky ATC (≤767px)
- Fixed bar at bottom after user scrolls past the buy box.
- Shows product name, price, and **Add to basket** (clicks the real PDP button).
- Hidden on desktop.

## Metrics to watch
- Add-to-basket rate (mobile)
- Scroll depth on product information
- Chip / Show-Hide engagement
- Bounce rate on PDP

## Notes
- Scoped under `html.ce-yg-pdp-info` — control traffic unaffected.
- If accordion DOM changes on live site, update section discovery in the JS file.
- Pair CSS + JS; JS alone has minimal fallback styling.
