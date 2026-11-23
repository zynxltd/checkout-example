// 033 — object initializer [oop]
// Run: dotnet run 033-init.cs

var p = new Product { Sku = "ROSE01", Price = 24.99m };
Console.WriteLine($"{p.Sku} £{p.Price}");

class Product { public string Sku { get; set; } = ""; public decimal Price { get; set; } }
