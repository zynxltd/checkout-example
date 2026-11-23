# SignalR plant auction — real-time .NET swing

**Use case:** live bidding board (WebSockets via SignalR) with SOLID layering.  
Contrast with MVC crash course (request → response) and Minimal order desk (HTTP JSON only).

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for the SOLID map.

| Laravel cousin | Here |
|----------------|------|
| Broadcasting / Echo / websockets | **SignalR Hub** |
| Policy | `IBidPolicy` |
| Scheduled job | `LotCloserWorker` |

## Run

```bash
cd demos/dotnet-signalr-plant-auction
dotnet run
```

Open **http://127.0.0.1:5191** in **two tabs** → bid from each → watch `lotUpdated`. Bid in the last ~45s to see soft-close `lotExtended`.

## Flow

```
Browser  →  AuctionHub.PlaceBid
              → IAuctionService → IBidPolicy + ILotRepository
              → Clients.All.lotUpdated / lotExtended
```

## What to notice

- Thin hub; rules in `DefaultBidPolicy`
- Soft-close anti-snipe + background lot closer
- `IAuctionClock` for DIP / testability
- REST snapshot: `GET /api/lots`

**Port:** `5191`
