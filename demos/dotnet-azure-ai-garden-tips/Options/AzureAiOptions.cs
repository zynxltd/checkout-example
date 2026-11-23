namespace DotnetAzureAiGardenTips.Options;

public sealed class AzureAiOptions
{
    public const string SectionName = "AzureAi";

    /// <summary>When false or missing endpoint/key, StubGardenTipGenerator is used.</summary>
    public bool Enabled { get; set; }

    public string Endpoint { get; set; } = "";
    public string ApiKey { get; set; } = "";
    public string Deployment { get; set; } = "gpt-4o-mini";
    public string ApiVersion { get; set; } = "2024-08-01-preview";
}
