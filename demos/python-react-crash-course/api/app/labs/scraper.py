from __future__ import annotations

"""
SCRAPERS / HTTP fetch — pull external data into your system.

Real-world cousins: BeautifulSoup/Playwright for HTML; httpx/requests for APIs.
Here we hit a public JSON API (no brittle HTML parsing in the demo).
"""

from dataclasses import dataclass
from typing import Any

import httpx


@dataclass(frozen=True)
class ExternalQuote:
    quote: str
    author: str
    source: str


def fetch_random_quote(timeout_s: float = 3.0) -> ExternalQuote:
    url = "https://dummyjson.com/quotes/random"
    try:
        response = httpx.get(url, timeout=timeout_s, headers={"Accept": "application/json"})
        response.raise_for_status()
        body: dict[str, Any] = response.json()
        return ExternalQuote(
            quote=str(body.get("quote", "")),
            author=str(body.get("author", "unknown")),
            source=url,
        )
    except Exception as exc:  # network / timeout — scrapers must degrade gracefully
        return ExternalQuote(
            quote="Could not fetch live quote (offline fallback).",
            author="local-fallback",
            source=f"error:{exc.__class__.__name__}",
        )


def fetch_product_stub(product_id: int = 1, timeout_s: float = 3.0) -> dict[str, Any]:
    """Example of syncing a remote catalogue row (DummyJSON products)."""
    url = f"https://dummyjson.com/products/{product_id}"
    try:
        response = httpx.get(url, timeout=timeout_s)
        response.raise_for_status()
        body = response.json()
        return {
            "ok": True,
            "id": body.get("id"),
            "title": body.get("title"),
            "price": body.get("price"),
            "source": url,
        }
    except Exception as exc:
        return {"ok": False, "error": str(exc), "source": url}
