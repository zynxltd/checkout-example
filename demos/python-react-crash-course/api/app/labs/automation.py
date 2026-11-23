from __future__ import annotations

"""
AUTOMATION — scripted jobs you would cron / queue / GitHub Action.

Real-world cousins: Celery beat, Airflow, cron + CLI, GitHub Actions.
"""

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

from app.labs.data_ops import load_sales_csv, write_sales_csv
from app.labs.reporting import category_revenue_report, top_sku_by_revenue


@dataclass(frozen=True)
class AutomationResult:
    ran_at: str
    report_path: str
    top_sku: dict
    categories: list[dict]


def run_nightly_sales_job(output_dir: Path | None = None) -> AutomationResult:
    """
    Fake 'nightly job':
    1) load sales
    2) write cleaned CSV
    3) build summary numbers (email/Slack would go here)
    """
    root = output_dir or Path(__file__).resolve().parents[2] / "data" / "exports"
    rows = load_sales_csv()
    csv_path = write_sales_csv(rows, root / "sales_clean.csv")

    categories = [
        {
            "category": item.category,
            "units": item.units,
            "revenue": item.revenue,
            "line_count": item.line_count,
        }
        for item in category_revenue_report(rows)
    ]
    top = top_sku_by_revenue(rows)

    summary_path = root / "sales_summary.txt"
    summary_path.write_text(
        "\n".join(
            [
                f"ran_at={datetime.now(timezone.utc).isoformat()}",
                f"top_sku={top['sku']} revenue={top['revenue']}",
                *[f"{c['category']}: units={c['units']} revenue={c['revenue']}" for c in categories],
                f"csv={csv_path}",
            ]
        )
        + "\n",
        encoding="utf-8",
    )

    return AutomationResult(
        ran_at=datetime.now(timezone.utc).isoformat(),
        report_path=str(summary_path),
        top_sku=top,
        categories=categories,
    )
