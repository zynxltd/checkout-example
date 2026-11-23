using System.Collections.Concurrent;
using DotnetReactClickCollect.Api.Contracts;
using DotnetReactClickCollect.Api.Models;

namespace DotnetReactClickCollect.Api.Services;

public sealed class InMemoryReservationStore : IReservationStore
{
    private readonly ConcurrentDictionary<Guid, Reservation> _rows = new();

    public IReadOnlyList<Reservation> All() =>
        _rows.Values.OrderByDescending(r => r.CreatedAt).ToList();

    public Reservation? Find(Guid id) =>
        _rows.TryGetValue(id, out var r) ? r : null;

    public Reservation Add(Reservation reservation)
    {
        _rows[reservation.Id] = reservation;
        return reservation;
    }

    public Reservation Replace(Reservation reservation)
    {
        _rows[reservation.Id] = reservation;
        return reservation;
    }
}
