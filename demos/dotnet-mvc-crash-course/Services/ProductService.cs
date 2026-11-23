using DotnetMvcCrashCourse.Contracts;
using DotnetMvcCrashCourse.Models;

namespace DotnetMvcCrashCourse.Services;

/// <summary>Application service — orchestrates store + policy (thin controllers).</summary>
public sealed class ProductService : IProductService
{
    private readonly IProductStore _store;
    private readonly IProductPolicy _policy;

    public ProductService(IProductStore store, IProductPolicy policy)
    {
        _store = store;
        _policy = policy;
    }

    public IReadOnlyList<Product> List(string? category = null, string? q = null)
        => _store.Search(category, q);

    public Product? Get(int id) => _store.Find(id);

    public Product Create(ProductForm form) => _store.Add(form);

    public bool Update(int id, ProductForm form) => _store.Update(id, form);

    public ProductDeleteOutcome Delete(int id)
    {
        var product = _store.Find(id);
        if (product is null) return ProductDeleteOutcome.NotFound;
        if (!_policy.CanDelete(product)) return ProductDeleteOutcome.Conflict;
        return _store.Delete(id) ? ProductDeleteOutcome.Deleted : ProductDeleteOutcome.NotFound;
    }
}

/// <summary>Backward-compatible static helpers used in exercises / docs.</summary>
public static class ProductRules
{
    private static readonly ProductPolicy Policy = new();

    public static bool CanDelete(Product product) => Policy.CanDelete(product);

    public static string CannotDeleteReason => Policy.CannotDeleteReason;
}
