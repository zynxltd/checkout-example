using System.Collections.Concurrent;
using DotnetSignalrPlantAuction.Contracts;
using DotnetSignalrPlantAuction.Models;

namespace DotnetSignalrPlantAuction.Services;

public sealed class InMemoryLotRepository : ILotRepository
{
    private readonly ConcurrentDictionary<string, LotEntity> _lots = new(StringComparer.OrdinalIgnoreCase);
    private readonly IBidPolicy _policy;
    private readonly object _gate = new();

    public InMemoryLotRepository(IBidPolicy policy, IEnumerable<LotSeed> seeds)
    {
        _policy = policy;
        foreach (var seed in seeds)
            _lots[seed.Id] = LotEntity.FromSeed(seed);
    }

    public IReadOnlyList<Lot> All() =>
        _lots.Values.Select(l => l.ToLot()).OrderBy(l => l.Id).ToList();

    public Lot? Find(string lotId) =>
        _lots.TryGetValue(lotId, out var entity) ? entity.ToLot() : null;

    public BidOutcome TryApplyBid(PlaceBidCommand command, DateTimeOffset now, TimeSpan softCloseWindow, TimeSpan extendBy)
    {
        if (!_lots.TryGetValue(command.LotId, out var entity))
            return new BidOutcome(false, "Unknown lot", null, false);

        lock (_gate)
        {
            entity.RefreshStatus(now);
            var lot = entity.ToLot();
            var error = _policy.Validate(command with { Bidder = command.Bidder.Trim() }, lot, now);
            if (error is not null)
                return new BidOutcome(false, error, lot, false);

            var extended = entity.EndsAt - now <= softCloseWindow;
            if (extended)
                entity.Extend(extendBy);

            entity.ApplyBid(command.Bidder.Trim(), command.Amount, now);
            entity.RefreshStatus(now);
            return new BidOutcome(true, null, entity.ToLot(), extended);
        }
    }

    public int CloseExpired(DateTimeOffset now)
    {
        var closed = 0;
        lock (_gate)
        {
            foreach (var entity in _lots.Values)
            {
                if (entity.TryClose(now))
                    closed++;
            }
        }

        return closed;
    }

    private sealed class LotEntity
    {
        private readonly List<Bid> _bids = [];

        public required string Id { get; init; }
        public required string Name { get; init; }
        public required decimal Reserve { get; init; }
        public required decimal MinIncrement { get; init; }
        public decimal HighBid { get; private set; }
        public string? HighBidder { get; private set; }
        public LotStatus Status { get; private set; } = LotStatus.Open;
        public DateTimeOffset EndsAt { get; private set; }

        public static LotEntity FromSeed(LotSeed seed) => new()
        {
            Id = seed.Id,
            Name = seed.Name,
            Reserve = seed.Reserve,
            MinIncrement = seed.MinIncrement,
            EndsAt = seed.EndsAt,
        };

        public void ApplyBid(string bidder, decimal amount, DateTimeOffset at)
        {
            HighBid = amount;
            HighBidder = bidder;
            _bids.Insert(0, new Bid(bidder, amount, at));
            if (_bids.Count > 12) _bids.RemoveAt(_bids.Count - 1);
        }

        public void Extend(TimeSpan by) => EndsAt = EndsAt.Add(by);

        public void RefreshStatus(DateTimeOffset now)
        {
            if (Status is LotStatus.Sold or LotStatus.Unsold) return;
            Status = EndsAt - now <= TimeSpan.FromSeconds(60) ? LotStatus.ClosingSoon : LotStatus.Open;
        }

        public bool TryClose(DateTimeOffset now)
        {
            if (Status is LotStatus.Sold or LotStatus.Unsold) return false;
            if (now < EndsAt) return false;
            Status = HighBid >= Reserve && HighBidder is not null ? LotStatus.Sold : LotStatus.Unsold;
            return true;
        }

        public Lot ToLot() => new(
            Id, Name, Reserve, MinIncrement, HighBid, HighBidder, Status, EndsAt, _bids.ToList());
    }
}

public sealed record LotSeed(string Id, string Name, decimal Reserve, decimal MinIncrement, DateTimeOffset EndsAt);

public static class AuctionCatalog
{
    public static IReadOnlyList<LotSeed> DefaultSeeds(DateTimeOffset now) =>
    [
        new("LOT-ROSE", "Climbing Rose — 3L pot", 18m, 1m, now.AddMinutes(8)),
        new("LOT-HERB", "Herb Starter Mixed Tray", 9m, 0.5m, now.AddMinutes(6)),
        new("LOT-TREE", "Olive Tree — patio standard", 45m, 2m, now.AddMinutes(12)),
        new("LOT-FEED", "Premium Bird Feeder Kit", 12m, 1m, now.AddMinutes(5)),
    ];
}
