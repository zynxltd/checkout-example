using DotnetMvcCrashCourse.Contracts;
using DotnetMvcCrashCourse.Models;

namespace DotnetMvcCrashCourse.Services;

/// <summary>
/// Richer ping-tree style routing (Ex 8a).
/// Guarantor min £2k; personal ≥ £25k → Prime Line; Harbour cap → Overflow Panel.
/// </summary>
public sealed class DefaultLeadRouter : ILeadRouter
{
    public const string HarbourLender = "Harbour Quick Cash";
    public const string OverflowLender = "Overflow Panel";
    public const string PrimeLine = "Prime Line";
    public const string Summit = "Summit Personal Loans";
    public const string OakSecured = "OakSecured Finance";
    public const string BridgeGuarantor = "Bridge Guarantor Co";

    public LeadRouteDecision Route(LeadApplication lead, LeadRoutingContext context)
    {
        if (lead.LoanAmount < 1000m)
        {
            return new LeadRouteDecision(false, null, "Below minimum loan amount");
        }

        var type = lead.ProductType.Trim().ToLowerInvariant();

        if (type == "guarantor" && lead.LoanAmount < 2000m)
        {
            return new LeadRouteDecision(false, null, "Guarantor loans require at least £2000");
        }

        string lender = type switch
        {
            "secured" => OakSecured,
            "guarantor" => BridgeGuarantor,
            _ when lead.LoanAmount >= 25_000m => PrimeLine,
            _ when lead.LoanAmount >= 15_000m => Summit,
            _ => HarbourLender,
        };

        if (lender == HarbourLender && context.HarbourRoutedCount >= context.HarbourCap)
        {
            lender = OverflowLender;
        }

        return new LeadRouteDecision(true, lender, null);
    }
}
