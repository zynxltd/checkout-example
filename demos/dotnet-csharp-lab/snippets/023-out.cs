// 023 — out assigns result [parameters]
// Run: dotnet run 023-out.cs

bool TrySku(string s, out string code) {
  if (s.StartsWith("LOT-")) { code = s; return true; }
  code = ""; return false;
}
Console.WriteLine(TrySku("LOT-ROSE", out var c) ? c : "fail");
