# Verdant Grid — .NET 10 + React SaaS demo

Green energy operations platform example:

| Layer | Stack |
|-------|--------|
| API | **.NET 10** / C# / ASP.NET Core minimal APIs |
| Web | **React 19** + TypeScript + Vite |
| Domain | Multi-site solar/wind/battery fleet, alerts, plan |

## Run (two terminals)

```bash
# API — http://127.0.0.1:5100
cd demos/green-energy-saas/api
dotnet run --launch-profile http

# Web — http://127.0.0.1:5175 (proxies /api → API)
cd demos/green-energy-saas/web
npm install
npm run dev
```

Open http://127.0.0.1:5175

## API

| Method | Path |
|--------|------|
| GET | `/api/health` |
| GET | `/api/tenant` |
| GET | `/api/dashboard` |
| GET | `/api/sites` |
| GET | `/api/sites/{id}` |
| GET | `/api/generation?range=24h\|7d` |
| GET | `/api/alerts` |
