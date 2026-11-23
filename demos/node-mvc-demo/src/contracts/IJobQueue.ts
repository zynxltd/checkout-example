import type { JobPayloadMap, JobRecord, JobResultMap, JobType, QueueStats } from '../types/jobs.js'
import type { IJobHandler } from './IJobHandler.js'

/**
 * Contract for enqueueing and observing background work.
 * Callers depend on this interface, not a concrete queue implementation.
 */
export interface IJobQueue {
  register<TType extends JobType>(
    type: TType,
    handler: IJobHandler<JobPayloadMap[TType], JobResultMap[TType]>,
  ): void

  start(): void
  stop(): void

  enqueue<TType extends JobType>(type: TType, payload: JobPayloadMap[TType]): JobRecord<TType>
  getStats(): QueueStats
  recent(limit?: number): JobRecord[]
  processNext(): Promise<void>
}
