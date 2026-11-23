// TASK 07: Primary constructor
// Docs: Constructors and initialization
// Run:  dotnet run 07-primary-ctor.cs
// Or paste entire file into https://dotnetfiddle.net/
// Expect: 40

class Container(int capacity)
{
    private int _capacity = capacity;
    public int Capacity => _capacity;
}

class Program
{
    static void Main()
    {
        Console.WriteLine(new Container(40).Capacity);
    }
}
