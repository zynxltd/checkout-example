import { useEffect, useState, useTransition } from 'react'
import { api } from './api'
import type { CartLine, CollectableItem, PickupSlot, Reservation } from './types'

type Tab = 'book' | 'mine' | 'desk'

export default function App() {
  const [tab, setTab] = useState<Tab>('book')
  const [live, setLive] = useState(false)
  const [catalogue, setCatalogue] = useState<CollectableItem[]>([])
  const [slots, setSlots] = useState<PickupSlot[]>([])
  const [cart, setCart] = useState<CartLine[]>([])
  const [slotId, setSlotId] = useState('')
  const [name, setName] = useState('Sam Lee')
  const [email, setEmail] = useState('sam@example.com')
  const [mine, setMine] = useState<Reservation[]>([])
  const [desk, setDesk] = useState<Reservation[]>([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [, startTransition] = useTransition()

  async function refreshBoard() {
    const [health, items, openSlots] = await Promise.all([
      api.health(),
      api.catalogue(),
      api.slots(),
    ])
    setLive(health.status === 'ok')
    setCatalogue(items)
    setSlots(openSlots)
    setSlotId((current) => current || openSlots[0]?.id || '')
  }

  async function refreshLists() {
    const [mineRows, deskRows] = await Promise.all([
      api.reservations(email),
      api.reservations(),
    ])
    setMine(mineRows)
    setDesk(deskRows)
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await refreshBoard()
        if (!cancelled) setError('')
      } catch (err) {
        if (!cancelled) {
          setLive(false)
          setError(err instanceof Error ? err.message : 'API unavailable — start the .NET API on :5193')
        }
      }
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (tab === 'book') return
    startTransition(() => {
      void refreshLists().catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load reservations'),
      )
    })
  }, [tab, email])

  function addToCart(item: CollectableItem) {
    setCart((prev) => {
      const existing = prev.find((l) => l.sku === item.sku)
      if (existing) {
        return prev.map((l) =>
          l.sku === item.sku ? { ...l, qty: Math.min(l.qty + 1, item.stock) } : l,
        )
      }
      return [...prev, { sku: item.sku, name: item.name, unitPrice: item.unitPrice, qty: 1 }]
    })
    setNotice('')
    setError('')
  }

  function bump(sku: string, delta: number) {
    setCart((prev) =>
      prev
        .map((l) => (l.sku === sku ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0),
    )
  }

  const total = cart.reduce((sum, l) => sum + l.qty * l.unitPrice, 0)

  async function book() {
    setError('')
    setNotice('')
    try {
      const row = await api.create({
        memberName: name,
        memberEmail: email,
        slotId,
        lines: cart.map((l) => ({ sku: l.sku, qty: l.qty })),
      })
      setCart([])
      setNotice(`Booked ${row.slotLabel} — £${row.total.toFixed(2)}`)
      await refreshBoard()
      setTab('mine')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed')
    }
  }

  async function act(kind: 'cancel' | 'ready' | 'collect', id: string) {
    setError('')
    try {
      if (kind === 'cancel') await api.cancel(id)
      if (kind === 'ready') await api.ready(id)
      if (kind === 'collect') await api.collect(id)
      await Promise.all([refreshBoard(), refreshLists()])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed')
    }
  }

  return (
    <div className="app">
      <header className="brand">
        <h1>GreenShelf Click &amp; Collect</h1>
        <p>
          React SPA + ASP.NET Minimal API — reserve plants for store pickup, then run the desk
          flow (ready → collect).
        </p>
      </header>

      <p className={`status-pill ${live ? 'live' : ''}`}>
        <span className="dot" />
        {live ? 'API connected (:5193 via Vite proxy)' : 'API offline'}
      </p>

      <nav className="tabs">
        <button type="button" className={tab === 'book' ? 'active' : ''} onClick={() => setTab('book')}>
          Book pickup
        </button>
        <button type="button" className={tab === 'mine' ? 'active' : ''} onClick={() => setTab('mine')}>
          My reservations
        </button>
        <button type="button" className={tab === 'desk' ? 'active' : ''} onClick={() => setTab('desk')}>
          Staff desk
        </button>
      </nav>

      <p className="err">{error}</p>
      <p className="ok">{notice}</p>

      {tab === 'book' && (
        <div className="layout two">
          <section className="panel">
            <h2>Collectable catalogue</h2>
            <div className="catalogue">
              {catalogue.map((item) => (
                <article key={item.sku} className="item">
                  <div>
                    <div className="name">{item.name}</div>
                    <div className="meta">
                      {item.category} · £{item.unitPrice.toFixed(2)} · {item.stock} in stock ·{' '}
                      <code>{item.sku}</code>
                    </div>
                  </div>
                  <button type="button" disabled={item.stock < 1} onClick={() => addToCart(item)}>
                    Add
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2>Your pickup</h2>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="slot">Slot</label>
              <select id="slot" value={slotId} onChange={(e) => setSlotId(e.target.value)}>
                {slots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.day} · {s.windowLabel} ({s.booked}/{s.capacity})
                  </option>
                ))}
              </select>
            </div>

            {cart.length === 0 ? (
              <p className="meta">Add items from the catalogue.</p>
            ) : (
              cart.map((line) => (
                <div key={line.sku} className="cart-line">
                  <span>
                    {line.name} × {line.qty}
                  </span>
                  <span>
                    <button type="button" className="ghost" onClick={() => bump(line.sku, -1)}>
                      −
                    </button>{' '}
                    <button type="button" className="ghost" onClick={() => bump(line.sku, 1)}>
                      +
                    </button>
                  </span>
                </div>
              ))
            )}

            <p className="total">Total £{total.toFixed(2)}</p>
            <button
              type="button"
              className="primary"
              disabled={!cart.length || !slotId}
              onClick={() => void book()}
            >
              Reserve pickup
            </button>
          </section>
        </div>
      )}

      {tab === 'mine' && (
        <section className="panel">
          <h2>Reservations for {email || '…'}</h2>
          <ReservationList
            rows={mine}
            onCancel={(id) => void act('cancel', id)}
          />
        </section>
      )}

      {tab === 'desk' && (
        <section className="panel">
          <h2>Staff desk — all pickups</h2>
          <ReservationList
            rows={desk}
            staff
            onReady={(id) => void act('ready', id)}
            onCollect={(id) => void act('collect', id)}
            onCancel={(id) => void act('cancel', id)}
          />
        </section>
      )}
    </div>
  )
}

