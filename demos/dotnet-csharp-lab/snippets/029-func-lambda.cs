// 029 — Func<> lambda [functions]
// Run: dotnet run 029-func-lambda.cs

Func<int,int> square = x => x * x;
Console.WriteLine(square(9));
