// TASK 13: virtual / override
// Docs: Inheritance
// Run:  dotnet run 13-virtual-override.cs
// Or paste entire file into https://dotnetfiddle.net/
// Expect: woof

class Animal
{
    public virtual string Speak() => "...";
}

class Dog : Animal
{
    public override string Speak() => "woof";
}

class Program
{
    static void Main()
    {
        Animal a = new Dog();
        Console.WriteLine(a.Speak());
    }
}
