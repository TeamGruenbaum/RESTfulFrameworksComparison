import { MethodNotAllowedError } from "../models/errors/MethodNotAllowedError.js";
export const MethodNotAllowedHandler = () => {
    throw new MethodNotAllowedError("This Method is not allowed for the specified resource.");
};
