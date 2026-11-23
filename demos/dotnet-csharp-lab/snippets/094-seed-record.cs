// 094 — LotSeed catalogue [oop]
// Run: dotnet run 094-seed-record.cs

var seeds = new[] {
  new LotSeed("LOT-ROSE", "Climbing Rose", 18m, DateTimeOffset.UtcNow.AddMinutes(8)),
};
Console.WriteLine($"{seeds[0].Id} ends {seeds[0].EndsAt:HH:mm}");

record LotSeed(string Id, string Name, decimal Reserve, DateTimeOffset EndsAt);
