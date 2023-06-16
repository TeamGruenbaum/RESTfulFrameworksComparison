package datatransferobjects

import "gin_libraryapi/models"

type BooksResponse struct {
	MaximumPage uint           `json:"maximumPage"`
	Items       *[]models.Book `json:"items"`
}
