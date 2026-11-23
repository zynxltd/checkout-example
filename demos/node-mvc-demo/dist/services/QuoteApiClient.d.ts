import type { QuoteSnapshot } from '../types/domain.js';
export default class QuoteApiClient {
    private readonly baseUrl;
    private readonly timeoutMs;
    constructor(baseUrl?: string, timeoutMs?: number);
    fetchQuote(): Promise<QuoteSnapshot>;
}
