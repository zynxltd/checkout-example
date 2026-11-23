// 071 — try/catch [errors]
// Run: dotnet run 071-try-catch.cs

try { throw new InvalidOperationException("below reserve"); }
catch (InvalidOperationException ex) { Console.WriteLine($"caught: {ex.Message}"); }
