import { describe, expect, it } from 'vitest'
import { cartSubtotal, lineTotal, margin } from '../lib/money.js'

describe('money helpers', () => {
  it('computes margin for MOWER1', () => {
    expect(margin(199, 0.62)).toBe(75.62)
  })

  it('line totals and cart subtotal', () => {
    expect(lineTotal(10, 3)).toBe(30)
    expect(cartSubtotal([{ price: 10, qty: 2 }, { price: 5, qty: 1 }])).toBe(25)
  })
})

// EXERCISE 10: add CleanLeadForm.test.jsx with Testing Library
// EXERCISE 1–2: optional ProductCard / ProductGrid tests
