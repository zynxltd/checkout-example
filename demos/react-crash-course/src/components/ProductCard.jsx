/**
 * EXERCISE 1 — presentational component.
 * Vue: props via defineProps. React: function args.
 *
 * Finish ProductCard so it shows name, price, stock badge, and an Add button
 * that calls onAdd(product).
 */
export function ProductCard({ product, onAdd }) {
  // TODO EXERCISE 1 — replace this placeholder
  return (
    <article className="product-card">
      <p className="muted">TODO Ex 1: render {product?.sku}</p>
      <button type="button" onClick={() => onAdd?.(product)} disabled>
        Add
      </button>
    </article>
  )
}
