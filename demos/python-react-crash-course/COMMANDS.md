# Python commands — Laravel / Vue → Python (FastAPI)

Cheat sheet for day-to-day **Python + FastAPI** when you already know **Laravel + Composer / Artisan**. React UI commands stay the same as Vue’s npm — see also [`react-crash-course/COMMANDS.md`](../react-crash-course/COMMANDS.md).

Companion lab: [`demos/python-react-crash-course`](../python-react-crash-course/).

---

## Mental model

| Laravel | Python (this course) |
|---------|----------------------|
| `composer` | **`pip`** (+ **`venv`**) |
| `artisan serve` | **`uvicorn`** |
| `routes/api.php` | FastAPI routers |
| FormRequest + Eloquent | **Pydantic** + services / SQLAlchemy later |
| Pest / PHPUnit | **pytest** |
| `.env` | `.env` + `os.environ` / pydantic-settings |
| Queued jobs | threads / Celery / RQ (course uses in-process queue) |
| Blade / Vue | **React** (separate `npm run dev`) |

Python replaces the **PHP backend**. Front end is still Node tooling.

---

## Python & virtualenvs (critical)

Always use a **venv** (like isolating vendor without polluting the system) — cousin of project-local `vendor/` + controlled PHP version.

```bash
python3 --version

cd demos/python-react-crash-course/api
python3 -m venv .venv

# Activate
source .venv/bin/activate          # macOS / Linux
# .venv\Scripts\activate           # Windows

python -m pip install --upgrade pip
pip install -r requirements.txt
```

| | |
|--|--|
| **When** | Every project, every machine |
| **How** | `.venv` stays in project; add to `.gitignore` |
| **Debug** | `which python` must point inside `.venv`; if imports fail, venv not active |

Deactivate:

```bash
deactivate
```

Without activating, call tools by path:

```bash
.venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn app.main:app --reload --port 8200
.venv/bin/pytest -q
```

---

## Packages (≈ Composer)

```bash
pip install fastapi uvicorn pydantic pytest httpx
pip install -r requirements.txt          # like composer install
pip freeze > requirements.txt            # like locking (simple)
pip uninstall fastapi
pip list
pip show fastapi
```

| | |
|--|--|
| **When** | Add web framework, test client, DB drivers |
| **Use case** | `composer require` equivalent |
| **Debug** | Wrong env → package installed globally but not in venv |
| **Better lock (optional)** | `pip-tools`, Poetry, or uv — teams vary |

This course keeps classic `requirements.txt` for clarity.

---

## Run the API (≈ `artisan serve`)

```bash
cd demos/python-react-crash-course/api
source .venv/bin/activate

uvicorn app.main:app --reload --port 8200
# API:  http://127.0.0.1:8200
# Docs: http://127.0.0.1:8200/docs      (Swagger UI — huge for Laravel people)
# Alt:  http://127.0.0.1:8200/redoc
```

| Flag | Meaning |
|------|---------|
| `app.main:app` | module `app/main.py`, variable `app` |
| `--reload` | restart on file change (≈ `npm run dev` HMR for API) |
| `--port 8200` | bind port |
| `--host 0.0.0.0` | expose on LAN/Docker |

| | |
|--|--|
| **When** | Local API development |
| **Use case** | Same as `php artisan serve` |
| **Debug** | ImportError → run from `api/` so `app` package resolves; check `pytest.ini` `pythonpath` |

Run React alongside:

```bash
cd ../web
npm install
npm run dev          # http://127.0.0.1:5173 — proxies /api → 8200
```

---

## Create / explore (no Artisan — use files + FastAPI)

| Goal | Laravel | Python / FastAPI |
|------|---------|------------------|
| New route | `routes/api.php` | `@router.get` in `routers/*.py` |
| New “controller” | `make:controller` | new module under `routers/` or `services/` |
| Validate input | FormRequest | Pydantic `BaseModel` |
| DI | service container | FastAPI `Depends(...)` |
| Interactive API map | `route:list` | **`/docs`** |

```bash
# Quick HTTP checks (≈ hitting routes in browser / Insomnia)
curl -s http://127.0.0.1:8200/api/health | jq .
curl -s http://127.0.0.1:8200/api/products | jq .
curl -s -X POST http://127.0.0.1:8200/api/leads \
  -H 'Content-Type: application/json' \
  -d '{"applicant_name":"Sam Lee","email":"sam@example.com","loan_amount":7500,"product_type":"personal"}' | jq .
```

---

## Testing (≈ Pest)

