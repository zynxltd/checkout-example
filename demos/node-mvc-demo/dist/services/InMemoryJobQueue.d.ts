import type { JobHandler, JobPayloadMap, JobRecord, JobResultMap, JobType, QueueStats } from '../types/jobs.js';
export default class InMemoryJobQueue {
    private readonly pollIntervalMs;
    private readonly jobs;
    private readonly handlers;
    private timer;
    private processing;
    constructor(pollIntervalMs?: number);
    register<TType extends JobType>(type: TType, handler: JobHandler<JobPayloadMap[TType], JobResultMap[TType]>): void;
    start(): void;
    stop(): void;
    enqueue<TType extends JobType>(type: TType, payload: JobPayloadMap[TType]): JobRecord<TType>;
    getStats(): QueueStats;
    recent(limit?: number): JobRecord[];
    processNext(): Promise<void>;
}
