/** In-memory SaaS store — garden club / subscription ops (Plotline). */

export const tenant = {
  id: 'ten_plotline',
  name: 'YouGarden Club Ops',
  plan: 'Growth',
  region: 'uk-south',
  seats: 12,
  seatsUsed: 7,
}

export const clubs = [
  {
    id: 'club_midlands',
    name: 'Midlands Growers',
    members: 1840,
    mrr: 9200,
    status: 'healthy',
    churn30d: 1.8,
  },
  {
    id: 'club_coast',
    name: 'Coastal Plots',
    members: 960,
    mrr: 4800,
    status: 'watch',
    churn30d: 4.2,
  },
  {
    id: 'club_north',
    name: 'Northern Beds',
    members: 2210,
    mrr: 11050,
    status: 'healthy',
    churn30d: 1.1,
  },
  {
    id: 'club_trial',
    name: 'Trial Greenhouse',
    members: 120,
    mrr: 0,
    status: 'trial',
    churn30d: 0,
  },
]

export const alerts = [
  {
    id: 'al_1',
    severity: 'warning',
    title: 'Coastal Plots churn above 4%',
    clubId: 'club_coast',
    at: hoursAgo(5),
  },
  {
    id: 'al_2',
    severity: 'info',
    title: 'Trial Greenhouse converts in 6 days',
    clubId: 'club_trial',
    at: hoursAgo(18),
  },
  {
    id: 'al_3',
    severity: 'critical',
    title: 'Failed renewals spike (card declines)',
    clubId: 'club_midlands',
    at: hoursAgo(2),
  },
]

/** Last 24h signups (hourly). */
export function signupSeries(hours = 24) {
  const now = Date.now()
  const points = []
  for (let i = hours - 1; i >= 0; i--) {
    const at = new Date(now - i * 3600_000).toISOString()
    const base = 8 + ((hours - i) % 5)
    const noise = (i * 7) % 6
    points.push({ at, count: base + noise })
  }
  return points
}

export function buildDashboard() {
  const members = clubs.reduce((n, c) => n + c.members, 0)
  const mrr = clubs.reduce((n, c) => n + c.mrr, 0)
  const active = clubs.filter((c) => c.status !== 'trial').length
  return {
    members,
    mrr,
    activeClubs: active,
    openAlerts: alerts.filter((a) => a.severity !== 'info').length,
    plan: tenant.plan,
    seatUtilisation: Math.round((tenant.seatsUsed / tenant.seats) * 100),
  }
}

function hoursAgo(h) {
  return new Date(Date.now() - h * 3600_000).toISOString()
}
