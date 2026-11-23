// 018 — discard _ [functions]
// Run: dotnet run 018-discard.cs

(string, int) Peek() => ("X", 9);
var (_, stock) = Peek();
Console.WriteLine(stock);
