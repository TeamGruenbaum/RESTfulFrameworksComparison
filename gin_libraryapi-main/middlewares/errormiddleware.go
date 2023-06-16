package middlewares

import (
	"gin_libraryapi/models/datatransferobjects"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

func ErrorMiddleware(context *gin.Context) {
	context.Next()

	if len(context.Errors) > 0 {
		context.JSON(http.StatusInternalServerError, datatransferobjects.ErrorResponse{Message: strings.Join(context.Errors.Errors()[:], "; ")})
	}
}
