import {ValidationError} from "../models/errors/ValidationError.js";
import {CreateBook} from "../models/./dataTransferObjects/CreateBook.js";
import {UpdateBook} from "../models/./dataTransferObjects/UpdateBook.js";
import {GetAllBooks} from "../models/./dataTransferObjects/GetAllBooks.js";

export class ContentValidator {
    public validateGetAllBooks(getAllBooks:GetAllBooks, validationErrors:ValidationError[]):boolean {
        let startValidationErrorsLength:number=validationErrors.length
        if(isNaN(parseInt(getAllBooks.page)) || parseInt(getAllBooks.page)<1) {
            validationErrors.push({parameterName:"page", errorMessage:"is not parsable to a number greater than 0."})
        }
        if(isNaN(parseInt(getAllBooks.per_page)) || parseInt(getAllBooks.per_page)<1 || parseInt(getAllBooks.per_page)>50) {
            validationErrors.push({parameterName:"per_page", errorMessage:"is not parsable to a number between 1 and 50."})
        }
        if (getAllBooks.query !== undefined) {
            this.validateTextLength(getAllBooks.query, "query", 1, 30, validationErrors)
        }
        return validationErrors.length===startValidationErrorsLength

    }

    public validateCreateBook(createBook:CreateBook, validationErrors:ValidationError[]):boolean {
        let startValidationErrorsLength:number=validationErrors.length

        this.validateIsbn(createBook.isbn, validationErrors)
        this.validateTextLength(createBook.title, "title", 1, 300, validationErrors)
        this.validateTextLength(createBook.author, "author", 1, 100, validationErrors)

        return validationErrors.length===startValidationErrorsLength
    }

    public validateUpdateBook(updateBook:UpdateBook, validationErrors:ValidationError[]):boolean {
        let startValidationErrorsLength:number=validationErrors.length
        if(updateBook.isbn!==undefined) {
            this.validateIsbn(updateBook.isbn, validationErrors)
        }
        if(updateBook.title!==undefined) {
            this.validateTextLength(updateBook.title, "title", 1, 300, validationErrors)
        }
        if (updateBook.author !== undefined) {
            this.validateTextLength(updateBook.author, "author", 1, 100, validationErrors)
        }
        return validationErrors.length===startValidationErrorsLength
    }

    public validateId(id:string, validationErrors:ValidationError[]):boolean {
        if(isNaN(parseInt(id)) || parseInt(id)<0) {
            validationErrors.push({parameterName:"id", errorMessage:"is not parsable to a non-negative number."})
            return false
        }
        return true
    }

    private validateIsbn(isbn:string, validationErrors:ValidationError[]):boolean {
        if(!(/^(978-?|979-?)?\d{1,5}-?\d{1,7}-?\d{1,6}-?\d{1,3}$/.test(isbn))) {
            validationErrors.push({parameterName:"isbn", errorMessage:"is not in the correct format."})
            return false
        }
        return true
    }

    private validateTextLength(text: string, parameterName: string, minLength: number, maxLength: number, validationErrors: ValidationError[]): boolean {
        if (text.length < minLength || text.length > maxLength) {
            validationErrors.push({parameterName:parameterName, errorMessage:`has not between ${ minLength } and ${ maxLength } characters.`})
            return false
        }
        return true
    }
}