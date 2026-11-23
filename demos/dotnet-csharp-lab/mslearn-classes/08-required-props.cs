// TASK 08: Required properties
// Docs: Constructors and initialization
// Run:  dotnet run 08-required-props.cs
// Or paste entire file into https://dotnetfiddle.net/
// Expect: Grace Hopper

class Person
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}

class Program
{
    static void Main()
    {
        var person = new Person { FirstName = "Grace", LastName = "Hopper" };
        Console.WriteLine($"{person.FirstName} {person.LastName}");
    }
}
