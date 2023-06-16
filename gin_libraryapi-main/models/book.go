package models

type Book struct {
	Id     uint   `json:"id" binding:"required"`
	Isbn   string `json:"isbn" binding:"required"`
	Title  string `json:"title" binding:"required"`
	Author string `json:"author" binding:"required"`
}
