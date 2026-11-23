import { useEffect, useRef, useState } from 'react'

const API = import.meta.env.VITE_API_URL || ''

export default function App() {
  const [products, setProducts] = useState([])
  const [leads, setLeads] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [q, setQ] = useState('')
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingLeads, setLoadingLeads] = useState(true)
  const [creating, setCreating] = useState(false)
  const [submittingLead, setSubmittingLead] = useState(false)
  const pollRef = useRef(null)
  const [form, setForm] = useState({
    sku: '',
    name: '',
    category: 'plants',
    price: '9.99',
    stock: '10',
  })

  async function loadProducts(query = q) {
    setLoadingProducts(true)
    try {
      const params = query ? `?q=${encodeURIComponent(query)}` : ''
      const res = await fetch(`${API}/api/products${params}`)
      if (!res.ok) throw new Error(`Products ${res.status}`)
      setProducts(await res.json())
    } finally {
      setLoadingProducts(false)
    }
  }

  async function loadLeads() {
    setLoadingLeads(true)
    try {
      const res = await fetch(`${API}/api/leads`)
      if (!res.ok) throw new Error(`Leads ${res.status}`)
      setLeads(await res.json())
    } finally {
      setLoadingLeads(false)
    }
  }

  useEffect(() => {
    Promise.all([loadProducts(), loadLeads()]).catch((e) => setError(String(e)))
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  async function onCreate(e) {
    e.preventDefault()
    if (creating) return
    setError('')
    setSuccess('')
    setCreating(true)
    try {
      const res = await fetch(`${API}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: form.sku,
          name: form.name,
          category: form.category,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      })
      if (!res.ok) {
        setError(await res.text())
        return
      }
      setForm({ sku: '', name: '', category: 'plants', price: '9.99', stock: '10' })
      setSuccess('Product created.')
      setTimeout(() => setSuccess(''), 2500)
      await loadProducts()
    } finally {
      setCreating(false)
    }
  }

  function startLeadPolling() {
    if (pollRef.current) clearInterval(pollRef.current)
    let ticks = 0
    pollRef.current = setInterval(() => {
      ticks += 1
      loadLeads().catch((e) => setError(String(e)))
      if (ticks >= 3) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }, 2000)
  }

  async function submitLead() {
    if (submittingLead) return
    setError('')
    setSubmittingLead(true)
    try {
      const res = await fetch(`${API}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicant_name: 'Sam Lee',
          email: 'sam@example.com',
          loan_amount: 7500,
          product_type: 'personal',
        }),
      })
      if (!res.ok) {
        setError(await res.text())
        return
      }
      await loadLeads()
      startLeadPolling()
    } finally {
      setSubmittingLead(false)
    }
  }

  return (
    <main className="page">
      <p className="pill">Python · FastAPI · React — Laravel→Python refresher</p>
      <h1>GreenShelf ops</h1>
      <p className="lead">
        Customer-facing catalogue + internal lead queue. Own the problem end-to-end — API, UI, tests.
      </p>

      {error ? <div className="err">{error}</div> : null}
      {success ? <div className="ok" role="status">{success}</div> : null}

      <section className="card">
        <div className="row">
          <h2>Products</h2>
          <form
            className="search"
            onSubmit={(e) => {
              e.preventDefault()
              loadProducts(q).catch((err) => setError(String(err)))
            }}
          >
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search (Ex 1)" />
            <button type="submit">Search</button>
          </form>
        </div>
        {loadingProducts ? <p className="muted">Loading products…</p> : null}
        {!loadingProducts && products.length === 0 ? <p className="muted">No products matched.</p> : null}
        {!loadingProducts && products.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <code>{p.sku}</code>
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>£{Number(p.price).toFixed(2)}</td>
                  <td>{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </section>

      <section className="card">
        <h2>Add product</h2>
        <form className="grid" onSubmit={onCreate}>
          <input
            placeholder="SKU"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            required
          />
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
          <button type="submit" disabled={creating}>
            {creating ? 'Creating…' : 'Create'}
          </button>
        </form>
      </section>

      <section className="card">
        <div className="row">
          <h2>Lead queue</h2>
          <button type="button" onClick={submitLead} disabled={submittingLead}>
            {submittingLead ? 'Submitting…' : 'Submit sample lead'}
          </button>
        </div>
        {loadingLeads ? <p className="muted">Loading leads…</p> : null}
        {!loadingLeads && leads.length === 0 ? <p className="muted">No leads yet.</p> : null}
        {!loadingLeads && leads.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Lender / reason</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td>{l.applicant_name}</td>
                  <td>£{Number(l.loan_amount).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${l.status}`}>{l.status}</span>
                  </td>
                  <td>{l.routed_to_lender || l.reject_reason || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </section>
    </main>
  )
}
