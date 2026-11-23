import type { ProductRow } from '../types/domain.js'

/** Seed catalogue used by SQLite migrate and in-memory fallback. */
export const productSeed: ProductRow[] = [
  {
    id: 'atlas-desk',
    name: 'Atlas Desk',
    price: 420,
    category: 'Workspace',
    summary: 'Solid oak top with a cable channel and soft matte steel legs.',
    stock: 14,
  },
  {
    id: 'lumen-lamp',
    name: 'Lumen Lamp',
    price: 89,
    category: 'Lighting',
    summary: 'Adjustable arm, warm LED, and a weighted cast base.',
    stock: 32,
  },
  {
    id: 'ridge-chair',
    name: 'Ridge Chair',
    price: 260,
    category: 'Seating',
    summary: 'Stackable ash frame with woven seat — indoor or covered patio.',
    stock: 8,
  },
  {
    id: 'cove-shelf',
    name: 'Cove Shelf',
    price: 145,
    category: 'Storage',
    summary: 'Wall-mounted oak shelf with hidden brackets.',
    stock: 21,
  },
]
