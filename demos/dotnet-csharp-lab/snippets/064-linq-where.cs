// 064 — LINQ Where/Select [linq]
// Run: dotnet run 064-linq-where.cs

Console.WriteLine(string.Join(",", new[]{1,2,3,4}.Where(x=>x%2==0).Select(x=>x*10)));
