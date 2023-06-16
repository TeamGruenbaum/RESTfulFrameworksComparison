export class TypeChecker {
    isBook(value, validationErrors) {
        if (!this.isNonNullObject(value, validationErrors)) {
            return false;
        }
        if (!("id" in value)) {
            validationErrors.push({ parameterName: "Id", errorMessage: "is missing." });
            return false;
        }
        if (typeof value.id !== "number" || value.id < 0) {
            validationErrors.push({ parameterName: "Id", errorMessage: "is not a non-negative number." });
            return false;
        }
        return this.isCreateBook(value, validationErrors);
    }
    isCreateBook(value, validationErrors) {
        if (!this.isNonNullObject(value, validationErrors)) {
            return false;
        }
        if (!("isbn" in value)) {
            validationErrors.push({ parameterName: "Isbn", errorMessage: "is missing." });
            return false;
        }
        if (typeof value.isbn !== "string" || !(/^(978-?|979-?)?\d{1,5}-?\d{1,7}-?\d{1,6}-?\d{1,3}$/.test(value.isbn))) {
            validationErrors.push({ parameterName: "Isbn", errorMessage: "is not a string in the correct format." });
            return false;
        }
        if (!("title" in value)) {
            validationErrors.push({ parameterName: "Title", errorMessage: "is missing." });
            return false;
        }
        if (typeof value.title !== "string" || value.title.length === 0) {
            validationErrors.push({ parameterName: "Title", errorMessage: "is not a string with at least one character." });
            return false;
        }
        if (!("author" in value)) {
            validationErrors.push({ parameterName: "Author", errorMessage: "is missing." });
            return false;
        }
        if (typeof value.author !== "string" || value.author.length === 0) {
            validationErrors.push({ parameterName: "Author", errorMessage: "is not a string with at least one character." });
            return false;
        }
        return true;
    }
    isUpdateBook(value, validationErrors) {
        if (!this.isNonNullObject(value, validationErrors)) {
            return false;
        }
        if ("isbn" in value && (typeof value.isbn !== "string" || !(/^(978-?|979-?)?\d{1,5}-?\d{1,7}-?\d{1,6}-?\d{1,3}$/.test(value.isbn)))) {
            validationErrors.push({ parameterName: "Isbn", errorMessage: "is not a string in the correct format." });
            return false;
        }
        if ("title" in value && (typeof value.title !== "string" || value.title.length === 0)) {
            validationErrors.push({ parameterName: "Title", errorMessage: "is not a string with at least one character." });
            return false;
        }
        if ("author" in value && (typeof value.author !== "string" || value.author.length === 0)) {
            validationErrors.push({ parameterName: "Author", errorMessage: "is not a string with at least one character." });
            return false;
        }
        return true;
    }
    isGetAllBooks(value, validationErrors) {
        if (!this.isNonNullObject(value, validationErrors)) {
            return false;
        }
        if (!("page" in value)) {
            validationErrors.push({ parameterName: "Page", errorMessage: "is missing." });
            return false;
        }
        if (typeof value.page !== "number" || value.page < 1) {
            validationErrors.push({ parameterName: "Page", errorMessage: "is not a non-negative number." });
            return false;
        }
        if (!("perPage" in value)) {
            validationErrors.push({ parameterName: "PerPage", errorMessage: "is missing." });
            return false;
        }
        if (typeof value.perPage !== "number" || value.perPage < 1) {
            validationErrors.push({ parameterName: "PerPage", errorMessage: "is not a non-negative number." });
            return false;
        }
        if ("query" in value && (typeof value.query !== "string" || value.query.length === 0)) {
            validationErrors.push({ parameterName: "Query", errorMessage: "is not a string with at least one character." });
            return false;
        }
        return true;
    }
    isArrayOfType(value, itemChecker, itemTypeName, validationErrors) {
        if (!Array.isArray(value)) {
            validationErrors.push({ parameterName: "Value", errorMessage: "is not an Array." });
            return false;
        }
        if (!value.every((item) => itemChecker(item))) {
            validationErrors.push({ parameterName: "Value", errorMessage: "is not an Array with items of Type " + itemTypeName + "." });
            return false;
        }
        return true;
    }
    isNonNullObject(value, validationErrors) {
        if (typeof value !== "object") {
            validationErrors.push({ parameterName: "Value", errorMessage: "is not an object." });
            return false;
        }
        if (value === null) {
            validationErrors.push({ parameterName: "Value", errorMessage: "is null." });
            return false;
        }
        return true;
    }
}
