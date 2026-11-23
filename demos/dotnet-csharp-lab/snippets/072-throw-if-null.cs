// 072 — ThrowIfNull [errors]
// Run: dotnet run 072-throw-if-null.cs

try { ArgumentNullException.ThrowIfNull((string?)null); }
catch (ArgumentNullException) { Console.WriteLine("ThrowIfNull worked"); }
