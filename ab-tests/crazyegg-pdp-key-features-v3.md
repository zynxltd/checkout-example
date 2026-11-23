# Crazy Egg — PDP Key Features v3 (mobile)

**Variant 1:** `crazyegg-pdp-key-features-v3.*` — KF gallery slide + lightbulb Feefo link (jumps to slide)  
**Variant 2:** `crazyegg-pdp-key-features-v3-variant-2.*` — KF slide + thumbs  
**Variant 5:** `crazyegg-pdp-key-features-v3-variant-5.*` — KF slide + thumbs + Feefo jump link  
**Variant 6:** `crazyegg-pdp-key-features-v3-variant-6.*` — thumbs + Feefo link opens **slide-out drawer** (Farmer Gracy–style)  
**Variant 7:** `crazyegg-pdp-key-features-v3-variant-7.*` — same as V6 but **centered popup modal**  
**Variant 8:** `crazyegg-pdp-key-features-v3-variant-8.*` — slide-out + **Plant Calendar** under KF icons  
**Variant 9:** `crazyegg-pdp-key-features-v3-variant-9.*` — same as V5 **without** Feefo lightbulb / Key Features link

Variants 3–4 were iteration drafts.

**Example:** https://www.yougarden.com/item-p-511603/standard-holly-trees-with-premium-pinecone-planters  
**Audience:** Mobile (≤1000px for KF slide; thumbs ≤599px). Desktop unchanged.

## Hypothesis

Key Features gets traction on mobile but the infinite mid-page carousel is slow to scan and unclear when you’ve looped. Pulling the icons (1–9) into a single slide in the main image gallery removes that block (description sits higher) and uses gallery dots / thumbs so start/end is obvious — lifting add to basket.

A “Key Features” jump link beside Feefo makes that last slide one tap away.

## Control vs variants

| | Behaviour |
|--|-----------|
| **Control** | Magento Key Features slick under ATC (infinite loop) |
| **Variant 1** | Hide mid-page KF; one Key Features slide (white) + lightbulb “Key Features” → jumps to that slide |
| **Variant 2** | Variant 1 + thumbs under hero (≤599px) |
| **Variant 5** | Variant 2 + “Key Features” link right of Feefo → jumps to KF gallery slide |
| **Variant 6** | Hide mid-page KF + thumbs + lightbulb “Key Features” link → **right slide-out** with icon grid (no KF in carousel) |
| **Variant 7** | Same as V6 → **centered popup modal** with icon grid |
| **Variant 8** | Same as V6 → slide-out with icon grid + **Plant Calendar** underneath |
| **Variant 9** | Same as V5 (KF slide + thumbs) but **no** Feefo lightbulb / Key Features link |

## Sample size

| | |
|--|--|
| **MDE** | 0.8% |
| **Confidence** | 90% |
| **Duration** | ~3 weeks |
| **Traffic** | ~30,418 users (page views) |

Primary metric: `add_to_cart` (+ Purchase).  
Diagnostic (optional GTM): `pdp_kf_carousel_view`, `pdp_gallery_engage` (thumbs), `pdp_kf_link_click` (V5).

## Crazy Egg setup

1. Matching URL: `yougarden.com/item-*` · Audience: **Mobile** · Metric: `add_to_cart`
2. **Variant 1** → `crazyegg-pdp-key-features-v3.*`
3. **Variant 2** → `crazyegg-pdp-key-features-v3-variant-2.*`
4. **Variant 5** → `crazyegg-pdp-key-features-v3-variant-5.*`
5. **Variant 6** → `crazyegg-pdp-key-features-v3-variant-6.*`
6. **Variant 7** → `crazyegg-pdp-key-features-v3-variant-7.*`
7. **Variant 8** → `crazyegg-pdp-key-features-v3-variant-8.*`
8. **Variant 9** → `crazyegg-pdp-key-features-v3-variant-9.*`
9. Control = no change

## QA (Variant 5)

- [ ] Mid-page KF gone; description higher
- [ ] Last gallery slide = Key Features grid; no left white gap on product images
- [ ] Thumbs under hero; last thumb is KF mini-grid
- [ ] “Key Features” right of Feefo stars (no underline, ~15px)
- [ ] Tap link → KF slide (no page flick to top)
- [ ] Desktop unchanged
