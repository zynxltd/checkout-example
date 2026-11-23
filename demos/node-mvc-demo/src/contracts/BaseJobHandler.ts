import type { IJobHandler } from './IJobHandler.js'

/**
 * Optional abstract base for job handlers (Liskov: subclasses are substitutable).
 */
export abstract class BaseJobHandler<TPayload, TResult> implements IJobHandler<TPayload, TResult> {
  abstract readonly type: string

  abstract handle(payload: TPayload): Promise<TResult>

  protected logStart(payload: TPayload): void {
    console.debug(`[job:${this.type}] start`, payload)
  }
}
