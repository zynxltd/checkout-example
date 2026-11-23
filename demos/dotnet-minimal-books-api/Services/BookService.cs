using BooksApi.Data;
using BooksApi.Models;

namespace BooksApi.Services;

/// <summary>
/// Business logic layer. Endpoints depend on this — not on the repository directly.
/// </summary>
public class BookService(IBookRepository repository) : IBookService
{
    public IReadOnlyList<Book> GetBooks() => repository.GetAll();

    public Book? GetBookById(int id) => repository.GetById(id);

    public Book CreateBook(Book book)
    {
        // Real apps: more rules, auditing, events, etc.
        return repository.Add(book);
    }
}
