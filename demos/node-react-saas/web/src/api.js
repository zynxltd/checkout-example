const BASE = import.meta.env.VITE_API_URL || ''

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return res.json()
}

async function post(path) {
  const res = await fetch(`${BASE}${path}`, { method: 'POST' })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || `${path} → ${res.status}`)
  return body
}

export const api = {
  health: () => get('/api/health'),
  tenant: () => get('/api/tenant'),
  dashboard: () => get('/api/dashboard'),
  clubs: () => get('/api/clubs'),
  club: (id) => get(`/api/clubs/${id}`),
  signups: (range = '24h') => get(`/api/signups?range=${range}`),
  alerts: () => get('/api/alerts'),
  pauseClub: (id) => post(`/api/clubs/${id}/pause`),
}
