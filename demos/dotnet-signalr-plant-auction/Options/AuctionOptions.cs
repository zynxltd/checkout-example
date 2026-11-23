namespace DotnetSignalrPlantAuction.Options;

public sealed class AuctionOptions
{
    public const string SectionName = "Auction";

    /// <summary>When a bid arrives inside this window before EndsAt, extend the lot.</summary>
    public int SoftCloseSeconds { get; set; } = 45;

    /// <summary>How far to push EndsAt on a soft-close bid.</summary>
    public int ExtendSeconds { get; set; } = 30;

    public decimal DefaultMinIncrement { get; set; } = 1.00m;
}
