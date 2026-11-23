import { cartSubtotal } from '../lib/money.js'

/**
 * EXERCISE 7 — cart drawer (Shopify-style problem to own).
 * Props: open, lines [{id,name,price,qty}], onClose, onQty, onRemove
 */
export function CartDrawer({ open, lines, onClose, onQty, onRemove }) {
  if (!open) return null

  const subtotal = cartSubtotal(lines)

  return (
    <div className="drawer-root" role="dialog" aria-modal="true" aria-label="Cart">
      <button type="button" className="backdrop" aria-label="Close cart" onClick={onClose} />
      <aside className="drawer">
        <header className="drawer-head">
          <h2>Cart</h2>
          <button type="button" className="ghost" onClick={onClose}>
            Close
          </button>
        </header>

        {/* TODO EXERCISE 7a: empty state when lines.length === 0 */}

        <ul className="drawer-lines">
          {lines.map((line) => (
            <li key={line.id}>
              <div>
                <strong>{line.name}</strong>
                <div className="muted">£{line.price.toFixed(2)}</div>
              </div>
              <div className="qty">
                {/* TODO EXERCISE 7b: − / + buttons calling onQty(id, qty±1) */}
                <span>{line.qty}</span>
                <button type="button" className="ghost" onClick={() => onRemove(line.id)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <footer className="drawer-foot">
          <div className="row">
            <span>Subtotal</span>
            <strong>£{subtotal.toFixed(2)}</strong>
          </div>
          {/* TODO EXERCISE 7c: disable checkout when empty */}
          <button type="button" className="primary block">
            Checkout
          </button>
        </footer>
      </aside>
    </div>
  )
}
