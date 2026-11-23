// 081 — switch on type [patterns]
// Run: dotnet run 081-switch-type.cs

object p = new Bid("Sam", 30m);
Console.WriteLine(p switch { Bid b => $"bid {b.Amount}", _ => "?" });

record Bid(string Who, decimal Amount);
