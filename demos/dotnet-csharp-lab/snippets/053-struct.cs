// 053 — readonly struct [oop]
// Run: dotnet run 053-struct.cs

Console.WriteLine($"{new Point(3,4).Len():0.00}");

readonly struct Point(double x, double y) {
  public double Len() => Math.Sqrt(x*x + y*y);
}
