using BooksApi.Models;

namespace BooksApi.Data;

/// <summary>
/// Demo stand-in for EF Core / SQL. Swap this registration for a real DbContext-backed repo in production.
/// </summary>
public class InMemoryBookRepository : IBookRepository
{
    private readonly List<Book> _books =
    [
        new Book { Id = 1, Title = "C# Basics", Pages = 150 },
        new Book { Id = 2, Title = "Mastering .NET", Pages = 300 }
    ];

    private int _nextId = 3;

    public IReadOnlyList<Book> GetAll() => _books;

    public Book? GetById(int id) => _books.FirstOrDefault(b => b.Id == id);

    public Book Add(Book book)
    {
        book.Id = _nextId++;
        _books.Add(book);
        return book;
    }
}
