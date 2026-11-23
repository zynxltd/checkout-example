# Middleware Pipeline Demo

Shows how `app.Use(async (context, next) => …)` layers work: request goes **in**, then response comes **out**.

## Run

```bash
cd demos/dotnet-middleware-pipeline
dotnet run
```

Open http://127.0.0.1:5201 and watch the terminal.

## What to notice

- Code **before** `await next()` runs on the way **in**
- Code **after** `await next()` runs on the way **out**
- Order of `app.Use(...)` calls = order of the pipeline
