using DotnetMinimalOrderDesk.Contracts;
using DotnetMinimalOrderDesk.Models;
using DotnetMinimalOrderDesk.Options;
using Microsoft.Extensions.Options;

namespace DotnetMinimalOrderDesk.Services;

/// <summary>Order rules only — Open/Closed: swap for VIP policy without touching the store.</summary>
public sealed class DefaultOrderPolicy(IOptions<OrderDeskOptions> options, ISkuCatalog catalog) : IOrderPolicy
{
    private readonly OrderDeskOptions _options = options.Value;

    public string? ValidateCreate(string customer, IReadOnlyList<OrderLine> lines)
    {
        if (string.IsNullOrWhiteSpace(customer))
            return "Customer is required";

        if (lines.Count == 0)
            return "At least one line is required";

        if (lines.Count > _options.MaxLinesPerOrder)
            return $"Max {_options.MaxLinesPerOrder} lines per order";

        foreach (var line in lines)
        {
            if (line.Qty <= 0)
                return $"Qty must be positive for {line.Sku}";
            if (line.UnitPrice < 0)
                return $"Unit price cannot be negative for {line.Sku}";

            var sku = catalog.Find(line.Sku);
            if (sku is null)
                return $"Unknown SKU {line.Sku}";

            // Soft guard: client price should be near list (±15%)
            var delta = Math.Abs(line.UnitPrice - sku.ListPrice);
            if (delta > sku.ListPrice * 0.15m && delta > 1m)
                return $"Unit price for {line.Sku} looks wrong (list £{sku.ListPrice:0.00})";
        }

        var total = lines.Sum(l => l.Qty * l.UnitPrice);
        if (total > _options.MaxOrderTotal)
            return $"Order total exceeds £{_options.MaxOrderTotal:0.00}";

        return null;
    }

    public string? CanCancel(GardenOrder order, DateTimeOffset now)
    {
        if (order.Status != OrderStatus.Open)
            return "Only open orders can be cancelled";

        var window = TimeSpan.FromMinutes(Math.Max(1, _options.CancelWindowMinutes));
        if (now - order.CreatedAt > window)
            return $"Cancel window ({_options.CancelWindowMinutes}m) has passed";

        return null;
    }

    public string? CanPack(GardenOrder order) =>
        order.Status == OrderStatus.Open ? null : "Only open orders can be packed";

    public string? CanShip(GardenOrder order) =>
        order.Status == OrderStatus.Packed ? null : "Only packed orders can be shipped";
}
