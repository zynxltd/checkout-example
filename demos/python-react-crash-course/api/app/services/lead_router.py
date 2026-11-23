from __future__ import annotations

from app.contracts.leads import RoutingDecision
from app.models import Lead, LeadStatus

HARBOUR_LENDER = "Harbour Quick Cash"
HARBOUR_CAP = 3


class DefaultLeadRouter:
    """
    Encapsulates lender routing rules.
    Open/Closed: replace this class to change policy without touching LeadPipeline.
    """

    def decide(self, lead: Lead, harbour_routed_count: int) -> RoutingDecision:
        if lead.loan_amount < 1000:
            return RoutingDecision(
                status=LeadStatus.rejected,
                reject_reason="Below minimum loan amount",
            )

        if lead.product_type == "guarantor" and lead.loan_amount < 2000:
            return RoutingDecision(
                status=LeadStatus.rejected,
                reject_reason="Guarantor loans require at least £2000",
            )

        if lead.product_type == "secured":
            lender = "OakSecured Finance"
        elif lead.product_type == "guarantor":
            lender = "Bridge Guarantor Co"
        elif lead.product_type == "personal" and lead.loan_amount >= 25_000:
            lender = "Prime Line"
        elif lead.loan_amount >= 15_000:
            lender = "Summit Personal Loans"
        else:
            lender = HARBOUR_LENDER if harbour_routed_count < HARBOUR_CAP else "Overflow Desk"

        return RoutingDecision(status=LeadStatus.routed, lender=lender)
