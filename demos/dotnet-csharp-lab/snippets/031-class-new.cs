// 031 — class + new [oop]
// Run: dotnet run 031-class-new.cs

var lot = new Lot("LOT-1", 18m);
Console.WriteLine($"{lot.Id} £{lot.Reserve}");

class Lot {
  public string Id { get; }
  public decimal Reserve { get; }
  public Lot(string id, decimal reserve) { Id = id; Reserve = reserve; }
}
