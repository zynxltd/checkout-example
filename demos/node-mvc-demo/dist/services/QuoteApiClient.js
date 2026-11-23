const FALLBACK_QUOTE = {
    quote: 'Good systems make the easy path the right path.',
    author: 'Harbor demo fallback',
    source: 'local',
    isFallback: true,
};
export default class QuoteApiClient {
    baseUrl;
    timeoutMs;
    constructor(baseUrl = 'https://dummyjson.com/quotes/random', timeoutMs = 1500) {
        this.baseUrl = baseUrl;
        this.timeoutMs = timeoutMs;
    }
    async fetchQuote() {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);
        try {
            const response = await fetch(this.baseUrl, {
                signal: controller.signal,
                headers: { Accept: 'application/json' },
            });
            if (!response.ok) {
                throw new Error(`Quote API returned ${response.status}`);
            }
            const body = (await response.json());
            return {
                quote: body.quote,
                author: body.author,
                source: this.baseUrl,
                isFallback: false,
            };
        }
        catch (error) {
            return {
                ...FALLBACK_QUOTE,
                error: error instanceof Error ? error.message : 'Unknown API error',
            };
        }
        finally {
            clearTimeout(timer);
        }
    }
}
