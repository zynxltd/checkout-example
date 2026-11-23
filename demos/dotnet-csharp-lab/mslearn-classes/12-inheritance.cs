// TASK 12: Inheritance
// Docs: Inheritance
// Run:  dotnet run 12-inheritance.cs
// Or paste entire file into https://dotnetfiddle.net/
// Expect: Satya manages Engineering

class Employee(string name)
{
    public string Name { get; } = name;
}

class Manager(string name, string department) : Employee(name)
{
    public string Department { get; } = department;
}

class Program
{
    static void Main()
    {
        var manager = new Manager("Satya", "Engineering");
        Console.WriteLine($"{manager.Name} manages {manager.Department}");
    }
}
