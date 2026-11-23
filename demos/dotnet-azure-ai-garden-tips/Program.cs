using DotnetAzureAiGardenTips.Contracts;
using DotnetAzureAiGardenTips.Options;
using DotnetAzureAiGardenTips.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<AzureAiOptions>(builder.Configuration.GetSection(AzureAiOptions.SectionName));
builder.Services.AddSingleton<StubGardenTipGenerator>();
builder.Services.AddHttpClient<AzureOpenAiGardenTipGenerator>();
builder.Services.AddScoped<IGardenTipGenerator, ResilientGardenTipGenerator>();

var app = builder.Build();

app.MapGet("/", (IGardenTipGenerator tips) => Results.Content(PageHtml.For(tips.ProviderName), "text/html"));

app.MapGet("/api/health", (IGardenTipGenerator tips) =>
    Results.Ok(new { status = "ok", service = "azure-ai-garden-tips", provider = tips.ProviderName }));

app.MapPost("/api/tips", async (TipBody body, IGardenTipGenerator tips, CancellationToken ct) =>
{
    if (string.IsNullOrWhiteSpace(body.Plant))
        return Results.ValidationProblem(new Dictionary<string, string[]>
        {
            ["plant"] = ["Plant name is required"],
        });

    var result = await tips.GenerateAsync(
        new GardenTipRequest(body.Plant, body.Season ?? "spring", body.Goal),
        ct);

    return Results.Ok(result);
});

app.Run("http://127.0.0.1:5196");

internal sealed record TipBody(string Plant, string? Season, string? Goal);

internal static class PageHtml
{
    public static string For(string provider) => $$"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Azure AI garden tips</title>
  <style>
    body{font-family:Segoe UI,system-ui,sans-serif;max-width:720px;margin:2rem auto;padding:0 1rem;color:#15241a;background:#f4faf6}
    code,pre{background:#e8f2eb;padding:.15rem .35rem;border-radius:4px}
    pre{padding:.75rem;overflow:auto}
    .muted{color:#5a6b60}
  </style>
</head>
<body>
  <h1>GreenShelf · Azure AI tips</h1>
  <p class="muted">Provider now: <code>{{provider}}</code>. Stub works offline; set <code>AzureAi:Enabled</code> + endpoint/key for live Azure OpenAI.</p>
  <pre>
curl -s http://127.0.0.1:5196/api/tips \\
  -H 'Content-Type: application/json' \\
  -d '{"plant":"Climbing rose","season":"spring","goal":"more blooms"}'
  </pre>
</body>
</html>
""";
}
