import { BadRequestError } from "../models/errors/BadRequestError.js";
export class BooksController {
    booksAdapter;
    formValidator;
    contentValidator;
    constructor(booksAdapter, formValidator, contentValidator) {
        this.booksAdapter = booksAdapter;
        this.formValidator = formValidator;
        this.contentValidator = contentValidator;
    }
    getBook = async (request, response) => {
        let validationErrors = [];
        let errorMessages = [];
        if (!this.contentValidator.validateId(request.params.id, validationErrors)) {
            validationErrors.forEach((validationError) => {
                errorMessages.push(validationError.parameterName + " " + validationError.errorMessage);
            });
            throw new BadRequestError(errorMessages);
        }
        const book = await this.booksAdapter.readById(parseInt(request.params.id));
        response.status(200).json(book);
    };
    getAllBooks = async (request, response) => {
        let validationErrors = [];
        let errorMessages = [];
        if (!this.formValidator.isGetAllBooks(request.query, validationErrors) || !this.contentValidator.validateGetAllBooks(request.query, validationErrors)) {
            validationErrors.forEach((validationError) => {
                errorMessages.push(validationError.parameterName + " " + validationError.errorMessage);
            });
            throw new BadRequestError(errorMessages);
        }
        const reading = await this.booksAdapter.read(parseInt(request.query.page), parseInt(request.query.per_page), request.query.query !== undefined ? request.query.query : undefined);
        response.status(200).json({ maximumPage: reading[0], items: reading[1] });
    };
    createBook = async (request, response) => {
        let validationErrors = [];
        let errorMessages = [];
        if (!this.formValidator.isCreateBook(request.body, validationErrors) || !this.contentValidator.validateCreateBook(request.body, validationErrors)) {
            validationErrors.forEach((validationError) => {
                errorMessages.push(validationError.parameterName + " " + validationError.errorMessage);
            });
            throw new BadRequestError(errorMessages);
        }
        const bookId = await this.booksAdapter.create(request.body);
        response.status(201).json({ id: bookId });
    };
    updateBook = async (request, response) => {
        let validationErrors = [];
        let errorMessages = [];
        if (!this.contentValidator.validateId(request.params.id, validationErrors) || !this.formValidator.isUpdateBook(request.body, validationErrors) || !this.contentValidator.validateUpdateBook(request.body, validationErrors)) {
            validationErrors.forEach((validationError) => {
                errorMessages.push(validationError.parameterName + " " + validationError.errorMessage);
            });
            throw new BadRequestError(errorMessages);
        }
        await this.booksAdapter.update(parseInt(request.params.id), request.body);
        response.status(204).send();
    };
    deleteBook = async (request, response) => {
        let validationErrors = [];
        let errorMessages = [];
        if (!this.contentValidator.validateId(request.params.id, validationErrors)) {
            validationErrors.forEach((validationError) => {
                errorMessages.push(validationError.parameterName + " " + validationError.errorMessage);
            });
            throw new BadRequestError(errorMessages);
        }
        await this.booksAdapter.delete(parseInt(request.params.id));
        response.status(204).send();
    };
}
