from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, HTTPException, Response, status

from app.domain.exceptions import NotFoundError, ValidationConflictError
from app.models import Product, ProductCreate
from app.services.product_service import ProductService


def create_products_router(products: ProductService) -> APIRouter:
    r = APIRouter(prefix="/api/products", tags=["products"])

    @r.get("", response_model=list[Product])
    def list_products(category: Optional[str] = None, q: Optional[str] = None):
        return products.list(category=category, q=q)

    @r.get("/{product_id}", response_model=Product)
    def get_product(product_id: int):
        try:
            return products.get(product_id)
        except NotFoundError as exc:
            raise HTTPException(status_code=404, detail=str(exc)) from exc

    @r.post("", response_model=Product, status_code=201)
    def create_product(body: ProductCreate):
        return products.create(body)

    @r.put("/{product_id}", response_model=Product)
    def update_product(product_id: int, body: ProductCreate):
        try:
            return products.update(product_id, body)
        except NotFoundError as exc:
            raise HTTPException(status_code=404, detail=str(exc)) from exc

    @r.delete("/{product_id}", status_code=204)
    def delete_product(product_id: int):
        try:
            products.delete(product_id)
        except NotFoundError as exc:
            raise HTTPException(status_code=404, detail=str(exc)) from exc
        except ValidationConflictError as exc:
            raise HTTPException(status_code=409, detail=str(exc)) from exc
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    return r
