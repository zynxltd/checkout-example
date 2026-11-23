using DotnetMvcCrashCourse.Models;

namespace DotnetMvcCrashCourse.Contracts;

/// <summary>
/// Persistence port — Laravel: repository interface.
/// Swap InMemory ↔ EF without touching controllers (DIP + OCP).
/// </summary>
public interface IProductStore
{
    IReadOnlyList<Product> All();
    Product? Find(int id);
    IReadOnlyList<Product> Search(string? category, string? q);
    Product Add(ProductForm form);
    bool Update(int id, ProductForm form);
    bool Delete(int id);
}
