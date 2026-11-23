// 090 — invariant money [basics]
// Run: dotnet run 090-culture-money.cs

Console.WriteLine(24.5m.ToString("0.00", System.Globalization.CultureInfo.InvariantCulture));
