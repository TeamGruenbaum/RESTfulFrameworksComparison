using System.ComponentModel.DataAnnotations;

namespace libraryapi;

public record class CreateBook([Required] [IsbnNumber] string isbn, [Required] [MinLength(1)] [MaxLength(300)] string title, [Required] [MinLength(1)] [MaxLength(100)] string author);