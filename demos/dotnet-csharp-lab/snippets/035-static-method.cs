// 035 — static method [oop]
// Run: dotnet run 035-static-method.cs

Console.WriteLine(MathX.Clamp(150, 0, 100));

static class MathX {
  public static int Clamp(int v, int min, int max) => v < min ? min : v > max ? max : v;
}
