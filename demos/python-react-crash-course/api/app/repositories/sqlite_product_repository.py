from __future__ import annotations

import sqlite3
import threading
from datetime import datetime
from pathlib import Path
from typing import Optional

from app.data.product_seed import PRODUCT_SEED
from app.models import Product, ProductCreate, utcnow


class SqliteProductRepository:
    """SQLite-backed catalogue — same contract as InMemoryProductRepository."""

    def __init__(self, db_path: Path) -> None:
        self._db_path = db_path
        self._lock = threading.Lock()
        db_path.parent.mkdir(parents=True, exist_ok=True)
        self._migrate_and_seed()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self._db_path, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn

    def _migrate_and_seed(self) -> None:
        with self._lock, self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    sku TEXT NOT NULL UNIQUE,
                    name TEXT NOT NULL,
                    category TEXT NOT NULL,
                    price REAL NOT NULL,
                    stock INTEGER NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )
            count = conn.execute("SELECT COUNT(*) AS c FROM products").fetchone()["c"]
            if count == 0:
                now = utcnow().isoformat()
                conn.executemany(
                    """
                    INSERT INTO products (sku, name, category, price, stock, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    [
                        (
                            row.sku.upper(),
                            row.name,
                            row.category.lower(),
                            row.price,
                            row.stock,
                            now,
                        )
                        for row in PRODUCT_SEED
                    ],
                )
            conn.commit()

    @staticmethod
    def _row_to_product(row: sqlite3.Row) -> Product:
        return Product(
            id=int(row["id"]),
            sku=row["sku"],
            name=row["name"],
            category=row["category"],
            price=float(row["price"]),
            stock=int(row["stock"]),
            created_at=datetime.fromisoformat(row["created_at"]),
        )

    def all(self) -> list[Product]:
        with self._lock, self._connect() as conn:
            rows = conn.execute("SELECT * FROM products ORDER BY lower(name)").fetchall()
            return [self._row_to_product(row) for row in rows]

    def find(self, product_id: int) -> Optional[Product]:
        with self._lock, self._connect() as conn:
            row = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
            return self._row_to_product(row) if row else None

    def search(self, category: Optional[str] = None, q: Optional[str] = None) -> list[Product]:
        clauses: list[str] = []
        params: list[object] = []
        if category:
            clauses.append("lower(category) = ?")
            params.append(category.strip().lower())
        if q:
            needle = f"%{q.strip().lower()}%"
            clauses.append("(lower(name) LIKE ? OR lower(sku) LIKE ?)")
            params.extend([needle, needle])

        sql = "SELECT * FROM products"
        if clauses:
            sql += " WHERE " + " AND ".join(clauses)
        sql += " ORDER BY lower(name)"

        with self._lock, self._connect() as conn:
            rows = conn.execute(sql, params).fetchall()
            return [self._row_to_product(row) for row in rows]

    def add(self, data: ProductCreate) -> Product:
        created_at = utcnow()
        with self._lock, self._connect() as conn:
            cur = conn.execute(
                """
                INSERT INTO products (sku, name, category, price, stock, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    data.sku.strip().upper(),
                    data.name.strip(),
                    data.category.strip().lower(),
                    data.price,
                    data.stock,
                    created_at.isoformat(),
                ),
            )
            conn.commit()
            product_id = int(cur.lastrowid)
        found = self.find(product_id)
        assert found is not None
        return found

    def update(self, product_id: int, data: ProductCreate) -> Optional[Product]:
        with self._lock, self._connect() as conn:
            cur = conn.execute(
                """
                UPDATE products
                SET sku = ?, name = ?, category = ?, price = ?, stock = ?
                WHERE id = ?
                """,
                (
                    data.sku.strip().upper(),
                    data.name.strip(),
                    data.category.strip().lower(),
                    data.price,
                    data.stock,
                    product_id,
                ),
            )
            conn.commit()
            if cur.rowcount == 0:
                return None
        return self.find(product_id)

    def delete(self, product_id: int) -> bool:
        with self._lock, self._connect() as conn:
            cur = conn.execute("DELETE FROM products WHERE id = ?", (product_id,))
            conn.commit()
            return cur.rowcount > 0
