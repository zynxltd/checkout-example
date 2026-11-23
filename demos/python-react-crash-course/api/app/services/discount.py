from __future__ import annotations

"""Clean discount helper — replaces the unsafe AI fixture."""


KNOWN_CODES = {
    "SAVE10": ("percent", 0.10),
    "SAVE50": ("fixed", 50.0),
}


class DiscountService:
    """IDiscountService implementation — no eval, no admin backdoor, never negative."""

    def apply(self, price: float, code: str) -> float:
        if price < 0:
            raise ValueError("price must be >= 0")

        normalized = (code or "").strip().upper()
        rule = KNOWN_CODES.get(normalized)
        if rule is None:
            return round(price, 2)

        kind, amount = rule
        if kind == "percent":
            discounted = price * (1 - amount)
        else:
            discounted = price - amount

        return round(max(discounted, 0.0), 2)


def apply_discount(price: float, code: str) -> float:
    """Back-compat function wrapper used by tests/routes."""
    return DiscountService().apply(price, code)