function ReservationList({
  rows,
  staff = false,
  onCancel,
  onReady,
  onCollect,
}: {
  rows: Reservation[]
  staff?: boolean
  onCancel?: (id: string) => void
  onReady?: (id: string) => void
  onCollect?: (id: string) => void
}) {
  if (!rows.length) return <p className="meta">No reservations yet.</p>

  return (
    <div className="res-list">
      {rows.map((row) => (
        <article key={row.id} className="res">
          <header>
            <strong>
              {row.memberName} · £{row.total.toFixed(2)}
            </strong>
            <span className={`badge ${row.status}`}>{row.status}</span>
          </header>
          <div className="meta">
            {row.slotLabel} · {row.memberEmail}
          </div>
          <div className="meta">
            {row.lines.map((l) => `${l.name}×${l.qty}`).join(' · ')}
          </div>
          <ul className="events">
            {row.events.map((e, i) => (
              <li key={`${e.kind}-${i}`}>
                {e.kind}: {e.detail}
              </li>
            ))}
          </ul>
          <div className="actions">
            {(row.status === 'Booked' || row.status === 'Ready') && onCancel && (
              <button type="button" className="ghost" onClick={() => onCancel(row.id)}>
                Cancel
              </button>
            )}
            {staff && row.status === 'Booked' && onReady && (
              <button type="button" className="primary" onClick={() => onReady(row.id)}>
                Mark ready
              </button>
            )}
            {staff && row.status === 'Ready' && onCollect && (
              <button type="button" className="primary" onClick={() => onCollect(row.id)}>
                Collect
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
