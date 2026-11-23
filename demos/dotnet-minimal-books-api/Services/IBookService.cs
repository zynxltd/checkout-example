using BooksApi.Models;

namespace BooksApi.Services;

public interface IBookService
{
    IReadOnlyList<Book> GetBooks();
    Book? GetBookById(int id);
    Book CreateBook(Book book);
}
