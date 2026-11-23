// 026 — reassign param does not replace caller [parameters]
// Run: dotnet run 026-reassign-param.cs

void Replace(Tag t) => t = new Tag("other");
var t = new Tag("keep"); Replace(t);
Console.WriteLine(t.Label);

class Tag(string l) { public string Label = l; }
