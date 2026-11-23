# SignalR plant auction — architecture (OOP / SOLID)

## Layout

```
Contracts/     # ports — IAuctionService, ILotRepository, IBidPolicy, IAuctionClock
Models/        # Lot, Bid, PlaceBidCommand, BidOutcome, LotStatus
Services/      # AuctionService, InMemoryLotRepository, DefaultBidPolicy, LotCloserWorker
Hubs/          # AuctionHub — thin realtime adapter only
Options/       # AuctionOptions (soft-close / increments)
wwwroot/       # board UI
Program.cs     # composition root
```

## SOLID map

| Principle | Example |
|-----------|---------|
| **S** | Hub only pushes/invokes; `DefaultBidPolicy` only validates; `LotCloserWorker` only closes expired lots |
| **O** | New bid rules → new `IBidPolicy` (VIP floors) without changing the hub or repository API |
| **L** | Any `ILotRepository` works behind `AuctionService` |
| **I** | Small ports (`IBidPolicy`, `IAuctionClock`) instead of one god board |
| **D** | Hub depends on `IAuctionService`, not `InMemoryLotRepository` |

## Request paths

```
Browser invoke PlaceBid
  → AuctionHub
  → IAuctionService.PlaceBid
  → IBidPolicy.Validate + ILotRepository.TryApplyBid
  → Clients.All lotUpdated (+ lotExtended on soft-close)

Every ~2s
  → LotCloserWorker → CloseExpiredLots → board push if any closed
```

## Behaviours to review

- Min increment + reserve + “already high bidder” guard
- Soft-close anti-snipe (`Auction:SoftCloseSeconds` / `ExtendSeconds`)
- Status: Open → ClosingSoon → Sold | Unsold
- Clock abstraction (`IAuctionClock`) for testable time

## Laravel cheat sheet

| Laravel | Here |
|---------|------|
| Echo / Broadcasting | SignalR Hub |
| Policy | `IBidPolicy` |
| Job / scheduler | `LotCloserWorker` (`BackgroundService`) |
| Service container bind | `builder.Services.AddSingleton<…>` |
