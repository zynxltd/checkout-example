import time

from fastapi.testclient import TestClient

from app.main import app
from app.services.discount import apply_discount
from app.services.python_lab import run_self_check

client = TestClient(app)


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_list_products():
    r = client.get("/api/products")
    assert r.status_code == 200
    assert len(r.json()) >= 4


def test_get_product():
    assert client.get("/api/products/1").status_code == 200
    assert client.get("/api/products/999").status_code == 404


def test_create_product():
    r = client.post(
        "/api/products",
        json={"sku": "TEST1", "name": "Test Plant", "category": "plants", "price": 5.5, "stock": 3},
    )
    assert r.status_code == 201
    assert r.json()["sku"] == "TEST1"


def test_search_category_plants():
    r = client.get("/api/products?category=plants")
    assert r.status_code == 200
    rows = r.json()
    assert rows
    assert all(row["category"] == "plants" for row in rows)


def test_search_q_rose():
    r = client.get("/api/products?q=rose")
    assert r.status_code == 200
    rows = r.json()
    assert any("rose" in row["name"].lower() or "rose" in row["sku"].lower() for row in rows)


def test_update_product():
    r = client.put(
        "/api/products/2",
        json={
            "sku": "FEED01",
            "name": "Bird Feeder Kit XL",
            "category": "wildlife",
            "price": 11.5,
            "stock": 100,
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert body["name"] == "Bird Feeder Kit XL"
    assert body["stock"] == 100


def test_delete_with_stock_conflicts():
    r = client.delete("/api/products/1")
    assert r.status_code == 409


def test_delete_zero_stock():
    created = client.post(
        "/api/products",
        json={"sku": "GONE1", "name": "Sold Out Item", "category": "plants", "price": 3.0, "stock": 0},
    )
    assert created.status_code == 201
    product_id = created.json()["id"]
    deleted = client.delete(f"/api/products/{product_id}")
    assert deleted.status_code == 204


def test_margin_mower():
    r = client.get("/api/debug/margin?sku=MOWER1")
    assert r.status_code == 200
    assert r.json()["margin"] == 75.62


def test_python_lab_self_check():
    assert run_self_check() is True
    r = client.get("/api/lab/self-check")
    assert r.status_code == 200
    assert r.json()["ok"] is True


def test_lead_routes_async():
    r = client.post(
        "/api/leads",
        json={
            "applicant_name": "Sam Lee",
            "email": "sam@example.com",
            "loan_amount": 7500,
            "product_type": "personal",
        },
    )
    assert r.status_code == 202
    lead_id = r.json()["id"]

    status = "queued"
    for _ in range(20):
        time.sleep(0.1)
        lead = client.get(f"/api/leads/{lead_id}").json()
        status = lead["status"]
        if status in {"routed", "rejected"}:
            break

    assert status in {"routed", "rejected"}


def test_lead_stats_and_requeue():
    rejected = client.post(
        "/api/leads",
        json={
            "applicant_name": "Low Amount",
            "email": "low@example.com",
            "loan_amount": 800,
            "product_type": "personal",
        },
    )
    assert rejected.status_code == 202
    lead_id = rejected.json()["id"]

    for _ in range(20):
        time.sleep(0.1)
        lead = client.get(f"/api/leads/{lead_id}").json()
        if lead["status"] == "rejected":
            break
    assert lead["status"] == "rejected"

    again = client.post(f"/api/leads/{lead_id}/requeue")
    assert again.status_code == 200
    assert again.json()["status"] == "queued"

    stats = client.get("/api/leads/stats")
    assert stats.status_code == 200
    assert stats.json()["total"] >= 1


def test_shopify_webhook():
    bad = client.post("/api/shopify/webhooks/orders-create", json={"id": 99})
    assert bad.status_code == 401

    ok = client.post(
        "/api/shopify/webhooks/orders-create",
        headers={"X-Demo-Secret": "greenshelf-demo-secret", "X-Shopify-Topic": "orders/create"},
        json={"id": 12345},
    )
    assert ok.status_code == 200
    assert ok.json()["order_id"] == 12345


def test_apply_discount_safe():
    assert apply_discount(100, "SAVE10") == 90.0
    assert apply_discount(40, "SAVE50") == 0.0
    assert apply_discount(100, "ADMIN") == 100.0
    assert apply_discount(100, "UNKNOWN") == 100.0
