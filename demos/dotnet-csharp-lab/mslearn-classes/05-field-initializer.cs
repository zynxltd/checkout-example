// TASK 05: Field initializers
// Docs: Constructors and initialization
// Run:  dotnet run 05-field-initializer.cs
// Or paste entire file into https://dotnetfiddle.net/
// Expect: 10

class Container
{
    private int _capacity = 10;
    public int Capacity => _capacity;
}

class Program
{
    static void Main()
    {
        Console.WriteLine(new Container().Capacity);
    }
}
