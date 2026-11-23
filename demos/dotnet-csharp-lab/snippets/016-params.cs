// 016 — params array [functions]
// Run: dotnet run 016-params.cs

int Sum(params int[] xs) => xs.Sum();
Console.WriteLine(Sum(1, 2, 3, 4));
