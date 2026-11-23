# Homepage P004 — category row only (Crazy Egg)

**Hypothesis:** Full-width category strip with clearer pills (and optional “Shop by category” headline) will improve category click engagement vs the current homepage row.

**Audience:** Desktop only — viewports **961px and wider**.

**Test URL:** `https://www.yougarden.com/` (homepage only)

**Out of scope:** Product carousel / Fresh Relevance block below the category row — left as live control (cannot be recreated reliably via CE injection).

**Also out of scope:** The **second** `.category-landing-row4-wrapper` block further down the homepage (same markup, different categories). CSS is scoped to the **first row only**.

**Metric ideas:** Category card clicks, click-through to department PLPs.

---

## Files

| File | Use |
|------|-----|
| [`crazyegg-homepage-p004.css`](crazyegg-homepage-p004.css) | **Paste into Crazy Egg** variant → Custom CSS (recommended) |
| [`crazyegg-homepage-p004.js`](crazyegg-homepage-p004.js) | Optional — only if you want the headline injected via JS (includes embedded CSS) |

---

## Control

Live homepage:

- First `.category-landing-row4-wrapper` — **4** category tiles (CMS limit), `.cta` pills (no section headline)
- Second row4 block lower on the page — unchanged
- Fresh Relevance / product module — unchanged in this test

## Variation

- Full-width category row, 18px rounded tiles, 16px pill labels
- Optional centred **“Shop by category”** headline (JS only)

---

## Crazy Egg setup

### Option A — CSS only (recommended)

1. **Page Editor** test on `https://www.yougarden.com/`
2. **Control** = no custom code
3. **Variant** → Custom CSS → paste full contents of `crazyegg-homepage-p004.css`
4. Publish and preview on homepage

### Option B — JS (CSS + optional headline)

1. Same test setup
2. **Variant** → Custom JavaScript → paste full contents of `crazyegg-homepage-p004.js`
3. Set `INJECT_HEADLINE = false` to skip the headline and rely on CSS-only styling

If you edit the `.css` file and use the JS route, sync the minified `css` string inside the JS file.

---

## Crazy Egg short description (paste)

```
Homepage P004 (desktop 961px+). Control = live category row. Variation = full-width category pills + rounded tiles. Product/Fresh Relevance block below unchanged. Goal: category click engagement.
```

---

## Selectors

Stable live classes: `.category-landing-row4-wrapper`, `.block`, `.cta`.

**Scoping:** first row only via  
`.category-landing-row4-wrapper:not(.category-landing-row4-wrapper ~ .category-landing-row4-wrapper)`

**4 cards:** live HTML ships 4 `.block` elements per row (`row4` in the class name). CSS cannot show 6–8 without CMS adding more tiles or a JS carousel build.
