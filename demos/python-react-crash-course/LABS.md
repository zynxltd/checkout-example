# Python strengths beyond the web API

Tiny labs under `api/app/labs/` — stdlib + `httpx` only (no pandas/sklearn required).

| Area | Module | Try it |
|------|--------|--------|
| **Data** | `data_ops.py` | Load/clean CSV rows into dataclasses |
| **Reporting** | `reporting.py` | Category revenue rollups |
| **Scrapers** | `scraper.py` | Fetch JSON from DummyJSON |
| **ML** | `ml_toy.py` | Weighted “impulse buy” scorer |
| **Automation** | `automation.py` | Nightly export job → `data/exports/` |
| **Scientific** | `scientific.py` | mean / median / stdev / growth curve |

## HTTP (with API running on :8200)

```bash
curl -s http://127.0.0.1:8200/api/labs/reporting | python3 -m json.tool
curl -s http://127.0.0.1:8200/api/labs/scraper/quote | python3 -m json.tool
curl -s 'http://127.0.0.1:8200/api/labs/ml/score?price=24.99&stock=40&category=plants' | python3 -m json.tool
curl -s -X POST http://127.0.0.1:8200/api/labs/automation/nightly-sales | python3 -m json.tool
curl -s http://127.0.0.1:8200/api/labs/scientific/prices | python3 -m json.tool
```

## CLI (from `api/`)

```bash
python -m app.labs.cli
```

## Tests

```bash
cd api && python -m pytest tests/test_labs.py -q
```

## What you’d add in production

| Lab | Next step |
|-----|-----------|
| Data | `pandas` / Polars / warehouse SQL |
| Reporting | Excel (`openpyxl`), PDF, Slack webhook |
| Scrapers | BeautifulSoup / Playwright + rate limits + robots.txt |
| ML | scikit-learn / PyTorch + train/eval split |
| Automation | cron, Celery, Airflow, GitHub Actions |
| Scientific | NumPy, SciPy, statsmodels |
