import { BaseJobHandler } from '../contracts/BaseJobHandler.js'
import type { IQuoteApiClient } from '../contracts/IQuoteApiClient.js'
import type { QuoteDigestPayload, QuoteDigestResult } from '../types/jobs.js'

export default class QuoteDigestJob extends BaseJobHandler<QuoteDigestPayload, QuoteDigestResult> {
  readonly type = 'quote.digest' as const

  constructor(private readonly quoteClient: IQuoteApiClient) {
    super()
  }

  async handle(payload: QuoteDigestPayload): Promise<QuoteDigestResult> {
    this.logStart(payload)
    const quote = await this.quoteClient.fetchQuote()
    return {
      quote: quote.quote,
      author: quote.author,
      source: quote.source,
      isFallback: quote.isFallback,
      error: quote.error,
      requestedBy: payload.requestedBy,
    }
  }
}
