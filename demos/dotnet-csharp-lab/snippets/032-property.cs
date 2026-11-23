// 032 — get/set property [oop]
// Run: dotnet run 032-property.cs

var lot = new Lot { HighBid = 20m };
Console.WriteLine(lot.HighBid);

class Lot { public decimal HighBid { get; set; } }
