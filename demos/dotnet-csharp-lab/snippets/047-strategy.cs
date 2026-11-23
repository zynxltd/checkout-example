// 047 — strategy pattern [oop]
// Run: dotnet run 047-strategy.cs

IBidPolicy p = new Vip();
Console.WriteLine(p.Check(18m, 18m) ?? "ok");

interface IBidPolicy { string? Check(decimal amt, decimal reserve); }

class Strict : IBidPolicy { public string? Check(decimal a, decimal r) => a < r + 1 ? "too low" : null; }

class Vip : IBidPolicy { public string? Check(decimal a, decimal r) => a < r ? "below" : null; }
