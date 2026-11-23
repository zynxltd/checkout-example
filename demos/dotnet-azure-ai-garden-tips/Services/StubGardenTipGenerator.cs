using DotnetAzureAiGardenTips.Contracts;

namespace DotnetAzureAiGardenTips.Services;

/// <summary>Deterministic local stand-in — no Azure account required.</summary>
public sealed class StubGardenTipGenerator : IGardenTipGenerator
{
    public string ProviderName => "stub-rules";

    public Task<GardenTipResult> GenerateAsync(GardenTipRequest request, CancellationToken ct = default)
    {
        var plant = string.IsNullOrWhiteSpace(request.Plant) ? "your plant" : request.Plant.Trim();
        var season = string.IsNullOrWhiteSpace(request.Season) ? "spring" : request.Season.Trim().ToLowerInvariant();
        var goal = string.IsNullOrWhiteSpace(request.Goal) ? "healthy growth" : request.Goal.Trim();

        var watering = season switch
        {
            "summer" => "water deeply 2–3× per week in the cool of morning",
            "winter" => "ease off watering; keep compost barely moist",
            "autumn" or "fall" => "steady moisture while roots settle; mulch after leaf fall",
            _ => "keep compost evenly moist; never waterlog the crown",
        };

        var tip =
            $"For {plant} in {season}, aim for {goal}: {watering}. " +
            "Feed with a balanced liquid fertiliser every 2–3 weeks in active growth, " +
            "and check for aphids under new leaves.";

        return Task.FromResult(new GardenTipResult(ProviderName, plant, tip, UsedLiveAzure: false));
    }
}
