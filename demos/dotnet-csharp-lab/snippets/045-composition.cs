// 045 — composition over inheritance [oop]
// Run: dotnet run 045-composition.cs

Console.WriteLine(new Mower(new Engine()).Go());

class Engine { public string Start() => "vroom"; }

class Mower(Engine engine) { public string Go() => engine.Start(); }
