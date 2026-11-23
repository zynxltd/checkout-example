namespace DotnetAzureAiGardenTips.Contracts;

public interface IGardenTipGenerator
{
    string ProviderName { get; }
    Task<GardenTipResult> GenerateAsync(GardenTipRequest request, CancellationToken ct = default);
}

public sealed record GardenTipRequest(string Plant, string Season, string? Goal);

public sealed record GardenTipResult(
    string Provider,
    string Plant,
    string Tip,
    bool UsedLiveAzure);
