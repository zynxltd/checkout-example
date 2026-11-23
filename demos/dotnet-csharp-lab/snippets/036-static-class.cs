// 036 — static helper class [oop]
// Run: dotnet run 036-static-class.cs

Console.WriteLine(Money.Format(19.5m));

static class Money {
  public static string Format(decimal v) => $"£{v:0.00}";
}
