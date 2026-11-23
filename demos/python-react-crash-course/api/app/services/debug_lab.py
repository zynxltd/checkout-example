from __future__ import annotations

"""
EXERCISE 5 — Debugging session 1.

Expected for MOWER1 @ 199.00 with cost_ratio 0.62 → margin 75.62
"""

import logging

logger = logging.getLogger(__name__)


def calculate_margin(price: float, cost_ratio: float = 0.62) -> float:
    # BREAKPOINT here — F10/F11 in VS Code / PyCharm
    cost = round(price * cost_ratio, 2)
    margin = round(price - cost, 2)
    return margin


def lookup_margin(sku: str, catalog: list[dict]) -> dict:
    match = next((p for p in catalog if p["sku"].upper() == sku.upper()), None)
    if match is None:
        return {"sku": sku, "found": False, "margin": 0.0}
    margin = calculate_margin(match["price"])
    logger.info("sku=%s margin=%s price=%s", match["sku"], margin, match["price"])
    return {"sku": match["sku"], "found": True, "price": match["price"], "margin": margin}
