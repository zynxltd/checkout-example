# MongoDB lead audit (optional)

Default audit store is **in-memory**. To use real Mongo behind the same `ILeadAuditStore`:

```bash
cd demos/dotnet-mvc-crash-course
docker compose -f docker-compose.mongo.yml up -d

# appsettings.Development.json or env:
# AuditStore__Driver=mongo
dotnet run --launch-profile http
```

```bash
# after submitting a lead and waiting ~1s for the worker:
curl -s http://localhost:5187/api/leads/{id}/audit
```

Documents land in `greenshelf.lead_audit`. Flip `Driver` back to `memory` when Docker is down.
