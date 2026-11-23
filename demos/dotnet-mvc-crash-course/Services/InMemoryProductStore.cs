using DotnetMvcCrashCourse.Contracts;
using DotnetMvcCrashCourse.Models;

namespace DotnetMvcCrashCourse.Services;

public class InMemoryProductStore : IProductStore
{
    private readonly List<Product> _products =
    [
        new() { Id = 1, Sku = "ROSE01", Name = "Climbing Rose", Category = "plants", Price = 24.99m, Stock = 40 },
        new() { Id = 2, Sku = "FEED01", Name = "Bird Feeder Kit", Category = "wildlife", Price = 9.99m, Stock = 120 },
        new() { Id = 3, Sku = "MOWER1", Name = "Compact Lawn Mower", Category = "machinery", Price = 199.00m, Stock = 8 },
        new() { Id = 4, Sku = "HERB12", Name = "Herb Starter Pack", Category = "plants", Price = 14.50m, Stock = 75 },
    ];

    private int _nextId = 5;
    private readonly object _lock = new();

    public IReadOnlyList<Product> All()
    {
        lock (_lock)
        {
            return _products.OrderBy(p => p.Name).ToList();
        }
    }

    public Product? Find(int id)
    {
        lock (_lock)
        {
            return Clone(_products.FirstOrDefault(p => p.Id == id));
        }
    }

    public IReadOnlyList<Product> Search(string? category, string? q)
    {
        lock (_lock)
        {
            IEnumerable<Product> query = _products;

            if (!string.IsNullOrWhiteSpace(category))
            {
                var cat = category.Trim();
                query = query.Where(p =>
                    string.Equals(p.Category, cat, StringComparison.OrdinalIgnoreCase));
            }

            if (!string.IsNullOrWhiteSpace(q))
            {
                var needle = q.Trim();
                query = query.Where(p =>
                    p.Name.Contains(needle, StringComparison.OrdinalIgnoreCase)
                    || p.Sku.Contains(needle, StringComparison.OrdinalIgnoreCase));
            }

            return query.OrderBy(p => p.Name).Select(p => Clone(p)!).ToList();
        }
    }

    public Product Add(ProductForm form)
    {
        lock (_lock)
        {
            var product = MapForm(form, _nextId++);
            _products.Add(product);
            return Clone(product)!;
        }
    }

    public bool Update(int id, ProductForm form)
    {
        lock (_lock)
        {
            var existing = _products.FirstOrDefault(p => p.Id == id);
            if (existing is null) return false;

            existing.Sku = form.Sku.Trim().ToUpperInvariant();
            existing.Name = form.Name.Trim();
            existing.Category = form.Category.Trim().ToLowerInvariant();
            existing.Price = form.Price;
            existing.Stock = form.Stock;
            return true;
        }
    }

    public bool Delete(int id)
    {
        lock (_lock)
        {
            var existing = _products.FirstOrDefault(p => p.Id == id);
            if (existing is null) return false;
            _products.Remove(existing);
            return true;
        }
    }

    private static Product MapForm(ProductForm form, int id) => new()
    {
        Id = id,
        Sku = form.Sku.Trim().ToUpperInvariant(),
        Name = form.Name.Trim(),
        Category = form.Category.Trim().ToLowerInvariant(),
        Price = form.Price,
        Stock = form.Stock,
    };

    private static Product? Clone(Product? p) =>
        p is null
            ? null
            : new Product
            {
                Id = p.Id,
                Sku = p.Sku,
                Name = p.Name,
                Category = p.Category,
                Price = p.Price,
                Stock = p.Stock,
                CreatedAt = p.CreatedAt,
            };
}
