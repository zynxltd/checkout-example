from __future__ import annotations


class DomainError(Exception):
    """Base domain/business error."""


class NotFoundError(DomainError):
    pass


class ConflictError(DomainError):
    pass


class ValidationConflictError(ConflictError):
    """Rule rejected the operation (e.g. cannot delete in-stock product)."""
