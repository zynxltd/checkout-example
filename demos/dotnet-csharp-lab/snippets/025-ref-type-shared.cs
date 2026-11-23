// 025 — class ref shared mutation [parameters]
// Run: dotnet run 025-ref-type-shared.cs

void Rename(Tag t) => t.Label = "renamed";
var t = new Tag(); Rename(t);
Console.WriteLine(t.Label);

class Tag { public string Label = "rose"; }
