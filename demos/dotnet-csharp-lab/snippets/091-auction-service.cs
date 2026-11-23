// 091 — thin service orchestration [oop]
// Run: dotnet run 091-auction-service.cs

Console.WriteLine(new AuctionService(new MemoryLots()).Board());

interface ILots { string All(); }

class MemoryLots : ILots { public string All() => "LOT-ROSE,LOT-HERB"; }

class AuctionService(ILots lots) { public string Board() => lots.All(); }
