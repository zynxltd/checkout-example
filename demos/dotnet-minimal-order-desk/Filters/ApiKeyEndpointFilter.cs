using DotnetMinimalOrderDesk.Contracts;

namespace DotnetMinimalOrderDesk.Filters;

/// <summary>Auth concern only — endpoints do not check keys themselves (SRP).</summary>
public sealed class ApiKeyEndpointFilter(IApiKeyValidator validator) : IEndpointFilter
{
    public const string HeaderName = "X-Api-Key";

    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        context.HttpContext.Request.Headers.TryGetValue(HeaderName, out var key);
        if (!validator.IsValid(key))
            return Results.Unauthorized();

        return await next(context);
    }
}
