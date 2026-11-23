// 052 — record with copy [oop]
// Run: dotnet run 052-record-with.cs

var a = new LotSeed("A", 10m);
var b = a with { Reserve = 12m };
Console.WriteLine($"{b.Reserve} (orig {a.Reserve})");

record LotSeed(string Id, decimal Reserve);
