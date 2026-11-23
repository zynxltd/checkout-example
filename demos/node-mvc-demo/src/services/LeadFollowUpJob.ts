import { BaseJobHandler } from '../contracts/BaseJobHandler.js'
import type {
  LeadFollowUpPayload,
  LeadFollowUpResult,
} from '../types/jobs.js'

export default class LeadFollowUpJob extends BaseJobHandler<
  LeadFollowUpPayload,
  LeadFollowUpResult
> {
  readonly type = 'lead.follow-up' as const

  async handle(payload: LeadFollowUpPayload): Promise<LeadFollowUpResult> {
    this.logStart(payload)
    return {
      sentTo: payload.email,
      subject: `Harbor follow-up for ${payload.name}`,
      queuedBecause: payload.reason,
    }
  }
}
