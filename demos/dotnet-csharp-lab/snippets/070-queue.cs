// 070 — Queue FIFO [collections]
// Run: dotnet run 070-queue.cs

var q = new Queue<string>(); q.Enqueue("a"); q.Enqueue("b");
Console.WriteLine(q.Dequeue());
