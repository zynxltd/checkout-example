export const CATALOG = [
  { id: 1, sku: 'ROSE01', name: 'Climbing Rose', category: 'plants', price: 24.99, stock: 40 },
  { id: 2, sku: 'FEED01', name: 'Bird Feeder Kit', category: 'wildlife', price: 9.99, stock: 120 },
  { id: 3, sku: 'MOWER1', name: 'Compact Lawn Mower', category: 'machinery', price: 199, stock: 8 },
  { id: 4, sku: 'HERB12', name: 'Herb Starter Pack', category: 'plants', price: 14.5, stock: 75 },
  { id: 5, sku: 'TREE9', name: 'Olive Tree', category: 'plants', price: 49.99, stock: 0 },
]

/** Fake network delay — practise loading states (Ex 5). */
export function fetchCatalog() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...CATALOG]), 400)
  })
}
