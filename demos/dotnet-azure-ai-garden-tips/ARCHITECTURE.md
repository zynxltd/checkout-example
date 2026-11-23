# Azure AI garden tips — architecture

## Layout

```
Contracts/IGardenTipGenerator.cs
Options/AzureAiOptions.cs
Services/
  StubGardenTipGenerator.cs          # always works offline
  AzureOpenAiGardenTipGenerator.cs   # Azure OpenAI chat HTTP
  ResilientGardenTipGenerator.cs     # live → fallback stub
Program.cs
```

## SOLID

| Letter | Example |
|--------|---------|
| **S** | Stub = rules; Azure client = HTTP; Resilient = failover policy |
| **O** | Add Document Intelligence client without changing endpoints |
| **D** | Endpoints → `IGardenTipGenerator` |

## Flow

```
POST /api/tips
  → ResilientGardenTipGenerator
       if AzureAi:Enabled + key → Azure OpenAI chat
       on failure / disabled → StubGardenTipGenerator
```

## Azure AI vs ML.NET

| | This demo | ML.NET demo |
|--|-----------|-------------|
| Where model runs | Azure OpenAI (cloud) | In-process ML.NET |
| Needs cloud key | Optional | No |
| Job-ad keyword | Azure AI / AOAI | ML.NET |
