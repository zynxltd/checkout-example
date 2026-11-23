function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export default class InMemoryJobQueue {
    pollIntervalMs;
    jobs = [];
    handlers = new Map();
    timer = null;
    processing = false;
    constructor(pollIntervalMs = 1000) {
        this.pollIntervalMs = pollIntervalMs;
    }
    register(type, handler) {
        this.handlers.set(type, handler);
    }
    start() {
        if (this.timer)
            return;
        this.timer = setInterval(() => {
            void this.processNext();
        }, this.pollIntervalMs);
    }
    stop() {
        if (!this.timer)
            return;
        clearInterval(this.timer);
        this.timer = null;
    }
    enqueue(type, payload) {
        const job = {
            id: String(this.jobs.length + 1),
            type,
            payload,
            status: 'queued',
            attempts: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            result: null,
            error: null,
        };
        this.jobs.push(job);
        return job;
    }
    getStats() {
        const summary = {
            queued: 0,
            processing: 0,
            completed: 0,
            failed: 0,
        };
        for (const job of this.jobs) {
            summary[job.status] += 1;
        }
        return {
            ...summary,
            total: this.jobs.length,
        };
    }
    recent(limit = 8) {
        return [...this.jobs].slice(-limit).reverse();
    }
    async processNext() {
        if (this.processing)
            return;
        const job = this.jobs.find((entry) => entry.status === 'queued');
        if (!job)
            return;
        const handler = this.handlers.get(job.type);
        if (!handler) {
            job.status = 'failed';
            job.error = `No handler registered for ${job.type}`;
            job.updatedAt = new Date().toISOString();
            return;
        }
        this.processing = true;
        job.status = 'processing';
        job.attempts += 1;
        job.updatedAt = new Date().toISOString();
        try {
            await wait(400);
            job.result = await handler.handle(job.payload);
            job.status = 'completed';
            job.updatedAt = new Date().toISOString();
        }
        catch (error) {
            job.status = 'failed';
            job.error = error instanceof Error ? error.message : 'Unknown job failure';
            job.updatedAt = new Date().toISOString();
        }
        finally {
            this.processing = false;
        }
    }
}
