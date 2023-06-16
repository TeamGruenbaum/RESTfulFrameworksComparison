package controllers

import (
	"gin_libraryapi/models/datatransferobjects"
	"gin_libraryapi/utilities"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

func CreateBook(context *gin.Context) {
	var createBook datatransferobjects.CreateBook
	if result := utilities.BindJson(context, &createBook); result {
		return
	}

	id, err := booksDataAccessor.Create(createBook)

	if err != nil {
		context.Error(err)
		return
	} else {
		context.JSON(http.StatusCreated, datatransferobjects.IdResponse{Id: id})
	}
}

func GetBooks(context *gin.Context) {
	var query datatransferobjects.GetAllBooks
	if result := utilities.BindQuery(context, &query); result {
		return
	}

	maximumPage, books, err := booksDataAccessor.Read(uint(query.Page), uint(query.Per_Page), query.Query)
	if err != nil {
		context.Error(err)
		return
	}

	context.JSON(http.StatusOK, datatransferobjects.BooksResponse{
		MaximumPage: maximumPage,
		Items:       books,
	})
}

func GetBook(context *gin.Context) {
	if id, err := strconv.Atoi(context.Param("id")); err != nil || id < 0 {
		context.AbortWithStatusJSON(http.StatusBadRequest, datatransferobjects.ErrorResponse{Message: "Invalid book id"})
	} else {
		book, _ := booksDataAccessor.ReadById(uint(id))

		if book == nil {
			context.AbortWithStatus(http.StatusNotFound)
		} else {
			context.JSON(http.StatusOK, book)
		}
	}
}

func UpdateBook(context *gin.Context) {
	if id, err := strconv.Atoi(context.Param("id")); err != nil || id < 0 {
		context.AbortWithStatusJSON(http.StatusBadRequest, datatransferobjects.ErrorResponse{Message: "Invalid book id"})
	} else {
		var updateBook datatransferobjects.UpdateBook
		if result := utilities.BindJson(context, &updateBook); result {
			return
		}

		_, err = booksDataAccessor.Update(uint(id), updateBook)

		context.JSON(http.StatusNoContent, nil)
	}
}

func DeleteBook(context *gin.Context) {
	if id, err := strconv.Atoi(context.Param("id")); err != nil || id < 0 {
		context.AbortWithStatusJSON(http.StatusBadRequest, datatransferobjects.ErrorResponse{Message: "Invalid book id"})
	} else {
		book, _ := booksDataAccessor.Delete(uint(id))
		context.JSON(http.StatusNoContent, book)
	}
}
