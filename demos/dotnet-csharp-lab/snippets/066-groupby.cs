// 066 — GroupBy [linq]
// Run: dotnet run 066-groupby.cs

var lines = new[]{ ("plants",1), ("plants",2), ("tools",1) };
Console.WriteLine(string.Join(" | ", lines.GroupBy(l=>l.Item1).Select(g=>$"{g.Key}:{g.Sum(x=>x.Item2)}")));
