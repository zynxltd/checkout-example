// 009 — is pattern [basics]
// Run: dotnet run 009-is-pattern.cs

object box = 7;
Console.WriteLine(box is int i ? $"int {i}" : "other");
