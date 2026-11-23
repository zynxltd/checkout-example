# ML.NET plant demand — .NET swing

**Gap covered:** **ML.NET** (train + score in-process).  
GreenShelf predicts whether a SKU window looks like **high demand**.

| Port | `:5195` |
|------|---------|
| Stack | .NET 10 Minimal APIs + **Microsoft.ML** |

See [ARCHITECTURE.md](./ARCHITECTURE.md).

## Run

```bash
cd demos/dotnet-mlnet-plant-demand
dotnet run
```

```bash
curl -s http://127.0.0.1:5195/api/model

curl -s http://127.0.0.1:5195/api/predict \
  -H 'Content-Type: application/json' \
  -d '{"category":"plants","unitPrice":24.99,"seasonMonth":4,"promo":true,"stockDays":8}'
```

## What to notice

- Pipeline: one-hot category → concatenate features → SDCA logistic regression  
- Train/test split + accuracy on `/api/model`  
- `IDemandModel` so you could swap to an Azure ML endpoint later (**DIP**)

**Not Azure ML Studio** — that’s cloud training/hosting; this is the **library** path for on-box models.
