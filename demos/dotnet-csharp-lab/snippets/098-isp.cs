// 098 — small interfaces ISP [oop]
// Run: dotnet run 098-isp.cs

IRead r = new Store(); ((IWrite)r).Set("ok");
Console.WriteLine(r.Get());

interface IRead { string Get(); }

interface IWrite { void Set(string v); }

class Store : IRead, IWrite {
  string _v = "";
  public string Get() => _v;
  public void Set(string v) => _v = v;
}
