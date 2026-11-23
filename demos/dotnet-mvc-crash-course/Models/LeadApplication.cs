using System.ComponentModel.DataAnnotations;

namespace DotnetMvcCrashCourse.Models;

/// <summary>
/// Loan lead application — real-world SaaS shape (Power by Excellence–style lead intake).
/// Laravel: App\Models\Lead + status enum / casts.
/// </summary>
public enum LeadStatus
{
    Received = 0,
    Queued = 1,
    Processing = 2,
    Routed = 3,
    Rejected = 4,
}

public class LeadApplication
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string ApplicantName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public decimal LoanAmount { get; set; }
    public string ProductType { get; set; } = "personal"; // personal | secured | guarantor
    public LeadStatus Status { get; set; } = LeadStatus.Received;
    public string? RoutedToLender { get; set; }
    public string? RejectReason { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? ProcessedAt { get; set; }
}

/// <summary>API / form payload — Laravel FormRequest.</summary>
public class LeadApplicationForm
{
    [Required, StringLength(120)]
    public string ApplicantName { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Range(500, 100_000)]
    public decimal LoanAmount { get; set; }

    [Required, StringLength(40)]
    public string ProductType { get; set; } = "personal";
}
