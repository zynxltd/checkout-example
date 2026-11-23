# Node MVC demo (Express + EJS + TypeScript)

Classic **Model · View · Controller** app on Node.js, now written in **TypeScript** with a more realistic backend layout.

```
src/
  server.ts              → Express bootstrap
  config.ts              → typed env/config
  types/                 → domain + job + session types
  routes/                → map URLs to controllers
  controllers/           → request logic
  repositories/          → data access interfaces + in-memory impl
  services/              → auth, queue, API client, dashboard orchestration
  models/                → domain classes
  middleware/            → auth gate
  lib/                   → DI container + async handler
views/                   → EJS templates
public/                  → static CSS
```

## Run

```bash
cd demos/node-mvc-demo
npm install
npm run dev
```

Open http://127.0.0.1:3090

```bash
npm run typecheck   # strict TS check
npm run build       # compile to dist/
npm run inspect     # debugger on ws://127.0.0.1:9230
```

## What’s in the TypeScript version

- **Typed job queue** with `lead.follow-up` and `quote.digest` job types
- **Repository interfaces** (`IProductRepository`, `IContactRepository`) with in-memory implementations
- **Auth service** + session-protected dashboard
- **Third-party API client** with timeout + fallback
- **JSON API** at `/api/health` and `/api/dashboard`
- **SOLID-style split**: controllers thin, services/repositories own behavior

See **[CONTRACTS.md](./CONTRACTS.md)** for interface contracts and how each SOLID principle maps to this codebase.

## Demo credentials

```
demo@harbor.test
letmein123
```

## Debugging commands

```bash
npm run dev
npm run inspect
npm run typecheck

curl -i http://127.0.0.1:3090/api/health
curl -i http://127.0.0.1:3090/login

curl -i -c cookies.txt -b cookies.txt \
  -X POST http://127.0.0.1:3090/login \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'email=demo@harbor.test&password=letmein123'

curl -i -b cookies.txt http://127.0.0.1:3090/dashboard
curl -s -b cookies.txt http://127.0.0.1:3090/api/dashboard | jq
```

## Routes

| Method | Path | Controller |
|--------|------|------------|
| GET | `/` | `homeController.index` |
| GET | `/about` | `homeController.about` |
| GET | `/products` | `productController.index` |
| GET | `/products/:id` | `productController.show` |
| GET/POST | `/contact` | `contactController` |
| GET/POST | `/login` | `authController` |
| GET | `/dashboard` | `dashboardController.show` |
| GET | `/api/health` | `apiController.health` |
| GET | `/api/dashboard` | `apiController.dashboardJson` |

See **[COMMANDS.md](./COMMANDS.md)** for the Laravel/Vue → Node cheat sheet.
