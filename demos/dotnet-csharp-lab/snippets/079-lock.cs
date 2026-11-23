// 079 — lock thread-safe [async]
// Run: dotnet run 079-lock.cs

var n = 0; var gate = new object();
Parallel.For(0, 1000, _ => { lock(gate) n++; });
Console.WriteLine(n);
