using BooksApi.Filters;
using BooksApi.Models;
using BooksApi.Services;
using Microsoft.AspNetCore.Http.HttpResults;

namespace BooksApi.Endpoints;

public static class BookEndpoints
{
    public static IEndpointRouteBuilder MapBookEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/books");

        group.MapGet("/", GetAll);
        group.MapGet("/{id:int}", GetById);
        group.MapPost("/", Create)
            .AddEndpointFilter<ValidateBookFilter>();

        return routes;
    }

    private static Ok<IReadOnlyList<Book>> GetAll(IBookService service)
        => TypedResults.Ok(service.GetBooks());

    private static Results<Ok<Book>, ProblemHttpResult> GetById(int id, IBookService service)
    {
        var book = service.GetBookById(id);
        if (book is null)
        {
            return TypedResults.Problem(
                detail: $"Book with ID {id} was not found.",
                statusCode: StatusCodes.Status404NotFound,
                title: "Book Not Found");
        }

        return TypedResults.Ok(book);
    }

    private static Created<Book> Create(Book book, IBookService service)
    {
        var created = service.CreateBook(book);
        return TypedResults.Created($"/api/books/{created.Id}", created);
    }
}
