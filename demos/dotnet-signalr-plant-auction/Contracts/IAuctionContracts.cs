using DotnetSignalrPlantAuction.Models;

namespace DotnetSignalrPlantAuction.Contracts;

public interface IAuctionClock
{
    DateTimeOffset UtcNow { get; }
}

public interface IBidPolicy
{
    string? Validate(PlaceBidCommand command, Lot lot, DateTimeOffset now);
}

public interface ILotRepository
{
    IReadOnlyList<Lot> All();
    Lot? Find(string lotId);
    BidOutcome TryApplyBid(PlaceBidCommand command, DateTimeOffset now, TimeSpan softCloseWindow, TimeSpan extendBy);
    int CloseExpired(DateTimeOffset now);
}

public interface IAuctionService
{
    IReadOnlyList<Lot> GetBoard();
    Lot? GetLot(string lotId);
    BidOutcome PlaceBid(PlaceBidCommand command);
    int CloseExpiredLots();
}
