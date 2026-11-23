using DotnetReactClickCollect.Api.Models;

namespace DotnetReactClickCollect.Api.Contracts;

public interface IPickupClock
{
    DateTimeOffset UtcNow { get; }
}

public interface ICollectableCatalog
{
    IReadOnlyList<CollectableItem> All();
    CollectableItem? Find(string sku);
    bool TryReserve(string sku, int qty, out string? error);
    void Release(string sku, int qty);
}

public interface ISlotBoard
{
    IReadOnlyList<PickupSlot> Available(DateTimeOffset now);
    PickupSlot? Find(string slotId);
    bool TryBook(string slotId, out string? error);
    void Release(string slotId);
}

public interface IPickupPolicy
{
    string? ValidateCreate(string memberName, string memberEmail, IReadOnlyList<ReservationLineRequest> lines);
    string? CanCancel(Reservation reservation, DateTimeOffset now);
    string? CanMarkReady(Reservation reservation);
    string? CanCollect(Reservation reservation);
}

public interface IReservationStore
{
    IReadOnlyList<Reservation> All();
    Reservation? Find(Guid id);
    Reservation Add(Reservation reservation);
    Reservation Replace(Reservation reservation);
}

public interface IPickupService
{
    IReadOnlyList<CollectableItem> ListCatalogue();
    IReadOnlyList<PickupSlot> ListSlots();
    IReadOnlyList<Reservation> ListReservations(ReservationStatus? status = null, string? email = null);
    Reservation? Get(Guid id);
    MutationResult Create(CreateReservationRequest request);
    MutationResult Cancel(Guid id);
    MutationResult MarkReady(Guid id);
    MutationResult Collect(Guid id);
}
