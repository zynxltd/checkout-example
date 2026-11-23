import type { JobHandler, LeadFollowUpPayload, LeadFollowUpResult } from '../types/jobs.js';
export default class LeadFollowUpJob implements JobHandler<LeadFollowUpPayload, LeadFollowUpResult> {
    readonly type: 'lead.follow-up';
    handle(payload: LeadFollowUpPayload): Promise<LeadFollowUpResult>;
}
