using BooksApi.Models;

namespace BooksApi.Filters;

/// <summary>
/// Runs before the POST handler. Rejects incomplete books with 400 Problem Details.
/// </summary>
public class ValidateBookFilter : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        var book = context.GetArgument<Book>(0);

        if (string.IsNullOrWhiteSpace(book.Title) || book.Pages <= 0)
        {
            return Results.Problem(
                detail: "Invalid book data",
                statusCode: StatusCodes.Status400BadRequest,
                title: "Validation Failed");
        }

        return await next(context);
    }
}
