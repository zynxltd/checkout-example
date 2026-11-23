// 056 — flags enum [oop]
// Run: dotnet run 056-flags.cs

var p = Perm.Read | Perm.Write;
Console.WriteLine(p.HasFlag(Perm.Write));

[Flags] enum Perm { None=0, Read=1, Write=2 }
