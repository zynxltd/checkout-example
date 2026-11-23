namespace DotnetMvcCrashCourse.Models;

/// <summary>
/// Domain model — Laravel equivalent: Eloquent model / plain PHP class in App\Models.
/// No DB here: we use an in-memory store so you can focus on MVC + DI first.
/// </summary>
public class Product
{
    public int Id { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
