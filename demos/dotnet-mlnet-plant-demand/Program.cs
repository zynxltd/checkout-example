using DotnetMlNetPlantDemand.Contracts;
using DotnetMlNetPlantDemand.Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<IDemandModel, MlNetDemandModel>();

var app = builder.Build();

app.MapGet("/", () => Results.Content(PageHtml.Content, "text/html"));

app.MapGet("/api/health", (IDemandModel model) =>
    Results.Ok(new { status = "ok", service = "mlnet-plant-demand", model = model.Info }));

app.MapGet("/api/model", (IDemandModel model) => Results.Ok(model.Info));

app.MapPost("/api/predict", (PredictRequest body, IDemandModel model) =>
{
    if (string.IsNullOrWhiteSpace(body.Category))
        return Results.ValidationProblem(new Dictionary<string, string[]>
        {
            ["category"] = ["Category is required (plants|wildlife|soil|tools)"],
        });

    var prediction = model.Predict(new DemandFeatures(
        body.Category,
        body.UnitPrice <= 0 ? 19.99f : body.UnitPrice,
        body.SeasonMonth is < 1 or > 12 ? DateTime.UtcNow.Month : body.SeasonMonth,
        body.Promo ? 1f : 0f,
        body.StockDays <= 0 ? 14f : body.StockDays));

    return Results.Ok(new
    {
        input = body,
        prediction.HighDemand,
        prediction.Probability,
        prediction.Advice,
        model = model.Info,
    });
});

app.Run("http://127.0.0.1:5195");

internal sealed record PredictRequest(
    string Category,
    float UnitPrice = 19.99f,
    int SeasonMonth = 0,
    bool Promo = false,
    float StockDays = 14f);

internal static class PageHtml
{
    public const string Content = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ML.NET plant demand</title>
  <style>
    body{font-family:Segoe UI,system-ui,sans-serif;max-width:720px;margin:2rem auto;padding:0 1rem;color:#15241a;background:#f4faf6}
    code,pre{background:#e8f2eb;padding:.15rem .35rem;border-radius:4px}
    pre{padding:.75rem;overflow:auto}
    .muted{color:#5a6b60}
  </style>
</head>
<body>
  <h1>GreenShelf · ML.NET demand</h1>
  <p class="muted">Trains a binary classifier on startup (synthetic garden sales). Predict high vs soft demand.</p>
  <pre>
curl -s http://127.0.0.1:5195/api/model

curl -s http://127.0.0.1:5195/api/predict \\
  -H 'Content-Type: application/json' \\
  -d '{"category":"plants","unitPrice":24.99,"seasonMonth":4,"promo":true,"stockDays":8}'
  </pre>
</body>
</html>
""";
}
