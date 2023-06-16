import mariadb, {Pool, PoolConfig} from "mariadb";
import {CreateBook} from "../models/./dataTransferObjects/CreateBook.js";
import {Book} from "../models/Book.js";
import {NotFoundError} from "../models/errors/NotFoundError.js";
import {UnknownError} from "../models/errors/UnknownError.js";
import {UpdateBook} from "../models/./dataTransferObjects/UpdateBook.js";
import {DataAccessor} from "./DataAccessor.js";

export class BooksService implements DataAccessor<Book, CreateBook, UpdateBook> {
    private readonly pool:Pool

    constructor(configuration:PoolConfig) {
        this.pool = mariadb.createPool(configuration);
    }

    public async start():Promise<void> {
        await this.pool.query(`CREATE TABLE IF NOT EXISTS books (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            isbn TINYTEXT NOT NULL,
            title TINYTEXT NOT NULL,
            author TINYTEXT NOT NULL
        );`)
    }

    public async create(book:CreateBook):Promise<number> {
        const insertResult:any=await this.pool.query(`INSERT INTO books (isbn, title, author) VALUES (?, ?, ?);`, [book.isbn, book.title, book.author]);

        if(!("affectedRows" in insertResult && insertResult.affectedRows===1)) {
            throw new UnknownError("An unknown error occurred.")
        }

        return parseInt(insertResult.insertId)
    }

    public async readById(id:number):Promise<Book> {
        const result:unknown=await this.pool.query(`SELECT * FROM books WHERE id=?;`, [id])
        if(!Array.isArray(result) || result.length===0) {
            throw new NotFoundError("Book with id "+id+" not found.")
        }
        return result[0]
    }

    public async read(page:number, perPage:number, query?:string):Promise<[number, Book[]]> {
        let sqlQuery:string=`SELECT * FROM books`
        let values:string[]=[]
        if(query!==undefined) {
            sqlQuery+=` WHERE isbn LIKE ? OR title LIKE ? OR author LIKE ?`
            values.push('%'+query+'%', '%'+query+'%', '%'+query+'%')
        }

        const result:unknown=await this.pool.query(sqlQuery+` ORDER BY id asc;`, values)
        if(!Array.isArray(result)) {
            throw new UnknownError("An unknown error occurred.")
        }

        let booksOnNthPage:Book[]=result.slice((page-1)*perPage, page*perPage)
        let maximumPage:number=Math.ceil(result.length/perPage)

        return [maximumPage, booksOnNthPage]
    }

    public async update(id:number, book:UpdateBook):Promise<void> {
        let sqlQuery:string=`UPDATE books SET `
        let values:string[]=[]
        if(book.isbn!==undefined) {
            sqlQuery+=`isbn=?`
            values.push(book.isbn)
        }
        if(book.title!==undefined) {
            if(values.length>0) {
                sqlQuery+=`, `
            }
            sqlQuery+=`title=?`
            values.push(book.title)
        }
        if(book.author!==undefined) {
            if(values.length>0) {
                sqlQuery+=`, `
            }
            sqlQuery+=`author=?`
            values.push(book.author)
        }

        const result=await this.pool.query(sqlQuery+` WHERE id=?;`, [...values, id])
        if(!("affectedRows" in result && result.affectedRows===1)) {
            throw new NotFoundError("Book with id "+id+" not found.")
        }
    }

    public async delete(id:number):Promise<void> {
        const result=await this.pool.query(`DELETE FROM books WHERE id=?;`, [id])
        if(!("affectedRows" in result && result.affectedRows===1)) {
            throw new NotFoundError("Book with id "+id+" not found.")
        }
    }
}