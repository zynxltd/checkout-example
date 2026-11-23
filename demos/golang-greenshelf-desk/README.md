# GreenShelf desk — Go swing

**Use case:** garden order intake API in **idiomatic Go** — stdlib `net/http`, interfaces, mutexes, and a **goroutine + channel** audit worker.

Same domain shape as the .NET Minimal order desk, different language.

| Port | `:5201` |
|------|---------|
| Module | `demos/golang-greenshelf-desk` |
| Deps | **stdlib only** |

See [ARCHITECTURE.md](./ARCHITECTURE.md).

## Prerequisites

```bash
go version   # need Go 1.22+ (PathValue routing)
# macOS: brew install go
```

## Run

```bash
cd demos/golang-greenshelf-desk
go run ./cmd/server
```

Open http://127.0.0.1:5201

```bash
curl -s http://127.0.0.1:5201/api/catalog

curl -s http://127.0.0.1:5201/api/orders \
  -H 'Content-Type: application/json' \
  -d '{"customer":"Sam Lee","lines":[{"sku":"ROSE01","qty":2}],"notes":"leave by shed"}'

# then pack → ship (use id from create)
curl -s -X POST http://127.0.0.1:5201/api/orders/{id}/pack
curl -s -X POST http://127.0.0.1:5201/api/orders/{id}/ship \
  -H 'Content-Type: application/json' -d '{"tracking":"GS-GO-1"}'

curl -s http://127.0.0.1:5201/api/audit
```

## What to notice

- Interfaces in `internal/ports` ≈ C# contracts / Laravel interfaces  
- `sync.Mutex` on catalog/store (thread-safe)  
- Audit worker: `chan` + `go` (multithreading / async boundary)  
- Thin HTTP layer; fat `service.Orders`

## Laravel / .NET map

| Idea | Laravel | .NET | Go |
|------|---------|------|-----|
| HTTP API | `routes/api.php` | Minimal APIs | `net/http` ServeMux |
| DI ports | container | `IOrderService` | `ports.OrderService` |
| Queue worker | `queue:work` | `BackgroundService` | goroutine + channel |
