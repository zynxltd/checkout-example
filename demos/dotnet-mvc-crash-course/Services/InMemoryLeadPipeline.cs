using System.Threading.Channels;
using DotnetMvcCrashCourse.Contracts;
using DotnetMvcCrashCourse.Models;

namespace DotnetMvcCrashCourse.Services;

/// <summary>
/// Lead store + in-process queue — Laravel Eloquent + Redis queue stand-in.
/// </summary>
public class InMemoryLeadPipeline : ILeadPipeline
{
    private readonly List<LeadApplication> _leads = [];
    private readonly Channel<Guid> _queue = Channel.CreateUnbounded<Guid>();
    private readonly object _lock = new();

    public LeadApplication Submit(LeadApplicationForm form)
    {
        var lead = new LeadApplication
        {
            ApplicantName = form.ApplicantName.Trim(),
            Email = form.Email.Trim().ToLowerInvariant(),
            LoanAmount = form.LoanAmount,
            ProductType = form.ProductType.Trim().ToLowerInvariant(),
            Status = LeadStatus.Queued,
        };

        lock (_lock)
        {
            _leads.Insert(0, lead);
        }

        _queue.Writer.TryWrite(lead.Id);
        return lead;
    }

    public IReadOnlyList<LeadApplication> All()
    {
        lock (_lock)
        {
            return _leads.ToList();
        }
    }

    public LeadApplication? Find(Guid id)
    {
        lock (_lock)
        {
            return _leads.FirstOrDefault(l => l.Id == id);
        }
    }

    public bool TryDequeue(out Guid leadId) => _queue.Reader.TryRead(out leadId);

    public void MarkProcessing(Guid id) => Update(id, l => l.Status = LeadStatus.Processing);

    public void MarkRouted(Guid id, string lender) => Update(id, l =>
    {
        l.Status = LeadStatus.Routed;
        l.RoutedToLender = lender;
        l.ProcessedAt = DateTimeOffset.UtcNow;
    });

    public void MarkRejected(Guid id, string reason) => Update(id, l =>
    {
        l.Status = LeadStatus.Rejected;
        l.RejectReason = reason;
        l.ProcessedAt = DateTimeOffset.UtcNow;
    });

    public bool TryRequeue(Guid id, out string? error)
    {
        lock (_lock)
        {
            var lead = _leads.FirstOrDefault(l => l.Id == id);
            if (lead is null)
            {
                error = "Lead not found";
                return false;
            }

            if (lead.Status != LeadStatus.Rejected)
            {
                error = "Only rejected leads can be requeued";
                return false;
            }

            lead.Status = LeadStatus.Queued;
            lead.RejectReason = null;
            lead.RoutedToLender = null;
            lead.ProcessedAt = null;
            _queue.Writer.TryWrite(lead.Id);
            error = null;
            return true;
        }
    }

    public int GetQueueDepth() => _queue.Reader.Count;

    public LeadStats GetStats()
    {
        lock (_lock)
        {
            return new LeadStats(
                Total: _leads.Count,
                Queued: _leads.Count(l => l.Status == LeadStatus.Queued),
                Processing: _leads.Count(l => l.Status == LeadStatus.Processing),
                Routed: _leads.Count(l => l.Status == LeadStatus.Routed),
                Rejected: _leads.Count(l => l.Status == LeadStatus.Rejected),
                QueueDepth: _queue.Reader.Count);
        }
    }

    private void Update(Guid id, Action<LeadApplication> mutate)
    {
        lock (_lock)
        {
            var lead = _leads.FirstOrDefault(l => l.Id == id);
            if (lead is null) return;
            mutate(lead);
        }
    }
}
