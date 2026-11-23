// 050 — extension method [oop]
// Run: dotnet run 050-extension.cs

Console.WriteLine("rose".Title());

static class Ex {
  public static string Title(this string s) => char.ToUpper(s[0]) + s[1..].ToLower();
}
