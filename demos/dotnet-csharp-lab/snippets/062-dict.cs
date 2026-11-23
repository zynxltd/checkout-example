// 062 — Dictionary [collections]
// Run: dotnet run 062-dict.cs

var stock = new Dictionary<string,int> { ["ROSE01"] = 10 };
stock["ROSE01"]++;
Console.WriteLine(stock["ROSE01"]);
