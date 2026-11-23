using DotnetReactClickCollect.Api.Contracts;
using DotnetReactClickCollect.Api.Models;

namespace DotnetReactClickCollect.Api.Services;

/// <summary>Orchestrates catalogue + slots + policy + store. Endpoints stay thin.</summary>
public sealed class PickupService(
    ICollectableCatalog catalog,
    ISlotBoard slots,
    IPickupPolicy policy,
    IReservationStore store,
    IPickupClock clock,
    ILogger<PickupService> logger) : IPickupService
{
    public IReadOnlyList<CollectableItem> ListCatalogue() => catalog.All();

    public IReadOnlyList<PickupSlot> ListSlots() => slots.Available(clock.UtcNow);

    public IReadOnlyList<Reservation> ListReservations(ReservationStatus? status = null, string? email = null)
    {
        IEnumerable<Reservation> q = store.All();
        if (status is not null)
            q = q.Where(r => r.Status == status);
        if (!string.IsNullOrWhiteSpace(email))
            q = q.Where(r => string.Equals(r.MemberEmail, email.Trim(), StringComparison.OrdinalIgnoreCase));
        return q.ToList();
    }

    public Reservation? Get(Guid id) => store.Find(id);

    public MutationResult Create(CreateReservationRequest request)
    {
        var rawLines = (request.Lines ?? [])
            .Where(l => !string.IsNullOrWhiteSpace(l.Sku) && l.Qty > 0)
            .Select(l => new ReservationLineRequest(l.Sku.Trim().ToUpperInvariant(), l.Qty))
            .GroupBy(l => l.Sku, StringComparer.OrdinalIgnoreCase)
            .Select(g => new ReservationLineRequest(g.Key, g.Sum(x => x.Qty)))
            .ToList();

        var validation = policy.ValidateCreate(
            request.MemberName?.Trim() ?? "",
            request.MemberEmail?.Trim() ?? "",
            rawLines);
        if (validation is not null)
            return Fail("validation", validation);

        var reserved = new List<ReservationLine>();
        foreach (var line in rawLines)
        {
            var item = catalog.Find(line.Sku)!;
            if (!catalog.TryReserve(line.Sku, line.Qty, out var stockError))
            {
                RollbackStock(reserved);
                return Fail("stock", stockError!);
            }

            reserved.Add(new ReservationLine(item.Sku, item.Name, line.Qty, item.UnitPrice));
        }

        if (!slots.TryBook(request.SlotId, out var slotError))
        {
            RollbackStock(reserved);
            return Fail("slot", slotError!);
        }

        var slot = slots.Find(request.SlotId)!;
        var now = clock.UtcNow;
        var reservation = new Reservation(
            Guid.NewGuid(),
            request.MemberName!.Trim(),
            request.MemberEmail!.Trim().ToLowerInvariant(),
            slot.Id,
            $"{slot.Day:ddd d MMM} · {slot.WindowLabel}",
            ReservationStatus.Booked,
            decimal.Round(reserved.Sum(l => l.Qty * l.UnitPrice), 2),
            reserved,
            now,
            null,
            null,
            null,
            [new ReservationEvent("booked", "Click & collect reserved", now)]);

        store.Add(reservation);
        logger.LogInformation("Reserved {Id} for {Email} slot {Slot}", reservation.Id, reservation.MemberEmail, slot.Id);
        return Ok(reservation);
    }

    public MutationResult Cancel(Guid id)
    {
        var existing = store.Find(id);
        if (existing is null) return Fail("not_found", "Reservation not found");

        var block = policy.CanCancel(existing, clock.UtcNow);
        if (block is not null) return Fail("conflict", block, existing);

        foreach (var line in existing.Lines)
            catalog.Release(line.Sku, line.Qty);
        slots.Release(existing.SlotId);

        var now = clock.UtcNow;
        var cancelled = WithEvent(
            existing with { Status = ReservationStatus.Cancelled, CancelledAt = now },
            "cancelled",
            "Cancelled by member/desk",
            now);

        store.Replace(cancelled);
        return Ok(cancelled);
    }

    public MutationResult MarkReady(Guid id)
    {
        var existing = store.Find(id);
        if (existing is null) return Fail("not_found", "Reservation not found");

        var block = policy.CanMarkReady(existing);
        if (block is not null) return Fail("conflict", block, existing);

        var now = clock.UtcNow;
        var ready = WithEvent(
            existing with { Status = ReservationStatus.Ready, ReadyAt = now },
            "ready",
            "Order staged at collection desk",
            now);

        store.Replace(ready);
        return Ok(ready);
    }

    public MutationResult Collect(Guid id)
    {
        var existing = store.Find(id);
        if (existing is null) return Fail("not_found", "Reservation not found");

        var block = policy.CanCollect(existing);
        if (block is not null) return Fail("conflict", block, existing);

        var now = clock.UtcNow;
        var collected = WithEvent(
            existing with { Status = ReservationStatus.Collected, CollectedAt = now },
            "collected",
            "Handed to member",
            now);

        store.Replace(collected);
        return Ok(collected);
    }

    private void RollbackStock(IEnumerable<ReservationLine> reserved)
    {
        foreach (var line in reserved)
            catalog.Release(line.Sku, line.Qty);
    }

    private static Reservation WithEvent(Reservation reservation, string kind, string detail, DateTimeOffset at)
    {
        var events = reservation.Events.ToList();
        events.Add(new ReservationEvent(kind, detail, at));
        return reservation with { Events = events };
    }

    private static MutationResult Ok(Reservation reservation) =>
        new(true, null, null, reservation);

    private static MutationResult Fail(string code, string message, Reservation? reservation = null) =>
        new(false, code, message, reservation);
}
