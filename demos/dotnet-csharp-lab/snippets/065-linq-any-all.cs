// 065 — Any / All [linq]
// Run: dotnet run 065-linq-any-all.cs

int[] xs = [1,2,3];
Console.WriteLine($"any>2={xs.Any(v=>v>2)} all>0={xs.All(v=>v>0)}");
