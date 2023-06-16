using libraryapi.Models;
using Microsoft.EntityFrameworkCore;

namespace libraryapi.DatabaseContexts;

public class BooksContext : DbContext {
    public DbSet<Book> Books { get; init; } = null!;

    public BooksContext(DbContextOptions<BooksContext> options) : base(options) {
        if (options == null) throw new ArgumentNullException(nameof(options));
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        modelBuilder.Entity<Book>().ToTable("Books");
    }
}