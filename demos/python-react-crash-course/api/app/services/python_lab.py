from __future__ import annotations

"""
EXERCISE 7 — list / dict comprehensions + helpers (Python's 'LINQ').
Make run_self_check() return True.
"""

from collections import defaultdict
from typing import Any

SAMPLE = [
    {"sku": "ROSE01", "name": "Climbing Rose", "category": "plants", "price": 24.99, "stock": 40},
    {"sku": "FEED01", "name": "Bird Feeder Kit", "category": "wildlife", "price": 9.99, "stock": 120},
    {"sku": "MOWER1", "name": "Compact Lawn Mower", "category": "machinery", "price": 199.0, "stock": 8},
    {"sku": "HERB12", "name": "Herb Starter Pack", "category": "plants", "price": 14.5, "stock": 75},
    {"sku": "TREE9", "name": "Olive Tree", "category": "plants", "price": 49.99, "stock": 0},
]


def plants_only(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    plants = [row for row in rows if row["category"] == "plants"]
    return sorted(plants, key=lambda row: row["name"])


def total_stock(rows: list[dict[str, Any]]) -> int:
    return sum(int(row["stock"]) for row in rows)


def average_price_in_stock(rows: list[dict[str, Any]]) -> float:
    priced = [float(row["price"]) for row in rows if int(row["stock"]) > 0]
    if not priced:
        return 0.0
    return round(sum(priced) / len(priced), 2)


def category_rollup(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    buckets: dict[str, dict[str, float]] = defaultdict(lambda: {"count": 0, "value": 0.0})
    for row in rows:
        category = str(row["category"])
        buckets[category]["count"] += 1
        buckets[category]["value"] += float(row["price"]) * int(row["stock"])
    return [
        {"category": category, "count": int(data["count"]), "value": round(data["value"], 2)}
        for category, data in buckets.items()
    ]


def most_expensive_sku(rows: list[dict[str, Any]]) -> str | None:
    if not rows:
        return None
    top = max(rows, key=lambda row: float(row["price"]))
    return str(top["sku"])


def run_self_check() -> bool:
    try:
        plants = plants_only(SAMPLE)
        if len(plants) != 3 or plants[0]["name"] != "Climbing Rose":
            return False
        if total_stock(SAMPLE) != 243:
            return False
        if average_price_in_stock(SAMPLE) != 62.12:
            return False
        if most_expensive_sku(SAMPLE) != "MOWER1":
            return False
        rollup = sorted(category_rollup(SAMPLE), key=lambda r: r["category"])
        if len(rollup) != 3:
            return False
        return True
    except NotImplementedError:
        return False
