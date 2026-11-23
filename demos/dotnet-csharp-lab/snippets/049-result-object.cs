// 049 — result object (no throw) [oop]
// Run: dotnet run 049-result-object.cs

Result Place(decimal a) => a < 18m ? Result.Fail("below reserve") : Result.Success();
Console.WriteLine(Place(20m));
Console.WriteLine(Place(10m));

record Result(bool Ok, string? Error) {
  public static Result Fail(string e) => new(false, e);
  public static Result Success() => new(true, null);
}
