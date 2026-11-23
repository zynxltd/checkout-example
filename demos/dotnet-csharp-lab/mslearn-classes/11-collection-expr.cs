// TASK 11: Collection expression
// Docs: Object initializers
// Run:  dotnet run 11-collection-expr.cs
// Or paste entire file into https://dotnetfiddle.net/
// Expect: Rose,Herb,Soil

class Basket
{
    public List<string> Items { get; init; } = [];
}

class Program
{
    static void Main()
    {
        var basket = new Basket { Items = ["Rose", "Herb", "Soil"] };
        Console.WriteLine(string.Join(",", basket.Items));
    }
}
