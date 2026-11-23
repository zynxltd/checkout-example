from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.contracts.leads import ILeadPipeline
from app.models import Lead, LeadCreate


def create_leads_router(pipeline: ILeadPipeline) -> APIRouter:
    r = APIRouter(prefix="/api/leads", tags=["leads"])

    @r.get("/stats")
    def lead_stats():
        return pipeline.stats()

    @r.get("", response_model=list[Lead])
    def list_leads():
        return pipeline.all()

    @r.get("/{lead_id}", response_model=Lead)
    def get_lead(lead_id: str):
        lead = pipeline.find(lead_id)
        if lead is None:
            raise HTTPException(status_code=404, detail="Not found")
        return lead

    @r.post("", response_model=Lead, status_code=status.HTTP_202_ACCEPTED)
    def create_lead(body: LeadCreate):
        return pipeline.submit(body)

    @r.post("/{lead_id}/requeue", response_model=Lead)
    def requeue_lead(lead_id: str):
        try:
            lead = pipeline.requeue(lead_id)
        except ValueError as exc:
            raise HTTPException(status_code=409, detail=str(exc)) from exc
        if lead is None:
            raise HTTPException(status_code=404, detail="Not found")
        return lead

    return r
