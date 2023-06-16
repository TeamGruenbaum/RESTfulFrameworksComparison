import { BadRequestError } from "../models/errors/BadRequestError.js";
import { NotFoundError } from "../models/errors/NotFoundError.js";
import { MethodNotAllowedError } from "../models/errors/MethodNotAllowedError.js";
import { UnknownError } from "../models/errors/UnknownError.js";
export const ErrorHandler = (error, request, response, next) => {
    if (error instanceof BadRequestError) {
        response.status(400).json({ messages: error.messages });
    }
    else if (error instanceof NotFoundError) {
        response.status(404).json({ message: error.message });
    }
    else if (error instanceof MethodNotAllowedError) {
        response.status(405).json({ message: error.message });
    }
    else if (error instanceof UnknownError) {
        response.status(500).json({ message: error.message });
    }
    else if (error instanceof SyntaxError) {
        response.status(400).json({ message: "The JSON is invalid." });
    }
    else {
        response.status(500).json({ message: "An unknown error occurred." });
    }
};
