import { ProductCard } from './ProductCard.jsx'

/**
 * EXERCISE 2–3 — list rendering + keys.
 * Map products → ProductCard. Use product.id as key (not index).
 */
export function ProductGrid({ products, onAdd }) {
  if (!products?.length) {
    return <p className="muted">No products match.</p>
  }

  // TODO EXERCISE 2: map products to <ProductCard key={...} />
  return (
    <div className="grid">
      <p className="muted">TODO Ex 2: map {products.length} products</p>
    </div>
  )
}
