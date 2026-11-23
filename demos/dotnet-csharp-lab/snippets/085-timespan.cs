// 085 — DateTimeOffset / TimeSpan [basics]
// Run: dotnet run 085-timespan.cs

var ends = DateTimeOffset.UtcNow.AddMinutes(8);
Console.WriteLine($"in {(ends-DateTimeOffset.UtcNow).TotalMinutes:0.0}m");
