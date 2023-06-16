using System.ComponentModel.DataAnnotations;

namespace libraryapi;


public record class UpdateBook([IsbnNumber] string? isbn, [MinLength(1)] [MaxLength(300)] string? title, [MinLength(1)] [MaxLength(100)]  string? author);