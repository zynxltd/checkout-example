# Plotline DevOps bonus — Docker, Compose, CI, smoke

Laravel cousins: Forge/Envoyer/Vapor ≈ containers + Actions here.  
Agile: treat each bonus item as a PR ([agile guide](../../docs/agile-scrum-prs-smoke-tests.md)).

## What’s included

| Artifact | Purpose |
|----------|---------|
| `Dockerfile` (root) | **All-in-one** image: Vite build + Express serves API + SPA |
| `docker-compose.yml` | **Split**: API container + Nginx web (proxies `/api`) |
| `api/Dockerfile` / `web/Dockerfile` | Per-service images for Compose |
| `scripts/smoke.sh` | Post-deploy / local smoke |
| `ci-workflow.example.yml` | PR: install → build → docker smoke |

## Quick start — all-in-one

```bash
cd demos/node-react-saas

# Need lockfiles for npm ci in Docker — generate if missing:
(cd api && npm install)
(cd web && npm install)

docker build -t plotline .
docker run --rm -p 5210:5210 plotline

# open http://127.0.0.1:5210  (UI + /api on same origin)
./scripts/smoke.sh http://127.0.0.1:5210
```

## Quick start — Compose (split)

```bash
cd demos/node-react-saas
docker compose up --build

# UI  http://127.0.0.1:5180
# API http://127.0.0.1:5210
./scripts/smoke.sh http://127.0.0.1:5210
```

`web` waits until `api` **healthcheck** passes — same idea as depends_on + readiness in K8s.

## Env vars (API)

| Var | Default | Meaning |
|-----|---------|---------|
| `PORT` | `5210` | Listen port |
| `HOST` | `127.0.0.1` (Docker: `0.0.0.0`) | Bind address |
| `WEB_DIST` | unset | If set, serve SPA from that folder |
| `CORS_ORIGIN` | localhost:5180 | Comma-separated origins |
| `NODE_ENV` | — | `production` → combined logs |

---

## Bonus tasks (pick ≥3)

### D1 — Wire CI into the monorepo

Copy `ci-workflow.example.yml` → `.github/workflows/plotline.yml` and open a PR that only touches this demo. Confirm Actions run.

**Done when:** PR shows green `api` / `web` / `docker-smoke` jobs.

### D2 — Multi-stage cache

Add a BuildKit cache mount or explicit `npm ci` layer comments in `Dockerfile` so rebuilds skip `npm ci` when `package-lock.json` is unchanged. Time a no-op rebuild.

**Done when:** second `docker build` is clearly faster on dependency layer.

### D3 — Staging compose override

Add `docker-compose.override.example.yml` that sets `CORS_ORIGIN` and a fake `PLOTLINE_ENV=staging` echoed from `/api/health`.

**Done when:** health JSON includes the env label.

### D4 — Rollback drill

1. Tag image `plotline:good`
2. Break health (temp), build `plotline:bad`, run it, watch smoke fail
3. `docker run … plotline:good` again

**Done when:** you can narrate rollback in 60 seconds (interview gold).

### D5 — Observability lite

Log JSON one-liners for `POST /api/clubs/:id/pause` (`club_id`, `result`, `ms`). Optional: add `/api/metrics` with request counters in memory.

**Done when:** `docker logs` shows structured lines for a pause call.

### D6 — IaC awareness (no cloud required)

Write `infra/NOTES.md` (10–15 lines): how you’d map this Compose stack to **Azure Container Apps** or **AWS ECS**/App Runner (1 service vs 2, health probe path `/api/health`, env for `CORS_ORIGIN`).

**Done when:** NOTES exist and mention health probes + secrets not in the image.

---

## When to use which shape

| Shape | Use when |
|-------|----------|
| All-in-one Dockerfile | Simple demos, single VM, Forge-like “one app” |
| Compose API + Nginx | Closer to prod split (CDN/static vs API), learning networking |
| K8s / cloud run | Real multi-service; after Compose is boring |

Monolith vs microservices: this demo is a **modular monolith** in all-in-one mode, and a **2-service** layout under Compose — same codebase, different packaging ([landscape doc](../../docs/2026-stack-landscape.md)).

## Debug failures

| Symptom | Fix |
|---------|-----|
| `npm ci` fails in Docker | Commit `package-lock.json`; run `npm install` locally first |
| Web 502 on `/api` | API not healthy; `docker compose ps` / logs |
| Blank SPA routes | Nginx `try_files` / Express SPA fallback missing |
| Smoke 000 | Container not listening on `0.0.0.0` — set `HOST` |
| CORS errors in split mode | Set `CORS_ORIGIN` to the web origin |
