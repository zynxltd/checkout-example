// 027 — ref can replace caller reference [parameters]
// Run: dotnet run 027-ref-reference.cs

void Replace(ref Tag t) => t = new Tag("replaced");
var t = new Tag("old"); Replace(ref t);
Console.WriteLine(t.Label);

class Tag(string l) { public string Label = l; }
