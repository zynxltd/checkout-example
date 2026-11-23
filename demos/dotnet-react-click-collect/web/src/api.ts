import type { CollectableItem, PickupSlot, Reservation, ReservationStatus } from './types'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })

  if (!res.ok) {
    let message = res.statusText
    try {
      const body = await res.json()
      message = body.error ?? body.title ?? Object.values(body.errors ?? {}).flat().join(' ') ?? message
    } catch {
      /* ignore */
    }
    throw new Error(message)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  health: () => request<{ status: string }>('/api/health'),
  catalogue: () => request<CollectableItem[]>('/api/catalogue'),
  slots: () => request<PickupSlot[]>('/api/slots'),
  reservations: (email?: string, status?: ReservationStatus) => {
    const q = new URLSearchParams()
    if (email) q.set('email', email)
    if (status) q.set('status', status)
    const qs = q.toString()
    return request<Reservation[]>(`/api/reservations${qs ? `?${qs}` : ''}`)
  },
  create: (body: {
    memberName: string
    memberEmail: string
    slotId: string
    lines: { sku: string; qty: number }[]
  }) =>
    request<Reservation>('/api/reservations', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  cancel: (id: string) =>
    request<Reservation>(`/api/reservations/${id}/cancel`, { method: 'POST' }),
  ready: (id: string) =>
    request<Reservation>(`/api/reservations/${id}/ready`, { method: 'POST' }),
  collect: (id: string) =>
    request<Reservation>(`/api/reservations/${id}/collect`, { method: 'POST' }),
}
