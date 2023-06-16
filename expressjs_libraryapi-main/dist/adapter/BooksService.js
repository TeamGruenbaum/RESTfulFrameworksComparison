import mariadb from "mariadb";
import { NotFoundError } from "../models/errors/NotFoundError.js";
import { UnknownError } from "../models/errors/UnknownError.js";
export class BooksService {
    pool;
    constructor() {
        this.pool = mariadb.createPool({
            host: process.env['DB_HOST'] || 'localhost',
            user: process.env['DB_USER'] || 'libraryapi',
            password: process.env['DB_PASSWORD'] || "1234",
            database: process.env['DB_USER'] || 'libraryapi',
            port: parseInt(process.env['DB_PORT'] || '24638'),
            connectionLimit: parseInt(process.env['DB_CONNECTIONLIMIT'] || '5')
        });
    }
    async start() {
        await this.pool.query(`CREATE TABLE IF NOT EXISTS books (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            isbn TINYTEXT NOT NULL,
            title TINYTEXT NOT NULL,
            author TINYTEXT NOT NULL
        );`);
    }
    async insertBook(book) {
        const insertResult = await this.pool.query(`INSERT INTO books (isbn, title, author) VALUES (?, ?, ?);`, [book.isbn, book.title, book.author]);
        if (!("affectedRows" in insertResult && insertResult.affectedRows === 1)) {
            throw new UnknownError("An unknown error occurred.");
        }
        return parseInt(insertResult.insertId);
    }
    async getBook(id) {
        const result = await this.pool.query(`SELECT * FROM books WHERE id=?;`, [id]);
        if (!Array.isArray(result) || result.length === 0) {
            throw new NotFoundError("Book with id " + id + " not found.");
        }
        return result[0];
    }
    async getBooks(page, perPage, query) {
        let sqlQuery = `SELECT * FROM books`;
        let values = [];
        if (query !== undefined) {
            sqlQuery += ` WHERE isbn LIKE ? OR title LIKE ? OR author LIKE ?`;
            values.push('%' + query + '%', '%' + query + '%', '%' + query + '%');
        }
        const result = await this.pool.query(sqlQuery + `;`, values);
        if (!Array.isArray(result)) {
            throw new UnknownError("An unknown error occurred.");
        }
        let booksOnNthPage = result.slice((page - 1) * perPage, page * perPage);
        let maximumPage = Math.ceil(result.length / perPage);
        return {
            maximumPage: maximumPage,
            items: booksOnNthPage
        };
    }
    async updateBook(id, book) {
        let sqlQuery = `UPDATE books SET `;
        let values = [];
        if (book.isbn !== undefined) {
            sqlQuery += `isbn=?`;
            values.push(book.isbn);
        }
        if (book.title !== undefined) {
            if (values.length > 0) {
                sqlQuery += `, `;
            }
            sqlQuery += `title=?`;
            values.push(book.title);
        }
        if (book.author !== undefined) {
            if (values.length > 0) {
                sqlQuery += `, `;
            }
            sqlQuery += `author=?`;
            values.push(book.author);
        }
        const result = await this.pool.query(sqlQuery + ` WHERE id=?;`, [...values, id]);
        if (!("affectedRows" in result && result.affectedRows === 1)) {
            throw new NotFoundError("Book with id " + id + " not found.");
        }
    }
    async deleteBook(id) {
        const result = await this.pool.query(`DELETE FROM books WHERE id=?;`, [id]);
        if (!("affectedRows" in result && result.affectedRows === 1)) {
            throw new NotFoundError("Book with id " + id + " not found.");
        }
    }
}
