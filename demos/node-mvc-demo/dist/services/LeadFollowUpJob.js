export default class LeadFollowUpJob {
    type = 'lead.follow-up';
    async handle(payload) {
        return {
            sentTo: payload.email,
            subject: `Harbor follow-up for ${payload.name}`,
            queuedBecause: payload.reason,
        };
    }
}
