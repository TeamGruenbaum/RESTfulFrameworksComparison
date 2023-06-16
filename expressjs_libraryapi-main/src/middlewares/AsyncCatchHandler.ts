import {Handler, NextFunction, Request, RequestHandler, Response} from "express";

export const asyncCatchHandler = (handler: Handler | RequestHandler<any, any, any, any>) => {
    const handlerFunction = handler as Function
    return (request: Request, response: Response, next: NextFunction) => {
        return handlerFunction(request, response, next)?.catch(next)
    }
}