// 013 — two parameters [functions]
// Run: dotnet run 013-two-params.cs

decimal LineTotal(int qty, decimal price) => qty * price;
Console.WriteLine(LineTotal(2, 12.50m));
