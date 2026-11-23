from __future__ import annotations

from typing import Protocol


class IDiscountService(Protocol):
    def apply(self, price: float, code: str) -> float:
        ...
