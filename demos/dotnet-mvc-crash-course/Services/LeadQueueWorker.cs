using DotnetMvcCrashCourse.Contracts;
using DotnetMvcCrashCourse.Models;
using Microsoft.Extensions.Options;

namespace DotnetMvcCrashCourse.Services;

/// <summary>
/// Background worker — Laravel <c>queue:work</c>.
/// Locals tip (Ex 10a): when stepping ProcessAsync, watch <c>lead</c>, <c>decision</c>, <c>harbourCount</c>.
/// </summary>
public class LeadQueueWorker : BackgroundService
{
    private readonly ILeadPipeline _pipeline;
    private readonly ILeadRouter _router;
    private readonly ILeadAuditStore _audit;
    private readonly IPartnerWebhook _webhook;
    private readonly LeadOptions _options;
    private readonly ILogger<LeadQueueWorker> _logger;

    public LeadQueueWorker(
        ILeadPipeline pipeline,
        ILeadRouter router,
        ILeadAuditStore audit,
        IPartnerWebhook webhook,
        IOptions<LeadOptions> options,
        ILogger<LeadQueueWorker> logger)
    {
        _pipeline = pipeline;
        _router = router;
        _audit = audit;
        _webhook = webhook;
        _options = options.Value;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Lead queue worker started (Laravel queue:work equivalent)");

        while (!stoppingToken.IsCancellationRequested)
        {
            if (_pipeline.TryDequeue(out var leadId))
            {
                await ProcessAsync(leadId, stoppingToken);
            }
            else
            {
                await Task.Delay(250, stoppingToken);
            }
        }
    }

    private async Task ProcessAsync(Guid leadId, CancellationToken ct)
    {
        var lead = _pipeline.Find(leadId);
        if (lead is null)
        {
            _logger.LogWarning("Lead {LeadId} missing from store", leadId);
            return;
        }

        _pipeline.MarkProcessing(leadId);
        _logger.LogInformation("Processing lead {LeadId} amount={Amount}", leadId, lead.LoanAmount);

        await Task.Delay(400, ct);

        // Re-read after processing delay (status may matter for audits)
        lead = _pipeline.Find(leadId) ?? lead;

        var harbourCount = _pipeline.All()
            .Count(l => l.Status == LeadStatus.Routed
                        && string.Equals(l.RoutedToLender, DefaultLeadRouter.HarbourLender, StringComparison.Ordinal));

        var context = new LeadRoutingContext(harbourCount, _options.HarbourDailyCap);
        var decision = _router.Route(lead, context);

        if (!decision.Accepted)
        {
            _pipeline.MarkRejected(leadId, decision.RejectReason ?? "Rejected");
            _audit.Append(new LeadAuditDocument(leadId, DateTimeOffset.UtcNow, LeadStatus.Rejected, decision.RejectReason ?? "Rejected"));
            _logger.LogInformation("Rejected lead {LeadId}: {Reason}", leadId, decision.RejectReason);
            return;
        }

        _pipeline.MarkRouted(leadId, decision.Lender!);
        _audit.Append(new LeadAuditDocument(leadId, DateTimeOffset.UtcNow, LeadStatus.Routed, $"Routed to {decision.Lender}"));
        _logger.LogInformation("Routed lead {LeadId} → {Lender}", leadId, decision.Lender);

        var routed = _pipeline.Find(leadId);
        if (routed is not null)
        {
            await _webhook.NotifyRoutedAsync(routed, ct);
        }
    }
}
