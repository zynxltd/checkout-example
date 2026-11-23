namespace DotnetSignalrPlantAuction.Models;

public enum LotStatus
{
    Open = 0,
    ClosingSoon = 1,
    Sold = 2,
    Unsold = 3,
}

public sealed record Bid(string Bidder, decimal Amount, DateTimeOffset At);

public sealed record Lot(
    string Id,
    string Name,
    decimal Reserve,
    decimal MinIncrement,
    decimal HighBid,
    string? HighBidder,
    LotStatus Status,
    DateTimeOffset EndsAt,
    IReadOnlyList<Bid> Recent);

public sealed record PlaceBidCommand(string LotId, string Bidder, decimal Amount);

public sealed record BidOutcome(bool Accepted, string? Error, Lot? Lot, bool Extended);
