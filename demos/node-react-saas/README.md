# Plotline — Node.js + React SaaS demo

Garden-club subscription ops platform (multi-tenant feel):

| Layer | Stack |
|-------|--------|
| API | **Node.js** + Express |
| Web | **React 19** + Vite |
| Domain | Clubs, MRR, signups chart, alerts, pause action |

Pairs with the landscape note in `docs/2026-stack-landscape.md` (API + SPA monolith shape).

## Run (two terminals)

```bash
# API — http://127.0.0.1:5210
cd demos/node-react-saas/api
npm install
npm run dev

# Web — http://127.0.0.1:5180 (proxies /api → API)
cd demos/node-react-saas/web
npm install
npm run dev
```

Open http://127.0.0.1:5180

## API

| Method | Path | Notes |
|--------|------|--------|
| GET | `/api/health` | Smoke |
| GET | `/api/tenant` | Current org / plan / seats |
| GET | `/api/dashboard` | KPI roll-up |
| GET | `/api/clubs` | Club list |
| GET | `/api/clubs/:id` | Club detail |
| POST | `/api/clubs/:id/pause` | Mutation (409 on trial) |
| GET | `/api/signups?range=24h\|7d` | Chart series |
| GET | `/api/alerts` | Ops alerts |

## Smoke

```bash
curl -s http://127.0.0.1:5210/api/health
curl -s http://127.0.0.1:5210/api/dashboard
curl -s -X POST http://127.0.0.1:5210/api/clubs/club_coast/pause
```

Or: `./scripts/smoke.sh http://127.0.0.1:5210`

## DevOps bonus

Docker (all-in-one **or** Compose split), CI example, smoke script, and tasks **D1–D6**: see **[DEVOPS.md](./DEVOPS.md)**.

```bash
# all-in-one
docker build -t plotline .
docker run --rm -p 5210:5210 plotline

# or split API + Nginx
docker compose up --build
```

## Related

| Demo | Stack |
|------|--------|
| `green-energy-saas` | .NET + React SaaS |
| `python-react-crash-course` | FastAPI + React learning path |
| `node-mvc-demo` | Express MVC (no React) |
| `react-crash-course` | React-only refresher |
