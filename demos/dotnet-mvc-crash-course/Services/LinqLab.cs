using DotnetMvcCrashCourse.Models;

namespace DotnetMvcCrashCourse.Services;

/// <summary>EXERCISE 7 — LINQ workout. Laravel parallel: collect() aggregates.</summary>
public static class LinqLab
{
    public static IReadOnlyList<Product> Sample { get; } =
    [
        new() { Id = 1, Sku = "ROSE01", Name = "Climbing Rose", Category = "plants", Price = 24.99m, Stock = 40 },
        new() { Id = 2, Sku = "FEED01", Name = "Bird Feeder Kit", Category = "wildlife", Price = 9.99m, Stock = 120 },
        new() { Id = 3, Sku = "MOWER1", Name = "Compact Lawn Mower", Category = "machinery", Price = 199.00m, Stock = 8 },
        new() { Id = 4, Sku = "HERB12", Name = "Herb Starter Pack", Category = "plants", Price = 14.50m, Stock = 75 },
        new() { Id = 5, Sku = "TREE9", Name = "Olive Tree", Category = "plants", Price = 49.99m, Stock = 0 },
    ];

    public static IEnumerable<Product> PlantsOnly(IEnumerable<Product> source)
        => source
            .Where(p => p.Category == "plants")
            .OrderBy(p => p.Name);

    public static int TotalStock(IEnumerable<Product> source)
        => source.Sum(p => p.Stock);

    public static decimal AveragePriceInStock(IEnumerable<Product> source)
    {
        var inStock = source.Where(p => p.Stock > 0).ToList();
        return inStock.Count == 0 ? 0m : decimal.Round(inStock.Average(p => p.Price), 2);
    }

    public static IEnumerable<(string Category, int Count, decimal Value)> CategoryRollup(IEnumerable<Product> source)
        => source
            .GroupBy(p => p.Category)
            .Select(g => (
                Category: g.Key,
                Count: g.Count(),
                Value: g.Sum(p => p.Price * p.Stock)));

    public static string? MostExpensiveSku(IEnumerable<Product> source)
        => source
            .OrderByDescending(p => p.Price)
            .Select(p => p.Sku)
            .FirstOrDefault();

    public static bool RunSelfCheck()
    {
        try
        {
            var plants = PlantsOnly(Sample).ToList();
            if (plants.Count != 3 || plants[0].Name != "Climbing Rose") return false;
            if (TotalStock(Sample) != 243) return false;
            if (AveragePriceInStock(Sample) != 62.12m) return false;

            var rollup = CategoryRollup(Sample).OrderBy(x => x.Category).ToList();
            if (rollup.Count != 3) return false;
            if (MostExpensiveSku(Sample) != "MOWER1") return false;
            return true;
        }
        catch (NotImplementedException)
        {
            return false;
        }
    }
}
