import { useCallback, useEffect, useState } from 'react'
import { api } from './api.js'

function money(n) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(n)
}

function SignupChart({ points }) {
  const max = Math.max(...points.map((p) => p.count), 1)
  const sample =
    points.length > 48 ? points.filter((_, i) => i % Math.ceil(points.length / 48) === 0) : points

  return (
    <div className="chart" aria-label="Signups chart">
      {sample.map((p) => (
        <i
          key={p.at}
          title={`${new Date(p.at).toLocaleString()} · ${p.count} signups`}
          style={{ height: `${(p.count / max) * 100}%` }}
        />
      ))}
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [tenant, setTenant] = useState(null)
  const [dash, setDash] = useState(null)
  const [clubs, setClubs] = useState([])
  const [club, setClub] = useState(null)
  const [series, setSeries] = useState([])
  const [alerts, setAlerts] = useState([])
  const [range, setRange] = useState('24h')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  const loadShell = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [t, d, c, a, s] = await Promise.all([
        api.tenant(),
        api.dashboard(),
        api.clubs(),
        api.alerts(),
        api.signups(range),
      ])
      setTenant(t)
      setDash(d)
      setClubs(c)
      setAlerts(a)
      setSeries(s)
    } catch (e) {
      setError(String(e.message || e))
    } finally {
      setLoading(false)
    }
  }, [range])

  useEffect(() => {
    loadShell()
  }, [loadShell])

  async function openClub(id) {
    setError('')
    try {
      const c = await api.club(id)
      setClub(c)
      setPage('club')
    } catch (e) {
      setError(String(e.message || e))
    }
  }

  async function pauseClub(id) {
    setBusy(true)
    setError('')
    try {
      const updated = await api.pauseClub(id)
      setClub(updated)
      setClubs((prev) => prev.map((c) => (c.id === id ? updated : c)))
      const d = await api.dashboard()
      setDash(d)
    } catch (e) {
      setError(String(e.message || e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="shell">
      <aside className="nav">
        <p className="brand">Plotline</p>
        <p className="tag">Node + React SaaS</p>
        <button type="button" className={page === 'dashboard' ? 'active' : ''} onClick={() => setPage('dashboard')}>
          Dashboard
        </button>
        <button
          type="button"
          className={page === 'clubs' || page === 'club' ? 'active' : ''}
          onClick={() => setPage('clubs')}
        >
          Clubs
        </button>
        <button type="button" className={page === 'alerts' ? 'active' : ''} onClick={() => setPage('alerts')}>
          Alerts
        </button>
        {tenant ? (
          <div className="tenant">
            <strong>{tenant.name}</strong>
            <span>
              {tenant.plan} · {tenant.seatsUsed}/{tenant.seats} seats
            </span>
          </div>
        ) : null}
      </aside>

      <main className="main">
        {error ? <div className="err">{error}</div> : null}
        {loading ? <p className="muted">Loading…</p> : null}

        {!loading && page === 'dashboard' && dash ? (
          <>
            <header className="head">
              <div>
                <h1>Operations dashboard</h1>
                <p className="muted">Subscription clubs, MRR, and signup velocity.</p>
              </div>
              <div className="range">
                <button type="button" className={range === '24h' ? 'chip on' : 'chip'} onClick={() => setRange('24h')}>
                  24h
                </button>
                <button type="button" className={range === '7d' ? 'chip on' : 'chip'} onClick={() => setRange('7d')}>
                  7d
                </button>
              </div>
            </header>

            <section className="kpis">
              <article>
                <span>Members</span>
                <strong>{dash.members.toLocaleString()}</strong>
              </article>
              <article>
                <span>MRR</span>
                <strong>{money(dash.mrr)}</strong>
              </article>
              <article>
                <span>Active clubs</span>
                <strong>{dash.activeClubs}</strong>
              </article>
              <article>
                <span>Open alerts</span>
                <strong>{dash.openAlerts}</strong>
              </article>
            </section>

            <section className="panel">
              <h2>Signups</h2>
              <SignupChart points={series} />
            </section>
          </>
        ) : null}

        {!loading && page === 'clubs' ? (
          <>
            <header className="head">
              <div>
                <h1>Clubs</h1>
                <p className="muted">Tenant-scoped garden club programmes.</p>
              </div>
            </header>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Members</th>
                  <th>MRR</th>
                  <th>Churn 30d</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map((c) => (
                  <tr key={c.id} className="click" onClick={() => openClub(c.id)}>
                    <td>{c.name}</td>
                    <td>{c.members.toLocaleString()}</td>
                    <td>{money(c.mrr)}</td>
                    <td>{c.churn30d}%</td>
                    <td>
                      <span className={`badge ${c.status}`}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : null}

        {!loading && page === 'club' && club ? (
          <>
            <header className="head">
              <div>
                <button type="button" className="link" onClick={() => setPage('clubs')}>
                  ← Clubs
                </button>
                <h1>{club.name}</h1>
                <p className="muted">{club.id}</p>
              </div>
              <button
                type="button"
                className="primary"
                disabled={busy || club.status === 'paused' || club.status === 'trial'}
                onClick={() => pauseClub(club.id)}
              >
                {club.status === 'paused' ? 'Paused' : 'Pause club'}
              </button>
            </header>
            <section className="kpis">
              <article>
                <span>Members</span>
                <strong>{club.members.toLocaleString()}</strong>
              </article>
              <article>
                <span>MRR</span>
                <strong>{money(club.mrr)}</strong>
              </article>
              <article>
                <span>Churn</span>
                <strong>{club.churn30d}%</strong>
              </article>
              <article>
                <span>Status</span>
                <strong className={`badge ${club.status}`}>{club.status}</strong>
              </article>
            </section>
          </>
        ) : null}

        {!loading && page === 'alerts' ? (
          <>
            <header className="head">
              <div>
                <h1>Alerts</h1>
                <p className="muted">Ops signals across the tenant.</p>
              </div>
            </header>
            <ul className="alerts">
              {alerts.map((a) => (
                <li key={a.id} className={a.severity}>
                  <div>
                    <strong>{a.title}</strong>
                    <div className="muted">
                      {a.clubId} · {new Date(a.at).toLocaleString()}
                    </div>
                  </div>
                  <span className={`badge ${a.severity}`}>{a.severity}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </main>
    </div>
  )
}
