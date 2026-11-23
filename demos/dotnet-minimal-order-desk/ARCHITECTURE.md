# Minimal order desk — architecture (OOP / SOLID)

## Layout

```
Contracts/     # IOrderService, IOrderStore, IOrderPolicy, ISkuCatalog, IApiKeyValidator, IOrderClock
Models/        # GardenOrder, OrderLine, OrderStatus, OrderEvent, SkuDefinition
Services/      # OrderService, policies, catalog, store, clock, key validator
Filters/       # ApiKeyEndpointFilter (auth only)
Endpoints/     # MapOrderDeskApi — thin HTTP mapping
Options/       # OrderDeskOptions
Program.cs     # composition root + HTML cheat sheet
```

## SOLID map

| Principle | Example |
|-----------|---------|
| **S** | Filter only checks keys; policy only rules; catalog only stock; endpoints only HTTP status mapping |
| **O** | New transition rules → new `IOrderPolicy`; swap catalog without touching endpoints |
| **L** | Any `IOrderStore` behind `OrderService` |
| **I** | Separate `ISkuCatalog` / `IOrderPolicy` / `IApiKeyValidator` |
| **D** | Endpoints depend on `IOrderService`, not `InMemoryOrderStore` |

## Status machine

```
Open ──pack──► Packed ──ship──► Shipped
  │
  └──cancel──► Cancelled   (within CancelWindowMinutes; releases stock)
```

## Request paths

```
POST /api/orders
  → ApiKeyEndpointFilter
  → IOrderService.Create
  → IOrderPolicy.ValidateCreate + ISkuCatalog.TryReserve + IOrderStore.Add

POST /api/orders/{id}/pack|ship|cancel
  → policy gate → store replace + OrderEvent append
```

## Behaviours to review

- Known SKUs only + soft list-price check (±15%)
- Stock reserve on create / release on cancel
- Max lines + max total from options
- Event log on each mutation
- API key from config (`OrderDesk:ApiKey`)

## Laravel cheat sheet

| Laravel | Here |
|---------|------|
| `routes/api.php` | `MapOrderDeskApi` |
| middleware | `IEndpointFilter` |
| FormRequest / Policy | `IOrderPolicy` |
| Eloquent | `IOrderStore` + `ISkuCatalog` |
