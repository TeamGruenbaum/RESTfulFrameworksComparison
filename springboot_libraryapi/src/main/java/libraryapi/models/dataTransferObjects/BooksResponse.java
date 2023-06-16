package libraryapi.models.dataTransferObjects;

import libraryapi.models.Book;

import java.util.List;

public record BooksResponse(int maximumPage, List<Book> items) {}
