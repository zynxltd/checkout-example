# Exercises — Laravel → Python + React (10 tasks)

Software Engineer refresher for the **Python + React** role (remote, autonomy-first).  
Your strength is **Laravel** — treat this as a transfer, not a rewrite of everything you know.

Markers: `EXERCISE`, `TODO`. One exercise ≈ one feature-branch PR (Agile habit).

## Advert coverage

| Advert need | Covered? | Exercise |
|-------------|----------|----------|
| Strong Python | Yes | 1–4, 6–8, 10 |
| Strong React | Yes | **6**, UI polish in 8 |
| Git / feature branch / PR | Yes | **9** (process) |
| Ownership / problem-solving | Yes | **8**, **10** |
| Tests / reliability | Yes | **3**, extend suite |
| Observability / safe release | Yes | health + logging; **9** CI |
| AI-assisted engineering | Yes | **10** |
| CI/CD (desirable) | Practice | **9** |
| Shopify (desirable) | Practice | **8d** + existing cart drawer demo |
| Azure / cloud / IaC | Concept | notes in README |
| App security | Practice | **10** (review AI code) |

---

## Laravel → this stack

| Laravel | Here |
|---------|------|
| `routes/api.php` + controller | FastAPI routers (`app/routers/*`) |
| Eloquent model + FormRequest | Pydantic models (`app/models.py`) |
| Service / Action class | `app/services/*` |
| `dispatch` + `queue:work` | `LeadPipeline` thread queue |
| Blade / Inertia / Vue | React (`web/`) |
| PHPUnit / Pest | pytest (`api/tests`) |
| `php artisan serve` | `uvicorn app.main:app` |
| Feature branch + PR | Ex 9 checklist |

---

## Exercise 1 — Search / filter (Python)

**Laravel:** `Product::query()->when(...)`.

Implement `ProductStore.search(category, q)`:

- `category` exact, case-insensitive
- `q` substring on `name` or `sku`

**Done when:** `GET /api/products?category=plants` and `?q=rose` work; React search box returns fewer rows.

---

## Exercise 2 — Update product (API + React optional)

Implement `ProductStore.update` and confirm `PUT /api/products/{id}` returns 200.

Optional React: inline edit stock on a row.

**Done when:** pytest `test_update_product` you add goes green.

---

## Exercise 3 — Tests as delivery confidence

Run:

```bash
cd api && .venv/bin/pytest -q
```

Add at least:

- `test_search_category_plants`
- `test_update_product`
- `test_lead_routes_async` (POST lead → sleep → status `routed` or `rejected`)

**Done when:** new tests pass; you can explain why the API TestClient is useful before a PR.

---

## Exercise 4 — Delete rule (business logic outside the route)

Implement `ProductStore.delete` using `product_rules.can_delete`.

**Done when:** delete in-stock → **409**; stock 0 → **204**.

---

## Exercise 5 — Debugging session 1

1. Break `calculate_margin` in `app/services/debug_lab.py`.
2. VS Code / PyCharm: debug `uvicorn`, breakpoint inside `calculate_margin`.
3. Hit `GET /api/debug/margin?sku=MOWER1`.
4. Fix → expect **75.62**.
5. Add a log line with sku + margin.

**Done when:** you can narrate Locals + call stack in 60 seconds.

---

## Exercise 6 — React ownership pass

In `web/src/App.jsx`:

1. Loading and empty states for products + leads.
2. Disable “Create” while request in flight.
3. After creating a product, show a short success toast/message.
4. Auto-refresh leads every 2s for 6 seconds after submit (watch queue flip).

**Done when:** UI feels production-tolerant (errors, loading, no double-submit).

---

## Exercise 7 — Python data workout

Finish `app/services/python_lab.py` until `GET /api/lab/self-check` → `{ "ok": true }`.

Add `assert run_self_check()` to pytest.

---

## Exercise 8 — Problem to own: loan lead SaaS (+ Shopify awareness)

Scaffolded: `POST /api/leads` → background worker → lender route. UI button already submits a sample.

**Own at least three:**

| # | Problem |
|---|--------|
| 8a | Richer routing (guarantor min £2k; personal ≥ £25k → Prime Line; Harbour cap 3 → Overflow) |
| 8b | `POST /api/leads/{id}/requeue` (Rejected only) |
| 8c | `GET /api/leads/stats` |
| 8d | **Shopify-shaped webhook:** `POST /api/shopify/webhooks/orders-create` verifies a shared secret header `X-Shopify-Topic` / `X-Demo-Secret` from env, logs order id, returns 200. (Desirable Shopify signal without a full store.) |
| 8e | Structured logging: every status change logs `lead_id`, `status`, `lender` as key=value |

Also skim `demos/react-shopify-cart-drawer` for storefront React patterns.

**Done when:** ≥3 of 8a–8e work; you can explain the async boundary like a Laravel queued job.

---

## Exercise 9 — Git, PR, CI (how the team ships)

1. Create branch `feat/ex1-product-search`.
2. Commit with a clear message; open a PR description using:

```markdown
## Summary
- …

## Test plan
- [ ] pytest green
- [ ] curl /api/products?q=rose
- [ ] React search works
```

3. Add `.github/workflows/python-react-crash-course.yml` (or extend repo CI) that:
   - installs `api/requirements.txt`
   - runs `pytest`
   - runs `npm ci && npm run build` in `web/`

**Done when:** workflow file exists and you’d be happy for a teammate to review the PR.

---

## Exercise 10 — AI code review + security + debug session 2

### 10a — Review “AI” output

Read `api/fixtures/ai_generated_discount.py`. List bugs (negative prices, `eval`, admin backdoor).

Create clean `app/services/discount.py` + pytest. **Never** ship unchecked AI code.

### 10b — Debug session 2

Break lead routing (always reject). Submit from React. Breakpoint in `LeadPipeline._process`. Fix. One-line comment: what Locals showed.

### 10c — Autonomy write-up (interview gold)

In `NOTES.md` (create it), half a page:

- Problem you owned in Ex 8
- Options you considered
- What you shipped
- How you’d monitor/rollback in prod

**Done when:** discount tests pass; notes file exists; debug story is verbalisable.

---

## Suggested schedule (~1–2 days)

| Block | Exercises |
|-------|-----------|
| API core | 1–4 |
| Debug #1 + React | 5–6 |
| Data + SaaS problem | 7–8 |
| Shipping + AI hygiene | 9–10 |

## Run

```bash
# API — http://127.0.0.1:8200  (docs at /docs)
cd demos/python-react-crash-course/api
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --port 8200

# Web — http://127.0.0.1:5173  (proxies /api → 8200)
cd ../web && npm install && npm run dev
```
