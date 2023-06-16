import express from "express";
import { asyncCatchHandler } from "../middlewares/AsyncCatchHandler.js";
import { MethodNotAllowedHandler } from "../middlewares/MethodNotAllowedHandler.js";
export class BooksRouter {
    router = express.Router();
    booksController;
    constructor(booksController) {
        this.booksController = booksController;
        this.router.route('/:id')
            .get(asyncCatchHandler(this.booksController.getBook))
            .patch(asyncCatchHandler(this.booksController.updateBook))
            .delete(asyncCatchHandler(this.booksController.deleteBook))
            .all(MethodNotAllowedHandler);
        this.router.route('/')
            .get(asyncCatchHandler(this.booksController.getAllBooks))
            .post(asyncCatchHandler(this.booksController.createBook))
            .all(MethodNotAllowedHandler);
    }
    getRouter() {
        return this.router;
    }
}
