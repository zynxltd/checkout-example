from app.labs.automation import run_nightly_sales_job
from app.labs.data_ops import filter_category, load_sales_csv
from app.labs.ml_toy import ImpulseBuyScorer, ProductFeatures
from app.labs.reporting import category_revenue_report, top_sku_by_revenue
from app.labs.scientific import compound_growth, summarise_prices
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_load_and_filter_sales():
    rows = load_sales_csv()
    assert len(rows) >= 4
    plants = filter_category(rows, "plants")
    assert plants
    assert all(row.category == "plants" for row in plants)


def test_reporting_aggregates():
    report = category_revenue_report()
    assert report[0].revenue >= report[-1].revenue
    top = top_sku_by_revenue()
    assert "sku" in top and top["revenue"] > 0


def test_ml_scorer():
    promote = ImpulseBuyScorer().predict(ProductFeatures(price=15, stock=50, category="plants"))
    hold = ImpulseBuyScorer().predict(ProductFeatures(price=400, stock=1, category="machinery"))
    assert promote.label == "promote"
    assert hold.score < promote.score


def test_scientific_summary():
    summary = summarise_prices([10, 20, 30, 40, 50])
    assert summary.n == 5
    assert summary.mean == 30
    assert compound_growth(100, 0.1, 2) == [100.0, 110.0, 121.0]


def test_automation_writes_files(tmp_path):
    result = run_nightly_sales_job(output_dir=tmp_path)
    assert (tmp_path / "sales_clean.csv").exists()
    assert (tmp_path / "sales_summary.txt").exists()
    assert result.top_sku["sku"]


def test_labs_reporting_endpoint():
    r = client.get("/api/labs/reporting")
    assert r.status_code == 200
    body = r.json()
    assert body["top_sku"]["sku"]
    assert body["by_category"]


def test_labs_ml_endpoint():
    r = client.get("/api/labs/ml/score?price=20&stock=40&category=plants")
    assert r.status_code == 200
    assert r.json()["label"] in {"promote", "hold"}


def test_labs_scientific_endpoint():
    r = client.get("/api/labs/scientific/prices")
    assert r.status_code == 200
    assert r.json()["summary"]["n"] >= 1


def test_labs_automation_endpoint():
    r = client.post("/api/labs/automation/nightly-sales")
    assert r.status_code == 200
    assert r.json()["report_path"]
