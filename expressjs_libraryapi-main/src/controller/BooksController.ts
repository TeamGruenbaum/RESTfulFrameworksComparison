import {RequestHandler} from "express";
import {Book} from "../models/Book.js";
import {BooksResponse} from "../models/./dataTransferObjects/BooksResponse.js";
import {FormValidator} from "../utils/FormValidator.js";
import {ValidationError} from "../models/errors/ValidationError.js";
import {ContentValidator} from "../utils/ContentValidator.js";
import {DataAccessor} from ".././services/DataAccessor.js";
import {BadRequestError} from "../models/errors/BadRequestError.js";
import {IdResponse} from "../models/./dataTransferObjects/IdResponse.js";
import {CreateBook} from "../models/./dataTransferObjects/CreateBook.js";
import {UpdateBook} from "../models/./dataTransferObjects/UpdateBook.js";

export class BooksController {
    private readonly booksService:DataAccessor<Book, CreateBook, UpdateBook>
    private readonly formValidator:FormValidator
    private readonly contentValidator:ContentValidator

    constructor(booksService:DataAccessor<Book, CreateBook, UpdateBook>, formValidator:FormValidator, contentValidator:ContentValidator) {
        this.booksService=booksService
        this.formValidator=formValidator
        this.contentValidator=contentValidator
    }

    public getBook:RequestHandler<{ id: string }, unknown, unknown, unknown, Record<string, unknown>> = async (request, response):Promise<void> => {
        let validationErrors:ValidationError[]=[]
        let errorMessages:string[]=[]
        if(!this.contentValidator.validateId(request.params.id, validationErrors)) {
            validationErrors.forEach((validationError:ValidationError) => {
                errorMessages.push(validationError.parameterName+" "+validationError.errorMessage)
            })
            throw new BadRequestError(errorMessages)
        }
        const book:Book=await this.booksService.readById(parseInt(request.params.id))
        response.status(200).json(book)
    }

    public getAllBooks:RequestHandler<unknown, unknown, unknown, unknown, Record<string, unknown>> = async (request, response):Promise<void> => {
        let validationErrors:ValidationError[]=[]
        let errorMessages:string[]=[]
        if(!this.formValidator.isGetAllBooks(request.query, validationErrors) || !this.contentValidator.validateGetAllBooks(request.query, validationErrors)) {
            validationErrors.forEach((validationError:ValidationError) => {
                errorMessages.push(validationError.parameterName+" "+validationError.errorMessage)
            })
            throw new BadRequestError(errorMessages)
        }
        const reading:[number, Book[]]=await this.booksService.read(parseInt(request.query.page), parseInt(request.query.per_page), request.query.query!==undefined ? request.query.query : undefined)
        response.status(200).json({maximumPage: reading[0], items: reading[1]} satisfies BooksResponse)
    }

    public createBook:RequestHandler<unknown, unknown, unknown, unknown, Record<string, unknown>> = async (request, response):Promise<void> => {
        let validationErrors:ValidationError[]=[]
        let errorMessages:string[]=[]
        if(!this.formValidator.isCreateBook(request.body, validationErrors) || !this.contentValidator.validateCreateBook(request.body, validationErrors)) {
            validationErrors.forEach((validationError:ValidationError) => {
                errorMessages.push(validationError.parameterName+" "+validationError.errorMessage)
            })
            throw new BadRequestError(errorMessages)
        }
        const bookId:number=await this.booksService.create(request.body)
        response.status(201).json({id: bookId} satisfies IdResponse)
    }

    public updateBook:RequestHandler<{ id: string }, unknown, unknown, unknown, Record<string, unknown>> = async (request, response):Promise<void> => {
        let validationErrors:ValidationError[]=[]
        let errorMessages:string[]=[]
        if(!this.contentValidator.validateId(request.params.id, validationErrors) || !this.formValidator.isUpdateBook(request.body, validationErrors) || !this.contentValidator.validateUpdateBook(request.body, validationErrors)) {
            validationErrors.forEach((validationError:ValidationError) => {
                errorMessages.push(validationError.parameterName+" "+validationError.errorMessage)
            })
            throw new BadRequestError(errorMessages)
        }
        await this.booksService.update(parseInt(request.params.id), request.body)
        response.status(204).send()
    }

    public deleteBook:RequestHandler<{ id: string }, unknown, unknown, unknown, Record<string, unknown>> = async (request, response):Promise<void> => {
        let validationErrors:ValidationError[]=[]
        let errorMessages:string[]=[]
        if(!this.contentValidator.validateId(request.params.id, validationErrors)) {
            validationErrors.forEach((validationError:ValidationError) => {
                errorMessages.push(validationError.parameterName+" "+validationError.errorMessage)
            })
            throw new BadRequestError(errorMessages)
        }
        await this.booksService.delete(parseInt(request.params.id))
        response.status(204).send()
    }
}