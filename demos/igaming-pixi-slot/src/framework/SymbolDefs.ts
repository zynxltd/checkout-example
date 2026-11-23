/** Symbol definitions for the demo slot. */

export type SymbolId = 'cherry' | 'lemon' | 'bell' | 'bar' | 'seven' | 'diamond'

export interface SymbolDef {
  id: SymbolId
  label: string
  color: number
  weight: number
  payout: number
}

export const SYMBOLS: SymbolDef[] = [
  { id: 'cherry', label: 'CH', color: 0xe84a9a, weight: 28, payout: 2 },
  { id: 'lemon', label: 'LM', color: 0xf0c14a, weight: 24, payout: 3 },
  { id: 'bell', label: 'BL', color: 0x4aa3f0, weight: 18, payout: 5 },
  { id: 'bar', label: 'BAR', color: 0x2de2c5, weight: 14, payout: 8 },
  { id: 'seven', label: '7', color: 0xff5a5a, weight: 10, payout: 15 },
  { id: 'diamond', label: '◆', color: 0xc4b5fd, weight: 6, payout: 40 },
]

export function pickWeightedSymbol(rng = Math.random): SymbolDef {
  const total = SYMBOLS.reduce((sum, s) => sum + s.weight, 0)
  let roll = rng() * total
  for (const symbol of SYMBOLS) {
    roll -= symbol.weight
    if (roll <= 0) return symbol
  }
  return SYMBOLS[0]
}

export function getSymbol(id: SymbolId): SymbolDef {
  return SYMBOLS.find((s) => s.id === id) ?? SYMBOLS[0]
}
