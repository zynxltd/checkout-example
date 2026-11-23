from __future__ import annotations

from typing import Optional, Protocol

from app.models import Product, ProductCreate


class IProductRepository(Protocol):
    """Persistence contract for catalogue products (DIP)."""

    def all(self) -> list[Product]:
        ...

    def find(self, product_id: int) -> Optional[Product]:
        ...

    def search(self, category: Optional[str] = None, q: Optional[str] = None) -> list[Product]:
        ...

    def add(self, data: ProductCreate) -> Product:
        ...

    def update(self, product_id: int, data: ProductCreate) -> Optional[Product]:
        ...

    def delete(self, product_id: int) -> bool:
        ...
