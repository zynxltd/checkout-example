// TASK 06: Constructor parameters
// Docs: Constructors and initialization
// Run:  dotnet run 06-ctor-params.cs
// Or paste entire file into https://dotnetfiddle.net/
// Expect: 25

class Container
{
    private int _capacity;
    public Container(int capacity) => _capacity = capacity;
    public int Capacity => _capacity;
}

class Program
{
    static void Main()
    {
        Console.WriteLine(new Container(25).Capacity);
    }
}
