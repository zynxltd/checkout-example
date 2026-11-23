# GreenShelf desk — Go architecture

## Layout

```
cmd/server/main.go     composition root (wire interfaces)
internal/
  domain/              models / DTOs
  ports/               interfaces (Go's contracts)
  catalog/             stock (mutex)
  store/               orders (RWMutex)
  policy/              rules only
  service/             orchestration
  audit/               channel + goroutine worker
  httpapi/             thin net/http adapters
  clock/               time abstraction
```

## SOLID in Go

| Letter | Example |
|--------|---------|
| **S** | Policy ≠ catalog ≠ store ≠ HTTP ≠ audit worker |
| **O** | New shipping rules → new `OrderPolicy` impl |
| **L** | Any `OrderStore` behind `service.Orders` |
| **I** | Small interfaces in `ports/` |
| **D** | Handlers depend on `ports.OrderService`, not concretes |

## Status machine

```
open → pack → packed → ship → shipped
  └─ cancel (within window; releases stock)
```

## Concurrency

```
Create/Pack/Ship/Cancel
  → service emits AuditEntry on channel
  → audit.Worker goroutine drains → log + in-memory recent
```

Laravel: `dispatch` + `queue:work` · .NET: `Channel` + `BackgroundService` · **Go: `chan` + `go func`**

## Laravel cheat sheet

| Laravel | Go here |
|---------|---------|
| `routes/api.php` | `http.ServeMux` methods |
| FormRequest / Policy | `ports.OrderPolicy` |
| Eloquent | `ports.OrderStore` + `ports.Catalog` |
| Service class | `service.Orders` |
| `queue:work` | `audit.Worker` goroutine |
