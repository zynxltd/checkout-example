from __future__ import annotations

from app.models import Product


class StockProductPolicy:
    """Business rule: only zero-stock products may be deleted (SRP)."""

    cannot_delete_reason = "Cannot delete product with stock remaining."

    def can_delete(self, product: Product) -> bool:
        return product.stock <= 0
