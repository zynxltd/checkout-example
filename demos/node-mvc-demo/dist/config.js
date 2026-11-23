export function loadConfig() {
    return {
        port: Number(process.env.PORT) || 3090,
        sessionSecret: process.env.SESSION_SECRET || 'harbor-demo-secret',
        demoEmail: process.env.DEMO_EMAIL || 'demo@harbor.test',
        demoPassword: process.env.DEMO_PASSWORD || 'letmein123',
        quoteApiUrl: process.env.QUOTE_API_URL || 'https://dummyjson.com/quotes/random',
        quoteApiTimeoutMs: Number(process.env.QUOTE_API_TIMEOUT_MS) || 1500,
        queuePollIntervalMs: Number(process.env.QUEUE_POLL_MS) || 900,
    };
}
