using DotnetMinimalOrderDesk.Contracts;
using DotnetMinimalOrderDesk.Options;
using Microsoft.Extensions.Options;

namespace DotnetMinimalOrderDesk.Services;

public sealed class ConfigApiKeyValidator(IOptions<OrderDeskOptions> options) : IApiKeyValidator
{
    public bool IsValid(string? presented) =>
        !string.IsNullOrWhiteSpace(presented)
        && string.Equals(presented, options.Value.ApiKey, StringComparison.Ordinal);
}
