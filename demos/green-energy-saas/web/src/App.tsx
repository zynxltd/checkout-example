import { useEffect, useMemo, useState } from 'react'
import { api, type Alert, type Dashboard, type GenerationPoint, type SiteView, type Tenant } from './api'

type Page = 'dashboard' | 'sites' | 'site' | 'plan'

function statusClass(status: string) {
  return status.toLowerCase()
}

function GenerationChart({ points }: { points: GenerationPoint[] }) {
  const max = Math.max(...points.map((p) => p.mw), 0.01)
  const sample = points.length > 48
    ? points.filter((_, i) => i % Math.ceil(points.length / 48) === 0)
    : points

  return (
    <div className="chart" aria-label="Generation chart">
      {sample.map((p) => (
        <i
          key={p.at}
          title={`${new Date(p.at).toLocaleString()} · ${p.mw} MW`}
          style={{ height: `${(p.mw / max) * 100}%` }}
        />
      ))}
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [siteId, setSiteId] = useState<string | null>(null)
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [dash, setDash] = useState<Dashboard | null>(null)
  const [sites, setSites] = useState<SiteView[]>([])
  const [site, setSite] = useState<SiteView | null>(null)
  const [series, setSeries] = useState<GenerationPoint[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const [t, d, s, g, a] = await Promise.all([
          api.tenant(),
          api.dashboard(),
          api.sites(),
          api.generation('24h'),
          api.alerts(),
        ])
        if (cancelled) return
        setTenant(t)
        setDash(d)
        setSites(s)
        setSeries(g)
        setAlerts(a)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load API')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (page !== 'site' || !siteId) return
    let cancelled = false
    ;(async () => {
      try {
        const s = await api.site(siteId)
        if (!cancelled) setSite(s)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Site load failed')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [page, siteId])

  const title = useMemo(() => {
    if (page === 'sites') return 'Sites'
    if (page === 'site') return site?.name ?? 'Site'
    if (page === 'plan') return 'Plan & billing'
    return 'Fleet dashboard'
  }, [page, site])

  function openSite(id: string) {
    setSiteId(id)
    setPage('site')
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          Verdant Grid
          <span>Green energy SaaS · .NET 10 + React</span>
        </div>
        <nav className="nav">
          <button type="button" className={page === 'dashboard' ? 'active' : ''} onClick={() => setPage('dashboard')}>
            Dashboard
          </button>
          <button type="button" className={page === 'sites' || page === 'site' ? 'active' : ''} onClick={() => setPage('sites')}>
            Sites
          </button>
          <button type="button" className={page === 'plan' ? 'active' : ''} onClick={() => setPage('plan')}>
            Plan
          </button>
        </nav>
        {tenant && (
          <div className="muted" style={{ marginTop: 'auto', fontSize: '0.85rem' }}>
            {tenant.name}
            <br />
            {tenant.plan} · {tenant.region}
          </div>
        )}
      </aside>

      <main className="main">
        <div className="page-head">
          <div>
            <h1>{title}</h1>
            <p>Monitor generation, availability, and carbon avoided across the fleet.</p>
          </div>
        </div>

        {loading && <p className="muted">Loading platform data…</p>}
        {error && (
          <p className="error">
            API error: {error}. Start the .NET API on :5100 (`dotnet run --project api --launch-profile http`).
          </p>
        )}

        {!loading && !error && page === 'dashboard' && dash && (
          <>
            <div className="grid-kpi">
              <div className="kpi"><label>Live fleet</label><strong>{dash.fleetLiveMw} MW</strong></div>
              <div className="kpi"><label>Today</label><strong>{dash.todayMwh} MWh</strong></div>
              <div className="kpi"><label>Month (est.)</label><strong>{dash.monthMwh} MWh</strong></div>
              <div className="kpi"><label>CO₂ avoided</label><strong>{dash.co2AvoidedTonnes} t</strong></div>
            </div>

            <div className="split">
              <section className="panel">
                <h2>Generation · last 24h</h2>
                <GenerationChart points={series} />
              </section>
              <section className="panel">
                <h2>Open alerts ({dash.alertsOpen})</h2>
                {alerts.map((a) => (
                  <div key={a.id} className={`alert ${a.severity}`}>
                    <strong>{a.siteName}</strong>
                    {a.message}
                    <div><span>{new Date(a.raisedAt).toLocaleString()} · {a.severity}</span></div>
                  </div>
                ))}
              </section>
            </div>

            <section className="panel">
              <h2>Top sites by live output</h2>
              <table>
                <thead>
                  <tr>
                    <th>Site</th><th>Type</th><th>Live</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dash.topSites.map((s) => (
                    <tr key={s.id} className="clickable" onClick={() => openSite(s.id)}>
                      <td>{s.name}</td>
                      <td>{s.type}</td>
                      <td>{s.liveKw} kW</td>
                      <td><span className={`badge ${statusClass(s.status)}`}>{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}

        {!loading && !error && page === 'sites' && (
          <section className="panel">
            <h2>All sites</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Location</th><th>Capacity</th><th>Today</th><th>Availability</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((s) => (
                  <tr key={s.id} className="clickable" onClick={() => openSite(s.id)}>
                    <td>{s.name}</td>
                    <td>{s.location}</td>
                    <td>{s.capacityMw} MW</td>
                    <td>{s.todayMwh} MWh</td>
                    <td>{s.availabilityPct}%</td>
                    <td><span className={`badge ${statusClass(s.status)}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {!loading && !error && page === 'site' && site && (
          <>
            <p className="muted">
              <button type="button" className="primary" style={{ marginBottom: '1rem' }} onClick={() => setPage('sites')}>
                ← All sites
              </button>
            </p>
            <div className="grid-kpi">
              <div className="kpi"><label>Live</label><strong>{site.liveKw} kW</strong></div>
              <div className="kpi"><label>Today</label><strong>{site.todayMwh} MWh</strong></div>
              <div className="kpi"><label>CO₂ avoided</label><strong>{site.co2AvoidedKg} kg</strong></div>
              <div className="kpi"><label>Availability</label><strong>{site.availabilityPct}%</strong></div>
            </div>
            <section className="panel">
              <h2>{site.type} · {site.location}</h2>
              <p className="muted">
                Capacity {site.capacityMw} MW · Commissioned {site.commissioned} ·{' '}
                <span className={`badge ${statusClass(site.status)}`}>{site.status}</span>
              </p>
            </section>
          </>
        )}

        {!loading && !error && page === 'plan' && tenant && (
          <section className="panel plan-card">
            <h2>{tenant.plan} plan</h2>
            <div className="price">£1,200<span className="muted" style={{ fontSize: '1rem' }}>/mo</span></div>
            <p className="muted">
              {tenant.seats} seats · Region {tenant.region} · Renews {tenant.renewsOn}
            </p>
            <ul className="muted">
              <li>Unlimited sites & SCADA connectors</li>
              <li>Carbon reporting exports</li>
              <li>Alerting + on-call webhooks</li>
              <li>SSO (SAML / OIDC)</li>
            </ul>
            <button type="button" className="primary">Manage billing (demo)</button>
          </section>
        )}
      </main>
    </div>
  )
}
