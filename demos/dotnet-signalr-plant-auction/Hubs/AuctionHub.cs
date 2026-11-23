using DotnetSignalrPlantAuction.Contracts;
using DotnetSignalrPlantAuction.Models;
using Microsoft.AspNetCore.SignalR;

namespace DotnetSignalrPlantAuction.Hubs;

/// <summary>Realtime adapter only — business rules live in IAuctionService / IBidPolicy.</summary>
public sealed class AuctionHub(IAuctionService auctions, ILogger<AuctionHub> logger) : Hub
{
    public Task JoinBoard() =>
        Clients.Caller.SendAsync("board", auctions.GetBoard());

    public async Task PlaceBid(string lotId, string bidder, decimal amount)
    {
        var outcome = auctions.PlaceBid(new PlaceBidCommand(lotId, bidder, amount));
        if (!outcome.Accepted)
        {
            await Clients.Caller.SendAsync("bidRejected", new { lotId, error = outcome.Error });
            return;
        }

        logger.LogInformation(
            "Bid £{Amount} on {Lot} by {Bidder} extended={Extended}",
            amount, lotId, bidder, outcome.Extended);

        await Clients.All.SendAsync("lotUpdated", outcome.Lot);
        if (outcome.Extended)
            await Clients.All.SendAsync("lotExtended", new { lotId, endsAt = outcome.Lot!.EndsAt });
    }
}
