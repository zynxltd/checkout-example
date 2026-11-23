namespace GreenShelf.Pricing;

/// <summary>One catalogue line for club pricing.</summary>
public sealed record QuoteLine(string Sku, string Category, decimal UnitPrice, int Qty);

/// <summary>Result of applying club rates to a basket.</summary>
public sealed record ClubQuote(
    decimal GuestSubtotal,
    decimal MemberSubtotal,
    decimal ClubSaving,
    bool PaysForItself,
    IReadOnlyList<PricedLine> Lines);

public sealed record PricedLine(
    string Sku,
    string Category,
    decimal UnitPrice,
    int Qty,
    decimal LineTotal,
    decimal MemberLineTotal,
    decimal Saving);

/// <summary>
/// Club member discount engine — extracted so MVC / API / console can share one NuGet.
/// Laravel cousin: a Composer package with a PricingService class.
/// </summary>
public static class ClubPricing
{
    public const decimal ClubAnnualFee = 10m;
    public const decimal PlantRate = 0.15m;
    public const decimal MachineryRate = 0.075m;

    public static ClubQuote Quote(IEnumerable<QuoteLine> lines)
    {
        ArgumentNullException.ThrowIfNull(lines);

        decimal guest = 0m;
        decimal member = 0m;
        var priced = new List<PricedLine>();

        foreach (var line in lines)
        {
            if (line.Qty < 0) throw new ArgumentOutOfRangeException(nameof(lines), "Qty cannot be negative.");
            if (line.UnitPrice < 0) throw new ArgumentOutOfRangeException(nameof(lines), "Price cannot be negative.");

            var rate = string.Equals(line.Category, "machinery", StringComparison.OrdinalIgnoreCase)
                ? MachineryRate
                : PlantRate;

            var lineTotal = decimal.Round(line.UnitPrice * line.Qty, 2);
            var memberLine = decimal.Round(lineTotal * (1 - rate), 2);
            var saving = lineTotal - memberLine;

            guest += lineTotal;
            member += memberLine;
            priced.Add(new PricedLine(
                line.Sku,
                line.Category,
                line.UnitPrice,
                line.Qty,
                lineTotal,
                memberLine,
                saving));
        }

        guest = decimal.Round(guest, 2);
        member = decimal.Round(member, 2);
        var clubSaving = guest - member;

        return new ClubQuote(
            GuestSubtotal: guest,
            MemberSubtotal: member,
            ClubSaving: clubSaving,
            PaysForItself: clubSaving >= ClubAnnualFee,
            Lines: priced);
    }
}
