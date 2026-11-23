# ASP.NET Core MVC crash course (Laravel → .NET)

Hands-on demo for a **.NET / ASP.NET Core** role if you already know **Laravel + Vue** and a bit of C#.

Stack covered here: **.NET 10**, **ASP.NET Core MVC**, **C#**, **Razor**, **Web API**, **DI**, **validation**, **debugging**.  
(Blazor / Azure / microservices are pointed at as “next”, not built in this folder.)

## Run

```bash
cd demos/dotnet-mvc-crash-course
dotnet run --launch-profile http
```

Open http://localhost:5187

| URL | What |
|-----|------|
| `/` | Concept map + links |
| `/Products` | MVC list / create / delete |
| `/Products/Details/1` | MVC detail |
| `/api/products` | JSON API (SPA-style) |
| `/api/leads` | Loan lead intake API (bonus SaaS) |
| `/Leads` | Lead queue ops board |
| `/DebugLab?sku=ROSE01` | Breakpoint lab |

## Laravel → ASP.NET cheat sheet

| Laravel | This project |
|---------|----------------|
| `routes/web.php` | `Program.cs` → `MapControllerRoute` |
| `routes/api.php` | `[Route("api/products")]` on `ProductsApiController` |
| Controller + Blade | `Controllers/*` + `Views/**/*.cshtml` |
| Eloquent model | `Models/Product.cs` + `IProductStore` |
| `FormRequest` + rules | `ProductForm` + DataAnnotations |
| `@csrf` | `[ValidateAntiForgeryToken]` + `@Html.AntiForgeryToken()` |
| `app()->bind()` / container | `builder.Services.AddSingleton<IProductStore, …>()` |
| `redirect()->with()` | `TempData["Flash"]` |
| `abort(404)` | `return NotFound()` |
| `php artisan serve` | `dotnet run` |
| `.env` | `appsettings.json` / `appsettings.Development.json` |
| `dispatch(new Job)` + `queue:work` | `Channel&lt;T&gt;` + `BackgroundService` (`LeadQueueWorker`) |
| Lead SaaS / ping-tree | `/api/leads` + `/Leads` (bonus exercise) |

### Request flow (MVC)

```
Browser GET /Products/Details/1
  → routing {controller=Products, action=Details, id=1}
  → ProductsController.Details(1)
  → IProductStore.Find(1)
  → return View(product)   // Views/Products/Details.cshtml
  → HTML response
```

### Request flow (API)

```
GET /api/products
  → ProductsApiController.GetAll()
  → return Ok(_store.All())
  → application/json
```

## Walkthrough (30–45 min)

1. **`Program.cs`** — service registration + middleware pipeline. This is your `bootstrap/app.php` + providers in one place.
2. **`Models/Product.cs` + `ProductForm.cs`** — domain vs form model (don’t bind the entity blindly in real apps).
3. **`Services/IProductStore`** — interface + in-memory impl. Swap later for EF Core + Azure SQL without rewriting controllers.
4. **`ProductsController`** — Index / Details / Create / Delete. Compare to a Laravel resource controller.
5. **`Views/Products/*`** — Razor tag helpers (`asp-for`, `asp-action`) ≈ Blade directives.
6. **`ProductsApiController`** — same store, JSON out. Mental model for React/Vue front ends.
7. **`DebugLabController`** — practice the debugger (below).

## Debugging

### VS Code / Cursor

1. Install **C# Dev Kit** (or C# extension).
2. Open this folder (or the repo root).
3. **Run and Debug** → pick / create a `.NET Launch` for `DotnetMvcCrashCourse`.
4. Or terminal: `dotnet build`, then F5 with a launch config that runs the project.
5. Set breakpoints in `DebugLabController.Index` (comments mark three good spots).
6. Browse to `/DebugLab?sku=ROSE01`.

### Rider / Visual Studio

1. Open `DotnetMvcCrashCourse.csproj`.
2. F5 (Debug).
3. Breakpoints on the gutter; F10 / F11 to step.

### What to practice

| Skill | How |
|-------|-----|
| Breakpoint | F9 on `var match = …` |
| Step into | F11 on `CalculateMargin(...)` |
| Locals / Watch | Inspect `products`, `sku`, `margin` |
| Call stack | See Index → CalculateMargin |
| Logs | Watch Debug console for `_logger.LogDebug` |
| Exception break | Debug → break on thrown CLR exceptions, then POST invalid create |

**Tip:** `ASPNETCORE_ENVIRONMENT=Development` (already in `launchSettings.json`) gives detailed errors. Production uses the exception handler page.

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for SOLID folder map + request flows.

## Exercises (do these)

See **[EXERCISES.md](./EXERCISES.md)** — **10 tasks** (MVC → API → debug → EF/Azure SQL shape → LINQ → loan queue SaaS → JS/React/Blazor → debug #2 + Mongo shape + SOLID).

## Commands (Laravel / Vue → .NET)

See **[COMMANDS.md](./COMMANDS.md)** — `dotnet` CLI, EF, test, debug (F5), Azure SQL notes.

## Advert coverage (short answer)

| Need | In this course? |
|------|-----------------|
| .NET / C# / ASP.NET Core MVC + Web API | Yes |
| LINQ, SOLID, DRY, DI, debugging | Yes |
| Azure SQL | Shape via EF + SQLite (Ex 6); real Azure = connection string swap |
| JavaScript / React / Blazor | Ex 9 (JS in-repo; React/Blazor guided) |
| Microservices | Queue/worker *shape* (Ex 8), not multi-repo Azure yet |
| MongoDB | Ex 10b — `AuditStore:Driver` memory\|mongo · [MONGO.md](./MONGO.md) |
| Full Azure platform | Concept + Aspire demo next door |

## How this maps to the Nottingham job advert

| Advert | This demo | Next step in this repo |
|--------|-----------|-------------------------|
| ASP.NET Core / MVC | Ex 1–2 | — |
| ASP.NET Core Web API | Ex 3–4, 8 | `demos/green-energy-saas/api` |
| C# / .NET 10 | `TargetFramework net10.0` | — |
| LINQ / SOLID / DRY | Ex 1, 4, 7, 10 | — |
| Azure SQL | Ex 6 (SQLite → SqlServer) | `dotnet-aspire-garden-club` |
| JavaScript | Ex 9 Path A (`/Home/Spa`) | — |
| React | Ex 9 Path B | `green-energy-saas/web` |
| Blazor | Ex 9 Path C | new blazor project |
| Microservices / Azure | Ex 8 worker shape | Aspire AppHost |
| MongoDB | Ex 10b — memory\|mongo · [MONGO.md](./MONGO.md) | `MongoDB.Driver` |
| Agile | One exercise = one ticket | — |

## API quick checks

```bash
curl -s http://localhost:5187/api/products | jq .

curl -s -X POST http://localhost:5187/api/products \
  -H 'Content-Type: application/json' \
  -d '{"sku":"TREE9","name":"Olive Tree","category":"plants","price":49.99,"stock":12}' | jq .

# Bonus: loan lead → queue → routed lender
curl -s -X POST http://localhost:5187/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"applicantName":"Sam Lee","email":"sam@example.com","loanAmount":7500,"productType":"personal"}' | jq .
sleep 1
curl -s http://localhost:5187/api/leads | jq .
```
