using BooksApi.Models;

namespace BooksApi.Data;

public interface IBookRepository
{
    IReadOnlyList<Book> GetAll();
    Book? GetById(int id);
    Book Add(Book book);
}
