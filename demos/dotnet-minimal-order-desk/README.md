# Minimal APIs order desk — HTTP-only .NET swing

**Use case:** warehouse/order intake API with API key, catalog stock, and a status machine — **no MVC controllers**.  
Contrast with `dotnet-mvc-crash-course` (controllers + views) and SignalR auction (push).

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for the SOLID map.

| Laravel cousin | Here |
|----------------|------|
| `routes/api.php` | `MapOrderDeskApi` |
| middleware | `ApiKeyEndpointFilter` |
| Policy + FormRequest | `IOrderPolicy` |
| Inventory | `ISkuCatalog` |

## Run

```bash
cd demos/dotnet-minimal-order-desk
dotnet run
```

- Cheat sheet: **http://127.0.0.1:5192**
- Health (no key): `GET /api/health`
- Header: `X-Api-Key: greenshelf-desk-key`

```bash
curl -s http://127.0.0.1:5192/api/catalog -H 'X-Api-Key: greenshelf-desk-key'

curl -s http://127.0.0.1:5192/api/orders \
  -H 'X-Api-Key: greenshelf-desk-key' \
  -H 'Content-Type: application/json' \
  -d '{"customer":"Sam Lee","lines":[{"sku":"ROSE01","qty":2,"unitPrice":24.99}],"notes":"leave by shed"}'
```

Then `POST …/pack` → `POST …/ship` (or `…/cancel` while still open).

## Flow

```
POST /api/orders
  → ApiKeyEndpointFilter
  → IOrderService.Create (policy + stock reserve)
  → 201 + GardenOrder (+ events)
```

## What to notice

- Endpoints map HTTP only; `OrderService` owns orchestration
- Status: Open → Packed → Shipped (or Cancelled)
- Stock release on cancel; event log on each step

**Port:** `5192`
