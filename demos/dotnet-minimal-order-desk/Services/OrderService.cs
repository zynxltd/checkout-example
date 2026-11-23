using DotnetMinimalOrderDesk.Contracts;
using DotnetMinimalOrderDesk.Models;

namespace DotnetMinimalOrderDesk.Services;

/// <summary>Orchestrates catalog + policy + store. Endpoints stay thin HTTP adapters.</summary>
public sealed class OrderService(
    IOrderStore store,
    IOrderPolicy policy,
    ISkuCatalog catalog,
    IOrderClock clock,
    ILogger<OrderService> logger) : IOrderService
{
    public int OpenCount => store.OpenCount;

    public IReadOnlyList<GardenOrder> List(OrderStatus? status = null)
    {
        var all = store.All();
        return status is null ? all : all.Where(o => o.Status == status).ToList();
    }

    public GardenOrder? Get(Guid id) => store.Find(id);

    public OrderMutationResult Create(CreateOrderRequest request)
    {
        var lines = (request.Lines ?? [])
            .Where(l => !string.IsNullOrWhiteSpace(l.Sku))
            .Select(l => new OrderLine(l.Sku.Trim().ToUpperInvariant(), l.Qty, l.UnitPrice))
            .GroupBy(l => l.Sku, StringComparer.OrdinalIgnoreCase)
            .Select(g => new OrderLine(g.Key, g.Sum(x => x.Qty), g.First().UnitPrice))
            .ToList();

        var validation = policy.ValidateCreate(request.Customer?.Trim() ?? "", lines);
        if (validation is not null)
            return Fail("validation", validation);

        var reserved = new List<OrderLine>();
        foreach (var line in lines)
        {
            if (!catalog.TryReserve(line.Sku, line.Qty, out var stockError))
            {
                foreach (var r in reserved)
                    catalog.Release(r.Sku, r.Qty);
                return Fail("stock", stockError!);
            }

            reserved.Add(line);
        }

        var now = clock.UtcNow;
        var order = new GardenOrder(
            Guid.NewGuid(),
            request.Customer!.Trim(),
            OrderStatus.Open,
            decimal.Round(lines.Sum(l => l.Qty * l.UnitPrice), 2),
            lines,
            string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            now,
            null,
            null,
            null,
            [new OrderEvent("created", "Order accepted", now)]);

        store.Add(order);
        logger.LogInformation("Created order {Id} total {Total}", order.Id, order.Total);
        return new OrderMutationResult(true, null, null, order);
    }

    public OrderMutationResult Cancel(Guid id)
    {
        var existing = store.Find(id);
        if (existing is null) return Fail("not_found", "Order not found");

        var block = policy.CanCancel(existing, clock.UtcNow);
        if (block is not null) return Fail("conflict", block, existing);

        foreach (var line in existing.Lines)
            catalog.Release(line.Sku, line.Qty);

        var now = clock.UtcNow;
        var cancelled = WithEvent(
            existing with { Status = OrderStatus.Cancelled, CancelledAt = now },
            "cancelled",
            "Cancelled by desk",
            now);

        store.Replace(cancelled);
        return Ok(cancelled);
    }

    public OrderMutationResult Pack(Guid id)
    {
        var existing = store.Find(id);
        if (existing is null) return Fail("not_found", "Order not found");

        var block = policy.CanPack(existing);
        if (block is not null) return Fail("conflict", block, existing);

        var now = clock.UtcNow;
        var packed = WithEvent(
            existing with { Status = OrderStatus.Packed, PackedAt = now },
            "packed",
            "Moved to packed",
            now);

        store.Replace(packed);
        return Ok(packed);
    }

    public OrderMutationResult Ship(Guid id, string? tracking)
    {
        var existing = store.Find(id);
        if (existing is null) return Fail("not_found", "Order not found");

        var block = policy.CanShip(existing);
        if (block is not null) return Fail("conflict", block, existing);

        var now = clock.UtcNow;
        var detail = string.IsNullOrWhiteSpace(tracking)
            ? "Shipped"
            : $"Shipped tracking={tracking.Trim()}";

        var shipped = WithEvent(
            existing with { Status = OrderStatus.Shipped, ShippedAt = now },
            "shipped",
            detail,
            now);

        store.Replace(shipped);
        return Ok(shipped);
    }

    private static GardenOrder WithEvent(GardenOrder order, string kind, string detail, DateTimeOffset at)
    {
        var events = order.Events.ToList();
        events.Add(new OrderEvent(kind, detail, at));
        return order with { Events = events };
    }

    private static OrderMutationResult Ok(GardenOrder order) =>
        new(true, null, null, order);

    private static OrderMutationResult Fail(string code, string message, GardenOrder? order = null) =>
        new(false, code, message, order);
}
