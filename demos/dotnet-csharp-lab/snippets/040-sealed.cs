// 040 — sealed class [oop]
// Run: dotnet run 040-sealed.cs

Console.WriteLine(new Tool("secateurs").Name);

sealed class Tool(string name) { public string Name => name; }
