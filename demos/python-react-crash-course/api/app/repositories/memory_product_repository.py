from __future__ import annotations

import threading
from typing import Optional

from app.data.product_seed import seed_products
from app.models import Product, ProductCreate, utcnow


class InMemoryProductRepository:
    """Default catalogue store — swap for SqliteProductRepository via config."""

    def __init__(self, initial: Optional[list[Product]] = None) -> None:
        self._lock = threading.Lock()
        products = initial if initial is not None else seed_products()
        self._products = list(products)
        self._next_id = max((p.id for p in self._products), default=0) + 1

    def all(self) -> list[Product]:
        with self._lock:
            return sorted(self._products, key=lambda p: p.name.lower())

    def find(self, product_id: int) -> Optional[Product]:
        with self._lock:
            return next((p for p in self._products if p.id == product_id), None)

    def search(self, category: Optional[str] = None, q: Optional[str] = None) -> list[Product]:
        items = self.all()
        if category:
            needle = category.strip().lower()
            items = [p for p in items if p.category.lower() == needle]
        if q:
            needle = q.strip().lower()
            items = [p for p in items if needle in p.name.lower() or needle in p.sku.lower()]
        return items

    def add(self, data: ProductCreate) -> Product:
        with self._lock:
            product = Product(
                id=self._next_id,
                sku=data.sku.strip().upper(),
                name=data.name.strip(),
                category=data.category.strip().lower(),
                price=data.price,
                stock=data.stock,
                created_at=utcnow(),
            )
            self._next_id += 1
            self._products.append(product)
            return product

    def update(self, product_id: int, data: ProductCreate) -> Optional[Product]:
        with self._lock:
            for i, existing in enumerate(self._products):
                if existing.id != product_id:
                    continue
                updated = Product(
                    id=existing.id,
                    sku=data.sku.strip().upper(),
                    name=data.name.strip(),
                    category=data.category.strip().lower(),
                    price=data.price,
                    stock=data.stock,
                    created_at=existing.created_at,
                )
                self._products[i] = updated
                return updated
            return None

    def delete(self, product_id: int) -> bool:
        with self._lock:
            for i, product in enumerate(self._products):
                if product.id != product_id:
                    continue
                del self._products[i]
                return True
            return False
