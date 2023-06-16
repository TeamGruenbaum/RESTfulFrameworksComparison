import {NotFoundError} from "../models/errors/NotFoundError.js";

export const ResourceNotFoundHandler = ()=> {
    throw new NotFoundError("Requested resource does not exist.")
}