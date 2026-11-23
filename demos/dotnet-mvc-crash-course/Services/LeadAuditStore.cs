using DotnetMvcCrashCourse.Contracts;

namespace DotnetMvcCrashCourse.Services;

/// <summary>MongoDB-shaped append-only audit log (in-memory; swap driver behind same interface).</summary>
public class InMemoryLeadAuditStore : ILeadAuditStore
{
    private readonly List<LeadAuditDocument> _docs = [];
    private readonly object _lock = new();

    public void Append(LeadAuditDocument document)
    {
        lock (_lock)
        {
            _docs.Add(document);
        }
    }

    public IReadOnlyList<LeadAuditDocument> ForLead(Guid leadId)
    {
        lock (_lock)
        {
            return _docs
                .Where(d => d.LeadId == leadId)
                .OrderBy(d => d.At)
                .ToList();
        }
    }
}
