using System.Text;
using System.Text.Json;
using DotnetAzureAiGardenTips.Contracts;
using DotnetAzureAiGardenTips.Options;
using Microsoft.Extensions.Options;

namespace DotnetAzureAiGardenTips.Services;

/// <summary>Azure OpenAI chat completions via HttpClient (Azure AI Foundry / AOAI shape).</summary>
public sealed class AzureOpenAiGardenTipGenerator(
    HttpClient http,
    IOptions<AzureAiOptions> options,
    ILogger<AzureOpenAiGardenTipGenerator> logger) : IGardenTipGenerator
{
    public string ProviderName => "azure-openai";

    public async Task<GardenTipResult> GenerateAsync(GardenTipRequest request, CancellationToken ct = default)
    {
        var cfg = options.Value;
        var plant = string.IsNullOrWhiteSpace(request.Plant) ? "garden plant" : request.Plant.Trim();
        var season = string.IsNullOrWhiteSpace(request.Season) ? "spring" : request.Season.Trim();
        var goal = string.IsNullOrWhiteSpace(request.Goal) ? "healthy growth" : request.Goal.Trim();

        var endpoint = cfg.Endpoint.TrimEnd('/');
        var url =
            $"{endpoint}/openai/deployments/{cfg.Deployment}/chat/completions?api-version={cfg.ApiVersion}";

        using var msg = new HttpRequestMessage(HttpMethod.Post, url);
        msg.Headers.Add("api-key", cfg.ApiKey);
        msg.Content = new StringContent(
            JsonSerializer.Serialize(new
            {
                messages = new object[]
                {
                    new { role = "system", content = "You are a concise UK garden-centre horticulturist. Reply in 2–3 short sentences." },
                    new { role = "user", content = $"Plant: {plant}. Season: {season}. Goal: {goal}. Give practical care tips." },
                },
                max_tokens = 180,
                temperature = 0.4,
            }),
            Encoding.UTF8,
            "application/json");

        using var response = await http.SendAsync(msg, ct);
        var raw = await response.Content.ReadAsStringAsync(ct);
        if (!response.IsSuccessStatusCode)
        {
            logger.LogWarning("Azure OpenAI failed {Status}: {Body}", (int)response.StatusCode, raw);
            throw new InvalidOperationException($"Azure OpenAI error {(int)response.StatusCode}");
        }

        using var doc = JsonDocument.Parse(raw);
        var tip = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString()
            ?.Trim()
            ?? "No content returned.";

        return new GardenTipResult(ProviderName, plant, tip, UsedLiveAzure: true);
    }
}

/// <summary>Tries Azure when enabled; falls back to stub on failure (resilience).</summary>
public sealed class ResilientGardenTipGenerator(
    StubGardenTipGenerator stub,
    AzureOpenAiGardenTipGenerator? azure,
    IOptions<AzureAiOptions> options,
    ILogger<ResilientGardenTipGenerator> logger) : IGardenTipGenerator
{
    public string ProviderName =>
        options.Value.Enabled && azure is not null ? "azure-openai-with-stub-fallback" : stub.ProviderName;

    public async Task<GardenTipResult> GenerateAsync(GardenTipRequest request, CancellationToken ct = default)
    {
        if (options.Value.Enabled && azure is not null
            && !string.IsNullOrWhiteSpace(options.Value.Endpoint)
            && !string.IsNullOrWhiteSpace(options.Value.ApiKey))
        {
            try
            {
                return await azure.GenerateAsync(request, ct);
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Azure tip generation failed — using stub");
            }
        }

        return await stub.GenerateAsync(request, ct);
    }
}
