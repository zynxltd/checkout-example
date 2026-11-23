// TASK 14: init-only property
// Docs: Object initializers
// Run:  dotnet run 14-init-only.cs
// Or paste entire file into https://dotnetfiddle.net/
// Expect: LOT-ROSE

class Lot
{
    public string Id { get; init; } = "";
}

class Program
{
    static void Main()
    {
        var lot = new Lot { Id = "LOT-ROSE" };
        Console.WriteLine(lot.Id);
    }
}
