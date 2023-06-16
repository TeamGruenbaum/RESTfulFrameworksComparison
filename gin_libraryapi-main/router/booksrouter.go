package router

import (
	"gin_libraryapi/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRouter(router *gin.RouterGroup) {
	router.POST("", controllers.CreateBook)
	router.GET("", controllers.GetBooks)
	router.GET("/:id", controllers.GetBook)
	router.PATCH("/:id", controllers.UpdateBook)
	router.DELETE("/:id", controllers.DeleteBook)
}
