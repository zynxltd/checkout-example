# PLP Filters & Sort drawer — Crazy Egg setup

One conversion for both arms: **any real filter use** → `ce_plp_filter_apply`

| Arm | What counts |
|-----|-------------|
| **Control** | Magento filter checkbox (tracked via GTM Custom HTML) |
| **Variant** | **Apply Filters** in the drawer (CE JS) |

Crazy Egg Control cannot take custom JS — Control tracking lives in GTM.

---

## 1. GTM

### A. Control tracker (required)

1. New tag → **Custom HTML**
2. Paste full `crazyegg-plp-filters-control-track.js` (includes `<script>`)
3. **Triggers (OR all of these)** — DOM Ready alone is not enough with Cookiebot:
   - **Window Loaded – All Pages**
   - Custom Event `cookie_consent_statistics`
   - Custom Event `cookie_consent_update`
4. Name e.g. `Desktop - Control - Filter`

**How Control tracking works:** Magento reloads on facet click, so GA4 often dies on unload. The script sets `sessionStorage` on click (survives reload), then on the **next** page load pushes `ce_plp_filter_apply`. Same CE goal as Variant Apply.

### B. GA4 event

1. Tag `plp_filter_apply` (GA4 Event name `plp_filter_apply`)
2. Trigger: **Custom Event** `ce_plp_filter_apply` only
3. **Remove** Click trigger **Control - Filter**
4. Publish

### C. Crazy Egg

Goal on GA4 / Live event `plp_filter_apply` (PLP Filter) — already set.

---

## 2. Crazy Egg pastes

### Desktop

| Arm | Paste |
|-----|--------|
| **Control** | nothing (GTM handles tracking) |
| **Variant** | `yg-desktop-filters.css` + `yg-desktop-filters.js` |

### Mobile

| Arm | Paste |
|-----|--------|
| **Control** | nothing |
| **Variant** | `crazyegg-plp-filters-drawer-mobile.css` + `crazyegg-plp-filters-drawer-mobile.js` |

---

## 3. Quick check

1. Control: open a filter dropdown → tap an option → page reloads → Live PLP Filter
2. Variant: Apply in drawer → Live PLP Filter
3. Tag Assistant: Control checkbox should show `ce_plp_filter_apply` then GA4

---

## Why not the Click trigger?

Magento runs `filterForm.submit()` in the checkbox `onclick`, so the page unloads before GTM Click can send. The Custom HTML tag pushes `ce_plp_filter_apply` with `eventCallback` first (same as Variant Apply), then submits.
