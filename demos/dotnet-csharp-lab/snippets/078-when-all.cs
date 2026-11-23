// 078 — Task.WhenAll parallel [async]
// Run: dotnet run 078-when-all.cs

var sw = System.Diagnostics.Stopwatch.StartNew();
Task.WhenAll(Task.Delay(40), Task.Delay(40)).GetAwaiter().GetResult();
Console.WriteLine($"~{sw.ElapsedMilliseconds}ms");
