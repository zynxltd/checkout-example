// 051 — record equality [oop]
// Run: dotnet run 051-record-eq.cs

Console.WriteLine(new LotSeed("A", 10m) == new LotSeed("A", 10m));

record LotSeed(string Id, decimal Reserve);
