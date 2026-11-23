import { useEffect, useMemo, useState } from 'react'
import { CartDrawer } from './components/CartDrawer.jsx'
import { DebugLab } from './components/DebugLab.jsx'
import { ProductGrid } from './components/ProductGrid.jsx'
import { SearchBar } from './components/SearchBar.jsx'
import { fetchCatalog } from './data/catalog.js'
import { AiMessyLeadForm } from './fixtures/AiMessyLeadForm.jsx'
import { useDebouncedValue, useLocalStorage } from './hooks/useLocalStorage.js'

const TABS = [
  { id: 'shop', label: 'Shop' },
  { id: 'debug', label: 'Debug' },
  { id: 'ai', label: 'AI review' },
]

export default function App() {
  const [tab, setTab] = useState('shop')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 250)

  // EXERCISE 6a: once useLocalStorage works, cart survives refresh
  const [cartOpen, setCartOpen] = useState(false)
  const [lines, setLines] = useLocalStorage('react-crash-cart', [])

  // EXERCISE 5 — fetch on mount (Vue onMounted)
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchCatalog()
      .then((data) => {
        if (!cancelled) setProducts(data)
      })
      .catch((e) => {
        if (!cancelled) setError(String(e))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (!q) return products
    // EXERCISE 4 — also filter by category exact match if query starts with "cat:"
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
    )
  }, [products, debouncedQuery])

  function addToCart(product) {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === product.id)
      if (existing) {
        return prev.map((l) => (l.id === product.id ? { ...l, qty: l.qty + 1 } : l))
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }]
    })
    setCartOpen(true)
  }

  function setQty(id, qty) {
    if (qty < 1) {
      setLines((prev) => prev.filter((l) => l.id !== id))
      return
    }
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, qty } : l)))
  }

  function removeLine(id) {
    setLines((prev) => prev.filter((l) => l.id !== id))
  }

  const cartCount = lines.reduce((n, l) => n + l.qty, 0)

  return (
    <div className="page">
      <header className="top">
        <div>
          <p className="pill">React refresher · Vue / Laravel → React</p>
          <h1>GreenShelf UI lab</h1>
          <p className="lead">Components, state, effects, hooks, cart drawer, DevTools, AI review.</p>
        </div>
        <button type="button" className="primary" onClick={() => setCartOpen(true)}>
          Cart ({cartCount})
        </button>
      </header>

      <nav className="tabs" aria-label="Sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? 'tab active' : 'tab'}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'shop' && (
        <section className="card">
          <div className="row">
            <h2>Catalogue</h2>
            <SearchBar value={query} onChange={setQuery} placeholder="Search name or SKU (Ex 3–4)" />
          </div>
          {error ? <p className="err">{error}</p> : null}
          {loading ? <p className="muted">Loading…</p> : <ProductGrid products={filtered} onAdd={addToCart} />}
          <p className="hint">
            Complete Ex 1–2 so cards appear. Ex 6 makes cart persist. Ex 7 finishes the drawer.
          </p>
        </section>
      )}

      {tab === 'debug' && <DebugLab />}

      {tab === 'ai' && (
        <section className="card">
          <p className="muted">
            Ex 10 — study the broken form, then build <code>CleanLeadForm.jsx</code> instead.
          </p>
          <AiMessyLeadForm onSubmit={(payload) => alert(JSON.stringify(payload))} />
        </section>
      )}

      <CartDrawer
        open={cartOpen}
        lines={lines}
        onClose={() => setCartOpen(false)}
        onQty={setQty}
        onRemove={removeLine}
      />
    </div>
  )
}
