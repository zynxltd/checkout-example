// 039 — interface polymorphism [oop]
// Run: dotnet run 039-interface.cs

IPriced p = new Product { Price = 5m };
Console.WriteLine(p.Price);

interface IPriced { decimal Price { get; } }

class Product : IPriced { public decimal Price { get; set; } }
