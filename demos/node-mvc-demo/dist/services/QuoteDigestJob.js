export default class QuoteDigestJob {
    quoteClient;
    type = 'quote.digest';
    constructor(quoteClient) {
        this.quoteClient = quoteClient;
    }
    async handle(payload) {
        const quote = await this.quoteClient.fetchQuote();
        return {
            quote: quote.quote,
            author: quote.author,
            source: quote.source,
            isFallback: quote.isFallback,
            error: quote.error,
            requestedBy: payload.requestedBy,
        };
    }
}
