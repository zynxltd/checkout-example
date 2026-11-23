// 034 — primary constructor [oop]
// Run: dotnet run 034-primary-ctor.cs

var b = new Bid("Sam", 22m);
Console.WriteLine($"{b.Bidder} £{b.Amount}");

class Bid(string bidder, decimal amount) {
  public string Bidder => bidder;
  public decimal Amount => amount;
}
