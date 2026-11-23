from __future__ import annotations

"""
REPORTING — roll up numbers for ops / email / dashboard exports.

Real-world cousins: pandas groupby, Metabase, Excel via openpyxl.
"""

from collections import defaultdict
from dataclasses import dataclass

from app.labs.data_ops import SaleRow, load_sales_csv


@dataclass(frozen=True)
class CategoryReport:
    category: str
    units: int
    revenue: float
    line_count: int


def category_revenue_report(rows: list[SaleRow] | None = None) -> list[CategoryReport]:
    rows = rows if rows is not None else load_sales_csv()
    buckets: dict[str, dict[str, float]] = defaultdict(lambda: {"units": 0, "revenue": 0.0, "lines": 0})

    for row in rows:
        buckets[row.category]["units"] += row.units
        buckets[row.category]["revenue"] += row.revenue
        buckets[row.category]["lines"] += 1

    report = [
        CategoryReport(
            category=category,
            units=int(data["units"]),
            revenue=round(data["revenue"], 2),
            line_count=int(data["lines"]),
        )
        for category, data in buckets.items()
    ]
    return sorted(report, key=lambda item: item.revenue, reverse=True)


def top_sku_by_revenue(rows: list[SaleRow] | None = None) -> dict:
    rows = rows if rows is not None else load_sales_csv()
    totals: dict[str, float] = defaultdict(float)
    for row in rows:
        totals[row.sku] += row.revenue
    sku, revenue = max(totals.items(), key=lambda pair: pair[1])
    return {"sku": sku, "revenue": round(revenue, 2)}
