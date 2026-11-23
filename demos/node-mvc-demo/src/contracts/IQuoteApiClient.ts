import type { QuoteSnapshot } from '../types/domain.js'

/**
 * Contract for fetching inspirational quotes from a third-party API.
 * Implementations may use HTTP, cache, or a static fallback.
 */
export interface IQuoteApiClient {
  fetchQuote(): Promise<QuoteSnapshot>
}
