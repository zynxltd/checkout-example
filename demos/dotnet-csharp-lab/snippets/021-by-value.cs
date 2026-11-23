// 021 — pass by value (copy) [parameters]
// Run: dotnet run 021-by-value.cs

void Bump(int x) => x++;
var a = 1; Bump(a);
Console.WriteLine(a); // still 1
