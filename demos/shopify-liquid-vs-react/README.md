# Shopify Liquid vs React — DUSK.com example

Teaching demo: **classic Liquid theme shell** + **React bag island**, inspired by [dusk.com](https://dusk.com/) homeware patterns (not affiliated).

## Verdict: is dusk.com Liquid or React?

**Liquid (Shopify Online Store theme)** — checked live **28 Jul 2026**.

| Signal | Finding |
|--------|---------|
| `powered-by` | `Shopify` |
| `Shopify.theme` | `{ name: "Copy of Main - Summer Sale", schema_name: "Underscore", … }` |
| HTML | `shopify-section`, Liquid markers, `/cdn/shop/t/…/assets/` |
| Shop | `duskretail.myshopify.com` |
| Hydrogen / React storefront shell | **Not** detected |

So the **page is server-rendered Liquid**. DUSK can still load **React (or other JS) inside app extensions** (search, reviews, badges, wishlist) — those are **islands**, not a Hydrogen rewrite.

### Contrast — well-known React / Hydrogen storefront

| Site | Stack |
|------|--------|
| [dusk.com](https://dusk.com/) | Liquid theme |
| **[skims.com](https://skims.com/)** | **Hydrogen (React) on Oxygen** — `powered-by: Shopify, Oxygen, Hydrogen` |

Also Hydrogen (live headers): [chubbiesshorts.com](https://chubbiesshorts.com/), [bubblegoods.com](https://bubblegoods.com/).

See also: [docs/shopify-liquid-vs-react.md](../../docs/shopify-liquid-vs-react.md)

---

## Run

```bash
cd demos/shopify-liquid-vs-react/react-island
npm install
npm run dev
```

Open http://127.0.0.1:5182

1. Read the verdict banner (Liquid vs React).
2. Click **Add to bag** on a product card (HTML as if Liquid rendered it).
3. React **bag drawer** opens — island listening to `data-add-to-bag`.

---

## What’s in the folder

| Path | Role |
|------|------|
| `liquid/snippets/product-card.liquid` | Real Liquid source (educational) |
| `liquid/sections/sale-top-picks.liquid` | Section + `{% schema %}` |
| `liquid/index.html` + `theme.css` | Static “rendered HTML” twin (for reading offline) |
| `react-island/` | Runnable Vite app: theme-like page + React drawer |

```text
Shopify would do:   product-card.liquid  →  HTML buttons
This demo does:     index.html buttons   →  same data-* attrs
React island:       listens for clicks   →  bag drawer (client)
```

---

## Compare

| | Liquid (DUSK shell) | React island (this demo) |
|--|---------------------|---------------------------|
| Product grid / SEO HTML | Theme sections | Not replacing the grid |
| Sale price / reviews markup | `{{ product.price \| money }}` | — |
| Bag UX | Theme JS *or* island | ✓ React drawer |
| Full headless storefront | No (they’re on Online Store) | Would be Hydrogen |

---

## Related

| Demo / doc | Notes |
|------------|--------|
| `demos/react-shopify-cart-drawer` | Richer cart/upsell React widget |
| `docs/shopify-liquid-vs-react.md` | Platform overview |
