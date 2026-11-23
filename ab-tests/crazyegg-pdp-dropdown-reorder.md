# Crazy Egg — PDP Drop Down Re-order

**Files:** `crazyegg-pdp-dropdown-reorder.css` + `crazyegg-pdp-dropdown-reorder.js`  
**Example:** https://www.yougarden.com/item-p-530211/the-best-ever-hybrid-tea-rose-bush-collection  
**Target:** PDP `item-*` with `.centralWrapper.text` → `.tab-heading` / `#tab-content-*`

## Hypothesis

Heatmaps show accordion tabs used most in reverse of Magento order. Surfacing Videos / Reviews / Delivery higher (esp. mobile) should improve UX and lift add to basket.

## Control vs Variant

| | Order |
|--|--------|
| **Control** | Plant Calendar → Description → Top Tips → Care → Delivery → Reviews → Videos |
| **Variant** | Plant Calendar → Description → **Videos → Reviews → Delivery → Care → Top Tips** |

Plant Calendar + Description stay at the top (already pre-open). Only the stack under Description is reversed (heatmap: Videos / Reviews / Delivery used most). Missing tabs skipped.

## Crazy Egg setup

1. New test — Matching URL: `yougarden.com/item-*` (or site PDP pattern)
2. Audience: All (or Mobile-only if you want to match the brief’s mobile scroll note)
3. Primary metric: `add_to_cart`
4. Variation Custom CSS → paste `crazyegg-pdp-dropdown-reorder.css`
5. Variation Custom JS → paste `crazyegg-pdp-dropdown-reorder.js`
6. Control = no change

## QA

- [ ] Order matches variant table on desktop + mobile
- [ ] Description / Plant Calendar still expand correctly
- [ ] Reviews Feefo loads when Reviews opened
- [ ] Videos iframe works; WATCH VIDEOS still scrolls to Videos
- [ ] TMS blocks below accordion still render
- [ ] PDP without Videos / Reviews still reorders cleanly
