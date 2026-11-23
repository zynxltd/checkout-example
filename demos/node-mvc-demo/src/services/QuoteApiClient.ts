import type { QuoteSnapshot } from '../types/domain.js'
import type { IQuoteApiClient } from '../contracts/IQuoteApiClient.js'

const FALLBACK_QUOTE: QuoteSnapshot = {
  quote: 'Good systems make the easy path the right path.',
  author: 'Harbor demo fallback',
  source: 'local',
  isFallback: true,
}

interface DummyJsonQuote {
  quote: string
  author: string
}

export default class QuoteApiClient implements IQuoteApiClient {
  constructor(
    private readonly baseUrl = 'https://dummyjson.com/quotes/random',
    private readonly timeoutMs = 1500,
  ) {}

  async fetchQuote(): Promise<QuoteSnapshot> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeoutMs)

    try {
      const response = await fetch(this.baseUrl, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Quote API returned ${response.status}`)
      }

      const body = (await response.json()) as DummyJsonQuote
      return {
        quote: body.quote,
        author: body.author,
        source: this.baseUrl,
        isFallback: false,
      }
    } catch (error) {
      return {
        ...FALLBACK_QUOTE,
        error: error instanceof Error ? error.message : 'Unknown API error',
      }
    } finally {
      clearTimeout(timer)
    }
  }
}
