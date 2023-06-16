import express, {Router, Application, NextFunction, Request, Response, RequestHandler, Handler} from 'express'
import {BooksRouter} from "./router/BooksRouter.js";
import {BooksService} from "././services/BooksService.js";
import {BooksController} from "./controller/BooksController.js";
import {FormValidator} from "./utils/FormValidator.js";
import {ContentValidator} from "./utils/ContentValidator.js";
import {ErrorHandler} from "./middlewares/ErrorHandler.js";
import {ResourceNotFoundHandler} from "./middlewares/ResourceNotFoundHandler.js";

const app:Application=express()

const booksService:BooksService=new BooksService({
    host: 'localhost',
    user: 'libraryapi',
    password: "1234",
    database: 'libraryapi',
    port : 24638,
    connectionLimit: 150
})
await booksService.start()
const formValidator:FormValidator=new FormValidator()
const contentValidator:ContentValidator=new ContentValidator()
const booksController:BooksController=new BooksController(booksService, formValidator, contentValidator)
const booksRouter:BooksRouter=new BooksRouter(booksController)

app.use(express.json())

app.use('/v1/books', booksRouter.getRouter())

app.use(ResourceNotFoundHandler)

app.use(ErrorHandler)

app.listen(21003, () => {
    console.log(`Application started on port 21003.`)
})

