// 028 — local function [functions]
// Run: dotnet run 028-local-func.cs

int Factorial(int x) {
  int Rec(int n) => n <= 1 ? 1 : n * Rec(n - 1);
  return Rec(x);
}
Console.WriteLine(Factorial(5));
