using System.Collections.Concurrent;
using DotnetMinimalOrderDesk.Contracts;
using DotnetMinimalOrderDesk.Models;

namespace DotnetMinimalOrderDesk.Services;

public sealed class InMemorySkuCatalog : ISkuCatalog
{
    private readonly ConcurrentDictionary<string, StockedSku> _skus;

    public InMemorySkuCatalog()
    {
        _skus = new ConcurrentDictionary<string, StockedSku>(StringComparer.OrdinalIgnoreCase);
        foreach (var seed in Seeds())
            _skus[seed.Sku] = seed;
    }

    public IReadOnlyList<SkuDefinition> All() =>
        _skus.Values.Select(s => s.ToDefinition()).OrderBy(s => s.Sku).ToList();

    public SkuDefinition? Find(string sku) =>
        _skus.TryGetValue(sku, out var s) ? s.ToDefinition() : null;

    public bool TryReserve(string sku, int qty, out string? error)
    {
        error = null;
        if (!_skus.TryGetValue(sku, out var item))
        {
            error = $"Unknown SKU {sku}";
            return false;
        }

        lock (item.Gate)
        {
            if (item.Stock < qty)
            {
                error = $"Insufficient stock for {sku} (have {item.Stock})";
                return false;
            }

            item.Stock -= qty;
            return true;
        }
    }

    public void Release(string sku, int qty)
    {
        if (!_skus.TryGetValue(sku, out var item)) return;
        lock (item.Gate)
            item.Stock += qty;
    }

    private static IEnumerable<StockedSku> Seeds() =>
    [
        new("ROSE01", "Climbing Rose 3L", 24.99m, 40),
        new("HERB12", "Herb Starter Tray", 9.50m, 80),
        new("OLIVE1", "Olive Tree Patio", 64.00m, 12),
        new("FEED03", "Bird Feeder Kit", 18.75m, 25),
        new("SOIL20", "Peat-Free Compost 20L", 7.25m, 100),
    ];

    private sealed class StockedSku(string sku, string name, decimal listPrice, int stock)
    {
        public string Sku { get; } = sku;
        public string Name { get; } = name;
        public decimal ListPrice { get; } = listPrice;
        public int Stock { get; set; } = stock;
        public object Gate { get; } = new();

        public SkuDefinition ToDefinition() => new(Sku, Name, ListPrice, Stock);
    }
}
