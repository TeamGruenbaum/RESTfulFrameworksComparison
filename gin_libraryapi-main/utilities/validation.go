package utilities

import (
	"fmt"
	"gin_libraryapi/models/datatransferobjects"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"net/http"
	"strings"
)

func BindQuery[T any](context *gin.Context, value *T) bool {
	return bind(context, value, context.ShouldBindQuery)
}

func BindJson[T any](context *gin.Context, value *T) bool {
	return bind(context, value, context.ShouldBindJSON)
}

func bind[T any](context *gin.Context, value *T, bindFunction func(any) error) bool {
	if err := bindFunction(value); err != nil {
		fields, ok := err.(validator.ValidationErrors)

		if ok {
			var messages []string
			for _, element := range fields {
				messages = append(messages, fmt.Sprintf("'%s' failed on the contraint '%s'", strings.ToLower(element.Field()), element.Tag()))
			}

			context.AbortWithStatusJSON(http.StatusBadRequest, datatransferobjects.ErrorsResponse{Messages: messages})
		} else {
			context.AbortWithStatusJSON(http.StatusInternalServerError, datatransferobjects.ErrorResponse{Message: "JSON parsing failed"})
		}

		return true
	} else {
		return false
	}
}
