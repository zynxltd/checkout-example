from __future__ import annotations

"""Back-compat shim — prefer ProductService + IProductRepository."""

from app.repositories.memory_product_repository import InMemoryProductRepository

# Older exercise notes referred to ProductStore; keep import path working.
ProductStore = InMemoryProductRepository

__all__ = ["ProductStore", "InMemoryProductRepository"]
