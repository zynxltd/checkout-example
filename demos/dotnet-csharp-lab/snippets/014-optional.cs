// 014 — optional parameter [functions]
// Run: dotnet run 014-optional.cs

string Greet(string who = "gardener") => $"Hi {who}";
Console.WriteLine(Greet());
Console.WriteLine(Greet("Sam"));
