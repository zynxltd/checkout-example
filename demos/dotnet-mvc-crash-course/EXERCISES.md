# Exercises — Laravel → .NET crash course (10 tasks)

Treat each as an **Agile ticket** (small PR). Markers in code: `EXERCISE`, `BONUS`, `TODO`.

**Honest coverage of the Nottingham advert** (this folder alone):

| Advert topic | Covered? | Where |
|--------------|----------|--------|
| .NET / .NET Core / C# | Yes | Whole project (`net10.0`) |
| ASP.NET Core MVC | Yes | Ex 1–2, views, controllers |
| ASP.NET Core Web API | Yes | Ex 3–4, 8 |
| LINQ | Yes | Ex 1, **Ex 7** |
| SOLID / DRY / DI | Yes | Interfaces + **Ex 4, 10** |
| Debugging | Yes | **Ex 5, Ex 10** |
| Queues / async workers (microservices *shape*) | Yes | **Ex 8** (leads) |
| Azure SQL *shape* (EF Core) | **Practice here** | **Ex 6** (SQLite stand-in) |
| JavaScript calling APIs | **Practice here** | **Ex 9** |
| React | Partial | Ex 9 path B → `demos/green-energy-saas/web` |
| Blazor | Partial | Ex 9 path C (guided add) |
| MongoDB | **Practice here** | **Ex 10** document-store lab |
| Azure cloud (App Service, Service Bus, etc.) | Concept only | Notes in Ex 6/8; Aspire demo next |
| C# 14 language toys | Light | Optional notes under Ex 7 |
| Agile | Process | One ticket = one exercise |

You will **not** finish “expert Azure + MongoDB + Blazor + React” in one weekend — this path gets you **interview-ready on the conversion** (Laravel mental model → ASP.NET) and **hands-on reps** on every keyword in the advert.

---

## Exercise 1 — MVC filter with LINQ (query string)

**Laravel:** `Product::query()->when($cat, …)->when($q, …)->get()` + Blade index.

**Do:**

1. Add `IReadOnlyList<Product> Search(string? category, string? q);` to `IProductStore`.
2. Implement with **LINQ** (`Where`, `Contains`, case-insensitive).
3. `ProductsController.Index(string? category, string? q)` → `Search`.
4. GET filter form on `Views/Products/Index.cshtml`.

**Done when:** `/Products?category=plants` and `q=rose` work.

---

## Exercise 2 — Edit product (MVC + validation)

**Laravel:** `edit` / `update` + FormRequest.

**Do:**

1. `bool Update(int id, ProductForm form)` on store.
2. `GET/POST Edit` on `ProductsController` + `Views/Products/Edit.cshtml`.
3. Edit button on Index.
4. Keep using `ProductForm` DataAnnotations (don’t duplicate rules in the controller — **DRY**).

**Done when:** price/stock editable in browser; `/api/products` shows the change.

---

## Exercise 3 — Web API get by id

**Laravel:** `Route::get('/api/products/{id}', …)` → JSON / 404.

**Do:** in `ProductsApiController`:

```csharp
[HttpGet("{id:int}")]
public ActionResult<Product> GetById(int id) { ... }
```

**Done when:**

```bash
curl -i http://localhost:5187/api/products/1    # 200
curl -i http://localhost:5187/api/products/999  # 404
```

---

## Exercise 4 — API delete + SOLID business rule

**Laravel:** Form Request / Action class / Policy — rule lives **outside** the controller.

**Do:**

1. `DELETE /api/products/{id}` → 204 or 404.
2. Rule: refuse delete when `Stock > 0` → **409** + `{ "error": "..." }`.
3. Extract `ProductRules.CanDelete(Product p)` (or similar) and call it from **both** API and MVC delete — **DRY + Single Responsibility**.

**Done when:** `ROSE01` delete fails at stock 40; succeeds after stock set to 0.

---

## Exercise 5 — Debugging session 1 (margin lab)

**Goal:** Comfortable with breakpoints (interview / day-one skill).

**Setup:** Break `DebugLabController.CalculateMargin` (wrong operator or `costRatio`).

**Practice:**

1. F5 debug → `/DebugLab?sku=MOWER1`.
2. Breakpoints; **F10** / **F11**; Locals + Watch.
3. Fix; add `_logger.LogInformation` for SKU + margin.
4. Speak the call stack in 60 seconds.

**Done when:** margin for MOWER1 = **£75.62** (`199 - 123.38`).

---

## Exercise 6 — EF Core + SQLite (Azure SQL stand-in)

**Laravel:** Eloquent + MySQL/Postgres.  
**Job advert:** Azure SQL — same **EF Core** skills; swap connection string later.

**Do:**

1. Add packages: `Microsoft.EntityFrameworkCore.Sqlite` + `Design`.
2. Create `Data/AppDbContext.cs` with `DbSet<Product>`.
3. Register: `builder.Services.AddDbContext<AppDbContext>(… UseSqlite("Data Source=greenshelf.db"))`.
4. Implement `EfProductStore : IProductStore` (map form ↔ entity).
5. On startup: `db.Database.EnsureCreated()` + seed if empty.
6. Switch DI from `InMemoryProductStore` → `EfProductStore` (**Open/Closed**: controllers unchanged).

**Done when:** restart app; products persist in `greenshelf.db`; create/edit/delete survive restart.

