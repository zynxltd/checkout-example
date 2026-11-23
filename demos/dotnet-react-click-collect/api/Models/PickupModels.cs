namespace DotnetReactClickCollect.Api.Models;

public enum ReservationStatus
{
    Booked = 0,
    Ready = 1,
    Collected = 2,
    Cancelled = 3,
}

public sealed record CollectableItem(
    string Sku,
    string Name,
    string Category,
    decimal UnitPrice,
    int Stock);

public sealed record PickupSlot(
    string Id,
    DateOnly Day,
    string WindowLabel,
    TimeOnly StartsAt,
    int Capacity,
    int Booked);

public sealed record ReservationLine(string Sku, string Name, int Qty, decimal UnitPrice);

public sealed record Reservation(
    Guid Id,
    string MemberName,
    string MemberEmail,
    string SlotId,
    string SlotLabel,
    ReservationStatus Status,
    decimal Total,
    IReadOnlyList<ReservationLine> Lines,
    DateTimeOffset CreatedAt,
    DateTimeOffset? ReadyAt,
    DateTimeOffset? CollectedAt,
    DateTimeOffset? CancelledAt,
    IReadOnlyList<ReservationEvent> Events);

public sealed record ReservationEvent(string Kind, string Detail, DateTimeOffset At);

public sealed record CreateReservationRequest(
    string MemberName,
    string MemberEmail,
    string SlotId,
    List<ReservationLineRequest>? Lines);

public sealed record ReservationLineRequest(string Sku, int Qty);

public sealed record MutationResult(bool Ok, string? ErrorCode, string? Message, Reservation? Reservation);
