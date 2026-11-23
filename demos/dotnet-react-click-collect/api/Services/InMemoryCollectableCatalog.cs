using System.Collections.Concurrent;
using DotnetReactClickCollect.Api.Contracts;
using DotnetReactClickCollect.Api.Models;

namespace DotnetReactClickCollect.Api.Services;

public sealed class InMemoryCollectableCatalog : ICollectableCatalog
{
    private readonly ConcurrentDictionary<string, StockedItem> _items;

    public InMemoryCollectableCatalog()
    {
        _items = new ConcurrentDictionary<string, StockedItem>(StringComparer.OrdinalIgnoreCase);
        foreach (var seed in Seeds())
            _items[seed.Sku] = seed;
    }

    public IReadOnlyList<CollectableItem> All() =>
        _items.Values.Select(i => i.ToItem()).OrderBy(i => i.Category).ThenBy(i => i.Name).ToList();

    public CollectableItem? Find(string sku) =>
        _items.TryGetValue(sku, out var item) ? item.ToItem() : null;

    public bool TryReserve(string sku, int qty, out string? error)
    {
        error = null;
        if (!_items.TryGetValue(sku, out var item))
        {
            error = $"Unknown SKU {sku}";
            return false;
        }

        lock (item.Gate)
        {
            if (item.Stock < qty)
            {
                error = $"Not enough stock for {sku} (have {item.Stock})";
                return false;
            }

            item.Stock -= qty;
            return true;
        }
    }

    public void Release(string sku, int qty)
    {
        if (!_items.TryGetValue(sku, out var item)) return;
        lock (item.Gate)
            item.Stock += qty;
    }

    private static IEnumerable<StockedItem> Seeds() =>
    [
        new("ROSE01", "Climbing Rose 3L", "plants", 24.99m, 28),
        new("HERB12", "Herb Starter Tray", "plants", 9.50m, 60),
        new("OLIVE1", "Olive Tree Patio", "plants", 64.00m, 10),
        new("FEED03", "Bird Feeder Kit", "wildlife", 18.75m, 22),
        new("SOIL20", "Peat-Free Compost 20L", "soil", 7.25m, 90),
        new("TOOL05", "Bypass Secateurs", "tools", 16.40m, 35),
    ];

    private sealed class StockedItem(string sku, string name, string category, decimal unitPrice, int stock)
    {
        public string Sku { get; } = sku;
        public string Name { get; } = name;
        public string Category { get; } = category;
        public decimal UnitPrice { get; } = unitPrice;
        public int Stock { get; set; } = stock;
        public object Gate { get; } = new();

        public CollectableItem ToItem() => new(Sku, Name, Category, UnitPrice, Stock);
    }
}
