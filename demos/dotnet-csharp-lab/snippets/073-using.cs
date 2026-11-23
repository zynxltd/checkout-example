// 073 — using IDisposable [errors]
// Run: dotnet run 073-using.cs

using (var m = new Meter()) Console.WriteLine(m.Read());

class Meter : IDisposable {
  public string Read() => "12mm";
  public void Dispose() => Console.WriteLine("disposed");
}
