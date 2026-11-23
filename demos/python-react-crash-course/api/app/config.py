from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class AppConfig:
    db_driver: str  # memory | sqlite
    sqlite_path: Path
    shopify_demo_secret: str
    cors_origins: tuple[str, ...]


def load_config() -> AppConfig:
    root = Path(__file__).resolve().parents[1]
    default_db = root / "data" / "greenshelf.db"
    db_driver = os.getenv("DB_DRIVER", "sqlite").strip().lower()
    if db_driver not in {"memory", "sqlite"}:
        db_driver = "sqlite"

    return AppConfig(
        db_driver=db_driver,
        sqlite_path=Path(os.getenv("SQLITE_PATH", str(default_db))),
        shopify_demo_secret=os.getenv("SHOPIFY_DEMO_SECRET", "greenshelf-demo-secret"),
        cors_origins=(
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ),
    )
