using DotnetSignalrPlantAuction.Contracts;
using DotnetSignalrPlantAuction.Models;
using DotnetSignalrPlantAuction.Options;
using Microsoft.Extensions.Options;

namespace DotnetSignalrPlantAuction.Services;

/// <summary>Application service — hub stays a thin realtime adapter.</summary>
public sealed class AuctionService(
    ILotRepository lots,
    IAuctionClock clock,
    IOptions<AuctionOptions> options) : IAuctionService
{
    private readonly AuctionOptions _options = options.Value;

    public IReadOnlyList<Lot> GetBoard() => lots.All();

    public Lot? GetLot(string lotId) => lots.Find(lotId);

    public BidOutcome PlaceBid(PlaceBidCommand command)
    {
        var soft = TimeSpan.FromSeconds(Math.Max(5, _options.SoftCloseSeconds));
        var extend = TimeSpan.FromSeconds(Math.Max(5, _options.ExtendSeconds));
        return lots.TryApplyBid(command, clock.UtcNow, soft, extend);
    }

    public int CloseExpiredLots() => lots.CloseExpired(clock.UtcNow);
}
