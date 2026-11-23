// TASK 01: Declare a class
// Docs: Declare a class
// Run:  dotnet run 01-declare-class.cs
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
