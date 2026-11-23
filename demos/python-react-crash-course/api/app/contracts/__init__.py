from __future__ import annotations

from app.contracts.discount import IDiscountService
from app.contracts.leads import ILeadPipeline, ILeadRouter, RoutingDecision
from app.contracts.policies import IProductPolicy
from app.contracts.products import IProductRepository

__all__ = [
    "IDiscountService",
    "ILeadPipeline",
    "ILeadRouter",
    "IProductPolicy",
    "IProductRepository",
    "RoutingDecision",
]
