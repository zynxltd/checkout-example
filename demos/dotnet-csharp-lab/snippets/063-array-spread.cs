// 063 — collection expression + spread [collections]
// Run: dotnet run 063-array-spread.cs

int[] xs = [1,2,3];
int[] ys = [..xs, 4, 5];
Console.WriteLine(string.Join(",", ys));
