export interface ProductRow {
    id: string;
    name: string;
    price: number;
    category: string;
    summary: string;
    stock: number;
}
export interface ContactInput {
    name: string;
    email: string;
    message: string;
}
export interface ContactRecord extends ContactInput {
    id: string;
    createdAt: string;
}
export interface QuoteSnapshot {
    quote: string;
    author: string;
    source: string;
    isFallback: boolean;
    error?: string;
}
export interface DashboardSnapshot {
    queueSummary: import('./jobs.js').QueueStats;
    recentJobs: import('./jobs.js').JobRecord[];
    recentMessages: ContactRecord[];
    quote: QuoteSnapshot;
    productCategories: Record<string, number>;
    contactCount: number;
}
export interface SessionUser {
    email: string;
    name: string;
}
