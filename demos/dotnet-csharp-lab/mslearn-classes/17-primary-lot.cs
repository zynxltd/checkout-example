// TASK 17: GreenShelf primary ctor lot
// Docs: Primary constructors practice
// Run:  dotnet run 17-primary-lot.cs
// Or paste entire file into https://dotnetfiddle.net/
// Expect: LOT-1 reserve=18 high=20

class Lot(string id, decimal reserve)
{
    public string Id => id;
    public decimal Reserve => reserve;
    public decimal HighBid { get; set; }
}

class Program
{
    static void Main()
    {
        var lot = new Lot("LOT-1", 18m) { HighBid = 20m };
        Console.WriteLine($"{lot.Id} reserve={lot.Reserve} high={lot.HighBid}");
    }
}
