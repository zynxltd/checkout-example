// 030 — Action<> void lambda [functions]
// Run: dotnet run 030-action.cs

Action<string> shout = s => Console.WriteLine(s.ToUpper());
shout("bid");
