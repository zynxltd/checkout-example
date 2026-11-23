export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed'

export type JobType = 'lead.follow-up' | 'quote.digest'

export interface LeadFollowUpPayload {
  name: string
  email: string
  reason: string
}

export interface QuoteDigestPayload {
  requestedBy: string
}

export interface LeadFollowUpResult {
  sentTo: string
  subject: string
  queuedBecause: string
}

export interface QuoteDigestResult {
  quote: string
  author: string
  source: string
  isFallback: boolean
  requestedBy: string
  error?: string
}

export type JobPayloadMap = {
  'lead.follow-up': LeadFollowUpPayload
  'quote.digest': QuoteDigestPayload
}

export type JobResultMap = {
  'lead.follow-up': LeadFollowUpResult
  'quote.digest': QuoteDigestResult
}

export interface JobRecord<TType extends JobType = JobType> {
  id: string
  type: TType
  payload: JobPayloadMap[TType]
  status: JobStatus
  attempts: number
  createdAt: string
  updatedAt: string
  result: JobResultMap[TType] | null
  error: string | null
}

export interface QueueStats {
  queued: number
  processing: number
  completed: number
  failed: number
  total: number
}

// Job handler contract lives in src/contracts/IJobHandler.ts
