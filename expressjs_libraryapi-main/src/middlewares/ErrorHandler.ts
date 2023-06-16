import {NextFunction, Request, Response} from "express";
import {BadRequestError} from "../models/errors/BadRequestError.js";
import {ErrorsResponse} from "../models/./dataTransferObjects/ErrorsResponse.js";
import {NotFoundError} from "../models/errors/NotFoundError.js";
import {ErrorResponse} from "../models/./dataTransferObjects/ErrorResponse.js";
import {MethodNotAllowedError} from "../models/errors/MethodNotAllowedError.js";
import {UnknownError} from "../models/errors/UnknownError.js";

export const ErrorHandler = (error: unknown, request: Request<object, unknown, unknown, unknown>, response: Response<unknown>, next: NextFunction) => {
    if(error instanceof BadRequestError) {
        response.status(400).json({messages: error.messages} satisfies ErrorsResponse)
    } else if(error instanceof NotFoundError) {
        response.status(404).json({message: error.message} satisfies ErrorResponse)
    } else if(error instanceof MethodNotAllowedError) {
        response.status(405).json({message: error.message} satisfies ErrorResponse)
    } else if(error instanceof UnknownError) {
        response.status(500).json({message: error.message} satisfies ErrorResponse)
    } else if(error instanceof SyntaxError) {
        response.status(400).json({message: "The JSON is invalid."} satisfies ErrorResponse)
    } else {
        response.status(500).json({message: "An unknown error occurred."} satisfies ErrorResponse)
    }
}