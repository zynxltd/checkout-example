using System.Collections.Concurrent;
using DotnetMinimalOrderDesk.Contracts;
using DotnetMinimalOrderDesk.Models;

namespace DotnetMinimalOrderDesk.Services;

public sealed class InMemoryOrderStore : IOrderStore
{
    private readonly ConcurrentDictionary<Guid, GardenOrder> _orders = new();

    public int OpenCount => _orders.Values.Count(o => o.Status == OrderStatus.Open);

    public IReadOnlyList<GardenOrder> All() =>
        _orders.Values.OrderByDescending(o => o.CreatedAt).ToList();

    public GardenOrder? Find(Guid id) =>
        _orders.TryGetValue(id, out var o) ? o : null;

    public GardenOrder Add(GardenOrder order)
    {
        _orders[order.Id] = order;
        return order;
    }

    public GardenOrder Replace(GardenOrder order)
    {
        _orders[order.Id] = order;
        return order;
    }
}
