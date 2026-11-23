# React SPA + ASP.NET Click & Collect — architecture (OOP / SOLID)

## Layout

```
api/                 ASP.NET Minimal API (:5193)
  Contracts/         ports — IPickupService, ICollectableCatalog, ISlotBoard, IPickupPolicy…
  Models/            Reservation, PickupSlot, CollectableItem, status enum
  Services/          implementations + orchestration
  Endpoints/         MapPickupApi — thin HTTP adapters
  Options/           PickupOptions (limits, CORS)
web/                 React 19 + Vite + TypeScript (:5194)
  src/api.ts         fetch client (proxied /api → :5193)
  src/App.tsx        book / my reservations / staff desk
```

## SOLID map

| Principle | Example |
|-----------|---------|
| **S** | Policy = rules; catalog = stock; slot board = capacity; endpoints = HTTP; React = UI |
| **O** | New cancel rules → new `IPickupPolicy` without touching React |
| **L** | Any `IReservationStore` behind `PickupService` |
| **I** | Separate catalog / slots / policy ports |
| **D** | Endpoints + React depend on HTTP contract; API internals on interfaces |

## Status machine

```
Booked ──ready──► Ready ──collect──► Collected
   │                 │
   └──── cancel ─────┘   (within CancelWindowHours; releases stock + slot)
```

## Request paths

```
React Add → cart (client)
POST /api/reservations
  → IPickupService.Create
  → policy validate
  → catalog TryReserve (rollback on fail)
  → slots TryBook
  → store Add + event "booked"

Staff Mark ready / Collect
  → policy gate → store replace + event
```

## Laravel / Vue cheat sheet

| Laravel / Vue | Here |
|---------------|------|
| `routes/api.php` + Sanctum SPA | Minimal API + Vite proxy/CORS |
| Vue SPA | React 19 |
| FormRequest / Policy | `IPickupPolicy` |
| Eloquent | `IReservationStore` + catalog/slots |
| `axios` / `fetch` | `src/api.ts` |

## When to pick this swing

| Need | Demo |
|------|------|
| Live multi-user push | S1 SignalR auction |
| curl/JSON API only | S2 Minimal order desk |
| Browser SPA + .NET API | **S3 this app** |
| Razor server HTML | MVC crash course |
