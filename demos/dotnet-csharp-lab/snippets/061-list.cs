// 061 — List<T> [collections]
// Run: dotnet run 061-list.cs

var ids = new List<string> { "LOT-1", "LOT-2" };
ids.Add("LOT-3");
Console.WriteLine(string.Join(",", ids));
