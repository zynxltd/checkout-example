# Azure AI garden tips — .NET swing

**Gap covered:** **Azure AI** shape (Azure OpenAI chat) with a **stub fallback** so the demo always runs.

| Port | `:5196` |
|------|---------|
| Stack | .NET 10 Minimal APIs + `HttpClient` → Azure OpenAI |

See [ARCHITECTURE.md](./ARCHITECTURE.md).

## Run (offline stub — default)

```bash
cd demos/dotnet-azure-ai-garden-tips
dotnet run
```

```bash
curl -s http://127.0.0.1:5196/api/tips \
  -H 'Content-Type: application/json' \
  -d '{"plant":"Climbing rose","season":"spring","goal":"more blooms"}'
```

## Optional — live Azure OpenAI

In `appsettings.Development.json` (do not commit secrets):

```json
{
  "AzureAi": {
    "Enabled": true,
    "Endpoint": "https://YOUR-RESOURCE.openai.azure.com",
    "ApiKey": "…",
    "Deployment": "gpt-4o-mini"
  }
}
```

Or env vars: `AzureAi__Enabled=true`, `AzureAi__Endpoint=…`, `AzureAi__ApiKey=…`.

## What to notice

- Same interface for stub vs cloud (**DIP**)  
- Resilient wrapper falls back if Azure is down  
- Interview line: “Azure AI Foundry / OpenAI for generative tips; ML.NET for tabular demand scoring”
