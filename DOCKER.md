# Docker tutorial — YouGarden cart drawer demo

Run the Laravel `yg-cart-drawer-demo` app inside Docker and open it in the browser.

> **Note:** Docker Desktop via Homebrew needs your Mac password for system links. This guide uses **Colima + Docker CLI** instead (already installable without sudo).

## What you get

| Piece | Role |
|-------|------|
| `Dockerfile` | PHP 8.4 + Apache + Composer image |
| `docker-compose.yml` | One service on **port 8080** |
| `docker/entrypoint.sh` | `.env`, `APP_KEY`, SQLite migrate on start |
| `.dockerignore` | Skips `demos/`, `node_modules`, etc. |

Preview URL after start: **http://localhost:8080**

---

## 0. Install runtime (Colima)

```bash
brew install colima docker docker-compose

# Let Docker find the Compose plugin
mkdir -p ~/.docker
cat > ~/.docker/config.json <<'EOF'
{
  "cliPluginsExtraDirs": [
    "/opt/homebrew/lib/docker/cli-plugins"
  ]
}
EOF

colima start --cpu 2 --memory 4 --disk 40
docker version
docker compose version
```

Optional Docker Desktop (needs password / GUI):

```bash
brew install --cask docker-desktop
open -a Docker
```

---

## 1. Build the image

From the repo root:

```bash
cd /Users/tom/Herd/yg-cart-drawer-demo
docker compose build
```

First build downloads PHP 8.4 base + Composer deps (a few minutes).

---

## 2. Start the app

```bash
docker compose up -d
docker compose ps
docker compose logs -f app
```

Look for Apache started / migrate success, then open:

### → [http://localhost:8080](http://localhost:8080)

Preview login is **off** in the container (`DEMO_PREVIEW_AUTH_ENABLED=false`).

---

## 3. Useful commands

```bash
# Shell into the container
docker compose exec app bash

# Artisan
docker compose exec app php artisan route:list

# Restart
docker compose restart

# Stop
docker compose down

# Stop + remove SQLite volume
docker compose down -v

# Stop Colima VM
colima stop
```

---

## How it maps (mental model)

```
Browser → localhost:8080
       → Docker port map 8080:80
       → Apache → /var/www/html/public
       → Laravel (session cart, Blade demos)
       → SQLite file in named volume yg-sqlite
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Cannot connect to the Docker daemon` | `colima start` (or open Docker Desktop) |
| Port 8080 in use | Change `"8080:80"` in `docker-compose.yml` |
| 500 on first load | `docker compose logs app` |
| Blank page | `docker compose exec app grep APP_KEY .env` |
| `docker compose` not found | Check `cliPluginsExtraDirs` in `~/.docker/config.json`, or use `docker-compose` |

---

## Why this demo?

Same app you use with Herd / `php artisan serve`, packaged so anyone can run:

```bash
colima start
docker compose up --build -d
```

…without installing PHP, Composer, or Herd locally.
