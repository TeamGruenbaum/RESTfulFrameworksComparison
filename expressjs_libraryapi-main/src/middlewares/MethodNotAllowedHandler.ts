import {MethodNotAllowedError} from "../models/errors/MethodNotAllowedError.js";

export const MethodNotAllowedHandler = ():void => {
    throw new MethodNotAllowedError("This Method is not allowed for the specified resource.")
}