# Homepage — Control vs Variant

| | Below the banner | How |
|--|------------------|-----|
| **Control** | 4 tiles + Top picks | CMS hides 8-up + Shop Bestsellers. [`crazyegg-homepage-promo-vs-tiles-control.css`](crazyegg-homepage-promo-vs-tiles-control.css) — **not** Crazy Egg. |
| **Variant** | 8-up + Shop Bestsellers | CE shows the top 2, hides the 2 below. [`crazyegg-homepage-promo-vs-tiles.css`](crazyegg-homepage-promo-vs-tiles.css) + [`.js`](crazyegg-homepage-promo-vs-tiles.js) |

Crazy Egg cannot style Control. The 8-card row and Bestsellers must already be `display: none` on the CMS homepage, or Control visitors will see all four blocks.

Preview: https://yougardennew.mtechpreview.com/ (`web` / `letmein2`)
