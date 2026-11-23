// 097 — Liskov — any IPriced works [oop]
// Run: dotnet run 097-lsp.cs

decimal Tax(IPriced p) => p.Price * 0.2m;
Console.WriteLine(Tax(new Plant()));
Console.WriteLine(Tax(new Tool()));

interface IPriced { decimal Price { get; } }

class Plant : IPriced { public decimal Price => 24.99m; }

class Tool : IPriced { public decimal Price => 16.40m; }
