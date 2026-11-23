// 043 — virtual / override [oop]
// Run: dotnet run 043-virtual.cs

Base x = new Child();
Console.WriteLine(x.Kind());

class Base { public virtual string Kind() => "base"; }

class Child : Base { public override string Kind() => "child"; }
