// TASK 09: Static class
// Docs: Static classes
// Run:  dotnet run 09-static-class.cs
// Or paste entire file into https://dotnetfiddle.net/
// Expect: Circumference: 31.42

static class MathHelpers
{
    public static double CircleCircumference(double radius) => 2 * Math.PI * radius;
}

class Program
{
    static void Main()
    {
        Console.WriteLine($"Circumference: {MathHelpers.CircleCircumference(5.0):F2}");
    }
}
