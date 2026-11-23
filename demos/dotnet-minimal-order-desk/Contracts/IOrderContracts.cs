using DotnetMinimalOrderDesk.Models;

namespace DotnetMinimalOrderDesk.Contracts;

public interface IOrderClock
{
    DateTimeOffset UtcNow { get; }
}

public interface ISkuCatalog
{
    SkuDefinition? Find(string sku);
    IReadOnlyList<SkuDefinition> All();
    bool TryReserve(string sku, int qty, out string? error);
    void Release(string sku, int qty);
}

public interface IOrderPolicy
{
    string? ValidateCreate(string customer, IReadOnlyList<OrderLine> lines);
    string? CanCancel(GardenOrder order, DateTimeOffset now);
    string? CanPack(GardenOrder order);
    string? CanShip(GardenOrder order);
}

public interface IOrderStore
{
    int OpenCount { get; }
    IReadOnlyList<GardenOrder> All();
    GardenOrder? Find(Guid id);
    GardenOrder Add(GardenOrder order);
    GardenOrder Replace(GardenOrder order);
}

public interface IOrderService
{
    IReadOnlyList<GardenOrder> List(OrderStatus? status = null);
    GardenOrder? Get(Guid id);
    OrderMutationResult Create(CreateOrderRequest request);
    OrderMutationResult Cancel(Guid id);
    OrderMutationResult Pack(Guid id);
    OrderMutationResult Ship(Guid id, string? tracking);
    int OpenCount { get; }
}

public interface IApiKeyValidator
{
    bool IsValid(string? presented);
}
