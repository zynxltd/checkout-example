import type { JobHandler, QuoteDigestPayload, QuoteDigestResult } from '../types/jobs.js';
import type QuoteApiClient from './QuoteApiClient.js';
export default class QuoteDigestJob implements JobHandler<QuoteDigestPayload, QuoteDigestResult> {
    private readonly quoteClient;
    readonly type: 'quote.digest';
    constructor(quoteClient: QuoteApiClient);
    handle(payload: QuoteDigestPayload): Promise<QuoteDigestResult>;
}
