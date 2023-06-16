package libraryapi.models.dataTransferObjects;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateBook(@Pattern(regexp="^(978-?|979-?)?\\d{1,5}-?\\d{1,7}-?\\d{1,6}-?\\d{1,3}$", message="isbn is not in the correct format.") String isbn, @Size(min=1, max=300, message="title must have between {min} and {max} characters.") String title, @Size(min=1, max=100, message="author must have between {min} and {max} characters.") String author) {}
