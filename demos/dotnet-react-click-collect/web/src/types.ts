export type ReservationStatus = 'Booked' | 'Ready' | 'Collected' | 'Cancelled'

export type CollectableItem = {
  sku: string
  name: string
  category: string
  unitPrice: number
  stock: number
}

export type PickupSlot = {
  id: string
  day: string
  windowLabel: string
  startsAt: string
  capacity: number
  booked: number
}

export type ReservationLine = {
  sku: string
  name: string
  qty: number
  unitPrice: number
}

export type ReservationEvent = {
  kind: string
  detail: string
  at: string
}

export type Reservation = {
  id: string
  memberName: string
  memberEmail: string
  slotId: string
  slotLabel: string
  status: ReservationStatus
  total: number
  lines: ReservationLine[]
  createdAt: string
  readyAt?: string | null
  collectedAt?: string | null
  cancelledAt?: string | null
  events: ReservationEvent[]
}

export type CartLine = { sku: string; name: string; unitPrice: number; qty: number }
