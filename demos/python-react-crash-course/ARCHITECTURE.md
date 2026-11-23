# GreenShelf API — architecture (OOP / SOLID)

## Layout

```
api/app/
  main.py                 # HTTP app bootstrap only
  container.py            # composition root (wires contracts → implementations)
  config.py               # env-based settings
  contracts/              # Protocols = interfaces
  domain/exceptions.py    # business errors (404/409 mapping in routers)
  repositories/           # data access (memory | sqlite)
  services/               # application / domain logic
  routers/                # thin HTTP adapters
  labs/                   # data / reporting / scraper / ML / automation / stats demos
  models.py               # Pydantic DTOs
  data/product_seed.py    # seed catalogue
```

See also: [LABS.md](./LABS.md) for Python strengths beyond the CRUD API.
## SOLID map

| Principle | Example |
|-----------|---------|
| **S** | `DefaultLeadRouter` only routes; `LeadPipeline` only queues/workers; routers only HTTP |
| **O** | New routing rules → new `ILeadRouter` impl; pipeline unchanged |
| **L** | Any `IProductRepository` can replace another (memory ↔ sqlite) |
| **I** | Small protocols (`IDiscountService.apply`, `IProductPolicy.can_delete`) |
| **D** | `ProductService` / `LeadPipeline` depend on Protocols, not concrete classes |

## Persistence

```bash
DB_DRIVER=memory   # default for pytest (tests/conftest.py)
DB_DRIVER=sqlite   # file at api/data/greenshelf.db
SQLITE_PATH=/tmp/greenshelf.db
```

Health returns `db_driver`.

## Request path

```
Router → ProductService → IProductRepository
                      ↘ IProductPolicy (delete rules)

Router → ILeadPipeline → worker thread → ILeadRouter.decide(...)
```
