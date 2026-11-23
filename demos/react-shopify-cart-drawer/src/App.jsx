import { useMemo, useState } from 'react'

const FREE_SHIPPING_AT = 40
const PRODUCTS = [
  { id: 'boots', title: 'Trail Boots', price: 32 },
  { id: 'socks', title: 'Merino Socks', price: 12 },
  { id: 'care', title: 'Care Kit (bundle)', price: 12, isBundle: true },
  { id: 'cap', title: 'Camp Cap', price: 18 },
]

export default function App() {
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState([])

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.qty, 0),
    [lines],
  )
  const remaining = Math.max(0, FREE_SHIPPING_AT - subtotal)
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100)
  const hasBundle = lines.some((l) => l.isBundle)
  const showBundleOffer = subtotal > 0 && subtotal < FREE_SHIPPING_AT && !hasBundle

  function addProduct(product) {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === product.id)
      if (existing) {
        return prev.map((l) =>
          l.id === product.id ? { ...l, qty: l.qty + 1 } : l,
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
    setOpen(true)
  }

  function setQty(id, qty) {
    setLines((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty } : l))
        .filter((l) => l.qty > 0),
    )
  }

  return (
    <div className="layout">
      <p className="pill">React · Shopify-style cart · P0</p>
      <div className="topbar">
        <div>
          <h1 style={{ margin: '0.35rem 0' }}>Smart cart drawer</h1>
          <p className="muted">Free-shipping meter + bundle upsell (Theme App Extension stand-in).</p>
        </div>
        <button type="button" className="ghost" onClick={() => setOpen(true)}>
          Cart ({lines.reduce((n, l) => n + l.qty, 0)})
        </button>
      </div>

      <div className="grid">
        {PRODUCTS.filter((p) => !p.isBundle).map((p) => (
          <article className="card" key={p.id}>
            <h3>{p.title}</h3>
            <div className="price">£{p.price.toFixed(2)}</div>
            <button type="button" onClick={() => addProduct(p)}>
              Add to cart
            </button>
          </article>
        ))}
      </div>

      {open && (
        <>
          <div className="backdrop" onClick={() => setOpen(false)} />
          <aside className="drawer" aria-label="Cart drawer">
            <div className="topbar">
              <strong>Your cart</strong>
              <button type="button" className="ghost" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>

            <div>
              {remaining > 0 ? (
                <p className="muted">£{remaining.toFixed(2)} away from free shipping</p>
              ) : (
                <p className="muted">You’ve unlocked free shipping</p>
              )}
              <div className="meter" aria-hidden>
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div>
              {lines.length === 0 && <p className="muted">Cart is empty.</p>}
              {lines.map((l) => (
                <div className="line" key={l.id}>
                  <div>
                    <div>{l.title}</div>
                    <div className="muted">£{l.price.toFixed(2)}</div>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="ghost"
                      onClick={() => setQty(l.id, l.qty - 1)}
                    >
                      −
                    </button>{' '}
                    {l.qty}{' '}
                    <button
                      type="button"
                      className="ghost"
                      onClick={() => setQty(l.id, l.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showBundleOffer && (
              <div className="offer">
                <div>Add Care Kit for £12 — unlock free shipping faster</div>
                <button
                  type="button"
                  style={{ marginTop: '0.6rem' }}
                  onClick={() => addProduct(PRODUCTS.find((p) => p.isBundle))}
                >
                  Add bundle
                </button>
              </div>
            )}

            <div className="footer">
              <div className="topbar">
                <span className="muted">Subtotal</span>
                <strong>£{subtotal.toFixed(2)}</strong>
              </div>
              <button type="button">Checkout</button>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}
