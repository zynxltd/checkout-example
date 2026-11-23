from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, Header, HTTPException, status

logger = logging.getLogger(__name__)


def create_shopify_router(demo_secret: str) -> APIRouter:
    r = APIRouter(prefix="/api/shopify/webhooks", tags=["shopify"])

    @r.post("/orders-create", status_code=status.HTTP_200_OK)
    def orders_create(
        body: dict,
        x_shopify_topic: Optional[str] = Header(default=None, alias="X-Shopify-Topic"),
        x_demo_secret: Optional[str] = Header(default=None, alias="X-Demo-Secret"),
    ):
        if x_demo_secret != demo_secret:
            raise HTTPException(status_code=401, detail="Invalid webhook secret")
        if x_shopify_topic and x_shopify_topic != "orders/create":
            raise HTTPException(status_code=400, detail="Unexpected Shopify topic")

        order_id = body.get("id") or body.get("order_id") or "unknown"
        logger.info(
            "shopify_webhook topic=%s order_id=%s",
            x_shopify_topic or "orders/create",
            order_id,
        )
        return {"ok": True, "order_id": order_id}

    return r
