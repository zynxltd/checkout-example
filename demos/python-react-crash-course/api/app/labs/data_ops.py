from __future__ import annotations

"""
DATA — load / clean / shape tabular data (stdlib CSV).

Real-world cousins: pandas DataFrame, Polars, SQL warehouse extracts.
"""

import csv
import io
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


@dataclass(frozen=True)
class SaleRow:
    sku: str
    category: str
    units: int
    unit_price: float

    @property
    def revenue(self) -> float:
        return round(self.units * self.unit_price, 2)


SAMPLE_CSV = """sku,category,units,unit_price
ROSE01,plants,12,24.99
HERB12,plants,30,14.50
FEED01,wildlife,8,9.99
MOWER1,machinery,2,199.00
ROSE01,plants,5,24.99
"""


def load_sales_csv(text: str = SAMPLE_CSV) -> list[SaleRow]:
    reader = csv.DictReader(io.StringIO(text.strip()))
    rows: list[SaleRow] = []
    for raw in reader:
        rows.append(
            SaleRow(
                sku=raw["sku"].strip().upper(),
                category=raw["category"].strip().lower(),
                units=int(raw["units"]),
                unit_price=float(raw["unit_price"]),
            )
        )
    return rows


def filter_category(rows: Iterable[SaleRow], category: str) -> list[SaleRow]:
    needle = category.strip().lower()
    return [row for row in rows if row.category == needle]


def write_sales_csv(rows: list[SaleRow], path: Path) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["sku", "category", "units", "unit_price", "revenue"])
        writer.writeheader()
        for row in rows:
            writer.writerow(
                {
                    "sku": row.sku,
                    "category": row.category,
                    "units": row.units,
                    "unit_price": row.unit_price,
                    "revenue": row.revenue,
                }
            )
    return path
