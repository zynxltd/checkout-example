// 024 — in read-only param [parameters]
// Run: dotnet run 024-in.cs

decimal Tax(in decimal net) => net * 0.2m;
var net = 100m;
Console.WriteLine(Tax(in net));
