import {ValidationError} from "../models/errors/ValidationError.js";
import {CreateBook} from "../models/./dataTransferObjects/CreateBook.js";
import {UpdateBook} from "../models/./dataTransferObjects/UpdateBook.js";
import {GetAllBooks} from "../models/./dataTransferObjects/GetAllBooks.js";

export class FormValidator {
    public isCreateBook(value:unknown, validationErrors:ValidationError[]):value is CreateBook {
        if(!this.isNonNullObject(value, validationErrors)) {
            return false
        }

        let startValidationErrorsLength:number=validationErrors.length
        if(!("isbn" in value)) {
            validationErrors.push({parameterName:"isbn", errorMessage:"is missing."})
        } else if(typeof value.isbn!=="string") {
            validationErrors.push({parameterName:"isbn", errorMessage:"is not a string."})
        }
        if(!("title" in value))
        {
            validationErrors.push({parameterName:"title", errorMessage:"is missing."})
        } else if(typeof value.title!=="string") {
            validationErrors.push({parameterName:"title", errorMessage:"is not a string."})
        }
        if(!("author" in value)) {
            validationErrors.push({parameterName:"author", errorMessage:"is missing."})
        } else if(typeof value.author!=="string") {
            validationErrors.push({parameterName:"author", errorMessage:"is not a string."})
        }
        return validationErrors.length===startValidationErrorsLength
    }

    public isUpdateBook(value:unknown, validationErrors:ValidationError[]):value is UpdateBook {
        if(!this.isNonNullObject(value, validationErrors)) {
            return false
        }

        let startValidationErrorsLength:number=validationErrors.length
        if("isbn" in value && (typeof value.isbn!=="string")) {
            validationErrors.push({parameterName:"isbn", errorMessage:"is not a string in the correct format."})
        }
        if("title" in value && (typeof value.title!=="string")) {
            validationErrors.push({parameterName:"title", errorMessage:"is not a string with at least one character."})
        }
        if("author" in value && (typeof value.author!=="string")) {
            validationErrors.push({parameterName:"author", errorMessage:"is not a string with at least one character."})
        }
        return validationErrors.length===startValidationErrorsLength
    }

    public isGetAllBooks(value:unknown, validationErrors:ValidationError[]):value is GetAllBooks {
        if(!this.isNonNullObject(value, validationErrors)) {
            return false
        }

        let startValidationErrorsLength:number=validationErrors.length
        if(!("page" in value)) {
            validationErrors.push({parameterName:"page", errorMessage:"is missing."})
        } else if(typeof value.page!=="string") {
            validationErrors.push({parameterName:"page", errorMessage:"is not a string."})
        }
        if(!("per_page" in value)) {
            validationErrors.push({parameterName:"per_page", errorMessage:"is missing."})
        } else if(typeof value.per_page!=="string") {
            validationErrors.push({parameterName:"per_page", errorMessage:"is not a string."})
        }
        if("query" in value && (typeof value.query!=="string")) {
            validationErrors.push({parameterName:"query", errorMessage:"is not a string."})
        }
        return validationErrors.length===startValidationErrorsLength
    }

    public isArrayOfType<ItemType>(value:object, itemChecker:(item:unknown)=>item is ItemType, itemTypeName:string, validationErrors:ValidationError[]):value is Array<ItemType> {
        if(!Array.isArray(value)) {
            validationErrors.push({parameterName:"value", errorMessage:"is not an Array."})
            return false
        }
        if(!value.every((item)=>itemChecker(item))) {
            validationErrors.push({parameterName:"value", errorMessage:"is not an Array with items of Type "+itemTypeName+"."})
            return false
        }
        return true
    }

    public isNonNullObject(value:unknown, validationErrors:ValidationError[]):value is object {
        if(typeof value!=="object") {
            validationErrors.push({parameterName:"value", errorMessage:"is not an object."})
            return false
        }
        if(value===null) {
            validationErrors.push({parameterName:"value", errorMessage:"is null."})
            return false
        }
        return true
    }
}