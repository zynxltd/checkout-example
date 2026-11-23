# Travel Bucket List API

Local completed solution for the Codecademy **Travel Bucket List API** lab (14 tasks).

## Structure (matches the lab)

```
TravelBucketListApi/
├── Program.cs
├── Models/Destination.cs
├── Services/DestinationService.cs
├── Filters/ValidateDestinationFilter.cs
└── Features/Destinations/DestinationEndpoints.cs
```

## Run

```bash
cd demos/dotnet-travel-bucket-list-api
dotnet run --launch-profile http
```

Swagger: check `Properties/launchSettings.json` for the port (often `http://localhost:5xxx/swagger`).

## Endpoints

| Method | Path | Notes |
|--------|------|--------|
| GET | `/api/destinations` | list via `DestinationService` |
| GET | `/api/destinations/{id}` | 404 Problem Details if missing |
| POST | `/api/destinations` | `ValidateDestinationFilter` requires Name |

## Tasks covered

1–3 Structure (model, extension method, register)  
4–7 Route group + TypedResults CRUD  
8–9 DI (`AddScoped` + inject service)  
10–14 Endpoint filter on POST  
