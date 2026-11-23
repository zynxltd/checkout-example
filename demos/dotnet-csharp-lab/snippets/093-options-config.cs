// 093 — options like config() [oop]
// Run: dotnet run 093-options-config.cs

var opt = new AuctionOptions { SoftCloseSeconds = 30 };
Console.WriteLine(Math.Max(5, opt.SoftCloseSeconds));

class AuctionOptions { public int SoftCloseSeconds { get; set; } = 45; }
