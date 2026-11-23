// 096 — immutable update with [oop]
// Run: dotnet run 096-immutability.cs

var o = new Order("open", 50m);
var packed = o with { Status = "packed" };
Console.WriteLine($"{o.Status} -> {packed.Status}");

record Order(string Status, decimal Total);
