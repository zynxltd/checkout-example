// 058 — generic method [generics]
// Run: dotnet run 058-generic-method.cs

T MaxOf<T>(T a, T b) where T : IComparable<T> => a.CompareTo(b) >= 0 ? a : b;
Console.WriteLine(MaxOf(3, 9));
Console.WriteLine(MaxOf("sam", "lee"));
