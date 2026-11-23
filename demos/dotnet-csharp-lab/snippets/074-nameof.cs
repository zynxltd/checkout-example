// 074 — nameof [basics]
// Run: dotnet run 074-nameof.cs

Console.WriteLine(nameof(Lot.HighBid));

class Lot { public decimal HighBid { get; set; } }
