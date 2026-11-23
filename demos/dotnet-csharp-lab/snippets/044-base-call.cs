// 044 — base.Method() [oop]
// Run: dotnet run 044-base-call.cs

Console.WriteLine(new Child().Tag());

class Base { public virtual string Tag() => "B"; }

class Child : Base { public override string Tag() => base.Tag() + "+C"; }
