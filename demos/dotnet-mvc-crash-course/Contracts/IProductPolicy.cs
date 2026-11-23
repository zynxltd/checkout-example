using DotnetMvcCrashCourse.Models;

namespace DotnetMvcCrashCourse.Contracts;

/// <summary>Business policy for products — keep controllers free of rule strings (SRP).</summary>
public interface IProductPolicy
{
    bool CanDelete(Product product);
    string CannotDeleteReason { get; }
}

public sealed class ProductPolicy : IProductPolicy
{
    public bool CanDelete(Product product) => product.Stock <= 0;

    public string CannotDeleteReason => "Cannot delete product with stock remaining.";
}
