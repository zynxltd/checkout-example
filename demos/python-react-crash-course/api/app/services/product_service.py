from __future__ import annotations

from typing import Optional

from app.contracts.policies import IProductPolicy
from app.contracts.products import IProductRepository
from app.domain.exceptions import NotFoundError, ValidationConflictError
from app.models import Product, ProductCreate


class ProductService:
    """
    Application service for products.
    Depends on contracts, not concrete storage (DIP).
    """

    def __init__(self, repository: IProductRepository, policy: IProductPolicy) -> None:
        self._repository = repository
        self._policy = policy

    def list(self, category: Optional[str] = None, q: Optional[str] = None) -> list[Product]:
        return self._repository.search(category=category, q=q)

    def get(self, product_id: int) -> Product:
        product = self._repository.find(product_id)
        if product is None:
            raise NotFoundError(f"Product {product_id} not found")
        return product

    def create(self, data: ProductCreate) -> Product:
        return self._repository.add(data)

    def update(self, product_id: int, data: ProductCreate) -> Product:
        updated = self._repository.update(product_id, data)
        if updated is None:
            raise NotFoundError(f"Product {product_id} not found")
        return updated

    def delete(self, product_id: int) -> None:
        product = self._repository.find(product_id)
        if product is None:
            raise NotFoundError(f"Product {product_id} not found")
        if not self._policy.can_delete(product):
            raise ValidationConflictError(self._policy.cannot_delete_reason)
        if not self._repository.delete(product_id):
            raise NotFoundError(f"Product {product_id} not found")
