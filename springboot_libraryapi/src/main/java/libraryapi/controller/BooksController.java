package libraryapi.controller;

import libraryapi.models.Book;
import libraryapi.models.dataTransferObjects.BooksResponse;
import libraryapi.models.dataTransferObjects.CreateBook;
import libraryapi.models.dataTransferObjects.IdResponse;
import libraryapi.models.dataTransferObjects.UpdateBook;
import libraryapi.models.errors.NotFoundException;
import libraryapi.repositories.BooksRepository;
import libraryapi.utilities.SearchBooksSpecification;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/books")
@Validated
public class BooksController {
    private final BooksRepository booksRepository;

    @Autowired
    public BooksController(BooksRepository booksRepository) {
        this.booksRepository=booksRepository;
    }

    @PostMapping("")
    public ResponseEntity<IdResponse> createBook(@RequestBody @Valid CreateBook createBook) {
        Book newBook=booksRepository.saveAndFlush(new Book(createBook.isbn(), createBook.title(), createBook.author()));
        return ResponseEntity.status(HttpStatus.CREATED).body(new IdResponse(newBook.getId()));
    }

    @GetMapping("")
    public ResponseEntity<BooksResponse> getAllBooks(@RequestParam @Min(value=1, message="page must be at least 1.") int page, @RequestParam @Min(value=1, message="per_page must be at least 1.") @Max(value=50, message="per_page must be at most 50.") int per_page, @RequestParam(required=false) @Size(min=1, max=30, message="query must have between {min} and {max} characters.") String query) {
        Page<Book> books=null;
        if(query!=null) {
            Specification<Book> specification=new SearchBooksSpecification(new String[]{"isbn", "title", "author"}, query);
            books=booksRepository.findAll(specification, PageRequest.of(page-1, per_page, Sort.by(new Sort.Order(Sort.Direction.ASC, "id"))));
        } else {
            books=booksRepository.findAll(PageRequest.of(page-1, per_page, Sort.by(new Sort.Order(Sort.Direction.ASC, "id"))));
        }
        return ResponseEntity.ok().body(new BooksResponse(books.getTotalPages(), books.getContent()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBook(@PathVariable int id) throws NotFoundException {
        Book book=booksRepository.findById(id).orElseThrow(() -> new NotFoundException("Book not found with id " + id));
        return ResponseEntity.ok().body(book);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateBook(@PathVariable int id, @RequestBody @Valid UpdateBook createBook) throws NotFoundException {
        Book book=booksRepository.findById(id).orElseThrow(() -> new NotFoundException("Book not found with id " + id));
        if(createBook.isbn()!=null) {
            book.setIsbn(createBook.isbn());
        }
        if(createBook.title()!=null) {
            book.setTitle(createBook.title());
        }
        if(createBook.author()!=null) {
            book.setAuthor(createBook.author());
        }
        booksRepository.saveAndFlush(book);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable int id) throws NotFoundException {
        booksRepository.findById(id).orElseThrow(() -> new NotFoundException("Book not found with id " + id));
        booksRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}