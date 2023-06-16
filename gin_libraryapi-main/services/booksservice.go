package services

import (
	"database/sql"
	"gin_libraryapi/models"
	"gin_libraryapi/models/datatransferobjects"
	_ "github.com/go-sql-driver/mysql"
	"strings"
)

type BooksService struct {
	db *sql.DB
}

func (accessor *BooksService) Connect(dataSourceName string, maxOpenConnections uint) error {
	var openErr error
	accessor.db, openErr = sql.Open("mysql", dataSourceName)

	if openErr != nil {
		return openErr
	}

	_, createErr := accessor.db.Exec(`
		CREATE TABLE IF NOT EXISTS books(
		    id int auto_increment,
		    isbn text not null,
		    title text not null,
		    author text not null, 
		    constraint books_pk primary key (id)
		)`)

	return createErr
}

func (accessor *BooksService) Create(newBook datatransferobjects.CreateBook) (uint, error) {
	result, insertErr := accessor.db.Exec("INSERT INTO books (isbn, title, author) VALUES (?, ?, ?)", newBook.Isbn, newBook.Title, newBook.Author)
	if insertErr != nil {
		return 0, insertErr
	}

	id, insertedIdErr := result.LastInsertId()
	if insertedIdErr != nil {
		return 0, insertedIdErr
	} else {
		return uint(id), nil
	}
}

func (accessor *BooksService) Read(page uint, perPage uint, query string) (uint, *[]models.Book, error) {
	var sqlQuery string = "SELECT * FROM books"
	var arguments []any = make([]any, 0)

	if query != "" {
		sqlQuery += " WHERE isbn LIKE ? OR title LIKE ? OR author LIKE ?"
		arguments = append(arguments, "%"+query+"%", "%"+query+"%", "%"+query+"%")
	}

	sqlQuery += " ORDER BY books.id ASC LIMIT ?,?"
	arguments = append(arguments, (page-1)*perPage, perPage)

	rows, err := accessor.db.Query(sqlQuery, arguments...)
	defer rows.Close()
	if err != nil {
		return 0, nil, err
	}

	var books []models.Book
	for rows.Next() {
		var book models.Book
		rows.Scan(&book.Id, &book.Isbn, &book.Title, &book.Author)
		books = append(books, book)
	}

	if books == nil {
		books = make([]models.Book, 0)
	}

	countResult := accessor.db.QueryRow("SELECT COUNT(*) FROM books")
	var count uint
	err = countResult.Scan(&count)
	if err != nil {
		return 0, nil, err
	}

	return count / perPage, &books, nil
}

func (accessor *BooksService) ReadById(id uint) (*models.Book, error) {
	result := accessor.db.QueryRow("SELECT * FROM books WHERE id = ?", id)

	var book models.Book
	err := result.Scan(&book.Id, &book.Isbn, &book.Title, &book.Author)

	if err != nil {
		return nil, err
	} else {
		return &book, nil
	}
}

func (accessor *BooksService) Update(id uint, updateBook datatransferobjects.UpdateBook) (bool, error) {
	var sqlQuery string = "UPDATE books SET "
	var sqlUpdateParts []string
	var arguments []any = make([]any, 0)

	if updateBook.Isbn != "" {
		sqlUpdateParts = append(sqlUpdateParts, "isbn=?")
		arguments = append(arguments, updateBook.Isbn)
	}

	if updateBook.Title != "" {
		sqlUpdateParts = append(sqlUpdateParts, "title=?")
		arguments = append(arguments, updateBook.Title)
	}

	if updateBook.Author != "" {
		sqlUpdateParts = append(sqlUpdateParts, "author=?")
		arguments = append(arguments, updateBook.Author)
	}

	if len(arguments) == 0 {
		return true, nil
	}

	sqlQuery += strings.Join(sqlUpdateParts, ", ")
	sqlQuery += " WHERE id=?"
	arguments = append(arguments, id)

	result, err := accessor.db.Exec(sqlQuery, arguments...)

	if err != nil {
		return false, err
	} else {
		rowsAffected, affectedErr := result.RowsAffected()

		if affectedErr != nil {
			return false, affectedErr
		} else {
			return rowsAffected > 0, nil
		}
	}
}

func (accessor *BooksService) Delete(id uint) (bool, error) {
	result, err := accessor.db.Exec("DELETE FROM books WHERE id = ?", id)

	if err != nil {
		return false, err
	} else {
		rowsAffected, affectedErr := result.RowsAffected()

		if affectedErr != nil {
			return false, affectedErr
		} else {
			return rowsAffected > 0, nil
		}
	}
}

func (accessor *BooksService) Disconnect() error {
	var err error = accessor.db.Close()
	return err
}
