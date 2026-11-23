// 017 — return tuple [functions]
// Run: dotnet run 017-tuple-return.cs

(string sku, int stock) Peek() => ("HERB12", 40);
var (sku, stock) = Peek();
Console.WriteLine($"{sku}={stock}");
