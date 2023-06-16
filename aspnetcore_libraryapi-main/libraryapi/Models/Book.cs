using System.ComponentModel.DataAnnotations;

namespace libraryapi.Models;

public record class Book(uint? id, string isbn, string title, string author) {
    [Key] public uint? id  { get; set; } = id;
    public string isbn  { get; set; } = isbn;
    public string title  { get; set; } = title;
    public string author { get; set; } = author;
}