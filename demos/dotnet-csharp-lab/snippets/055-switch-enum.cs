// 055 — switch expression [oop]
// Run: dotnet run 055-switch-enum.cs

string Lab(S s) => s switch { S.Open => "open", S.Sold => "gone", _ => "?" };
Console.WriteLine(Lab(S.Sold));

enum S { Open, Sold }
