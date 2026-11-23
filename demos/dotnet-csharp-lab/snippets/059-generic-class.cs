// 059 — generic class Box<T> [generics]
// Run: dotnet run 059-generic-class.cs

Console.WriteLine(new Box<int>(42).Value);

class Box<T>(T value) { public T Value => value; }
