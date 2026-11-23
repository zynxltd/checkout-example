using TravelBucketListApi.Models;

namespace TravelBucketListApi.Filters;

public class ValidateDestinationFilter : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        var destination = context.GetArgument<Destination>(0);

        if (string.IsNullOrWhiteSpace(destination.Name))
        {
            return Results.Problem(
                detail: "Destination name is required.",
                statusCode: StatusCodes.Status400BadRequest,
                title: "Validation Failed");
        }

        return await next(context);
    }
}
