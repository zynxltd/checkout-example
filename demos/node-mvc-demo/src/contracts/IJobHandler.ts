/**
 * Contract for a single background job processor.
 * Implementations must expose a stable `type` and async `handle`.
 */
export interface IJobHandler<TPayload, TResult> {
  readonly type: string
  handle(payload: TPayload): Promise<TResult>
}
