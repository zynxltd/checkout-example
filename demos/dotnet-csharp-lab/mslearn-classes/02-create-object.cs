// TASK 02: Create objects with new
// Docs: Create objects
// Run:  dotnet run 02-create-object.cs
// Or paste entire file into https://dotnetfiddle.net/
// Expect: Allison

class Customer
{
    public string Name { get; set; }
    public Customer(string name) => Name = name;
}

class Program
{
    static void Main()
    {
        var customer = new Customer("Allison");
        Console.WriteLine(customer.Name);
    }
}
