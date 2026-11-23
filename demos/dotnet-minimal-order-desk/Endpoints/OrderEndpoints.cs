using DotnetMinimalOrderDesk.Contracts;
using DotnetMinimalOrderDesk.Filters;
using DotnetMinimalOrderDesk.Models;

namespace DotnetMinimalOrderDesk.Endpoints;

public static class OrderEndpoints
{
    public static RouteGroupBuilder MapOrderDeskApi(this WebApplication app)
    {
        app.MapGet("/api/health", (IOrderService orders) =>
            Results.Ok(new { status = "ok", service = "order-desk", openOrders = orders.OpenCount }));

        app.MapGet("/api/catalog", (ISkuCatalog catalog) => Results.Ok(catalog.All()))
            .AddEndpointFilter<ApiKeyEndpointFilter>();

        var orders = app.MapGroup("/api/orders")
            .AddEndpointFilter<ApiKeyEndpointFilter>();

        orders.MapGet("/", (OrderStatus? status, IOrderService svc) => Results.Ok(svc.List(status)));

        orders.MapGet("/{id:guid}", (Guid id, IOrderService svc) =>
            svc.Get(id) is { } order ? Results.Ok(order) : Results.NotFound(new { error = "Order not found" }));

        orders.MapPost("/", (CreateOrderRequest body, IOrderService svc) =>
        {
            var result = svc.Create(body);
            if (!result.Ok)
            {
                return result.ErrorCode == "stock"
                    ? Results.Conflict(new { error = result.Message })
                    : Results.ValidationProblem(new Dictionary<string, string[]>
                    {
                        ["order"] = [result.Message!],
                    });
            }

            return Results.Created($"/api/orders/{result.Order!.Id}", result.Order);
        });

        orders.MapPost("/{id:guid}/cancel", (Guid id, IOrderService svc) => MapMutation(svc.Cancel(id)));
        orders.MapPost("/{id:guid}/pack", (Guid id, IOrderService svc) => MapMutation(svc.Pack(id)));
        orders.MapPost("/{id:guid}/ship", (Guid id, ShipRequest? body, IOrderService svc) =>
            MapMutation(svc.Ship(id, body?.Tracking)));

        return orders;
    }

    private static IResult MapMutation(OrderMutationResult result)
    {
        if (result.Ok) return Results.Ok(result.Order);
        if (result.ErrorCode == "not_found") return Results.NotFound(new { error = result.Message });
        return Results.Conflict(new { error = result.Message });
    }

    private sealed record ShipRequest(string? Tracking);
}
