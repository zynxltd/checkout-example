from __future__ import annotations

from typing import Protocol

from app.models import Product


class IProductPolicy(Protocol):
    def can_delete(self, product: Product) -> bool:
        ...

    @property
    def cannot_delete_reason(self) -> str:
        ...
