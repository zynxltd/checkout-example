// 022 — ref mutate caller [parameters]
// Run: dotnet run 022-ref.cs

void Bump(ref int x) => x++;
var a = 1; Bump(ref a);
Console.WriteLine(a); // 2
