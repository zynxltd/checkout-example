from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

from app.config import AppConfig, load_config
from app.contracts.discount import IDiscountService
from app.contracts.leads import ILeadPipeline, ILeadRouter
from app.contracts.policies import IProductPolicy
from app.contracts.products import IProductRepository
from app.repositories.memory_product_repository import InMemoryProductRepository
from app.repositories.sqlite_product_repository import SqliteProductRepository
from app.services.discount import DiscountService
from app.services.lead_pipeline import LeadPipeline
from app.services.lead_router import DefaultLeadRouter
from app.services.product_policy import StockProductPolicy
from app.services.product_service import ProductService


@dataclass
class AppContainer:
    config: AppConfig
    products: ProductService
    leads: ILeadPipeline
    discounts: IDiscountService
    product_repository: IProductRepository


def _build_product_repository(config: AppConfig) -> IProductRepository:
    if config.db_driver == "sqlite":
        return SqliteProductRepository(config.sqlite_path)
    return InMemoryProductRepository()


def build_container(config: Optional[AppConfig] = None) -> AppContainer:
    cfg = config or load_config()
    repository = _build_product_repository(cfg)
    policy: IProductPolicy = StockProductPolicy()
    router: ILeadRouter = DefaultLeadRouter()
    pipeline: ILeadPipeline = LeadPipeline(router=router)
    discounts: IDiscountService = DiscountService()

    return AppContainer(
        config=cfg,
        products=ProductService(repository=repository, policy=policy),
        leads=pipeline,
        discounts=discounts,
        product_repository=repository,
    )


container = build_container()
