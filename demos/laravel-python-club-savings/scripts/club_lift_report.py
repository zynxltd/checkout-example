#!/usr/bin/env python3
"""Compare recovery when Club savings messaging is shown vs not."""

from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "sample_abandons.csv"
OUT_PATH = ROOT / "data" / "lift_report.json"

PLANT_RATE = 0.15
MACHINERY_RATE = 0.075
CLUB_ANNUAL = 10.0


def line_saving(price: float, qty: int, category: str) -> float:
    rate = MACHINERY_RATE if category == "machinery" else PLANT_RATE
    return round(price * qty * rate, 2)


def main() -> None:
    rows = list(csv.DictReader(CSV_PATH.open()))
    groups = {"guest": [], "club_msg": []}
    for row in rows:
        groups[row["catalog"]].append(row)

    report = {"cohorts": {}, "lift": {}}
    for name, cohort in groups.items():
        carts = len(cohort)
        recovered = sum(1 for r in cohort if r["recovered"] == "1")
        revenue = sum(float(r["price"]) * int(r["qty"]) for r in cohort if r["recovered"] == "1")
        potential_club_saving = sum(
            line_saving(float(r["price"]), int(r["qty"]), r["category"]) for r in cohort
        )
        report["cohorts"][name] = {
            "carts": carts,
            "recovered": recovered,
            "recovery_rate": round(recovered / carts, 3) if carts else 0,
            "recovered_revenue": round(revenue, 2),
            "potential_club_saving_shown": round(potential_club_saving, 2),
        }

    g = report["cohorts"]["guest"]["recovery_rate"]
    c = report["cohorts"]["club_msg"]["recovery_rate"]
    report["lift"] = {
        "absolute_pp": round((c - g) * 100, 1),
        "relative_pct": round(((c - g) / g) * 100, 1) if g else None,
        "club_annual_price": CLUB_ANNUAL,
        "note": "Synthetic demo data — Club message cohort recovers more often.",
    }

    OUT_PATH.write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))
    print(f"\nWrote {OUT_PATH}")


if __name__ == "__main__":
    main()
