from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Protocol

from app.models import Lead, LeadCreate, LeadStatus


@dataclass(frozen=True)
class RoutingDecision:
    status: LeadStatus
    lender: Optional[str] = None
    reject_reason: Optional[str] = None


class ILeadRouter(Protocol):
    """Decides lender / reject — swap strategies without changing the queue (OCP)."""

    def decide(self, lead: Lead, harbour_routed_count: int) -> RoutingDecision:
        ...


class ILeadPipeline(Protocol):
    def submit(self, data: LeadCreate) -> Lead:
        ...

    def all(self) -> list[Lead]:
        ...

    def find(self, lead_id: str) -> Optional[Lead]:
        ...

    def requeue(self, lead_id: str) -> Optional[Lead]:
        ...

    def stats(self) -> dict:
        ...
