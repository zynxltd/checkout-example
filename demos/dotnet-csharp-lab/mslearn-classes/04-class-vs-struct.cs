// TASK 04: Struct assignment copies values
// Docs: Create objects vs structs
// Run:  dotnet run 04-class-vs-struct.cs
// Or paste entire file into https://dotnetfiddle.net/
// Expect: a.X=1 b.X=99

struct Point
{
    public int X;
    public int Y;
}

class Program
{
    static void Main()
    {
        var a = new Point { X = 1, Y = 2 };
        var b = a;
        b.X = 99;
        Console.WriteLine($"a.X={a.X} b.X={b.X}");
    }
}
