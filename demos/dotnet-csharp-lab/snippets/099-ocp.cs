// 099 — open/closed new strategy [oop]
// Run: dotnet run 099-ocp.cs

decimal Quote(IShip s) => s.Cost(2m);
Console.WriteLine(Quote(new Ground()));
Console.WriteLine(Quote(new Express()));

interface IShip { decimal Cost(decimal kg); }

class Ground : IShip { public decimal Cost(decimal kg) => 5 + kg; }

class Express : IShip { public decimal Cost(decimal kg) => 12 + kg * 2; }
