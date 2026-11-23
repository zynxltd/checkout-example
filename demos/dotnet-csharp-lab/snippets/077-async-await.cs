// 077 — async Task [async]
// Run: dotnet run 077-async-await.cs

async Task<int> Add(int a, int b) { await Task.Delay(20); return a + b; }
Console.WriteLine(Add(2,3).GetAwaiter().GetResult());