```bash
cd api
.venv/bin/pytest -q
.venv/bin/pytest -q tests/test_api.py
.venv/bin/pytest -vv                     # verbose
.venv/bin/pytest --pdb                   # drop into debugger on fail
.venv/bin/pytest -k "product"            # filter by name
```

`httpx` + FastAPI `TestClient` ≈ Laravel HTTP feature tests.

| | |
|--|--|
| **When** | Every PR; after Ex 1–4 in the crash course |
| **Use case** | Confidence before merge |
| **Debug** | `--pdb`; or breakpoint in test + IDE debug pytest |

---

## REPL (≈ `artisan tinker`)

```bash
python
>>> from app.services.product_store import ProductStore
>>> ProductStore().all()
```

Or:

```bash
.venv/bin/python -i -c "from app.main import app"
```

| | |
|--|--|
| **When** | Explore models/services quickly |
| **Debug** | Prefer tests for anything you want to keep |

---

## Debugging

### 1. IDE breakpoints

1. Cursor / VS Code / PyCharm
2. Breakpoint in `LeadPipeline._process` or `debug_lab.calculate_margin`
3. Debug configuration: module `uvicorn`, args `app.main:app --port 8200`
4. Or “Python: Current File” for scripts

Crash course endpoints:

- `GET /api/debug/margin?sku=MOWER1`
- Lead worker after `POST /api/leads`

### 2. Logging (≈ `Log::info`)

```python
import logging
logger = logging.getLogger(__name__)
logger.info("Routed lead %s → %s", lead_id, lender)
logger.exception("Failed")  # includes stack
```

```bash
# see logs in the uvicorn terminal
```

### 3. pdb (quick & dirty)

```python
breakpoint()  # Python 3.7+ — pauses in terminal
```

| | |
|--|--|
| **When** | No IDE debugger handy |
| **How** | `c` continue · `n` next · `s` step · `p var` print |
| **Use case** | Same niche as `dd()` but interactive |

### 4. Common failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| `ModuleNotFoundError: app` | Wrong cwd / no pythonpath | Run from `api/`; use `.venv/bin/pytest` |
| Port in use | Old uvicorn still running | Kill process or change `--port` |
| Validation 422 | Pydantic rejected body | Read `/docs` schema + response `detail` |
| CORS in browser | React on :5173, API :8200 | CORSMiddleware or Vite proxy |
| Stale code | Forgot `--reload` | restart uvicorn with `--reload` |

---

## Formatting / lint (optional cousins of Pint)

```bash
pip install ruff
ruff check .
ruff format .
```

| | |
|--|--|
| **When** | Team standards / CI |
| **Use case** | Like Laravel Pint + PHPStan lite |

---

## Environment variables

```bash
export DEMO_SECRET=dev-secret
# or .env + python-dotenv / pydantic-settings
```

| | |
|--|--|
| **When** | Shopify webhook secret (Ex 8d), DB URLs |
| **Debug** | Never commit real secrets; mirror `.env.example` |

---

## Use-case recipes

| Use case | Commands |
|----------|----------|
| API only | `uvicorn app.main:app --reload --port 8200` |
| Full stack local | uvicorn + `cd web && npm run dev` |
| Learn from Laravel | Follow `EXERCISES.md` (10 tasks) |
| PR checks | `pytest -q` + `npm run build` in `web/` |
| Explore API | Open `/docs` — click Try it out |
| Debug margin | Breakpoint + `GET /api/debug/margin` |
| Debug queue | Breakpoint in `_process` + POST lead |

---

## CI sketch (≈ GitHub Actions on PHPUnit)

```bash
pip install -r requirements.txt
pytest -q
```

Example workflow file: `ci-workflow.example.yml` in this demo folder.

---

## Quick “I used to type…” map

| Laravel / Vue | Python / FastAPI |
|---------------|------------------|
| `composer install` | `pip install -r requirements.txt` (in venv) |
| `php artisan serve` | `uvicorn app.main:app --reload` |
| `php artisan test` | `pytest` |
| `php artisan route:list` | open `/docs` |
| `php artisan tinker` | `python` REPL |
| `composer require X` | `pip install X` → freeze requirements |
| `Log::info` / `dd()` | `logger.info` / `breakpoint()` |
| `.env` | env vars / `.env` |
| `npm run dev` (UI) | still `npm run dev` (React) |

---

## React half (same as Vue npm)

From `web/`:

```bash
npm install
npm run dev
npm run build
npm test          # if configured
```

Full React command sheet: [`../react-crash-course/COMMANDS.md`](../react-crash-course/COMMANDS.md).
