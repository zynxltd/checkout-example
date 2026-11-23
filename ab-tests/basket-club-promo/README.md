# Basket Club Promo (Crazy Egg)

CE CSS/JS for Discount Club on `vieword.csp`.

**URL:** `https://www.yougarden.com/csp/yougdn/web/vieword.csp`

## Logo map (matches designs)

| Asset | Looks like | Used in |
|---|---|---|
| **Icon** (`yg-club-logo-icon*.png`) | Circular purple **C** + leaf | **V1** banner + sidebar · **V2** banner |
| **Primary** (`yg-club-logo-primary*`) | Stacked **YOUGARDEN DISCOUNT CLUB** badge + 2 leaves | **V3** banner + sidebar · **V2** sidebar (with Save MORE!) |
| **Secondary** (`yg-club-logo-secondary*`) | Horizontal capsule wordmark | In `assets/` if needed later |

Logos are **embedded as data-URIs** inside each `vN.js` (no hosting needed for CE).

## Variants

| Variant | Files | Layout |
|---|---|---|
| **V1** | `v1.js` + `v1.css` | Icon · benefit icons · radios · More Info · sidebar “Join to Save an Extra £X” |
| **V2** | `v2.js` + `v2.css` | Icon · dual ATC pills · More Info Here · sidebar primary + **Save MORE!** |
| **V3** | `v3.js` + `v3.css` | Primary badge · option cards · Add to Basket / More Info · sidebar primary + **SAVE MORE!** |

## Live hooks

- Mount after `.buttonPromoWrapper`
- Saving from `.clubSaving`
- ATC: `doAjaxBag` → `ST0007014` (auto) / `ST0003182` (one-off)

## CE setup

Paste matching CSS + JS into one variation. Do not combine V1/V2/V3 on the same visitor.
