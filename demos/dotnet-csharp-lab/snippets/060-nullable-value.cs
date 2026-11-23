// 060 — int? nullable value [basics]
// Run: dotnet run 060-nullable-value.cs

int? x = null;
Console.WriteLine(x?.ToString() ?? "null");
