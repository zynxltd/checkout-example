# Crazy Egg — Desktop nav megamenu

## Hypothesis

A cleaner desktop megamenu (same IA, rebuilt from the live menu feed) improves findability vs the current Magento dropdown.

| Arm | Treatment |
|-----|-----------|
| **Control** | Current `#desktopNav` / `ul.menu` (no CE code) |
| **Variant** | Rebuild megamenu **inside** `#desktopNav` from parsed menu DOM (header layout preserved) |

## Menu data (“menu feed”)

There is no separate JSON endpoint — the feed is the server-rendered Magento menu:

```text
#desktopNav > .centralWrapper > ul.menu > li.top
```

Variant JS parses top links, left categories (`.main-cats`), and right-block children (`#right-block-*`), then renders the new UI.

## Files

| File | Crazy Egg field |
|------|-----------------|
| `crazyegg-desktop-nav-megamenu.js` | Variant Custom JS |
| `crazyegg-desktop-nav-megamenu.css` | Variant Custom CSS |

## Scope

- **Desktop only:** `min-width: 1001px`
- Mobile / `#mobileNavWrapper` unchanged
- Keeps NEW (purple) / SALE (pink) / YouGarden TV

## QA

- [ ] Control unchanged
- [ ] Variant: top bar matches labels/order from live menu
- [ ] Hover opens panel; left category hover swaps right links
- [ ] Links hit same URLs as Magento menu
- [ ] NEW / SALE / TV look correct
- [ ] ≤1000px: Magento mobile menu only (variant hidden)
