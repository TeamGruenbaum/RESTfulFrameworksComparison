using System.ComponentModel.DataAnnotations;
using libraryapi.DatabaseContexts;
using libraryapi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace libraryapi.Controllers;


[ApiController]
[Route("/v1/books")]
public class BooksController : ControllerBase {
    private readonly BooksContext _booksContext;
    
    public BooksController(BooksContext booksContext) => _booksContext = booksContext;

    [HttpGet("{id}")]
    public async Task<ActionResult<Book>> GetBook([Required] uint id) {
        Book? searchedBook = await _booksContext.Books.FindAsync(id);
        if (searchedBook == null) {
            return NotFound();
        }
        
        return searchedBook;
    }
    
    [HttpGet]
    public async Task<BooksResponse> GetBooks([FromQuery] [Required] [Range(1, uint.MaxValue)] uint page, [FromQuery] [Required] [Range(1, 50)] uint per_page, [FromQuery] [MinLength(1)] [MaxLength(30)] string? query) {
        IQueryable<Book> queryable = from books in _booksContext.Books orderby books.id ascending select books;

        if (query != null) {
            queryable=queryable.Where(book => book.id.ToString()!.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                                      book.isbn.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                                      book.title.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                                      book.author.Contains(query, StringComparison.OrdinalIgnoreCase));
        }

        return new BooksResponse(
            ((uint) await queryable.CountAsync()/per_page)+1,
            await queryable
                .Skip((int) ((page-1) * per_page))
                .Take((int) per_page)
                .ToListAsync()
            );
    }
    
    [HttpPost]
    public async Task<IActionResult> CreateBook([FromBody] [Required] CreateBook createBook) {
        Book newBook = new Book(null, createBook.isbn, createBook.title, createBook.author);
        _booksContext.Books.Add(newBook);
        await _booksContext.SaveChangesAsync();

        return Created("", new IdResponse((uint) newBook.id!));
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateBook([Required] uint id, [FromBody] UpdateBook updateBook) {
        Book? searchedBook = await _booksContext.Books.FindAsync(id);
        if (searchedBook == null) {
            return NotFound();
        }

        if (updateBook.isbn != null) {
            searchedBook.isbn = updateBook.isbn;
        }

        if (updateBook.title != null) {
            searchedBook.title = updateBook.title;
        }

        if (updateBook.author != null) {
            searchedBook.author = updateBook.author;
        }

        await _booksContext.SaveChangesAsync();
        
        return NoContent();
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook([Required] uint id) {
        Book? searchedBook = await _booksContext.Books.FindAsync(id);
        if (searchedBook == null) {
            return NotFound();
        }

        _booksContext.Books.Remove(searchedBook);
        await _booksContext.SaveChangesAsync();

        return NoContent();
    }
}