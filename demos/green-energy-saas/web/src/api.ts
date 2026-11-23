export type Tenant = {
  id: string
  name: string
  plan: string
  seats: number
  renewsOn: string
  region: string
}

export type SiteView = {
  id: string
  name: string
  type: string
  location: string
  capacityMw: number
  status: string
  commissioned: string
  liveKw: number
  todayMwh: number
  co2AvoidedKg: number
  availabilityPct: number
}

export type Dashboard = {
  tenantName: string
  plan: string
  fleetLiveMw: number
  todayMwh: number
  monthMwh: number
  co2AvoidedTonnes: number
  activeSites: number
  alertsOpen: number
  topSites: SiteView[]
}

export type GenerationPoint = {
  at: string
  mw: number
}

export type Alert = {
  id: string
  siteId: string
  siteName: string
  severity: string
  message: string
  raisedAt: string
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`${res.status} ${path}`)
  return res.json() as Promise<T>
}

export const api = {
  tenant: () => getJson<Tenant>('/api/tenant'),
  dashboard: () => getJson<Dashboard>('/api/dashboard'),
  sites: () => getJson<SiteView[]>('/api/sites'),
  site: (id: string) => getJson<SiteView>(`/api/sites/${id}`),
  generation: (range: '24h' | '7d' = '24h') =>
    getJson<GenerationPoint[]>(`/api/generation?range=${range}`),
  alerts: () => getJson<Alert[]>('/api/alerts'),
}
