from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.container import container
from app.routers.labs import create_labs_router
from app.routers.leads import create_leads_router
from app.routers.products import create_products_router
from app.routers.shopify import create_shopify_router
from app.services.debug_lab import lookup_margin
from app.services.python_lab import SAMPLE as LAB_SAMPLE
from app.services.python_lab import run_self_check

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger("greenshelf")


@asynccontextmanager
async def lifespan(_: FastAPI):
    logger.info(
        "GreenShelf API started driver=%s sqlite=%s",
        container.config.db_driver,
        container.config.sqlite_path,
    )
    yield


app = FastAPI(
    title="GreenShelf API",
    version="0.2.0",
    description="Python + React crash course API (SOLID / OOP layout)",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(container.config.cors_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(create_products_router(container.products))
app.include_router(create_leads_router(container.leads))
app.include_router(create_shopify_router(container.config.shopify_demo_secret))
app.include_router(create_labs_router())


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "greenshelf-api",
        "db_driver": container.config.db_driver,
    }


@app.get("/api/debug/margin")
def debug_margin(sku: str = "MOWER1"):
    catalog = [p.model_dump() for p in container.product_repository.all()]
    return lookup_margin(sku, catalog)


@app.get("/api/lab/self-check")
def lab_self_check():
    return {"ok": run_self_check(), "sample_size": len(LAB_SAMPLE)}


@app.get("/api/discount")
def discount(price: float, code: str = ""):
    try:
        return {
            "price": price,
            "code": code,
            "discounted": container.discounts.apply(price, code),
        }
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
