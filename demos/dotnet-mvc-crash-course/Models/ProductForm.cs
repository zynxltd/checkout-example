using System.ComponentModel.DataAnnotations;

namespace DotnetMvcCrashCourse.Models;

/// <summary>
/// Form / request model — Laravel equivalent: Form Request (StoreProductRequest).
/// DataAnnotations ≈ Laravel validation rules.
/// </summary>
public class ProductForm
{
    [Required, StringLength(32)]
    [Display(Name = "SKU")]
    public string Sku { get; set; } = string.Empty;

    [Required, StringLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required, StringLength(40)]
    public string Category { get; set; } = string.Empty;

    [Range(0.01, 10_000)]
    [DataType(DataType.Currency)]
    public decimal Price { get; set; }

    [Range(0, 100_000)]
    public int Stock { get; set; }
}