**Azure note:** for Azure SQL you’d only change:

```csharp
options.UseSqlServer(builder.Configuration.GetConnectionString("AzureSql"));
```

---

## Exercise 7 — LINQ workout (+ light C# modern style)

**Laravel:** Collections / query builder aggregates.

Open `Services/LinqLab.cs` (stub) and make all methods pass the comments’ expected results.

Practice:

- `Where` / `Select` / `OrderBy` / `GroupBy`
- `Sum`, `Average`, `Any`, `FirstOrDefault`
- Prefer method syntax; optional query syntax for one method

**Optional C# 14 / modern C#:** use collection expressions, `is not null`, pattern matching in one helper — keep it readable.

**Done when:** `LinqLab.RunSelfCheck()` returns `true` (call it once from `HomeController.Index` temporarily and log the result, then remove).

---

## Exercise 8 — Loan lead SaaS (API + queue worker)

**Laravel:** `api.php` + `ShouldQueue` job + `queue:work`.  
**Job advert:** Web API + microservices *shape* (async boundary).

Scaffold already in place — try it first:

```bash
curl -s -X POST http://localhost:5187/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"applicantName":"Sam Lee","email":"sam@example.com","loanAmount":7500,"productType":"personal"}'
# then refresh /Leads
```

| Piece | Path | Laravel |
|-------|------|---------|
| Model | `Models/LeadApplication.cs` | Eloquent + FormRequest |
| Queue | `InMemoryLeadPipeline` | Redis queue |
| Worker | `LeadQueueWorker` | `queue:work` |
| API | `LeadsApiController` | `api.php` |
| Board | `/Leads` | Nova/Filament |

**Complete at least three:**

| # | Task |
|---|------|
| 8a | Richer routing (guarantor min £2k; personal ≥ £25k → Prime Line; Harbour cap 3 → Overflow Panel) |
| 8b | `POST /api/leads/{id}/requeue` (Rejected only → 409 otherwise) |
| 8c | `GET /api/leads/stats` + queue depth |
| 8d | Partner webhook via `HttpClient` + `appsettings.json` URL (httpbin OK); log failures, don’t crash worker |
| 8e | MVC `/Leads/Create` sharing `ILeadPipeline.Submit` |

**Done when:** API (and ideally MVC) submit → status moves async on `/Leads`, plus ≥3 of 8a–8e.

---

## Exercise 9 — Front end calling the API (JS / React / Blazor)

**Job advert:** JavaScript, React, Blazor — pick **one path** (do a second if you have time).

### Path A — JavaScript (in this project) ★ recommended first

1. Finish `wwwroot/js/products-api.js` (fetch `/api/products`, render a table).
2. Add `Views/Home/Spa.cshtml` (or static `wwwroot/spa.html`) that loads the script.
3. Button to POST a new product via `fetch` + JSON.

**Done when:** browser lists products without a full page reload.

### Path B — React

Use `demos/green-energy-saas/web` as the pattern: point fetch at `http://localhost:5187/api/products`. Minimal page: list + create.

### Path C — Blazor

```bash
dotnet new blazor -n GreenShelfBlazor -o demos/dotnet-mvc-crash-course-blazor --interactivity Server
```

Call the same Web API (HttpClient). One page: product list.

**Done when:** one of A/B/C works against this API.

---

## Exercise 10 — Debugging session 2 + Mongo-style audit + SOLID tidy

Three parts — all required.

### 10a — Debug the lead worker

1. Break routing intentionally (e.g. always `MarkRejected`).
2. Submit a lead; breakpoint in `LeadQueueWorker.ProcessAsync`.
3. Step through; fix; note in a one-line comment what the Locals window showed.

### 10b — MongoDB audit log (real or shape)

**In-memory (default):** `InMemoryLeadAuditStore` — append-only documents; `GET /api/leads/{id}/audit`.

**Real Mongo (optional):** see [MONGO.md](./MONGO.md)

```bash
docker compose -f docker-compose.mongo.yml up -d
# AuditStore:Driver = mongo
dotnet run --launch-profile http
```

Same `ILeadAuditStore` — `MongoLeadAuditStore` uses `MongoDB.Driver`. Flip driver without changing the worker (**DIP**).

### 10c — SOLID / DRY pass

- Controllers thin; rules in services
- No copy-pasted validation messages
- One interface per responsibility (`IProductStore`, `ILeadPipeline`, `ILeadAuditStore`)

**Done when:** audit API returns history; you can explain memory vs mongo registration in `Program.cs`.

---

## Suggested order / time

| Block | Exercises | ~Time |
|-------|-----------|-------|
| Core MVC + API | 1–4 | 2–3 h |
| Debug #1 | 5 | 30–45 m |
| Data + LINQ | 6–7 | 2–3 h |
| SaaS queue | 8 | 2–4 h |
| Front end | 9 | 1–3 h |
| Debug #2 + Mongo shape + SOLID | 10 | 1–2 h |

**Total:** roughly 1–2 focused days — enough to talk Laravel→.NET confidently in interview.

## After this repo folder

| Next | Path |
|------|------|
| EF + Aspire + multi-project | `demos/dotnet-aspire-garden-club` |
| .NET API + React SPA | `demos/green-energy-saas` |
| Razor Pages marketing site | `demos/aspnet-standard-website` |
