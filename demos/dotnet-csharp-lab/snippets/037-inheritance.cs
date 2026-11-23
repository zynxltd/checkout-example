// 037 — inheritance + override [oop]
// Run: dotnet run 037-inheritance.cs

Animal a = new Dog();
Console.WriteLine(a.Speak());

abstract class Animal { public abstract string Speak(); }

class Dog : Animal { public override string Speak() => "woof"; }
