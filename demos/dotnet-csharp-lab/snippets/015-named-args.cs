// 015 — named arguments [functions]
// Run: dotnet run 015-named-args.cs

decimal Line(int qty, decimal price) => qty * price;
Console.WriteLine(Line(price: 9.99m, qty: 3));
