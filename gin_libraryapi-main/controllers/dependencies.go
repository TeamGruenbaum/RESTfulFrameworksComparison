package controllers

import (
	"gin_libraryapi/models"
	"gin_libraryapi/models/datatransferobjects"
	"gin_libraryapi/services"
)

var booksDataAccessor services.DataAccessor[models.Book, datatransferobjects.CreateBook, datatransferobjects.UpdateBook]

func InjectDependencies(dataAccessor services.DataAccessor[models.Book, datatransferobjects.CreateBook, datatransferobjects.UpdateBook]) {
	booksDataAccessor = dataAccessor
}
