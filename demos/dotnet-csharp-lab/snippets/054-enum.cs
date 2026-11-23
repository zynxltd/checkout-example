// 054 — enum [oop]
// Run: dotnet run 054-enum.cs

Console.WriteLine(LotStatus.ClosingSoon);
Console.WriteLine((int)LotStatus.Sold);

enum LotStatus { Open, ClosingSoon, Sold, Unsold }
