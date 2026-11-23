# GreenShelf — Python + React crash course (Laravel → this role)

Refresher for a **Software Engineer** seat focused on **Python + React**, ownership, tests, Git/PR, and **AI-assisted** delivery. Built for someone strong in **Laravel** transferring patterns across.

## Run

**API** (FastAPI) — http://127.0.0.1:8200 · Swagger http://127.0.0.1:8200/docs

```bash
cd demos/python-react-crash-course/api
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --port 8200
# optional persistence:
# DB_DRIVER=sqlite .venv/bin/uvicorn app.main:app --reload --port 8200
```

Architecture (OOP / SOLID / repositories): **[ARCHITECTURE.md](./ARCHITECTURE.md)**  
Python labs (data / reporting / scrapers / ML / automation / stats): **[LABS.md](./LABS.md)**

**Web** (React + Vite) — http://127.0.0.1:5173

```bash
cd demos/python-react-crash-course/web
npm install
npm run dev
```

**Tests**

```bash
cd api && .venv/bin/pytest -q
```

## Commands (Laravel → Python + React)

See **[COMMANDS.md](./COMMANDS.md)** — venv, pip, uvicorn, pytest, debugging, plus React npm pointers.

## What’s included

| Area | Path |
|------|------|
| Products API | `/api/products` |
| Health | `/api/health` |
| Debug margin | `/api/debug/margin?sku=MOWER1` |
| Loan lead queue | `/api/leads` + background worker |
| React ops UI | `web/src/App.jsx` |
| pytest starter | `api/tests/test_api.py` |
| AI review fixture | `api/fixtures/ai_generated_discount.py` |
| **10 tasks** | [EXERCISES.md](./EXERCISES.md) |

## Laravel cheat sheet

| Laravel | FastAPI / React |
|---------|-----------------|
| `Route::apiResource` | `APIRouter` + path ops |
| FormRequest | Pydantic `BaseModel` |
| Eloquent | `ProductStore` (swap DB later) |
| Queued job | `LeadPipeline` worker thread |
| Blade/Vue | React components |
| Pest/PHPUnit | pytest |

## Job advert → this folder

Essential Python/React/Git/autonomy/AI → exercises **1–10**.  
Desirable CI/Shopify/security → **8d, 9, 10**.  
Azure/IaC → read-only awareness; use cloud later — same app boundaries.

Shopify storefront React practice also lives in `demos/react-shopify-cart-drawer`.
