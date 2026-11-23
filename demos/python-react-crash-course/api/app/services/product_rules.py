from __future__ import annotations

from app.models import Product
from app.services.product_policy import StockProductPolicy

_policy = StockProductPolicy()


def can_delete(product: Product) -> bool:
    """EXERCISE 4 — business rule lives in StockProductPolicy (SOLID/DRY)."""
    return _policy.can_delete(product)


CANNOT_DELETE_REASON = StockProductPolicy.cannot_delete_reason
