// 048 — repository pattern [oop]
// Run: dotnet run 048-repository.cs

var repo = new MemoryRepo(); repo.Add("LOT-1");
Console.WriteLine(repo.Find("LOT-1"));

interface IRepo { void Add(string id); string? Find(string id); }

class MemoryRepo : IRepo {
  readonly List<string> _xs = [];
  public void Add(string id) => _xs.Add(id);
  public string? Find(string id) => _xs.FirstOrDefault(x => x == id);
}
