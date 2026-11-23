import { useMemo, useState } from 'react'
import { CATALOG } from '../data/catalog.js'
import { margin } from '../lib/money.js'

/**
 * EXERCISE 8 — Debugging session.
 * Break margin() temporarily, use React DevTools + breakpoints.
 */
export function DebugLab() {
  const [sku, setSku] = useState('MOWER1')

  const result = useMemo(() => {
    const match = CATALOG.find((p) => p.sku.toUpperCase() === sku.toUpperCase())
    if (!match) return { found: false }
    // BREAKPOINT: step into margin()
    return { found: true, name: match.name, price: match.price, margin: margin(match.price) }
  }, [sku])

  return (
    <section className="card">
      <h2>Debug lab</h2>
      <p className="muted">Ex 8 — React DevTools + breakpoint in <code>margin()</code>.</p>
      <label>
        SKU{' '}
        <input value={sku} onChange={(e) => setSku(e.target.value)} />
      </label>
      {!result.found ? (
        <p className="err">No match</p>
      ) : (
        <p>
          {result.name}: £{result.price.toFixed(2)} → margin{' '}
          <strong>£{result.margin.toFixed(2)}</strong> (expect 75.62 for MOWER1)
        </p>
      )}
    </section>
  )
}
