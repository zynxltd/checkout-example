// 042 — readonly field [oop]
// Run: dotnet run 042-readonly.cs

Console.WriteLine(new Lot("LOT-X").Id);

class Lot {
  public readonly string Id;
  public Lot(string id) => Id = id;
}
