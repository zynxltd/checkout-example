// TASK 16: GreenShelf options initializer
// Docs: Object initializers practice
// Run:  dotnet run 16-options-practice.cs
// Or paste entire file into https://dotnetfiddle.net/
// Expect: 60/30

class AuctionOptions
{
    public int SoftCloseSeconds { get; init; } = 45;
    public int ExtendSeconds { get; init; } = 30;
}

class Program
{
    static void Main()
    {
        var opt = new AuctionOptions { SoftCloseSeconds = 60 };
        Console.WriteLine($"{opt.SoftCloseSeconds}/{opt.ExtendSeconds}");
    }
}
