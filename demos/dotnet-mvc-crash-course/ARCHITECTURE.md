# GreenShelf ASP.NET — architecture (OOP / SOLID)

## Layout

```
Contracts/          # interfaces (ports) — DIP
  IProductStore, IProductService, IProductPolicy
  ILeadPipeline, ILeadRouter, ILeadAuditStore, IPartnerWebhook
Controllers/        # thin HTTP adapters (MVC + Api/)
Data/               # EF Core DbContext + seed (Azure SQL stand-in = SQLite)
Models/             # domain + form DTOs (DataAnnotations)
Services/           # application logic + workers
Views/              # Razor (.cshtml) ≈ Blade
wwwroot/js/         # SPA Path A calling /api/products
Program.cs          # composition root (DI + middleware)
```

## SOLID map

| Principle | Example |
|-----------|---------|
| **S** | `DefaultLeadRouter` only routes; `LeadQueueWorker` only drains; controllers only HTTP |
| **O** | New routing rules → new `ILeadRouter`; swap `Persistence:Driver` memory↔sqlite |
| **L** | Any `IProductStore` works behind `ProductService` |
| **I** | Small ports (`IProductPolicy`, `IPartnerWebhook`) instead of one god interface |
| **D** | Controllers depend on `IProductService` / `ILeadPipeline`, not concretes |

## Persistence

```json
"Persistence": { "Driver": "sqlite", "SqlitePath": "greenshelf.db" }
```

Set `"Driver": "memory"` for in-memory (no EF). Azure SQL later: `UseSqlServer(connectionString)`.

## Request paths

```
GET /Products?category=plants
  → ProductsController → IProductService.List → IProductStore.Search → Razor

DELETE /api/products/1
  → ProductsApiController → IProductService.Delete → IProductPolicy.CanDelete → 204|409

POST /api/leads
  → ILeadPipeline.Submit (Channel enqueue)
  → LeadQueueWorker → ILeadRouter → ILeadAuditStore + IPartnerWebhook
```

## Laravel cheat sheet

| Laravel | Here |
|---------|------|
| Service provider bind | `builder.Services.Add…` in `Program.cs` |
| Eloquent | `IProductStore` + EF `AppDbContext` |
| FormRequest | `ProductForm` / `LeadApplicationForm` |
| `ShouldQueue` + `queue:work` | `Channel<Guid>` + `BackgroundService` |
| Mongo / Eloquent document | `ILeadAuditStore` → memory or `MongoLeadAuditStore` (`AuditStore:Driver`) |
| Policy / Action | `IProductPolicy` / `ILeadRouter` |
