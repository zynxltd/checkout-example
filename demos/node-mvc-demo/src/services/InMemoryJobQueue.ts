function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

import type { IJobHandler } from '../contracts/IJobHandler.js'
import type { IJobQueue } from '../contracts/IJobQueue.js'
import type {
  JobPayloadMap,
  JobRecord,
  JobResultMap,
  JobStatus,
  JobType,
  QueueStats,
} from '../types/jobs.js'

type AnyJobHandler = IJobHandler<JobPayloadMap[JobType], JobResultMap[JobType]>

export default class InMemoryJobQueue implements IJobQueue {
  private readonly jobs: JobRecord[] = []
  private readonly handlers = new Map<JobType, AnyJobHandler>()
  private timer: ReturnType<typeof setInterval> | null = null
  private processing = false

  constructor(private readonly pollIntervalMs = 1000) {}

  register<TType extends JobType>(
    type: TType,
    handler: IJobHandler<JobPayloadMap[TType], JobResultMap[TType]>,
  ): void {
    this.handlers.set(type, handler as AnyJobHandler)
  }

  start(): void {
    if (this.timer) return
    this.timer = setInterval(() => {
      void this.processNext()
    }, this.pollIntervalMs)
  }

  stop(): void {
    if (!this.timer) return
    clearInterval(this.timer)
    this.timer = null
  }

  enqueue<TType extends JobType>(type: TType, payload: JobPayloadMap[TType]): JobRecord<TType> {
    const job: JobRecord<TType> = {
      id: String(this.jobs.length + 1),
      type,
      payload,
      status: 'queued',
      attempts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      result: null,
      error: null,
    }

    this.jobs.push(job as JobRecord)
    return job
  }

  getStats(): QueueStats {
    const summary: Record<JobStatus, number> = {
      queued: 0,
      processing: 0,
      completed: 0,
      failed: 0,
    }

    for (const job of this.jobs) {
      summary[job.status] += 1
    }

    return {
      ...summary,
      total: this.jobs.length,
    }
  }

  recent(limit = 8): JobRecord[] {
    return [...this.jobs].slice(-limit).reverse()
  }

  async processNext(): Promise<void> {
    if (this.processing) return

    const job = this.jobs.find((entry) => entry.status === 'queued')
    if (!job) return

    const handler = this.handlers.get(job.type)
    if (!handler) {
      job.status = 'failed'
      job.error = `No handler registered for ${job.type}`
      job.updatedAt = new Date().toISOString()
      return
    }

    this.processing = true
    job.status = 'processing'
    job.attempts += 1
    job.updatedAt = new Date().toISOString()

    try {
      await wait(400)
      job.result = await handler.handle(job.payload)
      job.status = 'completed'
      job.updatedAt = new Date().toISOString()
    } catch (error) {
      job.status = 'failed'
      job.error = error instanceof Error ? error.message : 'Unknown job failure'
      job.updatedAt = new Date().toISOString()
    } finally {
      this.processing = false
    }
  }
}
