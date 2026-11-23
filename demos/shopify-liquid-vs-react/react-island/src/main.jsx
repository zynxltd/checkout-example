import { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './island.css'

/**
 * React island — mounts on a Liquid-rendered page (dusk.com pattern).
 * Listens for [data-add-to-bag] clicks that Liquid (or static HTML) output.
 */
function BagDrawer() {
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState([])

  useEffect(() => {
    function onAdd(e) {
      const btn = e.target.closest('[data-add-to-bag]')
      if (!btn || btn.disabled) return
      const item = {
        id: btn.dataset.variantId,
        productId: btn.dataset.productId,
        title: btn.dataset.title,
        price: Number(btn.dataset.price),
        qty: 1,
      }
      setLines((prev) => {
        const existing = prev.find((l) => l.id === item.id)
        if (existing) {
          return prev.map((l) => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l))
        }
        return [...prev, item]
      })
      setOpen(true)
    }

    function onToggle(e) {
      if (e.target.closest('#bag-toggle')) setOpen(true)
    }

    document.addEventListener('click', onAdd)
    document.addEventListener('click', onToggle)
    return () => {
      document.removeEventListener('click', onAdd)
      document.removeEventListener('click', onToggle)
    }
  }, [])

  useEffect(() => {
    const el = document.getElementById('bag-count')
    if (el) el.textContent = String(lines.reduce((n, l) => n + l.qty, 0))
  }, [lines])

  const subtotal = useMemo(
    () => lines.reduce((n, l) => n + l.price * l.qty, 0),
    [lines],
  )

  if (!open) return null

  return (
    <div className="island-root" role="dialog" aria-modal="true" aria-label="Bag">
      <button type="button" className="island-backdrop" aria-label="Close" onClick={() => setOpen(false)} />
      <aside className="island-drawer">
        <header>
          <h2>Your bag</h2>
          <button type="button" className="ghost" onClick={() => setOpen(false)}>
            Close
          </button>
        </header>
        <p className="island-note">React island · Liquid page emitted the Add buttons</p>
        {lines.length === 0 ? (
          <p className="empty">Your bag is empty.</p>
        ) : (
          <ul>
            {lines.map((l) => (
              <li key={l.id}>
                <div>
                  <strong>{l.title}</strong>
                  <div className="muted">
                    Qty {l.qty} · £{(l.price * l.qty).toFixed(2)}
                  </div>
                </div>
                <button
                  type="button"
                  className="ghost"
                  onClick={() => setLines((prev) => prev.filter((x) => x.id !== l.id))}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <footer>
          <div className="row">
            <span>Subtotal</span>
            <strong>£{subtotal.toFixed(2)}</strong>
          </div>
          <button type="button" className="checkout" disabled={!lines.length}>
            Checkout
          </button>
        </footer>
      </aside>
    </div>
  )
}

const mount = document.getElementById('react-bag-root')
if (mount) {
  createRoot(mount).render(<BagDrawer />)
}
