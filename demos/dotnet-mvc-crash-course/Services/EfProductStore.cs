using DotnetMvcCrashCourse.Contracts;
using DotnetMvcCrashCourse.Data;
using DotnetMvcCrashCourse.Models;
using Microsoft.EntityFrameworkCore;

namespace DotnetMvcCrashCourse.Services;

/// <summary>EF Core store — Azure SQL is a connection-string swap away.</summary>
public sealed class EfProductStore : IProductStore
{
    private readonly AppDbContext _db;

    public EfProductStore(AppDbContext db) => _db = db;

    public IReadOnlyList<Product> All()
        => _db.Products.AsNoTracking().OrderBy(p => p.Name).ToList();

    public Product? Find(int id)
        => _db.Products.AsNoTracking().FirstOrDefault(p => p.Id == id);

    public IReadOnlyList<Product> Search(string? category, string? q)
    {
        IQueryable<Product> query = _db.Products.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(category))
        {
            var cat = category.Trim().ToLower();
            query = query.Where(p => p.Category.ToLower() == cat);
        }

        if (!string.IsNullOrWhiteSpace(q))
        {
            var needle = q.Trim().ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(needle) || p.Sku.ToLower().Contains(needle));
        }

        return query.OrderBy(p => p.Name).ToList();
    }

    public Product Add(ProductForm form)
    {
        var product = new Product
        {
            Sku = form.Sku.Trim().ToUpperInvariant(),
            Name = form.Name.Trim(),
            Category = form.Category.Trim().ToLowerInvariant(),
            Price = form.Price,
            Stock = form.Stock,
        };
        _db.Products.Add(product);
        _db.SaveChanges();
        return product;
    }

    public bool Update(int id, ProductForm form)
    {
        var existing = _db.Products.FirstOrDefault(p => p.Id == id);
        if (existing is null) return false;

        existing.Sku = form.Sku.Trim().ToUpperInvariant();
        existing.Name = form.Name.Trim();
        existing.Category = form.Category.Trim().ToLowerInvariant();
        existing.Price = form.Price;
        existing.Stock = form.Stock;
        _db.SaveChanges();
        return true;
    }

    public bool Delete(int id)
    {
        var existing = _db.Products.FirstOrDefault(p => p.Id == id);
        if (existing is null) return false;
        _db.Products.Remove(existing);
        _db.SaveChanges();
        return true;
    }
}
