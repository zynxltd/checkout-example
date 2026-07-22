# Crazy Egg test notes (from recordings)

**Context:** Recordings show heavy scrolling, multi-tab browsing, repeated search edits, and possible uncertainty around add-to-basket options. Purchase tracking still pending on thank-you — use clicks / surveys / heatmaps for now; don’t use purchase as primary metric yet.

---

## 1. Quantify drop-off, then test prompts

- **First:** Use web analytics — how often product/category browsing ends **without** add-to-basket.
- **Then (A/B):** On high-scroll pages, test clearer **“Add to basket”** and/or **“Next best category”** prompts.
- **Why:** Excess scroll without ATC suggests people are browsing but not converting — prompts may reduce dead ends.

---

## 2. Survey — category pages (fruit)

- **Where:** Fruit bushes, Superfruit, Fruit trees (key category pages).
- **Ask:** e.g. *“What info are you looking for today?”*
- **Why:** Learn what’s missing and why users open many tabs.
- **Crazy Egg:** Survey.

---

## 3. Snapshot — strawberry PDP (clarify scope)

- **Primary focus = product page** (strawberry PDP), especially **mobile**.
- **Check:** What gets clicks; are **price**, **delivery**, **Add to basket** seen/used or missed?
- **Not** the whole site — one high-interest PDP first; expand to other PDPs if useful.
- **Crazy Egg:** Snapshot / heatmap.

---

## 4. Snapshot — category page (high scroll)

- **Where:** Same category(s) where recordings show lots of scrolling.
- **Check:** Where clicks land while scrolling; which **product tiles** / **filters** get attention vs ignored.
- **Crazy Egg:** Snapshot / heatmap.

---

## 5. Survey — search / findability

- **Where:** Search results and/or product pages after search.
- **Ask:** *“Did you find what you were looking for?”*
- **Why:** Confirm if repeated search edits = missing results, unclear naming, or search UX issues.
- **Crazy Egg:** Survey.

---

## 6. Add-to-basket options — guidance needed?

- **Recording:** [Crazy Egg session](https://crazye.gg/d0de6fb32de0a2e6?autostart=0&s=436) — from **~6:00**, watch for frustration vs smooth use of ATC options.
- **Question for team:** Do pack/size/ATC choices need clearer guidance (labels, helper text, default option)?
- **Next step:** If frustration shows, follow with Snapshot on that PDP + optional A/B on clearer ATC copy/layout.

---

## Suggested run order (current)

| Priority | Type | What |
|---|---|---|
| 1 | Survey | Category: “What info are you looking for today?” |
| 2 | Survey | Search/PDP: “Did you find what you were looking for?” |
| 3 | Snapshot | Strawberry **PDP** (mobile focus) |
| 4 | Snapshot | High-scroll **category** page |
| 5 | Review | ATC options recording (~6:00) → decide if guidance test needed |
| 6 | A/B (later) | Clearer ATC / next-category prompts on high-scroll pages *(after analytics check)* |

---

## One-liner for stakeholders

We’re using Crazy Egg surveys and heatmaps to see why people scroll/search a lot without adding to basket, then we’ll test clearer prompts and ATC guidance — starting on fruit categories and a key product page.

---

## Also in flight (site chrome)

- Contact nav — show vs hide
- USP banner — returning customers
- Survey — general site experience feedback

## Blocker

Purchase pixel needed on **order confirmation / thank-you** (GTM not on post-basket templates) before purchase-based A/B winners can be called reliably.
