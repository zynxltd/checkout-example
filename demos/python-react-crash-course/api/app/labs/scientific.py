from __future__ import annotations

"""
SCIENTIFIC / STATS — numeric computing with the standard library.

Real-world cousins: NumPy, SciPy, pandas, statsmodels.
"""

import math
import statistics
from dataclasses import dataclass


@dataclass(frozen=True)
class StatSummary:
    n: int
    mean: float
    median: float
    stdev: float
    p90: float


def summarise_prices(prices: list[float]) -> StatSummary:
    if not prices:
        return StatSummary(n=0, mean=0.0, median=0.0, stdev=0.0, p90=0.0)

    ordered = sorted(prices)
    # nearest-rank 90th percentile
    rank = max(0, min(len(ordered) - 1, math.ceil(0.9 * len(ordered)) - 1))
    stdev = statistics.pstdev(ordered) if len(ordered) > 1 else 0.0

    return StatSummary(
        n=len(ordered),
        mean=round(statistics.fmean(ordered), 2),
        median=round(statistics.median(ordered), 2),
        stdev=round(stdev, 2),
        p90=round(ordered[rank], 2),
    )


def compound_growth(start: float, rate: float, periods: int) -> list[float]:
    """Simple projection curve — same idea as financial / growth models."""
    value = start
    series = [round(value, 2)]
    for _ in range(periods):
        value *= 1 + rate
        series.append(round(value, 2))
    return series
