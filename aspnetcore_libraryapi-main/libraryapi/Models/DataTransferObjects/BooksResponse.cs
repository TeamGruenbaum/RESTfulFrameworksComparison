using libraryapi.Models;

namespace libraryapi;

public record class BooksResponse(uint maximumPage, List<Book> items);