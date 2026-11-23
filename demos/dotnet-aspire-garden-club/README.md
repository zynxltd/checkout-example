# Garden Club Catalog — .NET Aspire demo

Full-stack demo for the **.NET 10 / Aspire / EF Core 10 / Azure DevOps** stack.

## Story

Browse a seeded garden club catalogue, toggle **Club member** pricing, and express interest (persisted with EF Core + SQLite). Orchestrate with the Aspire AppHost dashboard, or run the Web project alone.

## Stack

| Piece | Choice |
|-------|--------|
| Runtime | .NET 10.0 |
| Language | C# 14 (collection expressions, primary constructors) |
| Web | ASP.NET Core — Razor Pages + Minimal APIs |
| Orchestration | .NET Aspire AppHost |
| Data | EF Core 10.0 + SQLite |
| Observability | OpenTelemetry via ServiceDefaults |
| CI/CD | Azure DevOps YAML (`azure-pipelines/`) |
| Front end | HTML / CSS Living Standard (no SPA framework) |

## Projects

```
GardenClub.AppHost          → Aspire orchestrator
GardenClub.ServiceDefaults  → health + OTLP defaults
GardenClub.Web              → UI + APIs + EF Core
azure-pipelines/            → Azure DevOps CI/CD
```

## Run (Web only — fastest)

```bash
cd demos/dotnet-aspire-garden-club/GardenClub.Web
dotnet run --launch-profile http
```

Open http://localhost:5288

## Run (Aspire AppHost)

Requires Docker Desktop (or compatible) for the Aspire dashboard experience on some setups.

```bash
cd demos/dotnet-aspire-garden-club/GardenClub.AppHost
dotnet run
```

The dashboard opens with the `garden-club-web` resource and its HTTP endpoint.

## API

| Method | Path | Notes |
|--------|------|-------|
| `GET` | `/api/plants?category=` | Catalogue JSON |
| `POST` | `/api/interest` | `{ "email", "sku", "clubMember" }` |
| `GET` | `/api/stats` | Counts + stack labels |
| `GET` | `/health` | Health check |

## Azure DevOps

Import `azure-pipelines/azure-pipelines.yml` into an Azure DevOps project (path filter already scopes to this folder). Stages:

1. **Build** — restore / build / publish Web zip artifact  
2. **Deploy_Preview** — manual environment gate; hook `AzureWebApp@1` or Container Apps in your org

## Demo script (≈3 min)

1. Open the catalogue — show club vs retail prices with the header toggle.  
2. Filter by category; express interest → row lands in SQLite (`InterestRequests`).  
3. Hit `/api/stats` — plants, requests, average club saving.  
4. (Optional) Start AppHost and show the Aspire dashboard + `/health`.  
5. Walk the Azure Pipelines YAML (SDK 10, publish artifact, preview stage).
