"""Run: python -m app.labs.cli  (from api/)"""

from __future__ import annotations

from app.labs.automation import run_nightly_sales_job
from app.labs.ml_toy import score_catalog_row
from app.labs.reporting import category_revenue_report, top_sku_by_revenue
from app.labs.scientific import summarise_prices
from app.labs.scraper import fetch_random_quote
from app.labs.data_ops import load_sales_csv


def main() -> None:
    rows = load_sales_csv()
    print("=== DATA ===")
    print(f"loaded {len(rows)} sale rows")

    print("\n=== REPORTING ===")
    print("top:", top_sku_by_revenue(rows))
    for item in category_revenue_report(rows):
        print(f"  {item.category}: £{item.revenue} ({item.units} units)")

    print("\n=== SCRAPER ===")
    quote = fetch_random_quote()
    print(f'"{quote.quote}" — {quote.author} [{quote.source}]')

    print("\n=== ML ===")
    print(score_catalog_row(24.99, 40, "plants"))

    print("\n=== SCIENTIFIC ===")
    summary = summarise_prices([r.unit_price for r in rows])
    print(summary)

    print("\n=== AUTOMATION ===")
    job = run_nightly_sales_job()
    print(f"wrote {job.report_path}")


if __name__ == "__main__":
    main()
