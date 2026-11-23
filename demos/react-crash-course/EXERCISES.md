# Exercises — React refresher (10 tasks)

Background: **Laravel + Vue**. Goal: think in React without fighting the framework.

Markers: `TODO`, `EXERCISE`. One exercise ≈ one PR-sized commit.

## Coverage (React job / SE React half)

| Skill | Exercise |
|-------|----------|
| Components & props | 1 |
| Lists & keys | 2 |
| Controlled inputs | 3 |
| Derived state / filter | 4 |
| `useEffect` + async | 5 |
| Custom hooks | 6 |
| Ownership UI (cart drawer) | 7 |
| Debugging (DevTools + breakpoints) | 8 |
| Forms & accessibility basics | 9 |
| Tests + AI code review | 10 |

---

## Exercise 1 — ProductCard (props)

**Vue:** `defineProps(['product'])` + `$emit('add')`.

Finish `src/components/ProductCard.jsx`:

- Show name, SKU, price, category
- Stock badge: “In stock” / “Out of stock” (`stock === 0`)
- **Add** button calls `onAdd(product)`; **disabled** when out of stock

**Done when:** after Ex 2, cards look real and Add works for in-stock items.

---

## Exercise 2 — ProductGrid (lists + keys)

Map `products` → `<ProductCard key={product.id} … />`.

Never use array index as key when the list can reorder/filter.

**Done when:** Shop tab shows the catalogue grid.

---

## Exercise 3 — SearchBar polish

Add a **Clear** button when `value.length > 0` that calls `onChange('')`.

Optional: `Escape` key clears (listen in `onKeyDown`).

---

## Exercise 4 — Smarter filter

In `App.jsx` `filtered` `useMemo`:

- If query starts with `cat:` (e.g. `cat:plants`), filter by **category** exact (case-insensitive)
- Else keep name/SKU contains behaviour

**Done when:** typing `cat:plants` shows only plants.

---

## Exercise 5 — useEffect loading (already scaffolded)

Read the fetch `useEffect` in `App.jsx`.

1. Explain (aloud) why `cancelled = true` in the cleanup.
2. Add an error retry button when `error` is set.
3. Optional: extract `useCatalog()` hook returning `{ products, loading, error, reload }`.

**Done when:** you can explain the cleanup in an interview.

---

## Exercise 6 — Custom hooks (composables)

Implement in `src/hooks/useLocalStorage.js`:

### 6a `useLocalStorage(key, initial)`

- Read JSON from `localStorage` on init
- Write on change
- Return `[value, setValue]` like `useState`

### 6b `useDebouncedValue(value, delayMs)`

- `useEffect` + `setTimeout` / `clearTimeout`
- Shop search should only filter after you pause typing

**Done when:** refresh keeps cart lines; typing fast doesn’t filter every keystroke.

---

## Exercise 7 — Cart drawer (problem to own)

Finish `CartDrawer.jsx`:

| # | Task |
|---|------|
| 7a | Empty state copy when no lines |
| 7b | − / + qty buttons via `onQty(id, qty)` |
| 7c | Disable Checkout when empty |
| 7d | Close on `Escape` (`useEffect` keydown) |

Compare with `demos/react-shopify-cart-drawer` when done.

**Done when:** full add → qty → remove → empty flow feels solid.

---

## Exercise 8 — Debugging session

1. Break `margin()` in `src/lib/money.js` (wrong operator).
2. Install **React Developer Tools**.
3. DebugLab tab: inspect component props/state.
4. Breakpoint inside `margin`; fix until MOWER1 shows **£75.62**.
5. `npm test` — money tests should pass.

**Done when:** DevTools + debugger story takes < 90 seconds to explain.

---

## Exercise 9 — Accessible lead form (clean rewrite warm-up)

Build `src/components/LeadForm.jsx` (not the AI mess):

- Controlled fields: name, email, amount
- Inline validation (required, amount ≥ 500)
- `aria-invalid` / error text linked with `aria-describedby`
- `onSubmit(payload)` only when valid

Wire it under the AI tab below the broken form (or replace the demo submit).

---

## Exercise 10 — AI review + tests

1. Read `src/fixtures/AiMessyLeadForm.jsx` — list bugs (keys, `let` instead of state, DOM ids, `dangerouslySetInnerHTML`, etc.).
2. Keep using your `LeadForm` from Ex 9 as the clean version.
3. Add `src/components/LeadForm.test.jsx` with Testing Library:
   - shows validation errors
   - calls `onSubmit` with parsed number amount when valid
4. Never ship the fixture patterns.

**Done when:** `npm test` green with your new tests.

---

## Suggested order (~1 day)

1–4 components → 5–6 hooks → 7 cart → 8 debug → 9–10 quality.

## Related demos in this repo

| Demo | When |
|------|------|
| `python-react-crash-course` | React + FastAPI together |
| `react-shopify-cart-drawer` | Shopify cart UX |
| `green-energy-saas/web` | React + typed API client |
| `garden-mascot-site` | Motion / layout React |
