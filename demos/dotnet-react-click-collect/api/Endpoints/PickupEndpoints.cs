using DotnetReactClickCollect.Api.Contracts;
using DotnetReactClickCollect.Api.Models;

namespace DotnetReactClickCollect.Api.Endpoints;

public static class PickupEndpoints
{
    public static void MapPickupApi(this WebApplication app)
    {
        app.MapGet("/api/health", () =>
            Results.Ok(new { status = "ok", service = "click-collect", runtime = "net10.0" }));

        app.MapGet("/api/catalogue", (IPickupService svc) => Results.Ok(svc.ListCatalogue()));
        app.MapGet("/api/slots", (IPickupService svc) => Results.Ok(svc.ListSlots()));

        var reservations = app.MapGroup("/api/reservations");

        reservations.MapGet("/", (ReservationStatus? status, string? email, IPickupService svc) =>
            Results.Ok(svc.ListReservations(status, email)));

        reservations.MapGet("/{id:guid}", (Guid id, IPickupService svc) =>
            svc.Get(id) is { } row ? Results.Ok(row) : Results.NotFound(new { error = "Not found" }));

        reservations.MapPost("/", (CreateReservationRequest body, IPickupService svc) =>
        {
            var result = svc.Create(body);
            if (!result.Ok)
            {
                if (result.ErrorCode is "stock" or "slot")
                    return Results.Conflict(new { error = result.Message });
                return Results.ValidationProblem(new Dictionary<string, string[]>
                {
                    ["reservation"] = [result.Message!],
                });
            }

            return Results.Created($"/api/reservations/{result.Reservation!.Id}", result.Reservation);
        });

        reservations.MapPost("/{id:guid}/cancel", (Guid id, IPickupService svc) => Map(svc.Cancel(id)));
        reservations.MapPost("/{id:guid}/ready", (Guid id, IPickupService svc) => Map(svc.MarkReady(id)));
        reservations.MapPost("/{id:guid}/collect", (Guid id, IPickupService svc) => Map(svc.Collect(id)));
    }

    private static IResult Map(MutationResult result)
    {
        if (result.Ok) return Results.Ok(result.Reservation);
        if (result.ErrorCode == "not_found") return Results.NotFound(new { error = result.Message });
        return Results.Conflict(new { error = result.Message });
    }
}
