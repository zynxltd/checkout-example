// 075 — typeof / GetType [basics]
// Run: dotnet run 075-typeof.cs

Console.WriteLine(typeof(Lot).Name);
Console.WriteLine(new Lot().GetType().Name);

class Lot {}
