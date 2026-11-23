from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    sku: str = Field(min_length=1, max_length=32)
    name: str = Field(min_length=1, max_length=120)
    category: str = Field(min_length=1, max_length=40)
    price: float = Field(gt=0, le=100_000)
    stock: int = Field(ge=0, le=100_000)


class Product(ProductCreate):
    id: int
    created_at: datetime


class LeadStatus(str, Enum):
    received = "received"
    queued = "queued"
    processing = "processing"
    routed = "routed"
    rejected = "rejected"


class LeadCreate(BaseModel):
    applicant_name: str = Field(min_length=1, max_length=120)
    email: str = Field(min_length=3, max_length=200)
    loan_amount: float = Field(ge=500, le=100_000)
    product_type: str = Field(default="personal", max_length=40)


class Lead(BaseModel):
    id: str
    applicant_name: str
    email: str
    loan_amount: float
    product_type: str
    status: LeadStatus
    routed_to_lender: Optional[str] = None
    reject_reason: Optional[str] = None
    created_at: datetime
    processed_at: Optional[datetime] = None


def utcnow() -> datetime:
    return datetime.now(timezone.utc)
