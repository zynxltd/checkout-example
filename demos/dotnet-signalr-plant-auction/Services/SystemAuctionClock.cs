using DotnetSignalrPlantAuction.Contracts;

namespace DotnetSignalrPlantAuction.Services;

public sealed class SystemAuctionClock : IAuctionClock
{
    public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
}
