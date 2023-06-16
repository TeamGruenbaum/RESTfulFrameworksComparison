import express from "express";
import {BooksController} from "../controller/BooksController.js";
import {asyncCatchHandler} from "../middlewares/AsyncCatchHandler.js";
import {MethodNotAllowedHandler} from "../middlewares/MethodNotAllowedHandler.js";

export class BooksRouter {
    private readonly router:express.Router=express.Router()
    private readonly booksController:BooksController

    constructor(booksController:BooksController) {
        this.booksController=booksController

        this.router.route('/:id')
            .get( asyncCatchHandler(this.booksController.getBook))
            .patch(asyncCatchHandler(this.booksController.updateBook))
            .delete(asyncCatchHandler(this.booksController.deleteBook))
            .all(MethodNotAllowedHandler)

        this.router.route('/')
            .get(asyncCatchHandler(this.booksController.getAllBooks))
            .post(asyncCatchHandler(this.booksController.createBook))
            .all(MethodNotAllowedHandler)
    }

    public getRouter(): express.Router {
        return this.router
    }
}