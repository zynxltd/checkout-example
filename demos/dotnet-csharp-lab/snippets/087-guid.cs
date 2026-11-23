// 087 — Guid [basics]
// Run: dotnet run 087-guid.cs

Console.WriteLine(Guid.NewGuid().ToString("N")[..8]);
