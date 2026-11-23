// 080 — ConcurrentDictionary [async]
// Run: dotnet run 080-concurrent-dict.cs

var bag = new System.Collections.Concurrent.ConcurrentDictionary<string,int>();
bag.AddOrUpdate("bids", 1, (_,v)=>v+1);
bag.AddOrUpdate("bids", 1, (_,v)=>v+1);
Console.WriteLine(bag["bids"]);
