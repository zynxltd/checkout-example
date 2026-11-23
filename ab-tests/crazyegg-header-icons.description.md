# Crazy Egg — Header icon + label mock-up

**Files:** `crazyegg-header-icons.css` + `crazyegg-header-icons.js`  
**Live:** https://www.yougarden.com/  
**Mock-up:** https://checkout-example-production-zffmhy.laravel.cloud/

Stacked silos: **icon above, label below** — matches the prototype utilities row.

## Desktop utilities (left → right)

| Silo | Icon | Label |
|------|------|-------|
| TV | Green play | YouGarden TV |
| Club | Purple **SAVE 10%** pill | Join Our Club |
| Account | Person | Login \| Register |
| Basket | Wheelbarrow | Your Basket (+ pink count when items) |

Basket silo restyles Magento’s `#basketWrapper`; hover opens the **live** `#mini-basket-show` in place (same dropdown as yougarden.com).

Also: centred pill search; YouGarden TV removed from the green bar (lives in utilities); Christmas stays; NEW + SALE stay coloured.

## Crazy Egg setup

1. Custom CSS → `crazyegg-header-icons.css`
2. Custom JS → `crazyegg-header-icons.js`
3. Do **not** also paste `crazyegg-header-mockup.*` or `crazyegg-header-hit-areas.*`

## QA

- [ ] Labels visible under each of the four utilities
- [ ] SAVE 10% sits above “Join Our Club”
- [ ] Wheelbarrow (not a cart glyph) for basket
- [ ] Search pill centred in the gap
- [ ] Christmas visible in green nav; TV gone (utility silo instead)
- [ ] Basket hover opens live Magento mini-basket (not the custom mock-up panel)
