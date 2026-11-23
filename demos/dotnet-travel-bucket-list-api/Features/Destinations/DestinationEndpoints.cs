using Microsoft.AspNetCore.Http.HttpResults;
using TravelBucketListApi.Filters;
using TravelBucketListApi.Models;
using TravelBucketListApi.Services;

namespace TravelBucketListApi.Features.Destinations;

public static class DestinationEndpoints
{
    public static void MapDestinationEndpoints(
        this IEndpointRouteBuilder routes,
        List<Destination> destinations)
    {
        var destinationGroup = routes.MapGroup("/api/destinations");

        destinationGroup.MapGet("/", (DestinationService service) =>
        {
            var all = service.GetAll(destinations);
            return TypedResults.Ok(all);
        });

        destinationGroup.MapGet("/{id:int}", Results<Ok<Destination>, ProblemHttpResult> (
            int id,
            DestinationService service) =>
        {
            var destination = service.GetAll(destinations)
                .FirstOrDefault(d => d.Id == id);

            if (destination is null)
            {
                return TypedResults.Problem(
                    detail: $"Destination with ID {id} was not found.",
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Destination Not Found");
            }

            return TypedResults.Ok(destination);
        });

        destinationGroup.MapPost("/", (Destination destination) =>
        {
            destinations.Add(destination);
            return TypedResults.Created($"/api/destinations/{destination.Id}", destination);
        })
        .AddEndpointFilter<ValidateDestinationFilter>();
    }
}
