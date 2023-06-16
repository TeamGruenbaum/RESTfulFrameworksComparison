package libraryapi.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "books")
public class Book {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
    @Column(name="isbn", nullable=false)
    @Pattern(regexp="^(978-?|979-?)?\\d{1,5}-?\\d{1,7}-?\\d{1,6}-?\\d{1,3}$", message="isbn is not in the correct format.")
    private String isbn;
    @Column(name="title", nullable=false)
    @Size(min=1, max=300, message="title must have between {min} and {max} characters.")
    @NotBlank(message="title must not be empty.")
    private String title;
    @Column(name="author", nullable=false)
    @Size(min=1, max=100, message="author must have between {min} and {max} characters.")
    @NotBlank(message="author must not be empty.")
    private String author;

    protected Book() {}

    public Book(String isbn, String title, String author) {
        this.isbn=isbn;
        this.title=title;
        this.author=author;
    }

    public int getId() {
        return id;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn=isbn;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title=title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author=author;
    }
}
