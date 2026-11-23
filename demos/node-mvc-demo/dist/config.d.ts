export interface AppConfig {
    port: number;
    sessionSecret: string;
    demoEmail: string;
    demoPassword: string;
    quoteApiUrl: string;
    quoteApiTimeoutMs: number;
    queuePollIntervalMs: number;
}
export declare function loadConfig(): AppConfig;
