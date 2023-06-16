export class FormValidator {
    isCreateBook(value, validationErrors) {
        if (!this.isNonNullObject(value, validationErrors)) {
            return false;
        }
        let startValidationErrorsLength = validationErrors.length;
        if (!("isbn" in value)) {
            validationErrors.push({ parameterName: "isbn", errorMessage: "is missing." });
        }
        else if (typeof value.isbn !== "string") {
            validationErrors.push({ parameterName: "isbn", errorMessage: "is not a string." });
        }
        if (!("title" in value)) {
            validationErrors.push({ parameterName: "title", errorMessage: "is missing." });
        }
        else if (typeof value.title !== "string") {
            validationErrors.push({ parameterName: "title", errorMessage: "is not a string." });
        }
        if (!("author" in value)) {
            validationErrors.push({ parameterName: "author", errorMessage: "is missing." });
        }
        else if (typeof value.author !== "string") {
            validationErrors.push({ parameterName: "author", errorMessage: "is not a string." });
        }
        return validationErrors.length === startValidationErrorsLength;
    }
    isUpdateBook(value, validationErrors) {
        if (!this.isNonNullObject(value, validationErrors)) {
            return false;
        }
        let startValidationErrorsLength = validationErrors.length;
        if ("isbn" in value && (typeof value.isbn !== "string")) {
            validationErrors.push({ parameterName: "isbn", errorMessage: "is not a string in the correct format." });
        }
        if ("title" in value && (typeof value.title !== "string")) {
            validationErrors.push({ parameterName: "title", errorMessage: "is not a string with at least one character." });
        }
        if ("author" in value && (typeof value.author !== "string")) {
            validationErrors.push({ parameterName: "author", errorMessage: "is not a string with at least one character." });
        }
        return validationErrors.length === startValidationErrorsLength;
    }
    isGetAllBooks(value, validationErrors) {
        if (!this.isNonNullObject(value, validationErrors)) {
            return false;
        }
        let startValidationErrorsLength = validationErrors.length;
        if (!("page" in value)) {
            validationErrors.push({ parameterName: "page", errorMessage: "is missing." });
        }
        else if (typeof value.page !== "string") {
            validationErrors.push({ parameterName: "page", errorMessage: "is not a string." });
        }
        if (!("per_page" in value)) {
            validationErrors.push({ parameterName: "per_page", errorMessage: "is missing." });
        }
        else if (typeof value.per_page !== "string") {
            validationErrors.push({ parameterName: "per_page", errorMessage: "is not a string." });
        }
        if ("query" in value && (typeof value.query !== "string")) {
            validationErrors.push({ parameterName: "query", errorMessage: "is not a string." });
        }
        return validationErrors.length === startValidationErrorsLength;
    }
    isArrayOfType(value, itemChecker, itemTypeName, validationErrors) {
        if (!Array.isArray(value)) {
            validationErrors.push({ parameterName: "value", errorMessage: "is not an Array." });
            return false;
        }
        if (!value.every((item) => itemChecker(item))) {
            validationErrors.push({ parameterName: "value", errorMessage: "is not an Array with items of Type " + itemTypeName + "." });
            return false;
        }
        return true;
    }
    isNonNullObject(value, validationErrors) {
        if (typeof value !== "object") {
            validationErrors.push({ parameterName: "value", errorMessage: "is not an object." });
            return false;
        }
        if (value === null) {
            validationErrors.push({ parameterName: "value", errorMessage: "is null." });
            return false;
        }
        return true;
    }
}
