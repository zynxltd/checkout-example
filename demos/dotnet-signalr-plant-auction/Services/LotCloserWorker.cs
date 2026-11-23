using DotnetSignalrPlantAuction.Contracts;
using DotnetSignalrPlantAuction.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace DotnetSignalrPlantAuction.Services;

/// <summary>Closes lots when EndsAt passes and pushes board refresh (SRP: timing, not bidding).</summary>
public sealed class LotCloserWorker(
    IAuctionService auctions,
    IHubContext<AuctionHub> hubs,
    ILogger<LotCloserWorker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("Lot closer started");
        while (!stoppingToken.IsCancellationRequested)
        {
            var closed = auctions.CloseExpiredLots();
            if (closed > 0)
            {
                logger.LogInformation("Closed {Count} lot(s)", closed);
                await hubs.Clients.All.SendAsync("board", auctions.GetBoard(), stoppingToken);
            }

            await Task.Delay(TimeSpan.FromSeconds(2), stoppingToken);
        }
    }
}
