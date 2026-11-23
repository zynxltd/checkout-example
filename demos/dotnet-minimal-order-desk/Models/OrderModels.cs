namespace DotnetMinimalOrderDesk.Models;

public enum OrderStatus
{
    Open = 0,
    Packed = 1,
    Shipped = 2,
    Cancelled = 3,
}

public sealed record OrderLine(string Sku, int Qty, decimal UnitPrice);

public sealed record CreateOrderRequest(string Customer, List<OrderLine>? Lines, string? Notes);

public sealed record GardenOrder(
    Guid Id,
    string Customer,
    OrderStatus Status,
    decimal Total,
    IReadOnlyList<OrderLine> Lines,
    string? Notes,
    DateTimeOffset CreatedAt,
    DateTimeOffset? PackedAt,
    DateTimeOffset? ShippedAt,
    DateTimeOffset? CancelledAt,
    IReadOnlyList<OrderEvent> Events);

public sealed record OrderEvent(string Kind, string Detail, DateTimeOffset At);

public sealed record SkuDefinition(string Sku, string Name, decimal ListPrice, int Stock);

public sealed record OrderMutationResult(bool Ok, string? ErrorCode, string? Message, GardenOrder? Order);
