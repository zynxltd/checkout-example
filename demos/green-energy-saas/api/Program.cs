using System.Text.Json.Serialization;
using GreenEnergy.Api.Data;
using GreenEnergy.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5175", "http://127.0.0.1:5175")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddSingleton<PlatformStore>();
builder.Services.AddSingleton<MetricsService>();

var app = builder.Build();

app.UseCors();

app.MapGet("/api/health", () => Results.Ok(new { status = "ok", runtime = "net10.0" }));

app.MapGet("/api/tenant", (PlatformStore store) => Results.Ok(store.Tenant));

app.MapGet("/api/dashboard", (PlatformStore store, MetricsService metrics) =>
{
    var dash = metrics.BuildDashboard(store);
    return Results.Ok(dash);
});

app.MapGet("/api/sites", (PlatformStore store, MetricsService metrics) =>
{
    var sites = store.Sites.Select(s => metrics.EnrichSite(s)).ToList();
    return Results.Ok(sites);
});

app.MapGet("/api/sites/{id}", (string id, PlatformStore store, MetricsService metrics) =>
{
    var site = store.Sites.FirstOrDefault(s => s.Id == id);
    if (site is null) return Results.NotFound();
    return Results.Ok(metrics.EnrichSite(site));
});

app.MapGet("/api/generation", (PlatformStore store, MetricsService metrics, string? range) =>
{
    var hours = range == "7d" ? 24 * 7 : 24;
    return Results.Ok(metrics.GenerationSeries(store, hours));
});

app.MapGet("/api/alerts", (PlatformStore store) => Results.Ok(store.Alerts));

app.Run();
