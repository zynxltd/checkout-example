using DotnetMvcCrashCourse.Models;

namespace DotnetMvcCrashCourse.Contracts;

public sealed record LeadRouteDecision(bool Accepted, string? Lender, string? RejectReason);

public sealed record LeadRoutingContext(int HarbourRoutedCount, int HarbourCap = 3);

/// <summary>Strategy for lender selection — Open/Closed: new rules → new router impl.</summary>
public interface ILeadRouter
{
    LeadRouteDecision Route(LeadApplication lead, LeadRoutingContext context);
}

public interface ILeadPipeline
{
    LeadApplication Submit(LeadApplicationForm form);
    IReadOnlyList<LeadApplication> All();
    LeadApplication? Find(Guid id);
    bool TryDequeue(out Guid leadId);
    void MarkProcessing(Guid id);
    void MarkRouted(Guid id, string lender);
    void MarkRejected(Guid id, string reason);
    bool TryRequeue(Guid id, out string? error);
    int GetQueueDepth();
    LeadStats GetStats();
}

public sealed record LeadStats(
    int Total,
    int Queued,
    int Processing,
    int Routed,
    int Rejected,
    int QueueDepth);

public interface ILeadAuditStore
{
    void Append(LeadAuditDocument document);
    IReadOnlyList<LeadAuditDocument> ForLead(Guid leadId);
}

public record LeadAuditDocument(Guid LeadId, DateTimeOffset At, LeadStatus Status, string Note);

public interface IPartnerWebhook
{
    Task NotifyRoutedAsync(LeadApplication lead, CancellationToken ct);
}
