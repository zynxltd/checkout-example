# GreenShelf Click & Collect — React + ASP.NET swing

**Use case:** member books store pickup in a **React SPA**; staff marks ready / collected against an **ASP.NET Minimal API**.  
Third swing after SignalR (push) and order desk (HTTP-only) — same SOLID layering, SPA front end.

See **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

| Layer | Stack | Port |
|-------|--------|------|
| API | .NET 10 Minimal APIs + contracts/services | `:5193` |
| Web | React 19 + TypeScript + Vite (proxies `/api`) | `:5194` |

## Run (two terminals)

```bash
# API
cd demos/dotnet-react-click-collect/api
dotnet run --launch-profile http

# Web
cd demos/dotnet-react-click-collect/web
npm install
npm run dev
```

Open **http://127.0.0.1:5194**

1. **Book pickup** — add catalogue items, pick a slot, reserve  
2. **My reservations** — cancel while Booked/Ready  
3. **Staff desk** — Mark ready → Collect  

## API (via proxy or direct)

| Method | Path |
|--------|------|
| GET | `/api/health` |
| GET | `/api/catalogue` |
| GET | `/api/slots` |
| GET | `/api/reservations?email=` |
| POST | `/api/reservations` |
| POST | `/api/reservations/{id}/cancel\|ready\|collect` |

## What to notice

- Vite `proxy` so the browser calls same-origin `/api`  
- CORS origins configured for direct API hits from `:5194`  
- Stock + slot capacity reserved together; cancel releases both  
- Thin React `api.ts` ↔ thin `PickupEndpoints` ↔ fat `PickupService`

Contrast: fuller SaaS shape lives in `demos/green-energy-saas` — this demo is the **teaching swing** sized like S1/S2.
