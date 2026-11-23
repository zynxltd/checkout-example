from __future__ import annotations

import logging
import queue
import threading
import time
import uuid
from collections import Counter
from typing import Optional

from app.contracts.leads import ILeadRouter
from app.models import Lead, LeadCreate, LeadStatus, utcnow
from app.services.lead_router import HARBOUR_LENDER, DefaultLeadRouter

logger = logging.getLogger(__name__)


class LeadPipeline:
    """
    Mini loan-lead queue — Laravel ShouldQueue / queue:work cousin.
    Depends on ILeadRouter for decisions (DIP / OCP).
    """

    def __init__(self, router: Optional[ILeadRouter] = None) -> None:
        self._router: ILeadRouter = router or DefaultLeadRouter()
        self._lock = threading.Lock()
        self._leads: list[Lead] = []
        self._q: queue.Queue[str] = queue.Queue()
        self._worker = threading.Thread(target=self._run_worker, daemon=True)
        self._worker.start()

    def submit(self, data: LeadCreate) -> Lead:
        lead = Lead(
            id=str(uuid.uuid4()),
            applicant_name=data.applicant_name.strip(),
            email=str(data.email).lower(),
            loan_amount=data.loan_amount,
            product_type=data.product_type.strip().lower(),
            status=LeadStatus.queued,
            created_at=utcnow(),
        )
        with self._lock:
            self._leads.insert(0, lead)
        self._log_status(lead.id, LeadStatus.queued, lender=None)
        self._q.put(lead.id)
        return lead

    def all(self) -> list[Lead]:
        with self._lock:
            return list(self._leads)

    def find(self, lead_id: str) -> Optional[Lead]:
        with self._lock:
            return next((lead for lead in self._leads if lead.id == lead_id), None)

    def requeue(self, lead_id: str) -> Optional[Lead]:
        lead = self.find(lead_id)
        if lead is None:
            return None
        if lead.status != LeadStatus.rejected:
            raise ValueError("Only rejected leads can be requeued")

        self._set(
            lead_id,
            status=LeadStatus.queued,
            reject_reason=None,
            routed_to_lender=None,
            processed_at=None,
        )
        self._q.put(lead_id)
        return self.find(lead_id)

    def stats(self) -> dict:
        with self._lock:
            counts = Counter(lead.status.value for lead in self._leads)
            lenders = Counter(
                lead.routed_to_lender for lead in self._leads if lead.routed_to_lender
            )
            return {
                "total": len(self._leads),
                "by_status": dict(counts),
                "by_lender": dict(lenders),
            }

    def _run_worker(self) -> None:
        while True:
            lead_id = self._q.get()
            try:
                self._process(lead_id)
            except Exception:
                logger.exception("Failed processing lead %s", lead_id)
            finally:
                self._q.task_done()

    def _process(self, lead_id: str) -> None:
        lead = self.find(lead_id)
        if lead is None:
            return

        # Locals at this breakpoint: lead_id, lead.loan_amount, lead.product_type, lead.status
        self._set(lead_id, status=LeadStatus.processing)
        time.sleep(0.35)

        lead = self.find(lead_id)
        if lead is None:
            return

        decision = self._router.decide(lead, self._harbour_routed_count())
        if decision.status == LeadStatus.rejected:
            self._set(
                lead_id,
                status=LeadStatus.rejected,
                reject_reason=decision.reject_reason,
                routed_to_lender=None,
            )
            return

        self._set(
            lead_id,
            status=LeadStatus.routed,
            routed_to_lender=decision.lender,
            processed_at=utcnow(),
        )

    def _harbour_routed_count(self) -> int:
        with self._lock:
            return sum(
                1
                for lead in self._leads
                if lead.status == LeadStatus.routed and lead.routed_to_lender == HARBOUR_LENDER
            )

    def _log_status(self, lead_id: str, status: LeadStatus, lender: Optional[str]) -> None:
        logger.info(
            "lead_id=%s status=%s lender=%s",
            lead_id,
            status.value,
            lender or "-",
        )

    def _set(self, lead_id: str, **fields) -> None:
        with self._lock:
            for i, lead in enumerate(self._leads):
                if lead.id != lead_id:
                    continue
                updated = lead.model_copy(update=fields)
                self._leads[i] = updated
                self._log_status(
                    lead_id,
                    updated.status,
                    updated.routed_to_lender,
                )
                return
