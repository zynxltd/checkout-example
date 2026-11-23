# Crazy Egg — PDP accordion restyle

**Files:** `crazyegg-pdp-accordion.css` + `crazyegg-pdp-accordion.js`  
**Live example:** https://www.yougarden.com/item-s-pa021/allium-purple-sensation  
**Target:** PDP URLs with `.centralWrapper.text` → `.tab-heading` / `#tab-content-*`

## Variation

Restyles the existing Magento tab stack into mock-up accordion cards:

- Collapsed: cream stone card + **SHOW** pill  
- Expanded: white bordered card + **HIDE** pill  
- Gelica-style serif titles, forest / moss YouGarden palette  
- Independent toggles (more than one section can stay open)  
- Default open: **Description** (others closed, including Plant Calendar)  
- Moves live nodes (no HTML clone) — Feefo reviews, Vimeo, blooming table stay intact  

## Sticky Add to Basket — feasibility only (not in this test)

**Possible:** yes, as a follow-up experiment.

| Need | Live hook |
|------|-----------|
| Primary CTA | `#buy-button.buy-button` — `onclick="showOptions();"` opens `#style-options-drop-box` (variant picker), not a direct add |
| Actual add | Secondary `.buy` nodes call `doAjaxBag(...)` after option selection |
| Title | `h1` (e.g. `Allium 'Purple Sensation'`) |
| Image | `img.mainImg` in the gallery |
| Price | Nearest reliable scrape: text near `.buy-wrapper` / `.product-right-wrapper` (often `£9.99` on this PDP) — no clean single `.product-price` in the buy box |

**Logic for a sticky bar (if built later):**

1. Show when `#buy-button` (or `.buy-wrapper`) scrolls out of view.  
2. Sticky CTA should `click()` `#buy-button` so behaviour matches live (options drawer / `showOptions`), not invent a new cart path.  
3. Thumbnail + truncated `h1` + price from buy-box region.  
4. Mobile-first; pad page bottom when bar is visible.

**Not implemented in this variation** — accordion-only, per brief.

## Crazy Egg setup

1. New test on PDP wildcard (e.g. `/item-*`).  
2. Variation Custom CSS → paste `crazyegg-pdp-accordion.css`.  
3. Variation Custom JS → paste `crazyegg-pdp-accordion.js`.  
4. Control = no change.

## QA checklist

- [ ] All tabs present: Plant Calendar, Description, Top Tips, Care, Delivery, Reviews, Videos (when on page)  
- [ ] Description open by default; SHOW/HIDE updates  
- [ ] Reviews Feefo widget loads when Reviews opened  
- [ ] Videos iframe plays when Videos opened  
- [ ] Plant calendar table scrolls horizontally on narrow screens  
- [ ] TMS carousels below tabs still render  
- [ ] No sticky ATC bar  
