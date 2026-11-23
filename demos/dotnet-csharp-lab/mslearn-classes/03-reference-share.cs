// TASK 03: Assignment copies reference
// Docs: Create objects
// Run:  dotnet run 03-reference-share.cs
// Or paste entire file into https://dotnetfiddle.net/
// Expect: Hopper

class Customer
{
    public string Name { get; set; }
    public Customer(string name) => Name = name;
}

class Program
{
    static void Main()
    {
        var c1 = new Customer("Grace");
        var c2 = c1;
        c2.Name = "Hopper";
        Console.WriteLine(c1.Name);
    }
}
