// 067 — OrderByDescending Take [linq]
// Run: dotnet run 067-orderby.cs

Console.WriteLine(string.Join(",", new[]{5,1,9,3}.OrderByDescending(v=>v).Take(2)));
