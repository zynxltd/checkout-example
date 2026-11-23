// 008 — ?. null-conditional [basics]
// Run: dotnet run 008-null-conditional.cs

string? n = null;
Console.WriteLine(n?.Length.ToString() ?? "was null");
