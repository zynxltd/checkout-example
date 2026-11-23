using DotnetSignalrPlantAuction.Contracts;
using DotnetSignalrPlantAuction.Models;
using DotnetSignalrPlantAuction.Options;
using Microsoft.Extensions.Options;

namespace DotnetSignalrPlantAuction.Services;

/// <summary>Bid rules only — Open/Closed: swap for VIP policy without touching the board.</summary>
public sealed class DefaultBidPolicy(IOptions<AuctionOptions> options) : IBidPolicy
{
    private readonly AuctionOptions _options = options.Value;

    public string? Validate(PlaceBidCommand command, Lot lot, DateTimeOffset now)
    {
        if (string.IsNullOrWhiteSpace(command.Bidder))
            return "Bidder name required";

        if (command.Amount <= 0)
            return "Bid must be positive";

        if (lot.Status is LotStatus.Sold or LotStatus.Unsold)
            return "Lot is closed";

        if (now >= lot.EndsAt)
            return "Lot has ended";

        if (command.Amount < lot.Reserve)
            return $"Below reserve £{lot.Reserve:0.00}";

        var floor = lot.HighBid <= 0
            ? lot.Reserve
            : lot.HighBid + Math.Max(lot.MinIncrement, _options.DefaultMinIncrement);

        if (command.Amount < floor)
            return $"Must bid at least £{floor:0.00}";

        if (string.Equals(lot.HighBidder, command.Bidder.Trim(), StringComparison.OrdinalIgnoreCase))
            return "You already hold the high bid";

        return null;
    }
}
