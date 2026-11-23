// 057 — Deconstruct [oop]
// Run: dotnet run 057-deconstruct.cs

var (id, reserve) = new Lot("L1", 18m);
Console.WriteLine($"{id}/{reserve}");

class Lot(string id, decimal r) {
  public void Deconstruct(out string i, out decimal x) { i = id; x = r; }
}
