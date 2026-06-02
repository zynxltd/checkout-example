# YouGarden Cart Drawer V2 — Laravel prototype

Interactive demo of the **V2 cart drawer** for stakeholder review. **YG default:** no free-delivery bar (Richard feedback). See `../yg-cart-drawer-stakeholder-feedback.md`.

## Brand typography

Per **YG Brand Guidelines 2026**: **Gelica** (headings) · **Proxima Nova** (body).

1. **Adobe Fonts (recommended):** Add both fonts to a web project at [fonts.adobe.com](https://fonts.adobe.com/), copy the kit ID into `.env` as `ADOBE_FONTS_KIT=xxxx`.
2. **Self-hosted:** Drop woff2 files in `public/fonts/` — see `public/fonts/README.md`.

Until a kit or woff2 files are configured, the browser falls back to system fonts if activated via Creative Cloud.

## Brand colours (V2)

| Token | Hex | Use |
|-------|-----|-----|
| YG Moss | `#CCEA81` | Qty +/- buttons, bin, promo chevrons (with forest icons) |
| YG Moss dark | `#6B9420` | Delivery progress fill |
| YG Moss surface | `#E5EFD0` | Recommendations / side-tab backgrounds |
| YG Forest | `#264F1C` | Header, text & icons on moss |
| YG Stone | `#F2E7D8` | Drawer background |
| YG Pebble | `#483F3A` | Body text |
| YG Rose | `#E3185D` | Prices, savings, More Info |
| YG Checkout Green | `#468900` | Checkout button |
| YG Club Purple | `#812881` | Club banner |

**Checkout icon:** White wheelbarrow line-art (`public/images/icons/icon-wheelbarrow.png`).

## Herd sync

Herd serves `/Users/tom/Herd/yg-cart-drawer-demo`. After editing files in this repo folder, run:

```bash
./sync-to-herd.sh
```

## Run locally

From this directory:

```bash
php artisan serve
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000)

If you use [Laravel Herd](https://herd.laravel.com), the site may be available at:

**http://yg-cart-drawer-demo.test**

## Share via Cloudflare Tunnel

Requires [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) (`brew install cloudflared`). Herd site must be running locally.

```bash
./tunnel.sh
```

Proxies Herd HTTPS on `127.0.0.1` with `Host: yg-cart-drawer-demo.test` (required so the site does not redirect visitors to `.test`). For `php artisan serve` only: `YG_TUNNEL_ORIGIN=http://127.0.0.1:8000 YG_TUNNEL_HOST=127.0.0.1:8000 ./tunnel.sh`.

Copy the `https://….trycloudflare.com` URL from the terminal. Quick tunnels are temporary and stop when the process exits.

## What’s included

- Mock **PDP** with header cart and **Add to basket**
- **Cart drawer** — V2 layout, cream background, forest header, contrast-safe controls, purple club bar, green checkout (`#468900`)
- **PDP in situ** — open cart / View basket on a product page; desktop slide-out over dimmed PDP
- **Prototype toggles** — delivery bar (GD), upsells strip, wide drawer (desktop)
- **Local product images** (real YG assets, no external CDN)
- **Icons** — SVG for close, trash, +/- , promo arrow, header; Flaticon wheelbarrow on checkout
- **Mobile:** full-screen drawer + club **bottom sheet**
- **Desktop (768px+):** 440px drawer + club panel slides **left** + “Proceed to Checkout” label
- **Have a code?** — offer code in basket (demo: `TEST`)
- **Checkout page** (`/checkout`) — Shopify-style 2-column layout: express checkout (PayPal, G Pay, Apple Pay, Amazon Pay), contact/delivery/payment form, order summary with **gift voucher** field (demo: `TEST` or `VOUCHER`)
- **Proceed to Checkout** in the drawer → `/checkout` with live basket session
- **VWO-style toggle** (bottom-left): drawer on vs “full basket page” alert

## Spec docs (parent repo)

- `../yg-cart-drawer-features.md` — feature guide
- `../yg-cart-drawer-dev-brief.md` — full brief

## Demo tips

1. Toggle **Cart drawer (test)** to compare behaviours.
2. Resize browser: mobile vs desktop layouts.
3. Apply offer `TEST` in the drawer; apply voucher `TEST` or `VOUCHER` on checkout.
4. **More Info** on club bar → sheet (mobile) or left panel (desktop).
5. **Proceed to Checkout** → express options at top, voucher in the summary column.

# checkout-example
# checkout-example
