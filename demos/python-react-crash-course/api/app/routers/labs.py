from __future__ import annotations

from fastapi import APIRouter

from app.labs.automation import run_nightly_sales_job
from app.labs.ml_toy import score_catalog_row
from app.labs.reporting import category_revenue_report, top_sku_by_revenue
from app.labs.scientific import compound_growth, summarise_prices
from app.labs.scraper import fetch_product_stub, fetch_random_quote
from app.labs.data_ops import load_sales_csv


def create_labs_router() -> APIRouter:
    r = APIRouter(prefix="/api/labs", tags=["python-labs"])

    @r.get("/reporting")
    def reporting():
        rows = load_sales_csv()
        return {
            "top_sku": top_sku_by_revenue(rows),
            "by_category": [
                {
                    "category": item.category,
                    "units": item.units,
                    "revenue": item.revenue,
                    "line_count": item.line_count,
                }
                for item in category_revenue_report(rows)
            ],
        }

    @r.get("/scraper/quote")
    def scraper_quote():
        quote = fetch_random_quote()
        return {"quote": quote.quote, "author": quote.author, "source": quote.source}

    @r.get("/scraper/product")
    def scraper_product(product_id: int = 1):
        return fetch_product_stub(product_id)

    @r.get("/ml/score")
    def ml_score(price: float = 24.99, stock: int = 40, category: str = "plants"):
        return score_catalog_row(price=price, stock=stock, category=category)

    @r.post("/automation/nightly-sales")
    def automation_nightly():
        result = run_nightly_sales_job()
        return {
            "ran_at": result.ran_at,
            "report_path": result.report_path,
            "top_sku": result.top_sku,
            "categories": result.categories,
        }

    @r.get("/scientific/prices")
    def scientific_prices():
        prices = [row.unit_price for row in load_sales_csv()]
        summary = summarise_prices(prices)
        return {
            "summary": {
                "n": summary.n,
                "mean": summary.mean,
                "median": summary.median,
                "stdev": summary.stdev,
                "p90": summary.p90,
            },
            "growth_example": compound_growth(1000, 0.05, 5),
        }

    return r
