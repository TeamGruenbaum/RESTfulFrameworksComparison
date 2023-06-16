export class ContentValidator {
    validateGetAllBooks(getAllBooks, validationErrors) {
        let startValidationErrorsLength = validationErrors.length;
        if (isNaN(parseInt(getAllBooks.page)) || parseInt(getAllBooks.page) < 1) {
            validationErrors.push({ parameterName: "page", errorMessage: "is not parsable to a number greater than 0." });
        }
        if (isNaN(parseInt(getAllBooks.per_page)) || parseInt(getAllBooks.per_page) < 1 || parseInt(getAllBooks.per_page) > 50) {
            validationErrors.push({ parameterName: "per_page", errorMessage: "is not parsable to a number between 1 and 50." });
        }
        if (getAllBooks.query !== undefined) {
            this.validateTextLength(getAllBooks.query, "query", 1, 30, validationErrors);
        }
        return validationErrors.length === startValidationErrorsLength;
    }
    validateCreateBook(createBook, validationErrors) {
        let startValidationErrorsLength = validationErrors.length;
        this.validateIsbn(createBook.isbn, validationErrors);
        this.validateTextLength(createBook.title, "title", 1, 300, validationErrors);
        this.validateTextLength(createBook.author, "author", 1, 100, validationErrors);
        return validationErrors.length === startValidationErrorsLength;
    }
    validateUpdateBook(updateBook, validationErrors) {
        let startValidationErrorsLength = validationErrors.length;
        if (updateBook.isbn !== undefined) {
            this.validateIsbn(updateBook.isbn, validationErrors);
        }
        if (updateBook.title !== undefined) {
            this.validateTextLength(updateBook.title, "title", 1, 300, validationErrors);
        }
        if (updateBook.author !== undefined) {
            this.validateTextLength(updateBook.author, "author", 1, 100, validationErrors);
        }
        return validationErrors.length === startValidationErrorsLength;
    }
    validateId(id, validationErrors) {
        if (isNaN(parseInt(id)) || parseInt(id) < 0) {
            validationErrors.push({ parameterName: "id", errorMessage: "is not parsable to a non-negative number." });
            return false;
        }
        return true;
    }
    validateIsbn(isbn, validationErrors) {
        if (!(/^(978-?|979-?)?\d{1,5}-?\d{1,7}-?\d{1,6}-?\d{1,3}$/.test(isbn))) {
            validationErrors.push({ parameterName: "isbn", errorMessage: "is not in the correct format." });
            return false;
        }
        return true;
    }
    validateTextLength(text, parameterName, minLength, maxLength, validationErrors) {
        if (text.length < minLength || text.length > maxLength) {
            validationErrors.push({ parameterName: parameterName, errorMessage: `has not between ${minLength} and ${maxLength} characters.` });
            return false;
        }
        return true;
    }
}
