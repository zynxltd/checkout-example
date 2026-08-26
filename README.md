# YouGarden Cart Drawer V2 — Laravel prototype

## Developer setup

**Stack:** Laravel 13 · PHP 8.3+ · Blade · session mock cart · vanilla CSS/JS in `public/` (no React/Shopify).

### Prerequisites

- PHP **8.3+**, [Composer](https://getcomposer.org/)
- Optional: [Laravel Herd](https://herd.laravel.com) (recommended on macOS)
- Optional: Node 20+ only if you run `npm run build` / Vite (not required for the demo UI)

### First-time install

```bash
git clone <repo-url> yg-cart-drawer-demo
cd yg-cart-drawer-demo

composer setup
```

`composer setup` runs: `composer install`, copies `.env.example` → `.env`, `php artisan key:generate`, `php artisan migrate`, `npm install`, `npm run build`.

**Manual install** (if you skip `composer setup`):

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite   # if missing
php artisan migrate
```

### Environment (`.env`)

| Variable | Purpose |
|----------|---------|
| `APP_URL` | Local URL, e.g. `http://yg-cart-drawer-demo.test` or `http://127.0.0.1:8000` |
| `ADOBE_FONTS_KIT` | Adobe Fonts kit ID (Gelica + Proxima Nova); leave empty for system fallbacks |
| `DEMO_PREVIEW_AUTH_ENABLED` | `true` = login gate; `false` = open demo (local only) |
| `DEMO_PREVIEW_USERNAME` / `DEMO_PREVIEW_PASSWORD` | Preview login (defaults in `.env.example`) |
| `SESSION_DRIVER` | `file` (default) — no database required |
| `CACHE_STORE` | `file` (default) — receipt handoff without SQLite |
| `QUEUE_CONNECTION` | `sync` (default) |

Demo data is session + config/files only. **No database is required** for local or Laravel Cloud. Optional local SQLite is unused unless you point drivers at `database`.

### Compact drawer layout (v2.1)

**Compact view (v2.1)** is **on by default** (Prototype tools → Compact view (v2.1)). Untick to use the standard mobile layout. On **mobile only** (≤767px): compact footer, full-width club saving strip, smaller club line item. **Desktop** stays the same as default V2.

**Subtotal only (v3.0)** is also **on by default**: hides the collapsible order summary and labels the main amount line **Subtotal** instead of Total. Untick in prototype tools to restore order summary + Total label.

### Run locally

**Herd** — park or link the project folder; open:

`http://yg-cart-drawer-demo.test`

**Artisan:**

```bash
php artisan serve
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000)

### Preview login

When `DEMO_PREVIEW_AUTH_ENABLED=true`, visit `/login` first.

Defaults (see `.env.example`): username `web`, password `letmein2`.

### Demo codes (mock logic)

| Code | Where |
|------|--------|
| `TEST` | Offer code in cart drawer |
| `TEST` or `VOUCHER` | Gift voucher on checkout |

### Where to edit

| Area | Path |
|------|------|
| Routes | `routes/web.php` |
| Cart / checkout logic | `app/Http/Controllers/` |
| Views | `resources/views/demo/` |
| Drawer / checkout JS | `public/js/yg-cart-drawer.js`, `yg-checkout.js` |
| Styles | `public/css/yg-cart-drawer.css`, `yg-checkout.css`, `demo-site.css` |

### Herd sync (optional)

If you keep a second copy under `~/Herd/yg-cart-drawer-demo`, sync from the repo:

```bash
./sync-to-herd.sh
```

Edit `HERD=` inside the script if your Herd path differs.

---

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

## Demo tips

1. Toggle **Cart drawer (test)** to compare behaviours.
2. Resize browser: mobile vs desktop layouts.
3. Apply offer `TEST` in the drawer; apply voucher `TEST` or `VOUCHER` on checkout.
4. **More Info** on club bar → sheet (mobile) or left panel (desktop).
5. **Proceed to Checkout** → express options at top, voucher in the summary column.
