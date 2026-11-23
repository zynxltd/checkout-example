/**
 * EXERCISE 8 / debug — pure helpers (easy to unit test + step through).
 * Expected: margin(199, 0.62) === 75.62
 */
export function margin(price, costRatio = 0.62) {
  const cost = Math.round(price * costRatio * 100) / 100
  return Math.round((price - cost) * 100) / 100
}

export function lineTotal(price, qty) {
  return Math.round(price * qty * 100) / 100
}

export function cartSubtotal(lines) {
  return lines.reduce((sum, line) => sum + lineTotal(line.price, line.qty), 0)
}
