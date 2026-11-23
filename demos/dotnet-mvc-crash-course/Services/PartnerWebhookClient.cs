using System.Net.Http.Json;
using DotnetMvcCrashCourse.Contracts;
using DotnetMvcCrashCourse.Models;
using Microsoft.Extensions.Options;

namespace DotnetMvcCrashCourse.Services;

public sealed class LeadOptions
{
    public const string SectionName = "Leads";
    public string? PartnerWebhookUrl { get; set; }
    public int HarbourDailyCap { get; set; } = 3;
}

/// <summary>Best-effort partner notify — never crash the worker (Ex 8d).</summary>
public sealed class PartnerWebhookClient : IPartnerWebhook
{
    private readonly HttpClient _http;
    private readonly LeadOptions _options;
    private readonly ILogger<PartnerWebhookClient> _logger;

    public PartnerWebhookClient(HttpClient http, IOptions<LeadOptions> options, ILogger<PartnerWebhookClient> logger)
    {
        _http = http;
        _options = options.Value;
        _logger = logger;
    }

    public async Task NotifyRoutedAsync(LeadApplication lead, CancellationToken ct)
    {
        var url = _options.PartnerWebhookUrl;
        if (string.IsNullOrWhiteSpace(url))
        {
            _logger.LogDebug("No PartnerWebhookUrl configured — skip notify for {LeadId}", lead.Id);
            return;
        }

        try
        {
            using var response = await _http.PostAsJsonAsync(
                url,
                new
                {
                    leadId = lead.Id,
                    status = lead.Status.ToString(),
                    lender = lead.RoutedToLender,
                    amount = lead.LoanAmount,
                },
                ct);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning(
                    "Partner webhook HTTP {Status} for lead {LeadId}",
                    (int)response.StatusCode,
                    lead.Id);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Partner webhook failed for lead {LeadId}", lead.Id);
        }
    }
}
