from __future__ import annotations

"""
ML (toy) — score / classify without a heavy framework.

Real-world cousins: scikit-learn, PyTorch, spaCy.
This is a transparent 'features → score' model so you can see the idea.
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class ProductFeatures:
    price: float
    stock: int
    category: str


@dataclass(frozen=True)
class ScoreResult:
    label: str
    score: float
    reasons: list[str]


# Hand-tuned weights — stand-in for a trained model
WEIGHTS = {
    "price": -0.01,  # expensive → slightly lower “impulse buy” score
    "stock": 0.02,  # more stock → easier to promote
    "plants_bonus": 0.35,
    "machinery_penalty": -0.25,
}


class ImpulseBuyScorer:
    """Tiny model object (OOP): fit is skipped; predict uses fixed weights."""

    def predict(self, features: ProductFeatures) -> ScoreResult:
        score = 0.5
        reasons: list[str] = []

        score += features.price * WEIGHTS["price"]
        reasons.append(f"price_effect={features.price * WEIGHTS['price']:.3f}")

        score += features.stock * WEIGHTS["stock"]
        reasons.append(f"stock_effect={features.stock * WEIGHTS['stock']:.3f}")

        category = features.category.lower()
        if category == "plants":
            score += WEIGHTS["plants_bonus"]
            reasons.append("plants_bonus")
        elif category == "machinery":
            score += WEIGHTS["machinery_penalty"]
            reasons.append("machinery_penalty")

        score = max(0.0, min(1.0, round(score, 3)))
        label = "promote" if score >= 0.55 else "hold"
        return ScoreResult(label=label, score=score, reasons=reasons)


def score_catalog_row(price: float, stock: int, category: str) -> dict:
    result = ImpulseBuyScorer().predict(ProductFeatures(price=price, stock=stock, category=category))
    return {"label": result.label, "score": result.score, "reasons": result.reasons}
