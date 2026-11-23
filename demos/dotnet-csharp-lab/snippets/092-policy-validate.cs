// 092 — bid policy SRP [oop]
// Run: dotnet run 092-policy-validate.cs

Console.WriteLine(new DefaultPolicy().Validate(20m, 18m, 1m) ?? "ok");
Console.WriteLine(new DefaultPolicy().Validate(18.5m, 18m, 1m) ?? "ok");

interface IPolicy { string? Validate(decimal amt, decimal high, decimal inc); }

class DefaultPolicy : IPolicy {
  public string? Validate(decimal amt, decimal high, decimal inc)
    => amt < high + inc ? $"need ≥ {high+inc}" : null;
}
