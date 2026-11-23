// 038 — abstract Area() [oop]
// Run: dotnet run 038-abstract.cs

Console.WriteLine($"area≈{new Circle(2).Area():0.00}");

abstract class Shape { public abstract double Area(); }

class Circle(double r) : Shape { public override double Area() => Math.PI * r * r; }
