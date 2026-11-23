using DotnetMvcCrashCourse.Models;

namespace DotnetMvcCrashCourse.Contracts;

public enum ProductDeleteOutcome
{
    NotFound,
    Conflict,
    Deleted,
}

public interface IProductService
{
    IReadOnlyList<Product> List(string? category = null, string? q = null);
    Product? Get(int id);
    Product Create(ProductForm form);
    bool Update(int id, ProductForm form);
    ProductDeleteOutcome Delete(int id);
}
