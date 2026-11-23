// 083 — property pattern [patterns]
// Run: dotnet run 083-property-pattern.cs

var p = new { Price = 24.99m };
Console.WriteLine(p is { Price: > 20m } ? "pricey" : "cheap");
