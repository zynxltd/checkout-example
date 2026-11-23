# ML.NET plant demand — architecture

## Layout

```
Contracts/IDemandModel.cs   port — Predict + ModelInfo
Services/MlNetDemandModel.cs  trains SdcaLogisticRegression on boot, scores requests
Program.cs                  composition root + Minimal API
```

## SOLID

| Letter | Example |
|--------|---------|
| **S** | Model only trains/scores; endpoints only HTTP |
| **O** | New scorer (Azure ML HTTP) → new `IDemandModel` |
| **D** | Endpoints depend on `IDemandModel`, not `MLContext` |

## Flow

```
App start → Fit pipeline on 480 synthetic rows → hold PredictionEngine
POST /api/predict → IDemandModel.Predict → { highDemand, probability, advice }
```

## Multithreading note

`PredictionEngine` is **not** thread-safe for concurrent calls in all ML.NET versions.
This demo is single-process teaching; for production use `PredictionEnginePool` or a queue.
