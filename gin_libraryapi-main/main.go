package main

import (
	"gin_libraryapi/controllers"
	"gin_libraryapi/middlewares"
	"gin_libraryapi/router"
	"gin_libraryapi/services"
	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode)

	var engine *gin.Engine = gin.Default()
	engine.HandleMethodNotAllowed = true

	engine.Use(middlewares.ErrorMiddleware)

	var booksDataAccessor *services.BooksService = &services.BooksService{}
	err := booksDataAccessor.Connect("libraryapi:1234@tcp(localhost:21345)/libraryapi?parseTime=true", 150)
	if err != nil {
		return
	}

	controllers.InjectDependencies(booksDataAccessor)

	var booksGroup *gin.RouterGroup = engine.Group("/v1/books")
	router.SetupRouter(booksGroup)

	if err := engine.Run(":31483"); err != nil {
		return
	}
}
